
from datetime import timedelta

from django.contrib.auth.models import User
from django.utils import timezone

from rest_framework.test import APITestCase
from rest_framework import status

from .models import MeetingRoom, Booking


class MeetingRoomBookingTests(APITestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username='sushmita',
            password='testpassword123'
        )

        self.other_user = User.objects.create_user(
            username='rahul',
            password='testpassword123'
        )

        self.room = MeetingRoom.objects.create(
            room_name='Conference Room',
            room_number='R101',
            capacity=10,
            location='First Floor',
            is_active=True
        )

        self.client.force_authenticate(user=self.user)

        self.start = (
            timezone.now() + timedelta(days=1)
        ).replace(
            minute=0,
            second=0,
            microsecond=0
        )

        self.end = self.start + timedelta(hours=1)

    def create_booking(self, start, end):

        return self.client.post(
            '/api/bookings/',
            {
                'meeting_room': self.room.id,
                'meeting_title': 'Project Discussion',
                'start_datetime': start.isoformat(),
                'end_datetime': end.isoformat(),
            },
            format='json'
        )

    def test_successful_booking(self):

        response = self.create_booking(
            self.start,
            self.end
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertEqual(Booking.objects.count(), 1)

    def test_overlapping_booking_rejected(self):

        first = self.create_booking(
            self.start,
            self.end
        )

        self.assertEqual(
            first.status_code,
            status.HTTP_201_CREATED
        )

        second = self.create_booking(
            self.start + timedelta(minutes=30),
            self.end + timedelta(minutes=30)
        )

        self.assertEqual(
            second.status_code,
            status.HTTP_409_CONFLICT
        )

        self.assertEqual(
            Booking.objects.filter(
                status=Booking.Status.CONFIRMED
            ).count(),
            1
        )

    def test_adjacent_booking_allowed(self):

        self.create_booking(
            self.start,
            self.end
        )

        response = self.create_booking(
            self.end,
            self.end + timedelta(hours=1)
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

    def test_invalid_time_range(self):

        response = self.create_booking(
            self.end,
            self.start
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

    def test_past_booking_rejected(self):

        start = timezone.now() - timedelta(hours=2)
        end = start + timedelta(hours=1)

        response = self.create_booking(start, end)

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )
        self.assertIn('start_datetime', response.data)

    def test_inactive_room_rejected(self):

        self.room.is_active = False
        self.room.save()

        response = self.create_booking(
            self.start,
            self.end
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

    def test_cancel_booking(self):

        response = self.create_booking(
            self.start,
            self.end
        )

        booking_id = response.data['id']

        cancel_response = self.client.delete(
            f'/api/bookings/{booking_id}/cancel/'
        )

        self.assertEqual(
            cancel_response.status_code,
            status.HTTP_200_OK
        )

        booking = Booking.objects.get(id=booking_id)

        self.assertEqual(
            booking.status,
            Booking.Status.CANCELLED
        )

    def test_user_cannot_cancel_other_users_booking(self):

        booking = Booking.objects.create(
            meeting_room=self.room,
            user=self.other_user,
            meeting_title='Private Meeting',
            start_datetime=self.start,
            end_datetime=self.end
        )

        response = self.client.delete(
            f'/api/bookings/{booking.id}/cancel/'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

        booking.refresh_from_db()

        self.assertEqual(
            booking.status,
            Booking.Status.CONFIRMED
        )

    def test_user_sees_only_own_bookings(self):

        Booking.objects.create(
            meeting_room=self.room,
            user=self.other_user,
            meeting_title='Rahul Meeting',
            start_datetime=self.start,
            end_datetime=self.end
        )

        response = self.client.get('/api/bookings/my/')

        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.data), 0)
