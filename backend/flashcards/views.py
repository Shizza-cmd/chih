from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Flashcard
from .serializers import FlashcardSerializer

@api_view(['GET'])
def flashcard_list(request):
    """
    List all flashcards.
    """
    flashcards = Flashcard.objects.all()
    serializer = FlashcardSerializer(flashcards, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def flashcard_detail(request, pk):
    """
    Retrieve a flashcard.
    """
    try:
        flashcard = Flashcard.objects.get(pk=pk)
    except Flashcard.DoesNotExist:
        return Response(status=404)

    serializer = FlashcardSerializer(flashcard)
    return Response(serializer.data)