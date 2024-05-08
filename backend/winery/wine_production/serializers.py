from rest_framework import serializers
from .models import WineTank, WineCellar, WineRacking
from wines.models import Wine
from wines.serializers import WineSerializer
from django.core.exceptions import ValidationError

class WineTankSerializer(serializers.ModelSerializer):
    wine = serializers.CharField()

    def create(self, validated_data):
        room_instance = validated_data.pop('room')

        # Get the wine data from validated data
        wine_type = validated_data.pop('wine')
        try:
            # Get the WineCellar instance using the room ID
            wine_instance = Wine.objects.get(name=wine_type)
        except Wine.DoesNotExist:
            raise serializers.ValidationError("Invalid wine name")
        
        # Create the wine tank instance with the room and wine instances
        wine_tank = WineTank.objects.create(room=room_instance, wine=wine_instance, **validated_data)

        return wine_tank
    
    class Meta:
        model = WineTank
        fields = '__all__'

class WineCellarSerializer(serializers.ModelSerializer):
    wine_tanks = WineTankSerializer(many=True, read_only=True)
    
    def create(self, validated_data):
        name = validated_data.pop('name')
        area = validated_data.pop('area')

        wine_cellar = WineCellar.objects.create(name=name, area=area)

        return wine_cellar
    
    class Meta:
        model = WineCellar
        fields = '__all__'
    
class WineRackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = WineRacking
        fields = '__all__'