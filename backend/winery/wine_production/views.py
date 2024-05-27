from django.shortcuts import render
from rest_framework import viewsets
from .models import WineCellar, WineTank, WineRacking, FermentationData, FermentationBatch
from .serializers import WineCellarSerializer, WineTankSerializer, WineRackingSerializer, FermentationBatchSerializer, FermentationDataSerializer
from users.models import Winemaker
from rest_framework.generics import UpdateAPIView, DestroyAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound

class WineCellarViewSet(viewsets.ModelViewSet):
    queryset = WineCellar.objects.all()
    serializer_class = WineCellarSerializer

class WineCellarDeleteAPIView(DestroyAPIView):
    queryset = WineCellar.objects.all()
    serializer_class = WineCellarSerializer
    lookup_field = 'pk'

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
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

class WineRackingViewSet(viewsets.ModelViewSet):
    queryset = WineRacking.objects.all()
    serializer_class = WineRackingSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid()
        
        from_tank = serializer.validated_data['from_tank']
        to_tank = serializer.validated_data['to_tank']
        amount = serializer.validated_data['amount']
        
        if amount > from_tank.current_volume:
            return Response({"error": "Amount exceeds the current volume of the from tank."}, status=status.HTTP_400_BAD_REQUEST)
    
        # Check if taking away the amount doesn't result in a negative volume
        if from_tank.current_volume - amount < 0:
            return Response({"error": "Taking away this amount would result in a negative volume for the from tank."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if adding the amount doesn't exceed the capacity of the to tank
        if to_tank.current_volume + amount > to_tank.capacity:
            return Response({"error": "Adding this amount exceeds the capacity of the to tank."}, status=status.HTTP_400_BAD_REQUEST)

        from_tank.current_volume -= amount
        to_tank.current_volume += amount
        from_tank.save()
        to_tank.save()
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()

class FermentationBatchViewSet(viewsets.ModelViewSet):
    queryset = FermentationBatch.objects.all()
    serializer_class = FermentationBatchSerializer

    def create(self, request, *args, **kwargs):
        winemaker_username = request.data['winemaker_username']

        winemaker = Winemaker.objects.get(username=winemaker_username)

        request.data['winemaker'] = winemaker.id
        del request.data['winemaker_username']

        print(request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid()
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()
    
class FermentationDataViewSet(viewsets.ModelViewSet):
    queryset = FermentationData.objects.all()
    serializer_class = FermentationDataSerializer

    def list(self, request):
        batch_id = request.query_params.get('batch')
        if batch_id:
            queryset = FermentationData.objects.filter(batch=batch_id)
        else:
            queryset = FermentationData.objects.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
