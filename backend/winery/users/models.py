from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        WINEMAKER = "WINEMAKER", "Winemaker"
        MANAGER = "MANAGER", "Manager"
        CUSTOMER = "CUSTOMER", "Customer"
        
    base_role = Role.ADMIN
    username = models.CharField(max_length=50, unique=True, primary_key=True)

    role = models.CharField(max_length=50, choices=Role.choices)
    
    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.base_role
            return super().save(*args, **kwargs)
        
class Customer(User):
    base_role = User.Role.CUSTOMER
    city = models.CharField(max_length=50, verbose_name="city", default="", null=False)
    country = models.CharField(max_length=50, verbose_name="city", default="", null=False)
        
    def welcome(self):
        return "Only for customers!"
    
    class Meta:
        verbose_name = "Customer"
        verbose_name_plural = "Customers"
    
class Winemaker(User):
    base_role = User.Role.WINEMAKER
    wine_sold = models.IntegerField(verbose_name="Wine sold", default=0)
    country = models.CharField(max_length=50, verbose_name="city", default="")
        
    def welcome(self):
        return "Only for winemakers!"
    
    class Meta:
        verbose_name = "Winemaker"
        verbose_name_plural = "Winemakers"