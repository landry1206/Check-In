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
    gallery = serializers.ListField(
        child=serializers.URLField(),
        max_length=3
    )
