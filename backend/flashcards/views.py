from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Flashcard
from .serializers import FlashcardSerializer

class FlashcardList(generics.ListCreateAPIView):
    serializer_class = FlashcardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Flashcard.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FlashcardDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FlashcardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Flashcard.objects.filter(user=user)
