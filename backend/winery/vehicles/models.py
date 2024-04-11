from django.db import models
from users.models import City

class Vehicle(models.Model):
    class VehicleType(models.TextChoices):
        SCOOTER = 'scooter', 'Scooter'
        TRUCK = 'truck', 'Truck'
        VAN = 'van', 'Van'
        MOTORCYCLE = 'motorcycle', 'Motorcycle'
        BICYCLE = 'bicycle', 'Bicycle'

    city = models.OneToOneField(
        City, on_delete=models.CASCADE, verbose_name="City")
    
    id = models.AutoField(primary_key=True)
    driver_name = models.CharField(max_length=255, verbose_name="Driver Name")
    capacity = models.PositiveIntegerField()
    address = models.CharField(max_length=255, verbose_name="Address")
    street_number = models.IntegerField(verbose_name="Street Number", default=0)
    phone_number = models.CharField(max_length=20)
    is_transporting = models.BooleanField(default=False)
    is_operational = models.BooleanField(default=True)
    vehicle_type = models.CharField(max_length=20, choices=VehicleType.choices)

    def __str__(self):
        return f"{self.vehicle_type} - {self.phone_number}"
