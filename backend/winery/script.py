import os
import django

# Postavite okruženje Django projekta
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'winery.settings')
django.setup()

# Import modela Admin iz vaše aplikacije
from users.models import Admin

# Provjera postoji li već administratorski korisnik
if not Admin.objects.filter(username='admin').exists():
    # Stvaranje administratorskog korisnika
    admin = Admin.objects.create(
        username='pale',
        role=Admin.Role.ADMIN,
        first_name='Pale',
        last_name='Admin',
        email='pale@example.com'
    )
    admin.set_password('123')
    admin.save()
    print("Admin kreiran.")
else:
    print("Admin nije kreiran.")
