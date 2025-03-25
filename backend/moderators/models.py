from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class Moderator(AbstractUser):
    assigned_model = models.CharField(max_length=255, blank=True, null=True)
    is_moderator = models.BooleanField(default=True)

    # Override fields to avoid reverse accessor clashes
    groups = models.ManyToManyField(
        Group,
        related_name="moderator_set",
        blank=True,
        help_text='The groups this user belongs to.'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="moderator_set",
        blank=True,
        help_text='Specific permissions for this user.'
    )

    class Meta:
        verbose_name = "Moderator"
        verbose_name_plural = "Moderators"
