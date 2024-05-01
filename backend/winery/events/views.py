from django.shortcuts import render
from rest_framework.generics import CreateAPIView
from rest_framework import viewsets, status
from .models import Event
from .serializers import EventSerializer
from rest_framework.response import Response
from datetime import datetime

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
