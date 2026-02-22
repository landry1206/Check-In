from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from utils.security import email_exists
from datetime import timedelta

User = get_user_model()


def register_admin(email, password):
    if not email_exists(email):
        return {"error": "Email invalide ou inexistant"}, 400

    if User.objects.filter(email=email).exists():
        return {"error": "Email déjà utilisé"}, 400

    user = User.objects.create_user(email=email, password=password)

    refresh = RefreshToken.for_user(user)

    return {
        "id": user.id,
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh),
    }, 200


from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

User = get_user_model()


def login_admin_service(email, password):
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return {"error": "Identifiants invalides"}, 401

    if not user.check_password(password):
        return {"error": "Identifiants invalides"}, 401

    if not user.is_active:
        return {"error": "Compte désactivé"}, 403

    refresh = RefreshToken.for_user(user)
    refresh.access_token.set_exp(lifetime=timedelta(hours=1))

    return {
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh),
        "user": {
            "id": str(user.id),
            "email": user.email,
        }
    }, 200

def get_all_admins_service():
    users = User.objects.all().values("id", "email", "created_at")
    return list(users), 200


def get_admin_by_id_service(admin_id):
    try:
        user = User.objects.values(
            "id", "email", "created_at"
        ).get(id=admin_id)
        return user, 200
    except User.DoesNotExist:
        return {"error": "Admin introuvable"}, 404





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
