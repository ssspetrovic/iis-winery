from rest_framework import serializers
from .models import Order, Wine, ShoppingCart, ShoppingCartItem, OrderItem, Wishlist, WishlistItem, CustomerNotificationSubscription
from users.models import User
from django.core.mail import send_mail
from rest_framework.response import Response


class WineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wine
        fields = '__all__'

    def update(self, instance, validated_data):
        old_quantity = instance.quantity
        instance = super().update(instance, validated_data)
        new_quantity = instance.quantity

        if old_quantity <= 0 and new_quantity > 0:
            self.notify_subscribed_users(instance)

        return instance

    def notify_subscribed_users(self, wine):
        subscriptions = CustomerNotificationSubscription.objects.filter(
            wine=wine)
        notified_customers = []
        notifications_disabled = []

        for subscription in subscriptions:
            customer = subscription.customer
            if customer.is_allowing_notifications:
                send_mail(
                    'Wine Back in Stock',
                    f'Dear {customer.name},\n\nThe wine "{
                        wine.name}" is back in stock!',
                    'noreply@winery.com',
                    [customer.email],
                    fail_silently=False,
                )
                notified_customers.append(customer.email)
                subscription.delete()
            else:
                notifications_disabled.append(customer.email)

        return Response({
            'notified_customers': notified_customers,
            'notifications_disabled': notifications_disabled
        })


class OrderItemSerializer(serializers.ModelSerializer):
    wine = WineSerializer()

    class Meta:
        model = OrderItem
        fields = ['wine', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = serializers.PrimaryKeyRelatedField(
        queryset=ShoppingCartItem.objects.all(), many=True)

    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        username = validated_data.pop('customer')
        customer = User.objects.get(username=username)
        order = Order(customer=customer, **validated_data)
        order.save()  # Save the order to generate an ID
        for item_data in items_data:
            if item_data.wine.quantity < item_data.quantity:
                raise serializers.ValidationError(
                    f"Not enough stock for {item_data.wine.name}. Available: {
                        item_data.wine.quantity}, Requested: {item_data.quantity}"
                )
            OrderItem.objects.create(
                order=order, wine=item_data.wine, quantity=item_data.quantity)
            item_data.wine.quantity -= item_data.quantity  # Decrease the wine quantity
            item_data.wine.save()  # Save the updated wine quantity
        order.total_price = sum(
            item.wine.price * item.quantity for item in order.items.all())
        order.save()

        # Clear the selected items from the user's shopping cart
        ShoppingCartItem.objects.filter(
            id__in=[item.id for item in items_data]).delete()

        return order


class ShoppingCartItemSerializer(serializers.ModelSerializer):
    wine_id = serializers.IntegerField(write_only=True)
    wine = WineSerializer(read_only=True)

    class Meta:
        model = ShoppingCartItem
        fields = '__all__'

    def create(self, validated_data):
        shopping_cart = validated_data['shopping_cart']
        wine_id = validated_data.pop('wine_id')
        quantity = validated_data['quantity']

        wine = Wine.objects.get(pk=wine_id)

        item, created = ShoppingCartItem.objects.get_or_create(
            shopping_cart=shopping_cart,
            wine=wine,
            defaults={'quantity': quantity},
        )

        if not created:
            item.quantity += quantity
            item.save()

        return item


class ShoppingCartSerializer(serializers.ModelSerializer):
    items = ShoppingCartItemSerializer(many=True, read_only=True)

    class Meta:
        model = ShoppingCart
        fields = ['id', 'customer', 'items']


class WishlistItemSerializer(serializers.ModelSerializer):
    wine_id = serializers.IntegerField(write_only=True)
    wine = WineSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = '__all__'


class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = '__all__'


class CustomerNotificationSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerNotificationSubscription
        fields = '__all__'

    def validate(self, data):
        wine = data.get('wine')
        if wine.quantity > 0:
            raise serializers.ValidationError(
                'Cannot subscribe to a wine that is in stock.')
        return data
