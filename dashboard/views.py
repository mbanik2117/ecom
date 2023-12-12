
# Create your views here.
from django.shortcuts import render
from store.models import Order
from django.contrib.auth.decorators import user_passes_test


def is_admin(user):
    return user.is_authenticated and user.is_staff

@user_passes_test(is_admin)
def order_dashboard(request):
    orders = Order.objects.all()
    context = {'orders': orders}
    return render(request, 'dashboard/order_dashboard.html', context)
