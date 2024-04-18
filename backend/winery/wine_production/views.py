from django.shortcuts import render
from rest_framework import viewsets
from .models import WineCellar, WineTank
from .serializers import WineCellarSerializer, WineTankSerializer
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

