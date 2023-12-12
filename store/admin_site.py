# myapp/admin_site.py

from django.contrib.admin import AdminSite

class MyCustomAdminSite(AdminSite):
    site_header = 'My Custom Admin'
    site_title = 'My Admin'
    index_title = 'Dashboard'

# Register your models if needed
