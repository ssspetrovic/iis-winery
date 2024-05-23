from django.urls import path
from .views import WineTankViewSet, WineRackingViewSet, WineCellarDeleteAPIView

urlpatterns = [
    path('wine-tanks/<int:room>/<str:tank_id>/', WineTankViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='winetank-retrieve-update-destroy'),
    path('wine-cellar/', WineTankViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='winetank-retrieve-update-destroy'),
    path('wine-racking/', WineRackingViewSet.as_view({'post' : 'create'}), name='wine-racking'),
    path('wine-cellar/<int:pk>/delete/', WineCellarDeleteAPIView.as_view(), name='winecellar-delete')
]