from django.urls import path
from .views import (
    ReportCreateAPIView, 
    ReportDetailAPIView, 
    LogoutAPIView,
    GetUserRoleAPIView,
    AuthenticatedHelloAPIView
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
    path('report/', ReportCreateAPIView.as_view(), name='report'),
    path('report/<int:pk>/reply/', ReportDetailAPIView.as_view(), name='reply'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('api/<str:username>/role/', GetUserRoleAPIView.as_view(), name="get_role"),
    path('api/hello-auth/', AuthenticatedHelloAPIView.as_view(), name="hello_auth")
]
