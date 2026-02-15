from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from asgiref.sync import sync_to_async
from Appartement.serializers import ApartmentCreateSerializer
from Appartement.services import create_apartment_service, get_apartment_detail_service, list_apartments_service,reserve_apartment_service,reservation_detail_service,list_reservations_service, update_apartment_service
from Appartement.permissions import IsAdminOrProvider
from rest_framework.permissions import AllowAny
from django.utils.dateparse import parse_datetime
from rest_framework.permissions import IsAuthenticated

@api_view(["POST"])
@permission_classes([IsAdminOrProvider])
def create_apartment_controller(request):
    print(request.data)
    serializer = ApartmentCreateSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    data, status_code = create_apartment_service(
        request.user,
        serializer.validated_data
    )

    return Response(data, status=status_code)

@api_view(["GET"])
@permission_classes([AllowAny])
def get_apartment_detail_controller(request, id):
    data, status_code = get_apartment_detail_service(id)

    return Response(data, status=status_code)


@api_view(["GET"])
@permission_classes([AllowAny])
def list_apartments_controller(request):
    data, status_code = list_apartments_service(request.GET)

    return Response(data, status=status_code)


@api_view(["POST"])
@permission_classes([AllowAny])
def reserve_apartment_controller(request, apartment_id):

    start = parse_datetime(request.data.get("start_datetime"))
    end = parse_datetime(request.data.get("end_datetime"))

    if not start or not end:
        return Response(
            {"error": "Dates manquantes ou invalides"},
            status=400
        )

    data, status_code = reserve_apartment_service(apartment_id, start, end)

    return Response(data, status=status_code)


@api_view(["GET"])
@permission_classes([AllowAny])
def list_reservations_controller(request):

    data, status_code = list_reservations_service()

    return Response(data, status=status_code)


@api_view(["GET"])
@permission_classes([AllowAny])
def reservation_detail_controller(request, reservation_id):

    data, status_code = reservation_detail_service(reservation_id)

    return Response(data, status=status_code)



@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def update_apartment_controller(request, apartment_id):

    partial = request.method == "PATCH"

    data, status_code = update_apartment_service(apartment_id, request.data, partial)

    return Response(data, status=status_code)