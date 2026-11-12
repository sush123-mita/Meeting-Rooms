
from rest_framework import serializers
from django.utils import timezone
from .models import MeetingRoom, Booking
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class MeetingRoomSerializer(serializers.ModelSerializer):

    class Meta:
        model = MeetingRoom

        fields = [
            'id',
            'room_name',
            'room_number',
            'capacity',
            'location',
            'is_active',
        ]

        read_only_fields = ['id']


class BookingSerializer(serializers.ModelSerializer):

    room_name = serializers.CharField(
        source='meeting_room.room_name',
        read_only=True
    )

    room_number = serializers.CharField(
        source='meeting_room.room_number',
        read_only=True
    )

    username = serializers.CharField(
        source='user.username',
        read_only=True
    )

    class Meta:
        model = Booking

        fields = [
            'id',
            'meeting_room',
            'room_name',
            'room_number',
            'user',
            'username',
            'meeting_title',
            'start_datetime',
            'end_datetime',
            'status',
            'created_at',
        ]

        read_only_fields = [
            'id',
            'user',
            'status',
            'created_at',
        ]


class BookingCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking

        fields = [
            'meeting_room',
            'meeting_title',
            'start_datetime',
            'end_datetime',
        ]

    def validate(self, attrs):

        start = attrs.get('start_datetime')
        end = attrs.get('end_datetime')

        if start and end and end <= start:
            raise serializers.ValidationError({
                'end_datetime':
                'End time must be greater than start time.'
            })

        if start and start <= timezone.now():
            raise serializers.ValidationError({
                'start_datetime':
                'Start time must be in the future.'
            })

        return attrs


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )
    
    class Meta:
        model=User
        fields=['username','email','password']
        
        
    def create(self, validate_data):
        return User.objects.create_user(**validate_data)
        