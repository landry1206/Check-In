from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .admin_serializer import AdminUserSerializer
from drf_yasg.utils import swagger_auto_schema


@swagger_auto_schema(method='post', request_body=AdminUserSerializer)
@api_view(['POST'])
def create_admin(request):
    serializer = AdminUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
