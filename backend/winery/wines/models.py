from django.db import models
from users.models import User
from vehicles.models import Vehicle

class Wine(models.Model):
    SWEETNESS_CHOICES = [
        ('Dry', 'Dry'),
        ('Medium', 'Medium'),
        ('Sweet', 'Sweet'),
    ]
    
    name = models.CharField(max_length=100)
    sweetness = models.CharField(max_length=20, choices=SWEETNESS_CHOICES)
    acidity = models.FloatField()
    alcohol = models.FloatField()
    pH = models.FloatField()
    winemaker = models.ForeignKey(User, on_delete=models.CASCADE, to_field='username')

    def __str__(self):
        return self.name

class Order(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE, to_field='username')
    wines = models.ManyToManyField(Wine)
    is_accepted = models.BooleanField(default=False)
    is_delivered = models.BooleanField(default=False)
    driver = models.ForeignKey(Vehicle, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"Order by {self.customer.username}"
