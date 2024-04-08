from rest_framework import viewsets
from .models import User, Customer, Manager, Winemaker, Admin
from .serializers import UserSerializer, CustomerSerializer, WinemakerSerializer, ManagerSerializer, AdminSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class WinemakerViewSet(viewsets.ModelViewSet):
    queryset = Winemaker.objects.all()
    serializer_class = WinemakerSerializer


class ManagerViewSet(viewsets.ModelViewSet):
    queryset = Manager.objects.all()    
    serializer_class = ManagerSerializer


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'role') and request.user.role == User.Role.ADMIN


class WorkersAPIView(APIView):
    def get(self, request, *args, **kwargs):
        winemakers = Winemaker.objects.all()
        managers = Manager.objects.all()
        
        winemakers_serializer = WinemakerSerializer(winemakers, many=True)
        managers_serializer = ManagerSerializer(managers, many=True)
        
        return Response({'winemakers': winemakers_serializer.data, 'managers': managers_serializer.data})
    

class WinemakerRegistrationAPIView(generics.CreateAPIView):
    serializer_class = WinemakerSerializer
    permission_classes = [IsAdminUser]  # Samo administratori mogu pristupiti ovom pogledu

    def post(self, request, *args, **kwargs):
        if request.user.role == 'ADMIN':
            return super().post(request, *args, **kwargs)
        else:
            return Response({'message': 'Only administrators can register new winemakers'}, status=status.HTTP_403_FORBIDDEN)


class ManagerRegistrationAPIView(generics.CreateAPIView):
    serializer_class = ManagerSerializer
    permission_classes = [IsAdminUser]  # Samo administratori mogu pristupiti ovom pogledu

    def post(self, request, *args, **kwargs):
        if request.user.role == 'ADMIN':
            return super().post(request, *args, **kwargs)
        else:
            return Response({'message': 'Only administrators can register new managers'}, status=status.HTTP_403_FORBIDDEN)


class WinemakerUpdateAPIView(generics.UpdateAPIView):
    queryset = Winemaker.objects.all()
    serializer_class = WinemakerSerializer
    lookup_field = 'username'  

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class ManagerUpdateAPIView(generics.UpdateAPIView):
    queryset = Manager.objects.all()
    serializer_class = ManagerSerializer
    lookup_field = 'username'  

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    

class AdminUpdateAPIView(generics.UpdateAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    lookup_field = 'username'  

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)