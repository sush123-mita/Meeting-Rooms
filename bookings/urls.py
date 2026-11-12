
from django.urls import path


from .views import (
    MeetingRoomListView,
    RoomAvailabilityView,
    BookingCreateView,
    MyBookingsView,
    CancelBookingView,
    RegisterView
)

from .admin_views import (
    CurrentUserView,
    AdminRoomListView,
    AdminRoomDetailView,
    AdminBookingListView,
    AdminCancelBookingView,
    AdminUserListView,
)



urlpatterns = [

    path(
        'rooms/',
        MeetingRoomListView.as_view(),
        name='room-list'
    ),

    path(
        'rooms/available/',
        RoomAvailabilityView.as_view(),
        name='room-availability'
    ),

    path(
        'bookings/',
        BookingCreateView.as_view(),
        name='booking-create'
    ),

    path(
        'bookings/my/',
        MyBookingsView.as_view(),
        name='my-bookings'
    ),

    path(
        'bookings/<int:booking_id>/cancel/',
        CancelBookingView.as_view(),
        name='cancel-booking'
    ),
    
    path(
        'auth/register/',RegisterView.as_view(), name='register'
    )
]

# Current user
path('auth/me/', CurrentUserView.as_view()),

# Admin APIs
path('admin/rooms/', AdminRoomListView.as_view()),
path('admin/rooms/<int:pk>/', AdminRoomDetailView.as_view()),

path('admin/bookings/', AdminBookingListView.as_view()),

path(
    'admin/bookings/<int:booking_id>/cancel/',
    AdminCancelBookingView.as_view()
),

path('admin/users/', AdminUserListView.as_view()),