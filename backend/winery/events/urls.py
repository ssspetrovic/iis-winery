from django.urls import path
from .views import EventViewSet, CreateEventAPIView

urlpatterns = [
    path('', EventViewSet.as_view({'get': 'list', 'post': 'create'}), name='event-list-create'),
    path('create/', CreateEventAPIView.as_view(), name='event-create'),
]