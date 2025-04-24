from django.db import models
from django.conf import settings

class Flashcard(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='flashcards', on_delete=models.CASCADE)
    front = models.TextField()
    back = models.TextField()

    def __str__(self):
        return f'{self.front} - {self.back}'
