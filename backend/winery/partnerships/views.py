from django.shortcuts import render
from rest_framework import viewsets
from .models import Partner
from .serializers import PartnerSerializer
from rest_framework.generics import CreateAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from users.models import City

# Create your views here.

class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer

class PartnerCreateAPIView(CreateAPIView):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer

    def post(self, request, *args, **kwargs):
        city_name = request.data.get('city', None)
        if city_name:
            try:
                city = City.objects.get(name=city_name)
            except City.DoesNotExist:
                return Response({"error": f"City with name {city_name} does not exist."}, status=status.HTTP_400_BAD_REQUEST)
            request.data['city'] = city.id  # Replace city name with city ID in request data
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class PartnerDeleteAPIView(DestroyAPIView):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer
    lookup_field = 'pk'

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)