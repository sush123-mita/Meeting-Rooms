

from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError

from rest_framework.permissions import AllowAny
from rest_framework import generics
from .serializers import UserRegistrationSerializer

from .models import MeetingRoom, Booking
from .serializers import (
    MeetingRoomSerializer,
    BookingSerializer,
    BookingCreateSerializer,
)


# ------------------------------------
# 1. LIST ACTIVE MEETING ROOMS
# ------------------------------------

class MeetingRoomListView(ListAPIView):

    serializer_class = MeetingRoomSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return MeetingRoom.objects.filter(
            is_active=True
        )


# ------------------------------------
# 2. CHECK ROOM AVAILABILITY
# ------------------------------------

class RoomAvailabilityView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        room_id = request.query_params.get('room_id')
        start = request.query_params.get('start_datetime')
        end = request.query_params.get('end_datetime')

        if not all([room_id, start, end]):
            return Response(
                {
                    'error': (
                        'room_id, start_datetime and '
                        'end_datetime are required.'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate the supplied dates
        date_serializer = BookingCreateSerializer(
            data={
                'meeting_room': room_id,
                'meeting_title': 'Availability Check',
                'start_datetime': start,
                'end_datetime': end,
            }
        )

        date_serializer.is_valid(raise_exception=True)

        room = date_serializer.validated_data['meeting_room']

        if not room.is_active:
            return Response({
                'available': False,
                'message': 'This room is inactive.'
            })

        start = date_serializer.validated_data['start_datetime']
        end = date_serializer.validated_data['end_datetime']

        overlapping = Booking.objects.filter(
            meeting_room=room,
            status=Booking.Status.CONFIRMED,
            start_datetime__lt=end,
            end_datetime__gt=start,
        ).exists()

        return Response({
            'room_id': room.id,
            'room_name': room.room_name,
            'available': not overlapping,
        })


# ------------------------------------
# 3. CREATE BOOKING
# ------------------------------------

class BookingCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = BookingCreateSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        requested_room = serializer.validated_data[
            'meeting_room'
        ]

        start = serializer.validated_data['start_datetime']
        end = serializer.validated_data['end_datetime']

        # Transaction begins here
        with transaction.atomic():

            # Lock the room row before checking availability
            room = get_object_or_404(
                MeetingRoom.objects.select_for_update(),
                pk=requested_room.pk
            )

            if not room.is_active:
                return Response(
                    {'error': 'This room is inactive.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check for overlapping confirmed bookings
            overlapping = Booking.objects.filter(
                meeting_room=room,
                status=Booking.Status.CONFIRMED,
                start_datetime__lt=end,
                end_datetime__gt=start,
            ).exists()

            if overlapping:
                return Response(
                    {
                        'error': (
                            'Room is already booked '
                            'for this time slot.'
                        )
                    },
                    status=status.HTTP_409_CONFLICT
                )

            # Create booking only if available
            booking = serializer.save(
                user=request.user,
                meeting_room=room
            )

        # Transaction commits after leaving the block
        return Response(
            BookingSerializer(booking).data,
            status=status.HTTP_201_CREATED
        )


# ------------------------------------
# 4. LIST LOGGED-IN USER BOOKINGS
# ------------------------------------

class MyBookingsView(ListAPIView):

    serializer_class = BookingSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return (
            Booking.objects
            .filter(user=self.request.user)
            .select_related('meeting_room', 'user')
        )


# ------------------------------------
# 5. CANCEL OWN BOOKING
# ------------------------------------

class CancelBookingView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, booking_id):

        # First identify a booking belonging to this user
        booking = get_object_or_404(
            Booking.objects.filter(user=request.user),
            pk=booking_id
        )

        with transaction.atomic():

            # Acquire the room lock using the same lock order
            # as the booking creation operation.
            room = get_object_or_404(
                MeetingRoom.objects.select_for_update(),
                pk=booking.meeting_room_id
            )

            # Lock and retrieve the booking again
            booking = get_object_or_404(
                Booking.objects.select_for_update().filter(
                    user=request.user
                ),
                pk=booking_id
            )

            if booking.status == Booking.Status.CANCELLED:
                return Response(
                    {'message': 'Booking is already cancelled.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            booking.status = Booking.Status.CANCELLED

            booking.save(update_fields=['status'])

        return Response(
            {
                'message': 'Booking cancelled successfully.',
                'booking_id': booking.id,
                'status': booking.status,
            },
            status=status.HTTP_200_OK
        )


class RegisterView(generics.CreateAPIView):
    serializer_class=UserRegistrationSerializer
    permission_classes=[AllowAny]