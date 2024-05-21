from django.urls import path
from .views import PartnerViewSet, PartnerCreateAPIView, PartnerDeleteAPIView, PartnershipViewSet, PartnershipCreateAPIView

urlpatterns = [
    path('partners/', PartnerViewSet.as_view({'get': 'list', 'post': 'create'}), name='partner-list-create'),
    path('partners/create/', PartnerCreateAPIView.as_view(), name='partner-create'),
    path('partners/delete/<int:pk>/', PartnerDeleteAPIView.as_view(), name='partner-delete'),
    path('', PartnershipViewSet.as_view({'get' : 'list', 'post' : 'create'}), name='partnerships'),
    path('create/', PartnershipCreateAPIView.as_view(), name='partnership-create'),
]