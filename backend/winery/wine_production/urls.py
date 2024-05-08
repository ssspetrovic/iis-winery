from django.urls import path
from .views import WineTankViewSet, WineRackingViewSet

urlpatterns = [
    path('wine-tanks/<int:room>/<str:tank_id>/', WineTankViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='winetank-retrieve-update-destroy'),
    path('wine-tanks/<int:room>/', WineTankViewSet.as_view({'get': 'list'}), name='winetank-list'),
    path('wine-racking/', WineRackingViewSet.as_view({'post' : 'create'}), name='wine-racking')
]