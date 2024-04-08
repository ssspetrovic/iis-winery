from django.urls import path
from .views import WinemakerRegistrationAPIView, ManagerRegistrationAPIView, WinemakerUpdateAPIView, ManagerUpdateAPIView, AdminUpdateAPIView, WorkersAPIView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/winemaker/', WinemakerRegistrationAPIView.as_view(), name='winemaker-registration'),
    path('register/manager/', ManagerRegistrationAPIView.as_view(), name='manager-registration'),
    path('update/winemaker/<str:username>/', WinemakerUpdateAPIView.as_view(), name='winemaker-update'), 
    path('update/manager/<str:username>/', ManagerUpdateAPIView.as_view(), name='manager-update'),  
    path('update/admin/<str:username>/', AdminUpdateAPIView.as_view(), name='admin-update'),
    path('api/workers/', WorkersAPIView.as_view(), name='all-workers')
]
