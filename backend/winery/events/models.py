from django.db import models
from venues.models import Venue

class Event(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    date_and_time = models.DateTimeField()
    number_of_guests = models.PositiveIntegerField()

    def __str__(self):
        return self.name

