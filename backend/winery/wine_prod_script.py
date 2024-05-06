from users.models import Winemaker
from wines.models import Wine
from wine_production.models import WineCellar, WineTank
import os
import django
from django.core.exceptions import ValidationError

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'winery.settings')
django.setup()


# Create WineCellar instances
wine_cellar_data = [
    {"name": "Cellar 1", "area": 100.0},
    {"name": "Cellar 2", "area": 150.0},
    {"name": "Cellar 3", "area": 200.0},
]

for data in wine_cellar_data:
    WineCellar.objects.create(**data)

if not Wine.objects.exists():
    # Create Wine instances
    base_image_path = 'media/wine_images'

    Wine.objects.create(
        name='Cabernet Sauvignon',
        sweetness='Dry',
        acidity=0.5,
        alcohol=12.0,
        pH=3.5,
        price=25.99,
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
        price=29.99,
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
        price=19.99,
        quantity=50,
        type='Red',
        age='Vintage',
        winemaker=Winemaker.objects.get(username='mata123'),
        image=f'{base_image_path}/cabernet_sauvignon_02.jpg'
    )


# Create WineTank instances
wine_tank_data = [
    {"tank_id": "T1", "description": "Tank 1", "room_id": 1, "capacity": 100.0,
        "current_volume": 50.0, "tank_type": "Inox", "wine_id": 1},
    {"tank_id": "T2", "description": "Tank 2", "room_id": 1, "capacity": 150.0,
        "current_volume": 100.0, "tank_type": "Barrel", "wine_id": 2},
    {"tank_id": "T3", "description": "Tank 3", "room_id": 2, "capacity": 200.0,
        "current_volume": 150.0, "tank_type": "Inox", "wine_id": 3},
]

for data in wine_tank_data:
    try:
        wine_id = data.pop('wine_id')
        wine = Wine.objects.get(pk=wine_id)

        WineTank.objects.create(**data, wine=wine)
    except ValidationError as e:
        print(f"Validation Error: {e}")
