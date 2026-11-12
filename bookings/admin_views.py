from django.contrib.auth.models import User
from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status

from .models import MeetingRoom, Booking
from .serializers import MeetingRoomSerializer, BookingSerializer


# Logged-in user's details and role
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "is_staff": request.user.is_staff,
            "is_superuser": request.user.is_superuser,
        })


# Admin: list all rooms and create a room
class AdminRoomListView(generics.ListCreateAPIView):
    queryset = MeetingRoom.objects.all()
    serializer_class = MeetingRoomSerializer
    permission_classes = [IsAdminUser]


# Admin: retrieve or update a room
class AdminRoomDetailView(generics.RetrieveUpdateAPIView):
    queryset = MeetingRoom.objects.all()
    serializer_class = MeetingRoomSerializer
    permission_classes = [IsAdminUser]


# Admin: view every booking
class AdminBookingListView(generics.ListAPIView):
    queryset = Booking.objects.select_related(
        "meeting_room", "user"
    ).all()
    serializer_class = BookingSerializer
    permission_classes = [IsAdminUser]


# Admin: cancel any booking
class AdminCancelBookingView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, booking_id):
        booking = get_object_or_404(
            Booking.objects.select_related("meeting_room"),
            pk=booking_id
        )

        with transaction.atomic():
            room = get_object_or_404(
                MeetingRoom.objects.select_for_update(),
                pk=booking.meeting_room_id
            )

            booking = get_object_or_404(
                Booking.objects.select_for_update(),
                pk=booking_id
            )

            if booking.status == Booking.Status.CANCELLED:
                return Response(
                    {"message": "Booking is already cancelled."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            booking.status = Booking.Status.CANCELLED
            booking.save(update_fields=["status"])

        return Response({
            "message": "Booking cancelled successfully.",
            "booking_id": booking.id,
            "status": booking.status
        })


# Admin: view registered users
class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by("username")
    permission_classes = [IsAdminUser]

    def list(self, request, *args, **kwargs):
        users = self.get_queryset()

        data = [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_staff": user.is_staff,
                "is_active": user.is_active,
            }
            for user in users
        ]

        return Response(data)