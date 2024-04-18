# Generated by Django 5.0.4 on 2024-04-18 13:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('wines', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='WineCellar',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('area', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='WineTank',
            fields=[
                ('tank_id', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('description', models.CharField(max_length=250)),
                ('capacity', models.DecimalField(decimal_places=2, max_digits=10)),
                ('current_volume', models.DecimalField(decimal_places=2, max_digits=10)),
                ('tank_type', models.CharField(choices=[('Inox', 'Inox'), ('Barrel', 'Barrel')], max_length=25)),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wine_production.winecellar')),
                ('wine', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wines.wine')),
            ],
        ),
    ]
