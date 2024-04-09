from rest_framework import serializers
from .models import User, Customer, City, Winemaker, Manager, Admin, Report
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.HyperlinkedModelSerializer):
    def create(self, validated_data):
        # Hash the password before saving the user
        password = validated_data.pop('password')
        hashed_password = make_password(password)
        user = User.objects.create(password=hashed_password, **validated_data)
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
        hashed_password = make_password(password)
        user = User.objects.create(password=hashed_password, **validated_data)
        return user

    class Meta:
        model = Customer
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'address', 'street_number', 'city']
        extra_kwargs = {
            'password': {'write_only': True},
        }

class WinemakerSerializer(serializers.HyperlinkedModelSerializer):
    city = CitySerializer()

    def create(self, validated_data):
        city_data = validated_data.pop('city')
        city_instance = City.objects.create(**city_data)
        
        validated_data['role'] = User.Role.WINEMAKER

        password = validated_data.pop('password')
        hashed_password = make_password(password)
        validated_data['password'] = hashed_password
        
        winemaker = Winemaker.objects.create(city=city_instance, **validated_data)
        return winemaker

    def update(self, instance, validated_data):
        city_data = validated_data.pop('city', None)
        if city_data:
            city_instance, _ = City.objects.get_or_create(**city_data)
            instance.city = city_instance
        
        if 'password' in validated_data:
            password = validated_data.pop('password')
            hashed_password = make_password(password)
            validated_data['password'] = hashed_password
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
    
    class Meta:
        model = Winemaker
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'address', 'street_number', 'city']
        extra_kwargs = {
            'password': {'write_only': True},
        }


class ManagerSerializer(serializers.HyperlinkedModelSerializer):
    def create(self, validated_data):
        validated_data['role'] = User.Role.MANAGER
        
        password = validated_data.pop('password')
        hashed_password = make_password(password)
        validated_data['password'] = hashed_password
        
        manager = Manager.objects.create(**validated_data)
        return manager

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            hashed_password = make_password(password)
            validated_data['password'] = hashed_password

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
    
    class Meta:
        model = Manager
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'phone_number']
        extra_kwargs = {
            'password': {'write_only': True},
        }


class AdminSerializer(serializers.HyperlinkedModelSerializer):
    def create(self, validated_data):
        validated_data['role'] = User.Role.ADMIN
        
        # Hash the password before saving the admin
        password = validated_data.pop('password')
        hashed_password = make_password(password)
        validated_data['password'] = hashed_password
        
        admin = Admin.objects.create(**validated_data)
        return admin

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            hashed_password = make_password(password)
            validated_data['password'] = hashed_password
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
    
    class Meta:
        model = Admin
        fields = ['username', 'password', 'first_name', 'last_name', 'email']


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['id', 'user_id', 'description', 'is_reviewed', 'reply']
    

