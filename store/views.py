# views.py

# views.py
from django.template.loader import render_to_string
import random
import traceback
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views import View
from .forms import UserCreationForm, UserLoginForm, ReviewForm, CartItemForm, OrderForm
from .models import CustomUser, Product, ProductCategory, Review, Cart, CartItem, Order, OrderItem
from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.authtoken.views import obtain_auth_token
from datetime import datetime, timedelta
from django.contrib.auth.forms import AuthenticationForm, PasswordResetForm, UserCreationForm
import json
from .forms import CustomUserCreationForm  
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_POST
from django.contrib.auth.views import PasswordResetView, PasswordResetConfirmView
from django.urls import reverse_lazy
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.views.generic import RedirectView
from django.contrib.auth import logout
from django.contrib.auth import get_user_model
from django.forms.models import model_to_dict
from django.core.mail import send_mail
from django.contrib.auth import update_session_auth_hash
from django.contrib import admin
from django.http import HttpResponse
from django.urls import path


@csrf_protect
def user_signup(request):
    if request.method == 'POST':
        # Assuming you have a form with 'email', 'username', 'password' fields
        data = json.loads(request.body.decode('utf-8'))
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')

        if email and username and password:
            User = get_user_model()
            user = User.objects.create_user(username=username, email=email, password=password)
            login(request, user)
            return JsonResponse({'success': True, 'message': 'Signup successful'})
        else:
            return JsonResponse({'success': False, 'message': 'Invalid data'})

    return render(request, 'signup.html')
    
@csrf_protect
@require_POST
def user_login(request):
    if request.method == 'POST':
        # Assuming you have a form with 'email' and 'password' fields
        username = request.POST.get('username')
        password = request.POST.get('password')
        # Authenticate user
        user = authenticate(request, username=username, password=password)

        if user is not None:
            print(request.POST)
            login(request, user)
            return JsonResponse({'success': True, 'message': 'Login successful'})
        else:
            return JsonResponse({'success': False, 'message': 'Invalid credentials'})

    # Redirect to login.html for GET requests
    return render(request, 'login.html')


@permission_classes([AllowAny])
def forgot_password(request):
    # You can add any additional logic here if needed
    return PasswordResetView.as_view(
        template_name='forgot_password.html',
        success_url=reverse_lazy('password_reset_done'),
        email_template_name='password_reset_email.html',  # Custom email template
        subject_template_name='password_reset_subject.txt',  # Custom subject template
    )(request=request)


@permission_classes([AllowAny])
def password_reset_confirm(request, uidb64, token):
    return PasswordResetConfirmView.as_view(
        template_name='password_reset_confirm.html',
        success_url=reverse_lazy('password_reset_complete'),
    )(request=request, uidb64=uidb64, token=token)

def home(request):
    products = Product.objects.all()
    categories = ProductCategory.objects.all()
    return render(request, 'home.html', {'products': products, 'categories': categories})

def product_categories(request):
    categories = ProductCategory.objects.all()
    return render(request, 'home.html', {'categories': categories})

def category_products(request, category_id):
    category = ProductCategory.objects.get(pk=category_id)
    products = Product.objects.filter(category=category)
    categories = ProductCategory.objects.all()
    return render(request, 'home.html', {'category': category, 'products': products, 'categories': categories})


def product_detail(request, product_id):  # Change 'pk' to 'product_id'
    product = Product.objects.get(pk=product_id)
    reviews = Review.objects.filter(product=product)
    return render(request, 'product_detail.html', {'product': product, 'reviews': reviews})

def search_view(request):
    query = request.GET.get('q', '')
    
    if query:
        # Perform the search using your model's filter
        results = Product.objects.filter(name__icontains=query)
    else:
        results = []

    context = {
        'query': query,
        'results': results,
    }

    return render(request, 'search_results.html', context)



@login_required
def my_profile(request):
    # You can add additional logic to fetch user-specific profile details if needed
    return render(request, 'my_profile.html')

@login_required
def my_orders(request):
    orders = Order.objects.filter(user=request.user)
    return render(request, 'my_orders.html', {'orders': orders})

@login_required
def add_to_cart(request, product_id):
    try:
        quantity = int(request.POST.get('quantity', 1))
    except ValueError:
        return JsonResponse({'success': False, 'message': 'Invalid quantity'}, status=400)

    try:
        product = Product.objects.get(pk=product_id)
        cart, created = Cart.objects.get_or_create(user=request.user)
    
        # Update or create CartItem
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        cart_item.quantity = 1  # Set the quantity to the desired value
        cart_item.save()

        return JsonResponse({'success': True, 'message': 'Item added to cart'})
    except Product.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Product not found'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)

