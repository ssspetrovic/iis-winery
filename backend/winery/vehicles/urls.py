from django.urls import path
from .views import VehicleViewSet, VehicleCreateAPIView, VehicleUpdateAPIView, VehicleDeleteAPIView

urlpatterns = [
    path('', VehicleViewSet.as_view({'get': 'list', 'post': 'create'}), name='vehicle-list-create'),
    path('<int:pk>/', VehicleViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='vehicle-retrieve-update-destroy'),
    path('create/', VehicleCreateAPIView.as_view(), name='vehicle-create'),
    path('<int:pk>/update/', VehicleUpdateAPIView.as_view(), name='vehicle-update'),
    path('<int:pk>/delete/', VehicleDeleteAPIView.as_view(), name='vehicle-delete'),
]
