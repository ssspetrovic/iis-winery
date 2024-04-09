from rest_framework import permissions
from .models import User

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'role') and request.user.role == User.Role.ADMIN

class IsCustomerOrManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and hasattr(request.user, 'role') and (request.user.role == User.Role.CUSTOMER or request.user.role == User.Role.MANAGER)
      