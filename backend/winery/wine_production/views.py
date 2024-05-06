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

    def list(self, request):
        room_id = request.query_params.get('room')
        if room_id:
            queryset = WineTank.objects.filter(room_id=room_id)
        else:
            queryset = WineTank.objects.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Call the create method of the serializer
            wine_tank = serializer.create(serializer.validated_data)
            return Response({'message': 'Wine tank created successfully'}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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

