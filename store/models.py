# models.py

from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils import timezone
from django.core.validators import MinValueValidator
from django.contrib.auth import get_user_model



class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    groups = models.ManyToManyField(Group, related_name='custom_user_groups', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='custom_user_permissions', blank=True)
    # other fields as needed

    def __str__(self):
        return self.username

   


class ProductCategory(models.Model):
    name = models.CharField(max_length=255)

class Product(models.Model):
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_available = models.IntegerField()
    image = models.ImageField(upload_to='product_images/')

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField()
    datetime = models.DateTimeField(default=timezone.now)

class Cart(models.Model):
    # Define the OneToOneField with the correct User model
    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, through='CartItem')

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1, null=False)


class Order(models.Model):

    ORDER_STATUS_CHOICES = [
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
    ]
    PAYMENT_METHOD_CHOICES = [
        ('cash_on_delivery', 'Cash on Delivery'),
        ('debit_credit_card', 'Debit/Credit Card'),
        ('upi', 'UPI'),
        # Add other payment methods as needed
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, through='OrderItem')
    full_name = models.CharField(max_length=255, blank=False, default='')
    email = models.EmailField(blank=False, default='')
    address = models.TextField(blank=False, default='')
    city = models.CharField(max_length=255, blank=False, default='')
    pin_code = models.CharField(max_length=6, blank=False, default='')
    state = models.CharField(max_length=255, blank=False, default='')
    mobile = models.CharField(max_length=15, blank=False, default='')
    order_date = models.DateTimeField(default=timezone.now)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, blank=False, default='')
    order_id = models.CharField(max_length=8, unique=True, blank=False, default='')  # Assuming order_id is unique
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='processing')


    def calculate_total(self):
        order_items = OrderItem.objects.filter(order=self)
        self.total = sum(item.price * item.quantity for item in order_items)
        self.save()

    def save(self, *args, **kwargs):
        # Set default values if the user kept them void
        if not self.full_name:
            self.full_name = 'Unknown Name'
        if not self.email:
            self.email = 'unknown@example.com'
        # Add similar checks for other fields

        super().save(*args, **kwargs)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=Order.PAYMENT_METHOD_CHOICES, default='')
    
    def save(self, *args, **kwargs):
        # Perform additional checks or logic before saving the order item
        # For example, calculate the total price for the item before saving
        self.calculate_total_price()

        super().save(*args, **kwargs)

    def calculate_total_price(self):
        self.price = self.product.price * self.quantity