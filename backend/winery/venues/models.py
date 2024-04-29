from django.db import models
from users.models import User
from vehicles.models import Vehicle

class Venue(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=200)
    capacity = models.PositiveIntegerField()

    def __str__(self):
        return self.name
