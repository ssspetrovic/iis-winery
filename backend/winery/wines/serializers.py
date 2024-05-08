from rest_framework import serializers
from .models import Order, Wine, ShoppingCart, ShoppingCartItem
from users.serializers import CustomerSerializer


class WineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wine
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    wines = serializers.PrimaryKeyRelatedField(
        queryset=Wine.objects.all(), many=True)

    class Meta:
        model = Order
        fields = '__all__'


class WineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wine
        fields = '__all__'


class ShoppingCartItemSerializer(serializers.ModelSerializer):
    wine = serializers.PrimaryKeyRelatedField(queryset=Wine.objects.all())

    class Meta:
        model = ShoppingCartItem
        fields = '__all__'

    def create(self, validated_data):
        shopping_cart = validated_data['shopping_cart']
        wine = validated_data['wine']
        quantity = validated_data['quantity']

        # Check if a ShoppingCartItem with the given shopping_cart and wine already exists
        item, created = ShoppingCartItem.objects.get_or_create(
            shopping_cart=shopping_cart,
            wine=wine,
            defaults={'quantity': quantity},
        )

        if not created:
            # If the item already exists, update its quantity
            item.quantity += quantity
            item.save()

        return item


class ShoppingCartSerializer(serializers.ModelSerializer):
    items = ShoppingCartItemSerializer(many=True, read_only=True)

    class Meta:
        model = ShoppingCart
        fields = ['customer', 'items']
