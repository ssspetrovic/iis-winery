import os
import django
import random
from django.core.exceptions import ValidationError

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'winery.settings')
django.setup()

from wine_production.models import WineCellar, WineTank
from users.models import Winemaker
from wines.models import Wine

# Create WineCellar instances
wine_cellar_data = [
    {"name": "Cellar 1", "area": 100.0},
    {"name": "Cellar 2", "area": 150.0},
    {"name": "Cellar 3", "area": 200.0},
]

# Provera da li postoje WineCellar instance pre dodavanja novih
if WineCellar.objects.exists():
    print("WineCellar instance već postoje.")
else:
    for data in wine_cellar_data:
        WineCellar.objects.create(**data)
    print("WineCellar instance su uspešno kreirane.")


if not Wine.objects.exists():
    # Create Wine instances
    base_image_path = 'media/wine_images'

    Wine.objects.create(
        name='Cabernet Sauvignon',
        sweetness='Dry',
        acidity=0.5,
        alcohol=12.0,
        pH=3.5,
        price=10200,
        quantity=100,
        type='Red',
        age='Vintage',
        winemaker=Winemaker.objects.get(username='mata123'),
        image=f'{base_image_path}/cabernet_sauvignon_01.jpg'
    )

    Wine.objects.create(
        name='Sauvignon Blanc',
        sweetness='Sweet',
        acidity=0.6,
        alcohol=13.5,
        pH=3.6,
        price=3850,
        quantity=80,
        type='White',
        age='Non-vintage',
        winemaker=Winemaker.objects.get(username='mata123'),
        image=f'{base_image_path}/sauvignon_blanc.jpg'
    )

    Wine.objects.create(
        name='Cabernet Sauvignon',
        sweetness='Medium',
        acidity=0.7,
        alcohol=11.5,
        pH=3.4,
        price=7800,
        quantity=50,
        type='Red',
        age='Vintage',
        winemaker=Winemaker.objects.get(username='mata123'),
        image=f'{base_image_path}/cabernet_sauvignon_02.jpg'
    )
    
    Wine.objects.create(
        name='Sauvignon Blanc',
        sweetness='Medium',
        acidity=0.6,
        alcohol=13.5,
        pH=3.6,
        price=5820,
        quantity=30,
        type='White',
        age='Vintage',
        winemaker=Winemaker.objects.get(username='mata123'),
        image=f'{base_image_path}/sauvignon_blanc.jpg'
    )

wine_ids = list(Wine.objects.values_list('id', flat=True))

# Lista podataka o vinima
wine_data_list = [
    {"capacity": random.uniform(100, 200), "current_volume": random.uniform(50, 150), "tank_type": random.choice(["Barrel", "Inox"]), "wine_id": wine_ids[0]},
    {"capacity": random.uniform(100, 200), "current_volume": random.uniform(50, 150), "tank_type": random.choice(["Barrel", "Inox"]), "wine_id": wine_ids[1]},
    {"capacity": random.uniform(100, 200), "current_volume": random.uniform(50, 150), "tank_type": random.choice(["Barrel", "Inox"]), "wine_id": wine_ids[2]},
    {"capacity": random.uniform(100, 200), "current_volume": random.uniform(50, 150), "tank_type": random.choice(["Barrel", "Inox"]), "wine_id": wine_ids[3]},
]

if WineTank.objects.exists():
    print("WineTank instance već postoje.")
else:
    # Kreiranje WineTank instanci
    wine_cellar_ids = list(WineCellar.objects.values_list('id', flat=True))
    for i, data in enumerate(wine_data_list, start=1):
        try:
            tank_id = f"T{i}"
            description = f"Tank {i}"
            room_id = random.choice(wine_cellar_ids)  # Random izbor wine_cellar_id-a
            capacity = data["capacity"]  # Kapacitet je već generisan
            current_volume = data["current_volume"]  # Trenutni volumen je već generisan
            tank_type = data["tank_type"]  # Tip tanka je već generisan
            wine_id = data["wine_id"]  # ID vina je već odabran

            wine = Wine.objects.get(pk=wine_id)
            WineTank.objects.create(
                tank_id=tank_id,
                description=description,
                room_id=room_id,
                capacity=capacity,
                current_volume=current_volume,
                tank_type=tank_type,
                wine=wine
            )
        except ValidationError as e:
            print(f"Validation Error: {e}")
