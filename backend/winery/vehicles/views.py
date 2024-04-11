from rest_framework import viewsets
from .models import Vehicle
from .serializers import VehicleSerializer
from rest_framework.generics import UpdateAPIView, DestroyAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from users.models import City


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class VehicleCreateAPIView(CreateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

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


class VehicleUpdateAPIView(UpdateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())

        try:
            obj = queryset.get(pk=self.kwargs[self.lookup_field])
            self.check_object_permissions(self.request, obj)
            return obj
        except Vehicle.DoesNotExist:
            raise NotFound('Vehicle not found')


class VehicleDeleteAPIView(DestroyAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    lookup_field = 'pk'

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
