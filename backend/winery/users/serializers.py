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


class CustomerSerializer(serializers.ModelSerializer):
    city = CitySerializer()

    def create(self, validated_data):
        city_data = validated_data.pop('city')
        city_instance, _ = City.objects.get_or_create(**city_data)

        # Hash the password before saving the user
        password = validated_data.pop('password')
        hashed_password = make_password(password)

        validated_data['role'] = Customer.Role.CUSTOMER

        customer = Customer.objects.create(
            password=hashed_password, city=city_instance, **validated_data)
        return customer

    def update(self, instance, validated_data):
        city_data = validated_data.pop('city', None)
        if city_data:
            city_instance, _ = City.objects.get_or_create(**city_data)
            instance.city = city_instance

        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get(
            'first_name', instance.first_name)
        instance.last_name = validated_data.get(
            'last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.address = validated_data.get('address', instance.address)
        instance.street_number = validated_data.get(
            'street_number', instance.street_number)

        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)

        instance.save()
        return instance

    class Meta:
        model = Customer
        fields = ['username', 'password', 'first_name', 'last_name', 'date_of_birth',
                  'email', 'address', 'street_number', 'city']
        extra_kwargs = {
            'password': {'write_only': True},
        }


class WinemakerSerializer(serializers.ModelSerializer):
    city = CitySerializer()

    def create(self, validated_data):
        city_data = validated_data.pop('city')
        city_instance, _ = City.objects.get_or_create(**city_data)

        validated_data['role'] = Winemaker.Role.WINEMAKER

        password = validated_data.pop('password')
        hashed_password = make_password(password)
        validated_data['password'] = hashed_password

        winemaker = Winemaker.objects.create(
            city=city_instance, **validated_data)
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
        fields = ['id', 'username', 'password', 'first_name',
                  'last_name', 'email', 'address', 'street_number', 'city']


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
        fields = ['username', 'password', 'first_name',
                  'last_name', 'email', 'phone_number']


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
        fields = ['id', 'user', 'description', 'is_reviewed', 'reply']
