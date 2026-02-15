from .models import Apartment, ApartmentGallery
from django.utils import timezone
from django.db.models import Q
from .models import ApartmentUnavailable
from django.core.paginator import Paginator
from django.utils.dateparse import parse_datetime
from django.db import transaction


def create_apartment_service(user, data):
    apartment = Apartment.objects.create(
        creator=user,
        title=data["title"],
        description=data["description"],
        city=data["city"],
        country=data["country"],
        latitude=data["latitude"],
        longitude=data["longitude"],
        category=data["category"],
        main_photo=data["main_photo"],
    )

    gallery_urls = data.get("gallery", [])

    if len(gallery_urls) > 3:
        apartment.delete()
        return {"error": "Maximum 3 images dans la galerie"}, 400

    for url in gallery_urls:
        ApartmentGallery.objects.create(
            apartment=apartment,
            image_url=url
        )

    return {
        "id": apartment.id,
        "message": "Appartement créé avec succès"
    }, 201





def check_overlap(apartment, start, end):
    return ApartmentUnavailable.objects.filter(
        apartment=apartment
    ).filter(
        Q(start_datetime__lt=end) &
        Q(end_datetime__gt=start)
    ).exists()


def is_available_for_period(apartment, start, end):
    overlap = ApartmentUnavailable.objects.filter(
        apartment=apartment
    ).filter(
        Q(start_datetime__lt=end) &
        Q(end_datetime__gt=start)
    ).exists()

    return not overlap

def add_reservation_service(apartment, start, end):
    if start >= end:
        return {"error": "Dates invalides"}, 400

    overlap = check_overlap(apartment, start, end)

    if overlap:
        return {"error": "Période déjà réservée"}, 400

    ApartmentUnavailable.objects.create(
        apartment=apartment,
        start_datetime=start,
        end_datetime=end
    )

    return {"message": "Réservation enregistrée"}, 201

def compute_apartment_status(apartment):
    now = timezone.now()

    current_unavailability = ApartmentUnavailable.objects.filter(
        apartment=apartment,
        start_datetime__lte=now,
        end_datetime__gte=now
    ).exists()

    if current_unavailability:
        return "indisponible"

    return "disponible"

def get_apartment_detail_service(apartment_id):
    from .models import Apartment

    try:
        apartment = Apartment.objects.get(id=apartment_id)
    except Apartment.DoesNotExist:
        return {"error": "Appartement introuvable"}, 404

    unavailabilities = apartment.unavailabilities.all().values(
        "start_datetime",
        "end_datetime"
    )
    gallery = apartment.gallery.all().values("image_url")
    status = compute_apartment_status(apartment)

    return {
        "id": apartment.id,
        "title": apartment.title,
        "description": apartment.description,
        "latitude": apartment.latitude,
        "country": apartment.country,
        "city": apartment.city,
        "gallery": list(gallery),
        "longitude": apartment.longitude,
        "category": apartment.category,
        "main_photo": apartment.main_photo,
        "creator_email": apartment.creator.email,
        "status": status,
        "unavailabilities": list(unavailabilities),
    }, 200


def list_apartments_service(params):

    queryset = Apartment.objects.all()

    # Filtre catégorie
    category = params.get("category")
    if category:
        queryset = queryset.filter(category=category)

    #Filtre prix
    min_price = params.get("min_price")
    max_price = params.get("max_price")

    if min_price:
        queryset = queryset.filter(price_per_hour__gte=min_price)
    if max_price:
        queryset = queryset.filter(price_per_hour__lte=max_price)

    apartments = list(queryset)

    #Filtre disponibilité
    start = params.get("start")
    end = params.get("end")

    if start and end:
        start = parse_datetime(start)
        end = parse_datetime(end)

        apartments = [
            apt for apt in apartments
            if is_available_for_period(apt, start, end)
        ]

    #  Pagination
    page_number = params.get("page", 1)
    paginator = Paginator(apartments, 10) 
    page = paginator.get_page(page_number)

    results = []

    for element in page:
        results.append({
            "id": element.id,
            "title": element.title,
            "category": element.category,
            "price": element.price_per_hour,
            "city": element.city,
            "country": element.country,
            "main_photo": element.main_photo
        })

    return {
        "total_pages": paginator.num_pages,
        "current_page": page.number,
        "total_items": paginator.count,
        "results": results
    }, 200




@transaction.atomic
def reserve_apartment_service(apartment_id, start, end):
    try:
        apartment = Apartment.objects.select_for_update().get(id=apartment_id)
    except Apartment.DoesNotExist:
        return {"error": "Appartement introuvable"}, 404

    if start >= end:
        return {"error": "Dates invalides"}, 400

    # Vérification chevauchement
    overlap = ApartmentUnavailable.objects.filter(
        apartment=apartment,
        start_datetime__lt=end,
        end_datetime__gt=start,
    ).exists()

    if overlap:
        return {"error": "Appartement non disponible pour cette période"}, 400

    # Création indisponibilité
    ApartmentUnavailable.objects.create(
        apartment=apartment,
        start_datetime=start,
        end_datetime=end,
    )

    return {"message": "Réservation confirmée"}, 201



def list_reservations_service():
    reservations = ApartmentUnavailable.objects.select_related("apartment").all()

    data = []

    for r in reservations:
        data.append({
            "reservation_id": r.id,
            "start_datetime": r.start_datetime,
            "end_datetime": r.end_datetime,
            "apartment": {
                "id": r.apartment.id,
                "title": r.apartment.title,
                "latitude": r.apartment.latitude,
                "longitude": r.apartment.longitude,
            }
        })

    return data, 200


def reservation_detail_service(reservation_id):
    try:
        reservation = ApartmentUnavailable.objects.select_related("apartment").get(id=reservation_id)
    except ApartmentUnavailable.DoesNotExist:
        return {"error": "Réservation introuvable"}, 404

    data = {
        "reservation_id": reservation.id,
        "start_datetime": reservation.start_datetime,
        "end_datetime": reservation.end_datetime,
        "apartment": {
            "id": reservation.apartment.id,
            "title": reservation.apartment.title,
            "description": reservation.apartment.description,
            "latitude": reservation.apartment.latitude,
            "longitude": reservation.apartment.longitude,
            "category": reservation.apartment.category,
        }
    }

    return data, 200



def update_apartment_service(apartment_id, data, partial=False):
    try:
        apartment = Apartment.objects.get(id=apartment_id)
    except Apartment.DoesNotExist:
        return {"error": "Appartement introuvable"}, 404

    allowed_fields = [
        "title",
        "description",
        "latitude",
        "longitude",
        "category",
        "main_photo",
    ]

    for field in allowed_fields:
        if field in data:
            setattr(apartment, field, data[field])

    apartment.save()

    return {
        "message": "Appartement mis à jour",
        "id": apartment.id,
    }, 200


