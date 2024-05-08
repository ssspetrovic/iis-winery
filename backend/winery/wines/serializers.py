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
    class Meta:
        model = ShoppingCartItem
        fields = '__all__'


class ShoppingCartSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer()

    class Meta:
        model = ShoppingCart
        fields = '__all__'
