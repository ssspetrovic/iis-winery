from rest_framework import viewsets
from .models import Vehicle
from .serializers import VehicleSerializer
from rest_framework import permissions
from users.models import User
from rest_framework.generics import UpdateAPIView, DestroyAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework import status

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'role') and request.user.role == User.Role.ADMIN

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAdminUser]

class VehicleCreateAPIView(CreateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAdminUser]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class VehicleUpdateAPIView(UpdateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    lookup_field = 'pk'
    permission_classes = [IsAdminUser]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class VehicleDeleteAPIView(DestroyAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    lookup_field = 'pk'
    permission_classes = [IsAdminUser]

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
