from django.db import models
from wines.models import Wine
from django.core.exceptions import ValidationError
from django.utils import timezone
from users.models import Winemaker

class WineCellar(models.Model):
    name = models.CharField(max_length=100, unique=True)
    area = models.DecimalField(max_digits=10, decimal_places=2)

class WineTank(models.Model):
    TANK_TYPE = [
        ('Inox', 'Inox'),
        ('Barrel', 'Barrel'),
    ]
    
    tank_id = models.CharField(primary_key=True, max_length=10)
    description = models.CharField(max_length=250, unique=True)
    room = models.ForeignKey(WineCellar, on_delete=models.CASCADE)
    wine = models.ForeignKey(Wine, on_delete=models.CASCADE)
    capacity = models.DecimalField(max_digits=10, decimal_places=2)
    current_volume = models.DecimalField(max_digits=10, decimal_places=2)
    tank_type = models.CharField(max_length=25, choices=TANK_TYPE)

    class Meta:
        unique_together = (('tank_id', 'room'),)

    def clean(self):
        if self.current_volume > self.capacity:
            raise ValidationError(
                "Current volume must not exceed tank capacity.")

class WineRacking(models.Model):
    from_tank = models.ForeignKey(WineTank, related_name='racked_from', on_delete=models.CASCADE)
    to_tank = models.ForeignKey(WineTank, related_name='racked_to', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_time = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'Wine Racking from {self.from_tank} to {self.to_tank}'

class FermentationBatch(models.Model):
    name = models.CharField(max_length=100)
    start_date = models.DateTimeField(auto_now_add=True)
    winemaker = models.ForeignKey(Winemaker, on_delete=models.CASCADE)
    wine = models.ForeignKey(Wine, on_delete=models.CASCADE)

class FermentationData(models.Model):
    batch = models.ForeignKey(FermentationBatch, on_delete=models.CASCADE, related_name='data')
    timestamp = models.DateTimeField(auto_now_add=True)
    temperature = models.FloatField()
    sugar_level = models.FloatField()
    pH = models.FloatField()