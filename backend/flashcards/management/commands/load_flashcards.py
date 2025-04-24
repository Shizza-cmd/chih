from django.core.management.base import BaseCommand
from flashcards.models import Flashcard
import csv

class Command(BaseCommand):
    help = 'Loads flashcards from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **options):
        csv_file = options['csv_file']
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.reader(file)
            next(reader)
            for row in reader:
                front, back = row
                Flashcard.objects.create(front=front, back=back)

        self.stdout.write(self.style.SUCCESS('Successfully loaded flashcards'))