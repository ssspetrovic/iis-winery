import os
import django
import csv

# Postavite okruženje Django projekta
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'winery.settings')
django.setup()

# Import modela Admin iz vaše aplikacije
from users.models import Admin, City, Winemaker

# Provera postoji li već administratorski korisnik
if not Admin.objects.filter(username='pale').exists():
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

# Putanja do CSV datoteke s gradovima
csv_file_path = 'data/cities.csv'

def load_cities_from_csv(csv_file_path):
    with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            city_name = row['City']
            postal_code = row['Postal Code']
            existing_city = City.objects.filter(name=city_name, postal_code=postal_code).first()
            if not existing_city:
                city = City(name=city_name, postal_code=postal_code)
                city.save()
                print(f"Dodan grad: {city_name}, Poštanski kod: {postal_code}")
            else:
                print(f"Grad već postoji: {city_name}, Poštanski kod: {postal_code}")

# Poziv funkcije za učitavanje gradova iz CSV datoteke
load_cities_from_csv(csv_file_path)