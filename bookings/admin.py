
from django.contrib import admin
from .models import MeetingRoom, Booking


@admin.register(MeetingRoom)
class MeetingRoomAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'room_name',
        'room_number',
        'capacity',
        'location',
        'is_active',
    )

    list_filter = ('is_active', 'location')

    search_fields = (
        'room_name',
        'room_number',
        'location',
    )


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'meeting_title',
        'meeting_room',
        'user',
        'start_datetime',
        'end_datetime',
        'status',
    )

    list_filter = ('status', 'meeting_room')

    search_fields = (
        'meeting_title',
        'user__username',
    )

    readonly_fields = ('created_at',)
