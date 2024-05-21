from django.db import models
from users.models import City
from datetime import date
from django.conf import settings

class Partner(models.Model):

    city = models.ForeignKey(City, on_delete=models.CASCADE)
    
    name = models.CharField(max_length=255, verbose_name="Name")
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    address = models.CharField(max_length=255, verbose_name="Address")
    street_number = models.IntegerField(
        verbose_name="Street Number", default=0)

    def __str__(self):
        return f"{self.name}"

class Partnership(models.Model):
    class ContractStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ACTIVE = 'active', 'Active'
        EXPIRED = 'expired', 'Expired'
            
    partner = models.ForeignKey(Partner, on_delete=models.CASCADE)
    start_date = models.DateField(default=date.today)
    end_date = models.DateField()
    terms = models.TextField()
    status = models.CharField(max_length=10, choices=ContractStatus.choices, default=ContractStatus.PENDING)

    def __str__(self):
        return f'Partnership with {self.partner.name} ({self.status})'