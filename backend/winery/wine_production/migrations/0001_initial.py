# Generated by Django 5.0.4 on 2024-06-07 08:31

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0002_customer_is_allowing_notifications'),
        ('wines', '0003_customernotificationsubscription'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
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
            name='FermentationBatch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('start_date', models.DateTimeField(auto_now_add=True)),
                ('estimated_completion_date', models.DateTimeField(null=True)),
                ('status', models.CharField(choices=[('NOT_STARTED', 'Not Started'), ('IN_PROGRESS', 'In Progress'), ('COMPLETED', 'Completed')], default='NOT_STARTED', max_length=20)),
                ('wine', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wines.wine')),
                ('winemaker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.winemaker')),
            ],
        ),
        migrations.CreateModel(
            name='FermentationData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('temperature', models.FloatField()),
                ('sugar_level', models.FloatField()),
                ('pH', models.FloatField()),
                ('batch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wine_production.fermentationbatch')),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=255)),
                ('completed', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('assigned_to', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='WineTank',
            fields=[
                ('tank_id', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('description', models.CharField(max_length=250, unique=True)),
                ('capacity', models.DecimalField(decimal_places=2, max_digits=10)),
                ('current_volume', models.DecimalField(decimal_places=2, max_digits=10)),
                ('tank_type', models.CharField(choices=[('Inox', 'Inox'), ('Barrel', 'Barrel')], max_length=25)),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wine_production.winecellar')),
                ('wine', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wines.wine')),
            ],
            options={
                'unique_together': {('tank_id', 'room')},
            },
        ),
        migrations.CreateModel(
            name='WineRacking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('date_time', models.DateTimeField(default=django.utils.timezone.now)),
                ('from_tank', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='racked_from', to='wine_production.winetank')),
                ('to_tank', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='racked_to', to='wine_production.winetank')),
            ],
        ),
    ]
