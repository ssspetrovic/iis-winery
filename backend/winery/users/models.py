from django.db import models
from django.contrib.auth.models import AbstractUser


class City(models.Model):
    name = models.CharField(
        max_length=60, verbose_name='City name', default='')
    postal_code = models.IntegerField(verbose_name='Postal Code', default=0)


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        WINEMAKER = 'WINEMAKER', 'Winemaker'
        MANAGER = 'MANAGER', 'Manager'
        CUSTOMER = 'CUSTOMER', 'Customer'

    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.CUSTOMER,
        verbose_name='Role'
    )


class Customer(User):
    city = models.OneToOneField(
        City, on_delete=models.CASCADE, verbose_name="City")

    class Meta:
        verbose_name = 'Customer'
        verbose_name_plural = 'Customers'


class Winemaker(User):
    city = models.OneToOneField(
        City, on_delete=models.CASCADE, verbose_name="City")

    class Meta:
        verbose_name = 'Winemaker'
        verbose_name_plural = 'Winemakers'
