from .models import Partner
from users.models import City
from users.serializers import CitySerializer
from rest_framework import serializers

class PartnerSerializer(serializers.ModelSerializer):
    city = CitySerializer()

    class Meta:
        model = Partner
        fields = ['name', 'email', 'phone_number', 'address', 'street_number', 'city']

    def create(self, validated_data):
        city_data = validated_data.pop('city')
        city_instance, _ = City.objects.get_or_create(**city_data)
        partner = Partner.objects.create(city=city_instance, **validated_data)
        return partner

    def update(self, instance, validated_data):
        city_data = validated_data.pop('city', None)
        if city_data:
            city_instance, _ = City.objects.get_or_create(**city_data)
            instance.city = city_instance
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance