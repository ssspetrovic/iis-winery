from rest_framework import viewsets
from .models import User, Customer, Manager, Winemaker, Admin, Report
from .serializers import UserSerializer, CustomerSerializer, WinemakerSerializer, ManagerSerializer, AdminSerializer, ReportSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .permissions import IsAdminUser, IsCustomerOrManager
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password

class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'
    lookup_url_kwarg = 'username'

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    lookup_field = 'username'
    lookup_url_kwarg = 'username'

class WinemakerViewSet(viewsets.ModelViewSet):
    queryset = Winemaker.objects.all()
    serializer_class = WinemakerSerializer
    lookup_field = 'username'
    lookup_url_kwarg = 'username'

class ManagerViewSet(viewsets.ModelViewSet):
    queryset = Manager.objects.all()    
    serializer_class = ManagerSerializer
    lookup_field = 'username'
    lookup_url_kwarg = 'username'

class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    lookup_field = 'username'
    lookup_url_kwarg = 'username'

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
    

class ReportCreateAPIView(generics.CreateAPIView):
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated, IsCustomerOrManager]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReportListAPIView(generics.ListAPIView):
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == User.Role.ADMIN:
            return Report.objects.filter(is_reviewed=False)
        else:
            return Report.objects.filter(user=user)


class ReportDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def perform_update(self, serializer):
        user = self.request.user
        if user.role == User.Role.ADMIN:
            if serializer.instance.is_reviewed:
                return Response({"error": "This report has already been reviewed."}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save(is_reviewed=True)
        else:
            return Response({"error": "Only administrators can update reports."}, status=status.HTTP_403_FORBIDDEN)
