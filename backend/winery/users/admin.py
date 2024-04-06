from django.contrib import admin
from .models import User, Customer, Winemaker

# Register your models here.
admin.site.register(User)
admin.site.register(Customer)
admin.site.register(Winemaker)