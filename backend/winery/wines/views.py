from .serializers import WineSerializer
from .models import OrderItem, WishlistItem, Wine
from rest_framework import viewsets
from .models import Order, Wine, ShoppingCart, ShoppingCartItem, OrderItem, Wishlist, WishlistItem, CustomerNotificationSubscription
from .serializers import OrderSerializer, WineSerializer, ShoppingCartItemSerializer, ShoppingCartSerializer, OrderItemSerializer, WishlistSerializer, WishlistItemSerializer, CustomerNotificationSubscriptionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count


class WineViewSet(viewsets.ModelViewSet):
    queryset = Wine.objects.all()
    serializer_class = WineSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer


class ShoppingCartItemViewSet(viewsets.ModelViewSet):
    queryset = ShoppingCartItem.objects.all()
    serializer_class = ShoppingCartItemSerializer


class ShoppingCartViewSet(viewsets.ModelViewSet):
    queryset = ShoppingCart.objects.all()
    serializer_class = ShoppingCartSerializer


class WishlistItemViewSet(viewsets.ModelViewSet):
    queryset = WishlistItem.objects.all()
    serializer_class = WishlistItemSerializer


class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer


class CustomerNotificationSubscriptionViewSet(viewsets.ModelViewSet):
    queryset = CustomerNotificationSubscription.objects.all()
    serializer_class = CustomerNotificationSubscriptionSerializer


class WineRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        customer = request.user

        # Get wine IDs from OrderItems related to the customer's orders
        order_wines = OrderItem.objects.filter(
            order__customer=customer).values_list('wine', flat=True)

        # Get wine IDs from WishlistItems related to the customer's wishlist
        wishlist_wines = WishlistItem.objects.filter(
            wishlist__customer=customer).values_list('wine', flat=True)

        # Combine wines from orders and wishlist
        wine_ids = list(set(order_wines) | set(wishlist_wines))

        # Fetch all wines
        wines = Wine.objects.filter(id__in=wine_ids)

        # If there are no preferred wine types, return random wines from the entire wine list
        if not wines.exists():
            all_wines = Wine.objects.order_by('?')
        else:
            # Analyze preferences
            wine_type_counts = wines.values('type').annotate(
                count=Count('type')).order_by('-count')
            preferred_type = wine_type_counts.first(
            )['type'] if wine_type_counts else None

            # Recommend wines of the same type if a preferred type is identified
            if preferred_type:
                all_wines = Wine.objects.filter(
                    type=preferred_type).order_by('?')
            else:
                # Fallback to recommend random wines if no preferences found
                all_wines = Wine.objects.order_by('?')

        # Now slice the QuerySet
        recommendations = all_wines[:3]

        # Serialize and return recommendations
        serializer = WineSerializer(recommendations, many=True)
        return Response(serializer.data)
