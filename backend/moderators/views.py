# moderators/views.py
import json
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Moderator
from .serializers import ModeratorSerializer

@csrf_exempt
def moderator_login(request):
    """
    API endpoint for moderator login.
    Expects a POST request with JSON containing 'email' and 'password'.
    """
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")
            
            # Authenticate using the email as the username.
            user = authenticate(request, username=email, password=password)
            if user is not None and getattr(user, 'is_moderator', False):
                login(request, user)
                return JsonResponse({"message": "Login successful", "user": user.username}, status=200)
            else:
                return JsonResponse({"error": "Invalid credentials or not a moderator"}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=405)


class ModeratorAdminViewSet(viewsets.ModelViewSet):
    """
    Admin panel for managing moderator accounts.
    Only accessible to admin users.
    """
    queryset = Moderator.objects.all()
    serializer_class = ModeratorSerializer
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=['post'])
    def create_moderator(self, request):
        """
        Admins can create new moderators from this endpoint.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Moderator created successfully", "moderator": serializer.data}, status=201)
        return Response(serializer.errors, status=400)

    @action(detail=True, methods=['delete'])
    def delete_moderator(self, request, pk=None):
        """
        Admins can delete moderators using this endpoint.
        """
        try:
            moderator = self.get_object()
            moderator.delete()
            return Response({"message": "Moderator deleted successfully"}, status=200)
        except Moderator.DoesNotExist:
            return Response({"error": "Moderator not found"}, status=404)
