from django.db import models
from users.models import User, Customer
from vehicles.models import Vehicle


class Wine(models.Model):
    SWEETNESS_CHOICES = [
        ('Dry', 'Dry'),
        ('Medium', 'Medium'),
        ('Sweet', 'Sweet'),
    ]

    TYPE_CHOICES = [
        ('Red', 'Red'),
        ('White', 'White'),
        ('Rose', 'Rose'),
    ]

    AGE_CHOICES = [
        ('Vintage', 'Vintage'),
        ('Non-vintage', 'Non-vintage')
    ]

    name = models.CharField(max_length=100)
    sweetness = models.CharField(
        max_length=20, choices=SWEETNESS_CHOICES, default='Dry')
    acidity = models.FloatField(verbose_name='Acidity', default=0)
    alcohol = models.FloatField(verbose_name='Alcohol', default=0)
    pH = models.FloatField(verbose_name='pH Value', default=0)
    price = models.DecimalField(
        verbose_name='Price', decimal_places=2, max_digits=10, default=0)
    quantity = models.IntegerField(verbose_name='Quantity', default=0)
    type = models.CharField(max_length=6, verbose_name='Type', default='Red')
    age = models.CharField(
        max_length=12, verbose_name='Age', default='Non-vintage')
    winemaker = models.ForeignKey(
        User, on_delete=models.CASCADE, to_field='username')
    image = models.ImageField(verbose_name='Image',
                              upload_to='wine_images/', null=True)

    def __str__(self):
        return self.name


class Order(models.Model):
    customer = models.ForeignKey(
        User, on_delete=models.CASCADE, to_field='username')
    wines = models.ManyToManyField(Wine)
    is_accepted = models.BooleanField(default=False)
    is_delivered = models.BooleanField(default=False)
    driver = models.ForeignKey(Vehicle, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"Order by {self.customer.username}"


class ShoppingCart(models.Model):
    customer = models.ForeignKey(
        Customer, verbose_name="Customer", on_delete=models.CASCADE, related_name="shopping_cart")
    items = models.ManyToManyField(
        'ShoppingCartItem', verbose_name="Items", related_name="shopping_carts")


class ShoppingCartItem(models.Model):
    wine = models.ForeignKey(
        Wine, verbose_name="Wine item", on_delete=models.CASCADE, related_name="shopping_cart_items")
    quantity = models.IntegerField(verbose_name="Wine quantity", default=0)
