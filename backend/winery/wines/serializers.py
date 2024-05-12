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
