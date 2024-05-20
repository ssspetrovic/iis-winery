from django.urls import path
from .views import PartnerViewSet, PartnerCreateAPIView, PartnerDeleteAPIView

urlpatterns = [
    path('', PartnerViewSet.as_view({'get': 'list', 'post': 'create'}), name='partner-list-create'),
    path('create/', PartnerCreateAPIView.as_view(), name='partner-create'),
    path('delete/<int:pk>/', PartnerDeleteAPIView.as_view(), name='partner-delete'),
]