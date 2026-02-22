from rest_framework import serializers
from .models import ApartmentCategory


class ApartmentCreateSerializer(serializers.Serializer):
    title = serializers.CharField()
    description = serializers.CharField()
    city = serializers.CharField()
    country = serializers.CharField()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    category = serializers.ChoiceField(choices=ApartmentCategory.choices)
    main_photo = serializers.URLField()
    price_per_hour = serializers.CharField()  # Accept string, will convert in service
    status = serializers.CharField(required=False, default='disponible')
    gallery = serializers.ListField(
        child=serializers.URLField(),
        required=False,
        default=list,
        max_length=3
    )
    unavailabilities = serializers.ListField(
        required=False,
        default=list
    )
    
    def validate_price_per_hour(self, value):
        try:
            float(value)
            return value
        except (ValueError, TypeError):
            raise serializers.ValidationError("Le prix doit être un nombre valide")
