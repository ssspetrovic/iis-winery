from rest_framework import serializers
from .models import Order, Wine, ShoppingCart, ShoppingCartItem, OrderItem, Wishlist, WishlistItem
from users.models import User


class WineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wine
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    wine = WineSerializer()

    class Meta:
        model = OrderItem
        fields = ['wine', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = serializers.PrimaryKeyRelatedField(
        queryset=ShoppingCartItem.objects.all(), many=True)

    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        username = validated_data.pop('customer')
        customer = User.objects.get(username=username)
        order = Order(customer=customer, **validated_data)
        order.save()  # Save the order to generate an ID
        for item_data in items_data:
            if item_data.wine.quantity < item_data.quantity:
                raise serializers.ValidationError(
                    f"Not enough stock for {item_data.wine.name}. Available: {
                        item_data.wine.quantity}, Requested: {item_data.quantity}"
                )
            OrderItem.objects.create(
                order=order, wine=item_data.wine, quantity=item_data.quantity)
            item_data.wine.quantity -= item_data.quantity  # Decrease the wine quantity
            item_data.wine.save()  # Save the updated wine quantity
        order.total_price = sum(
            item.wine.price * item.quantity for item in order.items.all())
        order.save()

        # Clear the selected items from the user's shopping cart
        ShoppingCartItem.objects.filter(
            id__in=[item.id for item in items_data]).delete()

        return order


class ShoppingCartItemSerializer(serializers.ModelSerializer):
    wine_id = serializers.IntegerField(write_only=True)
    wine = WineSerializer(read_only=True)

    class Meta:
        model = ShoppingCartItem
        fields = '__all__'

    def create(self, validated_data):
        shopping_cart = validated_data['shopping_cart']
        wine_id = validated_data.pop('wine_id')
        quantity = validated_data['quantity']

        wine = Wine.objects.get(pk=wine_id)

        item, created = ShoppingCartItem.objects.get_or_create(
            shopping_cart=shopping_cart,
            wine=wine,
            defaults={'quantity': quantity},
        )

        if not created:
            item.quantity += quantity
            item.save()

        return item


class ShoppingCartSerializer(serializers.ModelSerializer):
    items = ShoppingCartItemSerializer(many=True, read_only=True)

    class Meta:
        model = ShoppingCart
        fields = ['id', 'customer', 'items']


class WishlistItemSerializer(serializers.ModelSerializer):
    wine_id = serializers.IntegerField(write_only=True)
    wine = WineSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        fields = '__all__'


class WishlistSerializer(serializers.ModelSerializer):
    items = WishlistItemSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = '__all__'
