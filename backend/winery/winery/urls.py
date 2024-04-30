"""
URL configuration for winery project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from users.views import UserViewSet, CustomerViewSet, WinemakerViewSet, ManagerViewSet, AdminViewSet, CityViewSet, ReportViewSet
from vehicles.views import VehicleViewSet
from wines.views import OrderViewSet, WineViewSet
from wine_production.views import WineCellarViewSet, WineTankViewSet
from venues.views import VenueViewSet

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'winemakers', WinemakerViewSet)
router.register(r'managers', ManagerViewSet)
router.register(r'vehicles', VehicleViewSet)
router.register(r'admins', AdminViewSet)
router.register(r'cities', CityViewSet)
router.register(r'reports', ReportViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'wines', WineViewSet)
router.register(r'wine-rooms', WineCellarViewSet)
router.register(r'wine-tanks', WineTankViewSet)
router.register(r'venues', VenueViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('users.urls'), name='users'),
    path('api/', include(router.urls)),
    path('api/vehicles/', include('vehicles.urls'), name='vehicles'),
    path('api/wines/', include('wines.urls'), name='wines'),
    path('api/venues/', include('venues.urls'), name='venues'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
