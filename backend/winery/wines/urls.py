from django.urls import path
from . import views

urlpatterns = [
    # path('orders/<int:order_id>/optimize_delivery_route/', views.optimize_delivery_route, name='optimize_delivery_route'),
    path('recommendations/get/', views.WineRecommendationView.as_view(), name='wine_recommendations')
]
