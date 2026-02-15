from django.shortcuts import render
from rest_framework import viewsets
from .models import Session, Exercise, Set
from .serializers import SessionSerializer, ExerciseSerializer, SetSerializer
# Create your views here.

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class =SessionSerializer

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

class SetViewSet(viewsets.ModelViewSet):
    queryset = Set.objects.all()
    serializer_class = SetSerializer
