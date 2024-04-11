# Generated by Django 5.0.4 on 2024-04-11 11:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vehicles', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vehicle',
            name='city',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='vehicles.city', verbose_name='City'),
        ),
    ]
