from rest_framework import serializers
from .models import Vehicle, City

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['name', 'postal_code']

class VehicleSerializer(serializers.ModelSerializer):
    city = CitySerializer()

    class Meta:
        model = Vehicle
        fields = ['id', 'driver_name', 'capacity', 'address', 'street_number', 'phone_number', 'is_transporting', 'is_operational', 'vehicle_type', 'city']

    def create(self, validated_data):
        city_data = validated_data.pop('city')
        city_instance, _ = City.objects.get_or_create(**city_data)
        vehicle = Vehicle.objects.create(city=city_instance, **validated_data)
        return vehicle

    def update(self, instance, validated_data):
        city_data = validated_data.pop('city', None)
        if city_data:
            city_instance, _ = City.objects.get_or_create(**city_data)
            instance.city = city_instance
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

