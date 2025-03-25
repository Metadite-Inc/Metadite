# moderators/urls.py
from django.urls import path, include
from rest_framework import routers
from .views import ModeratorAdminViewSet, moderator_login

router = routers.DefaultRouter()
router.register(r'admin/moderators', ModeratorAdminViewSet, basename='admin-moderators')

urlpatterns = [
    path('login/', moderator_login, name='moderator-login'),
    path('', include(router.urls)),
]
