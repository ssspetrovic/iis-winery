from django.db import models
from venues.models import Venue
from users.models import Customer
from django.utils.crypto import get_random_string

class Event(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    date_and_time = models.DateTimeField()
    number_of_guests = models.PositiveIntegerField()

    def __str__(self):
        return self.name

class Invitation(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    token = models.CharField(max_length=32, unique=True)
    sent = models.BooleanField(default=False)

    def generate_token(self):
        return get_random_string(length=32)

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = self.generate_token()
        super().save(*args, **kwargs)

