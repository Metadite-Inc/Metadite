# moderators/serializers.py
from rest_framework import serializers
from .models import Moderator

class ModeratorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Moderator
        fields = ['id', 'username', 'email', 'password', 'assigned_model']

    def create(self, validated_data):
        # Use the create_user method to hash the password
        password = validated_data.pop('password')
        moderator = Moderator(**validated_data)
        moderator.set_password(password)
        moderator.save()
        return moderator

    def update(self, instance, validated_data):
        # Ensure password is hashed when updating
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
