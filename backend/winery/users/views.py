from rest_framework import viewsets
from .models import User, Customer, Manager, Winemaker, Admin, Report, City
from .serializers import UserSerializer, CustomerSerializer, WinemakerSerializer, ManagerSerializer, AdminSerializer, ReportSerializer, CitySerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from rest_framework.decorators import permission_classes


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([IsAuthenticated])
class AuthenticatedHelloAPIView(APIView):
    def get(self, request, format=None):
        content = {
            'message': 'Hello, authenticated user!'
        }
        return Response(content)


class GetUserRoleAPIView(APIView):
    """
    Retrieve the role of a user.
    """

    def get_object(self, username):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound("User not found")

    def get(self, request, username, format=None):
        user = self.get_object(username)
        return Response({'role': user.role})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'
    lookup_url_kwarg = 'username'


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    lookup_field = 'username'
    lookup_url_kwarg = 'username'


class WinemakerViewSet(viewsets.ModelViewSet):
    queryset = Winemaker.objects.all()
    serializer_class = WinemakerSerializer
    lookup_field = 'username'
    lookup_url_kwarg = 'username'


class ManagerViewSet(viewsets.ModelViewSet):
    queryset = Manager.objects.all()
    serializer_class = ManagerSerializer
    lookup_field = 'username'
    lookup_url_kwarg = 'username'


class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    lookup_field = 'username'
    lookup_url_kwarg = 'username'


class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer


class ReportCreateAPIView(generics.CreateAPIView):
    serializer_class = ReportSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReportDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    def perform_update(self, serializer):
        user = self.request.user
        if user.role == User.Role.ADMIN:
            if serializer.instance.is_reviewed:
                return Response({"error": "This report has already been reviewed."}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save(is_reviewed=True)
        else:
            return Response({"error": "Only administrators can update reports."}, status=status.HTTP_403_FORBIDDEN)


class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    lookup_field = 'name'
    lookup_url_kwarg = 'name'
