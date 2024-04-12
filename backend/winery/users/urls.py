from django.urls import path
from .views import (
    WinemakerRegistrationAPIView, 
    ManagerRegistrationAPIView, 
    WinemakerUpdateAPIView, 
    ManagerUpdateAPIView, 
    WorkersAPIView, 
    ReportCreateAPIView, 
    ReportDetailAPIView, 
    LogoutAPIView,
    GetUserRoleAPIView
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # path('api/token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/winemaker/', WinemakerRegistrationAPIView.as_view(), name='winemaker-registration'),
    path('register/manager/', ManagerRegistrationAPIView.as_view(), name='manager-registration'),
    path('update/winemaker/<str:username>/', WinemakerUpdateAPIView.as_view(), name='winemaker-update'), 
    path('update/manager/<str:username>/', ManagerUpdateAPIView.as_view(), name='manager-update'),  
    path('api/workers/', WorkersAPIView.as_view(), name='all-workers'),
    path('report/', ReportCreateAPIView.as_view(), name='report'),
    path('report/<int:pk>/reply/', ReportDetailAPIView.as_view(), name='reply'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('api/<str:username>/role/', GetUserRoleAPIView.as_view(), name="get_role")
]
