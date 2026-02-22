
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/auth/", include("account.routes.auth_routes")),
    path("api/Appartements/", include("Appartement.routes.apartement_routes")),

]
