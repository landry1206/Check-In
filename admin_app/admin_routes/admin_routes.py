from django.urls import path
from ..admin_controllers.admin_controller import create_admin

urlpatterns = [
    path('create/', create_admin, name='create-admin'),
]
