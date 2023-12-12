from django.urls import path
from .views import order_dashboard

app_name = 'dashboard'

urlpatterns = [
    path('order-dashboard/', order_dashboard, name='order_dashboard'),
    # Add more URLs for other dashboard features if needed
]
