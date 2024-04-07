from rest_framework import serializers
from .models import User, Customer, City


class UserSerializer(serializers.HyperlinkedModelSerializer):
    def create(self, validated_data):
        # Hash the password before saving the user
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)  # Set password using set_password method
        user.save()
        return user

    class Meta:
        model = User
        fields = ['username', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
        }


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name', 'postal_code']


class CustomerSerializer(serializers.HyperlinkedModelSerializer):
    city = CitySerializer()

    def create(self, validated_data):
        # Hash the password before saving the user
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)  # Set password using set_password method
        user.save()
        return user

    class Meta:
        model = Customer
        fields = ['username', 'password', 'city']
        extra_kwargs = {
            'password': {'write_only': True},
        }