@login_required
def remove_from_cart(request, product_id):
    cart_item = get_object_or_404(CartItem, product_id=product_id, cart__user=request.user)
    cart_item.delete()
    return redirect('cart')

@login_required
def view_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    cart_items = CartItem.objects.filter(cart=cart)
    return render(request, 'cart.html', {'cart': cart, 'cart_items': cart_items})

@login_required
def update_cart(request, product_id):
    cart_item = get_object_or_404(CartItem, product_id=product_id, cart__user=request.user)

    if request.method == 'POST':
        # Parse the JSON payload
        payload = json.loads(request.body)
        quantity = int(payload.get('quantity', 0))

        if quantity == 0:
            cart_item.delete()
            messages.success(request, 'Item removed from the cart.')
        else:
            cart_item.quantity = quantity
            cart_item.save()
            messages.success(request, 'Cart updated.')

        return JsonResponse({'success': True})

    return redirect('cart')

@login_required
def get_cart_item(request, product_id):
    cart_item = get_object_or_404(CartItem, product_id=product_id, cart__user=request.user)

    cart_item_data = {
        'product_id': cart_item.product_id,
        'quantity': cart_item.quantity,
        # Include other fields as needed
    }

    return JsonResponse(cart_item_data)

@login_required
def get_user_cart(request):
    try:
        user_cart = Cart.objects.get(user=request.user)
        cart_items = CartItem.objects.filter(cart=user_cart)
        
        # Serialize cart data to JSON
        cart_data = {
            'cart_items': [{
                'product': {
                    'name': item.product.name,
                    'price': float(item.product.price),
                    'image': item.product.image.url,
                    'id': item.product.id,
                    # Add other product details as needed
                },
                'quantity': item.quantity,
            } for item in cart_items],
            'cart_total': float(sum(item.product.price * item.quantity for item in cart_items)),
            # Add other cart details as needed
        }

        return JsonResponse(cart_data)
    except Cart.DoesNotExist:
        return JsonResponse({'error': 'Cart not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

    

class CheckAuthenticationView(View):
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return JsonResponse({'authenticated': True})
        else:
            return JsonResponse({'authenticated': False})
        
        

@login_required
def post_review(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            rating = form.cleaned_data['rating']
            comment = form.cleaned_data['comment']
            Review.objects.create(product=product, user=request.user, rating=rating, comment=comment)
            messages.success(request, 'Review posted successfully.')
            return redirect('product_detail', product_id=product_id)
    else:
        form = ReviewForm()

    return render(request, 'post_review.html', {'form': form, 'product': product})


@login_required
def checkout(request):
    return render(request, 'checkout.html')

@login_required
@require_POST
def place_order(request):
    try:
        data = json.loads(request.body.decode('utf-8'))

        full_name = data.get('full_name')
        mobile = data.get('mobile')
        address = data.get('address')
        city = data.get('city')
        pin_code = data.get('pin_code')
        state = data.get('state')
        email = data.get('email')
        payment_method = data.get('payment_method')

        # Create a random 8-digit order ID
        order_id = str(random.randint(10000000, 99999999))

        # Create the order
        order = Order.objects.create(
            user=request.user,
            full_name=full_name,
            mobile=mobile,
            address=address,
            city=city,
            pin_code=pin_code,
            state=state,
            email=email,
            payment_method=payment_method,
            order_id=order_id,
        )

        # Move cart items to order items
        user_cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_items = CartItem.objects.filter(cart=user_cart)

        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )
        
        # Calculate and save the total order value
        order.calculate_total()

        # Clear the cart after placing the order
        user_cart.products.clear()

        # # Send an email to the user with order details
        # send_order_confirmation_email(order)

        messages.success(request, 'Order placed successfully.')
        return JsonResponse({'success': True, 'order_id': order.order_id})

    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON data'}, status=400)
    

def send_order_confirmation_email(order):
    subject = 'Order Confirmation'
    
    # Construct the email message using a template
    message = render_to_string('order_confirmation_email.html', {'order': order})
    
    from_email = 'your@example.com'  # Replace with your email address
    to_email = [order.email]

    send_mail(subject, message, from_email, to_email, fail_silently=False)


def order_detail(request, order_id):
    order = get_object_or_404(Order, order_id=order_id)
    order_items = OrderItem.objects.filter(order=order)
    total_price = sum(order_item.price * order_item.quantity for order_item in order_items)
    context = {
        'order': order,
        'order_items': order_items,
        'total_price': total_price,
    }

    return render(request, 'order_detail.html', context)


@login_required
def order_placed(request,order_id):
    orders = Order.objects.filter(user=request.user)
    # Redirect to the order detail page
    return redirect('order_detail', order_id=order_id)



