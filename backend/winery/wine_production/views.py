from django.shortcuts import render
from rest_framework import viewsets
from .models import WineCellar, WineTank
from .serializers import WineCellarSerializer, WineTankSerializer
from rest_framework.generics import UpdateAPIView, DestroyAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound

class WineCellarViewSet(viewsets.ModelViewSet):
    queryset = WineCellar.objects.all()
    serializer_class = WineCellarSerializer

class WineTankViewSet(viewsets.ModelViewSet):
    queryset = WineTank.objects.all()
    serializer_class = WineTankSerializer

    def destroy(self, request, room, tank_id):
        try:
            # Attempt to get the wine tank with the given room and tank_id
            wine_tank = WineTank.objects.get(room=room, tank_id=tank_id)
        except WineTank.DoesNotExist:
            # If wine tank does not exist, return 404 Not Found
            return Response({'error': 'Wine tank not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Delete the wine tank
        wine_tank.delete()
        
        # Respond with success message
        return Response({'message': 'Wine tank deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

