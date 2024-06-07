from django.db import models
from wines.models import Wine
from django.core.exceptions import ValidationError
from django.utils import timezone
from users.models import Winemaker, User

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
    STATUS_CHOICES = [
        ('NOT_STARTED', 'Not Started'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
    ]

    name = models.CharField(max_length=100)
    start_date = models.DateTimeField(auto_now_add=True)
    estimated_completion_date = models.DateTimeField(null=True)
    winemaker = models.ForeignKey(Winemaker, on_delete=models.CASCADE)
    wine = models.ForeignKey(Wine, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NOT_STARTED')

    def __str__(self):
        return self.name

class FermentationData(models.Model):
    batch = models.ForeignKey(FermentationBatch, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    temperature = models.FloatField()
    sugar_level = models.FloatField()
    pH = models.FloatField()

class Task(models.Model):
    description = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')

    def __str__(self):
        return self.description