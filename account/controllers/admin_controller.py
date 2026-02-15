from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from account.permissions import IsAdminUserCustom
from account.services import (
    get_all_admins_service,
    get_admin_by_id_service,
)



@api_view(["GET"])
@permission_classes([IsAdminUserCustom])
def get_all_admins_controller(request):
    data, status_code = get_all_admins_service()
    return Response(data, status=status_code)


@api_view(["GET"])
@permission_classes([IsAdminUserCustom])
def get_admin_by_id_controller(request, admin_id):
    data, status_code = get_admin_by_id_service(admin_id)
    return Response(data, status=status_code)
