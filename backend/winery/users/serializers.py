from .models import User
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
        }
        
    def get_permissions(self):
        if self.action == 'create':
            # No authentication required for user creation
            return []
        return [IsAuthenticated()]

    authentication_classes = []


    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user
