from django.conf import settings
from django.urls import path
from store import views
from store.views import user_signup, user_login, forgot_password,search_view, get_user_cart,CheckAuthenticationView, get_cart_item, place_order, order_detail
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('signup/', user_signup, name='signup'),
    path('login/', user_login, name='login'),
    path('auth/logout/', LogoutView.as_view(next_page='home'), name='custom_logout'),
    path('forgot_password/', forgot_password, name='forgot_password'),
    path('search/', search_view, name='search'),
    path('my-profile/', views.my_profile, name='my_profile'),
    path('my-orders/', views.my_orders, name='my_orders'),
    path('', views.home, name='home'),
    path('categories/', views.product_categories, name='product_categories'),
    path('categories/<int:category_id>/', views.category_products, name='category_products'),
    path('product/<int:product_id>/', views.product_detail, name='product_detail'),
    path('check-authentication/', CheckAuthenticationView.as_view(), name='check_authentication'),
    path('get_user_cart/', get_user_cart, name='get_user_cart'),
    path('add_to_cart/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path('update_cart/<int:product_id>/', views.update_cart, name='update_cart'),
    path('remove_from_cart/<int:product_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('cart/', views.view_cart, name='cart'),
    path('get_cart_item/<int:product_id>/', get_cart_item, name='get_cart_item'),
    path('checkout/', views.checkout, name='checkout'),
    path('place_order/', place_order, name='place_order'),
    path('order/<str:order_id>/', order_detail, name='order_detail'),
    path('order_placed/', views.order_placed, name='order_placed'),
    
   
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)   

# Add the following lines if you're using Django Rest Framework (DRF) for API views
