# Generated by Django 5.0.4 on 2024-05-08 15:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
        ('wines', '0004_wine_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='ShoppingCart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('customer', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='shopping_cart', to='users.customer', verbose_name='Customer')),
            ],
        ),
        migrations.CreateModel(
            name='ShoppingCartItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(default=0, verbose_name='Wine quantity')),
                ('shopping_cart', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='wines.shoppingcart', verbose_name='Shopping Cart')),
                ('wine', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='shopping_cart_items', to='wines.wine', verbose_name='Wine item')),
            ],
        ),
    ]
