from rest_framework import serializers
from .models import Order, Wine

class WineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wine
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    wines = serializers.PrimaryKeyRelatedField(queryset=Wine.objects.all(), many=True)

    class Meta:
        model = Order
        fields = '__all__'
