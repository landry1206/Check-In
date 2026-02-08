from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission

class AdminUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    # Évite les conflits avec auth.User
    groups = models.ManyToManyField(
        Group,
        related_name='admin_users',  # <-- important
        blank=True,
        help_text='Les groupes auxquels appartient l’utilisateur',
        verbose_name='groupes'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='admin_users_permissions',  # <-- important
        blank=True,
        help_text='Permissions spécifiques à cet utilisateur',
        verbose_name='permissions utilisateur'
    )

    objects = BaseUserManager()  # ou ton AdminUserManager

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return self.email

