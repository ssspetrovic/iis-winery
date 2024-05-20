from django.urls import path
from .views import VenueViewSet

urlpatterns = [
    path('', VenueViewSet.as_view({'get': 'list', 'post': 'create'}), name='venue-list-create'),
]