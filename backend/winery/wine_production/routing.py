from django.urls import path
from .consumers import FermentationDataConsumer

websocket_urlpatterns = [
    path('ws/fermentation/', FermentationDataConsumer.as_asgi()),
]