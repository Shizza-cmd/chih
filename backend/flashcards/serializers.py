from rest_framework import serializers
from .models import Flashcard

class FlashcardSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = Flashcard
        fields = ['id', 'front', 'back', 'user']
        extra_kwargs = {
            'front': {'required': True},
            'back': {'required': True},
            'user': {'required': False}
        }
