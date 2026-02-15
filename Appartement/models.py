from django.db import models
from django.conf import settings
import uuid



class ApartmentCategory(models.TextChoices):
    CHAMBRE = "chambre", "Chambre"
    STUDIO = "studio", "Studio"
    APPARTEMENT = "appartement", "Appartement"
    VILLA = "villa", "Villa"


class ApartmentStatus(models.TextChoices):
    DISPONIBLE = "disponible", "Disponible"
    INDISPONIBLE = "indisponible", "Indisponible"
    EN_COURS = "en_cours", "En cours"


class Apartment(models.Model):
    id = models.CharField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        max_length=36
    )
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="apartments"
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    city = models.CharField(max_length=255, default="Douala")
    country = models.CharField(max_length=255, default="cameroun")
    latitude = models.FloatField()
    longitude = models.FloatField()

    category = models.CharField(
        max_length=20,
        choices=ApartmentCategory.choices
    )

    main_photo = models.URLField()

    status = models.CharField(
        max_length=20,
        choices=ApartmentStatus.choices,
        default=ApartmentStatus.DISPONIBLE
    )
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ApartmentGallery(models.Model):
    apartment = models.ForeignKey(
        Apartment,
        on_delete=models.CASCADE,
        related_name="gallery"
    )
    image_url = models.URLField()

class ApartmentUnavailable(models.Model):
    apartment = models.ForeignKey(
        Apartment,
        on_delete=models.CASCADE,
        related_name="unavailabilities"
    )
    id = id = models.CharField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        max_length=36
    )
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()

