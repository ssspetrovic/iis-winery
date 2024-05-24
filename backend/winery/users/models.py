from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import date


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

    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.CUSTOMER,
        verbose_name='Role'
    )


class Customer(User):
    city = models.OneToOneField(
        City, on_delete=models.CASCADE, verbose_name="City", unique=False)
    address = models.CharField(max_length=255, verbose_name="Address")
    street_number = models.IntegerField(
        verbose_name="Street Number", default=0)
    date_of_birth = models.DateField(
        verbose_name="Date of Birth", default=date.today)
    is_allowing_notifications = models.BooleanField(
        verbose_name='is allowing notifications', default=False)

    class Meta:
        verbose_name = 'Customer'
        verbose_name_plural = 'Customers'


class Winemaker(User):
    city = models.OneToOneField(
        City, on_delete=models.CASCADE, verbose_name="City", unique=False)
    address = models.CharField(max_length=255, verbose_name="Address")
    street_number = models.IntegerField(
        verbose_name="Street Number", default=0)

    class Meta:
        verbose_name = 'Winemaker'
        verbose_name_plural = 'Winemakers'


class Manager(User):
    phone_number = models.CharField(
        max_length=20, verbose_name="Phone Number", default="")

    class Meta:
        verbose_name = 'Manager'
        verbose_name_plural = 'Managers'


class Admin(User):
    class Meta:
        verbose_name = 'Admin'
        verbose_name_plural = 'Admins'


class Report(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, to_field='username')
    description = models.TextField()
    is_reviewed = models.BooleanField(default=False)
    reply = models.TextField(null=True, blank=True)
