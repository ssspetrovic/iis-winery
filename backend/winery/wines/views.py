from rest_framework import viewsets
from .models import Order, Wine, ShoppingCart, ShoppingCartItem
from .serializers import OrderSerializer, WineSerializer, ShoppingCartItemSerializer, ShoppingCartSerializer
from django.http import JsonResponse
# import googlemaps


class WineViewSet(viewsets.ModelViewSet):
    queryset = Wine.objects.all()
    serializer_class = WineSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class ShoppingCartItemViewSet(viewsets.ModelViewSet):
    queryset = ShoppingCartItem.objects.all()
    serializer_class = ShoppingCartItemSerializer


class ShoppingCartViewSet(viewsets.ModelViewSet):
    queryset = ShoppingCart.objects.all()
    serializer_class = ShoppingCartSerializer

# def optimize_delivery_route(request, order_id):
#     try:
#         # Pronađi narudžbinu na osnovu ID-ja
#         order = Order.objects.get(id=order_id)
#         print(order.is_accepted)
#         # Proveri da li je narudžbina prihvaćena
#         if order.is_accepted:
#             # Pripremi adrese kupca i vinara
#             customer_address = order.customer.address
#             winemaker_address = order.wines.first().winemaker.address

#             # Dodaj brojeve ulica
#             customer_street_number = order.customer.street_number
#             winemaker_street_number = order.wines.first().winemaker.street_number

#             # Poveži se sa Google Maps API-jem
#             gmaps = googlemaps.Client(key='AIzaSyBAx-8HIskKSQ2T4uE4SewJxYNtrzVeKDM')

#             # Napravi listu parova adresa i brojeva ulica za kupca i vinara
#             customer_location = f"{customer_address}, {customer_street_number}"
#             winemaker_location = f"{winemaker_address}, {winemaker_street_number}"

#             # Izračunaj optimalnu rutu
#             directions = gmaps.directions(origin=winemaker_location,
#                                         destination=customer_location,
#                                         mode='driving')

#             # Analiziraj rezultate i ažuriraj status isporuke narudžbine
#             distance = directions[0]['legs'][0]['distance']['text']
#             duration = directions[0]['legs'][0]['duration']['text']
#             # Ažuriraj status isporuke narudžbine ili bazu podataka sa podacima o ruti
#             return JsonResponse({'message': 'Delivery route optimized successfully.', 'is_accepted': True})
#         else:
#             return JsonResponse({'error': 'Order is not accepted.'}, status=400)
#     except Order.DoesNotExist:
#         return JsonResponse({'error': 'Order not found.'}, status=404)
