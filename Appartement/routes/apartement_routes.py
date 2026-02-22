from django.urls import path
from Appartement.controllers.apartment_controller import (
    create_apartment_controller,
    get_apartment_detail_controller,
    list_apartments_controller,
    reserve_apartment_controller,
    reservation_detail_controller,
    list_reservations_controller,
    update_apartment_controller,
    delete_apartment_controller,
    upload_image_controller,
)


urlpatterns = [
    path("create/", create_apartment_controller),
    path("<uuid:id>/", get_apartment_detail_controller),
    path("", list_apartments_controller),
    path("<uuid:apartment_id>/reserve/", reserve_apartment_controller),
    path("reservations/", list_reservations_controller),
    path("reservations/<uuid:reservation_id>/", reservation_detail_controller),
    path("<uuid:apartment_id>/update/", update_apartment_controller),
    path("<uuid:apartment_id>/delete/", delete_apartment_controller),
    path("upload/", upload_image_controller),
]
