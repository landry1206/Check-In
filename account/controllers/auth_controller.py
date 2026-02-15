from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from account.serializers import AdminRegisterSerializer
from account.services import register_admin
from account.serializers import AdminLoginSerializer
from account.services import login_admin_service



@api_view(["POST"])
@permission_classes([AllowAny])
def register_admin_controller(request):
    serializer = AdminRegisterSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    data, status_code = register_admin(
        serializer.validated_data["email"],
        serializer.validated_data["password"],
    )

    return Response(data, status=status_code)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_admin_controller(request):
    serializer = AdminLoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    email = serializer.validated_data["email"]
    password = serializer.validated_data["password"]

    data, status_code = login_admin_service(
        email,
        password
    )

    return Response(data, status=status_code)