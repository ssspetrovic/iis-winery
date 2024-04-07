from django.core.management.base import BaseCommand
from django.conf import settings
from users.models import City
import csv


class Command(BaseCommand):
    help = 'Load cities data from CSV file'

    def handle(self, *args, **options):
        csv_file = settings.CITY_CSV_PATH

        # Open the CSV file and read data
        with open(csv_file, 'r', encoding='utf-8') as file:
            csv_reader = csv.reader(file)
            next(csv_reader)  # Skip header row
            for row in csv_reader:
                city_name, postal_code = row
                # Create City object and save to database
                City.objects.create(name=city_name, postal_code=postal_code)

        self.stdout.write(self.style.SUCCESS('Cities loaded successfully!'))
