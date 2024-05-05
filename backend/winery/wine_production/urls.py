from django.urls import path
from .views import WineTankViewSet

urlpatterns = [
    path('wine-tanks/<int:room>/<str:tank_id>/', WineTankViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='winetank-retrieve-update-destroy'),
    # path('<int:pk>/update/', WineTankUpdateAPIView.as_view(), name='vehicle-update'),
    # path('<int:pk>/delete/', WineTankDeleteAPIView.as_view(), name='vehicle-delete'),
]