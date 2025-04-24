from django.db import models

class Flashcard(models.Model):
    front = models.TextField()
    back = models.TextField()
    
    def __str__(self):
        return self.front