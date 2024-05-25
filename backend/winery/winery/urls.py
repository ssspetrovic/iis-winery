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
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from users.views import UserViewSet, CustomerViewSet, WinemakerViewSet, ManagerViewSet, AdminViewSet, CityViewSet, ReportViewSet
from vehicles.views import VehicleViewSet
from wines.views import OrderViewSet, WineViewSet, ShoppingCartItemViewSet, ShoppingCartViewSet, OrderItemViewSet, WishlistViewSet, WishlistItemViewSet, CustomerNotificationSubscriptionViewSet
from wine_production.views import WineCellarViewSet, WineTankViewSet, FermentationBatchViewSet, FermentationDataViewSet
from venues.views import VenueViewSet
from events.views import EventViewSet
from partnerships.views import PartnerViewSet

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
router.register(r'carts', ShoppingCartViewSet)
router.register(r'cart-items', ShoppingCartItemViewSet)
router.register(r'order-items', OrderItemViewSet)
router.register(r'venues', VenueViewSet)
router.register(r'events', EventViewSet)
router.register(r'partners', PartnerViewSet)
router.register(r'batches', FermentationBatchViewSet)
router.register(r'ferm-data', FermentationDataViewSet)
router.register(r'wishlists', WishlistViewSet)
router.register(r'wishlist-items', WishlistItemViewSet)
router.register(r'customer-subscriptions',
                CustomerNotificationSubscriptionViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('users.urls'), name='users'),
    path('api/', include(router.urls)),
    path('api/vehicles/', include('vehicles.urls'), name='vehicles'),
    path('api/wines/', include('wines.urls'), name='wines'),
    path('api/wine-prod/', include('wine_production.urls'), name='wine_production'),
    path('api/venues/', include('venues.urls'), name='venues'),
    path('api/event/', include('events.urls'), name='events'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/partnerships/', include('partnerships.urls'), name='partnerships'),
    *static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT),

]

# Serve media files during development
# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
