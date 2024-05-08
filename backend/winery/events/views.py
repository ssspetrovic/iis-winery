from django.shortcuts import render
from rest_framework.generics import CreateAPIView
from rest_framework import viewsets, status
from .models import Event, Invitation
from .serializers import EventSerializer
from rest_framework.response import Response
from datetime import datetime
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from rest_framework.views import APIView
from users.models import Customer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)

class CreateEventAPIView(CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def post(self, request, *args, **kwargs):
        date = request.data.get('date')
        time = request.data.get('time')
        try:
            date_time_str = f"{date} {time}"
            request.data['date_and_time'] = datetime.strptime(date_time_str, '%Y-%m-%d %H:%M')
        except ValueError:
            return Response({'error': 'Invalid date or time format'}, status=status.HTTP_400_BAD_REQUEST)
        request.data.pop('date', None)
        request.data.pop('time', None)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class SendInvitationsAPIView(APIView):
    def post(self, request, event_id):
        event = get_object_or_404(Event, pk=event_id)
        selected_customers = request.data.get('selected_customers', [])
        for customer_id in selected_customers:
            customer = get_object_or_404(Customer, pk=customer_id)
            invitation = Invitation.objects.create(event=event, customer=customer)
            invitation_link = f'http://example.com/confirm-invitation/{invitation.token}/'
            send_mail(
                'Invitation to Event',
                f'You are invited to the event "{event.name}". Please confirm your attendance by clicking the following link: {invitation_link}',
                'from@example.com',
                [customer.email],
                fail_silently=False,
            )
            invitation.sent = True
            invitation.save()
        return Response({'message': 'Invitations sent successfully.'})
