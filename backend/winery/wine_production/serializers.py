from rest_framework import serializers
from .models import WineTank, WineCellar
from wines.models import Wine
from wines.serializers import WineSerializer
from django.core.exceptions import ValidationError

class WineTankSerializer(serializers.ModelSerializer):
    # wine = WineSerializer()

    # def create(self, validated_data):
    #     wine_room_name = validated_data.pop('wine_room')
        
    #     wine_room_intance = WineCellar.objects.get(name=wine_room_name)

    #     wine_name = validated_data.pop('wine')

    #     wine_instance = Wine.objects.get(name=wine_name)


    #     return wine_instance
    
    # class Meta:
    #     model = WineTank
    #     fields = ['tank_id', 'description', 'room', 'wine', 'capacity', 'current_volume', 'tank_type']
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