# Generated by Django 5.0.4 on 2024-05-22 22:19

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('wine_production', '0001_initial'),
        ('wines', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='winetank',
            name='wine',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wines.wine'),
        ),
        migrations.AddField(
            model_name='wineracking',
            name='from_tank',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='racked_from', to='wine_production.winetank'),
        ),
        migrations.AddField(
            model_name='wineracking',
            name='to_tank',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='racked_to', to='wine_production.winetank'),
        ),
        migrations.AlterUniqueTogether(
            name='winetank',
            unique_together={('tank_id', 'room')},
        ),
    ]
