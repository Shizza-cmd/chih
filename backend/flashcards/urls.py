from django.urls import path
from . import views

urlpatterns = [
    path('', views.FlashcardList.as_view(), name='flashcard_list'),
    path('<int:pk>/', views.FlashcardDetail.as_view(), name='flashcard_detail'),
]
