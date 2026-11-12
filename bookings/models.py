from django.db import models
from django.contrib.auth.models import User
from django.db.models import Q


class MeetingRoom(models.Model):
    
    room_name= models.CharField(max_length=100)
    
    room_number=models.CharField(
        
        max_length=20,
        unique=True   
    )
    
    capacity=models.PositiveBigIntegerField()
    location=models.CharField(max_length=150)
    is_active=models.BooleanField(default=True)
    created_at=models.DateTimeField(auto_now_add=True)
    
    
    class Meta:
        
        ordering = ['room_number']
        
    def __str__(self):
        return f"{self.room_name} ({self.room_number})"
        


class Booking(models.Model):
    
    
    class Status(models.TextChoices):
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        CANCELLED = 'CANCELLED', 'Cancelled'

    meeting_room = models.ForeignKey(
        MeetingRoom,
        on_delete=models.PROTECT,
        related_name='bookings'
    )

    user = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='bookings'
    )

    meeting_title = models.CharField(max_length=200)

    start_datetime = models.DateTimeField()

    end_datetime = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.CONFIRMED
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['start_datetime']

        constraints = [
            models.CheckConstraint(
                condition=Q(
                    end_datetime__gt=models.F('start_datetime')
                ),
                name='booking_end_after_start'
            )
        ]

    def __str__(self):
        return (
            f"{self.meeting_title} - "
            f"{self.meeting_room.room_name}"
        )
