from django.db import models
from users.models import User, Customer
from vehicles.models import Vehicle
from django.utils.timezone import now


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


class ShoppingCart(models.Model):
    customer = models.OneToOneField(
        Customer, verbose_name="Customer", on_delete=models.CASCADE, related_name="shopping_cart"
    )


class ShoppingCartItem(models.Model):
    shopping_cart = models.ForeignKey(
        ShoppingCart, verbose_name="Shopping Cart", on_delete=models.CASCADE, related_name="items"
    )
    wine = models.ForeignKey(
        Wine, verbose_name="Wine item", on_delete=models.CASCADE, related_name="shopping_cart_items"
    )
    quantity = models.IntegerField(verbose_name="Wine quantity", default=0)


class Order(models.Model):
    total_price = models.DecimalField(
        verbose_name='Total Price', decimal_places=2, max_digits=10, default=0)
    is_accepted = models.BooleanField(default=False)
    is_delivered = models.BooleanField(default=False)
    customer = models.ForeignKey(
        User, on_delete=models.CASCADE, to_field='username')
    driver = models.ForeignKey(Vehicle, on_delete=models.CASCADE, null=True)
    datetime = models.DateTimeField(default=now)

    def __str__(self):
        return f"Order by {self.customer.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name='items')
    wine = models.ForeignKey(Wine, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return f"{self.quantity} of {self.wine.name} for {self.order}"


class Wishlist(models.Model):
    customer = models.OneToOneField(
        Customer, verbose_name="Customer", on_delete=models.CASCADE, related_name="wishlist"
    )


class WishlistItem(models.Model):
    wishlist = models.ForeignKey(
        Wishlist, verbose_name="wishlist", on_delete=models.CASCADE, related_name="items"
    )
    wine = models.ForeignKey(
        Wine, verbose_name="wishlist item", on_delete=models.CASCADE, related_name="wishlist_items"
    )


class CustomerNotificationSubscription(models.Model):
    customer = models.ForeignKey(
        Customer, verbose_name='customer', on_delete=models.CASCADE)
    wine = models.ForeignKey(Wine, verbose_name='wine',
                             on_delete=models.CASCADE)
    subscription_time = models.DateTimeField(default=now)

    class Meta:
        unique_together = ('customer', 'wine')

    def __str__(self):
        return f'{self.customer} subscribed to {self.wine}'
