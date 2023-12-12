from django import template

register = template.Library()

@register.filter(name='get_product_id')
def get_product_id(item):
    if hasattr(item, 'product') and hasattr(item.product, 'id'):
        return item.product.id
    return None