
from django.urls import path
from account.views import (
    register_admin_controller,
    login_admin_controller,
    get_all_admins_controller,
    get_admin_by_id_controller,
)

urlpatterns = [
    path("register/", register_admin_controller),
    path("login/", login_admin_controller),

    path("admins/", get_all_admins_controller),
    path("admins/<uuid:id>/", get_admin_by_id_controller),
]

