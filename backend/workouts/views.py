from django.shortcuts import render
from rest_framework import viewsets
from .models import Session, Exercise, Set
from .serializers import SessionSerializer, ExerciseSerializer, SetSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
from rest_framework.response import Response
# Create your views here.

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class =SessionSerializer

    def perform_create(self, serializer):
        if Session.objects.filter(status="active").exists():
            raise ValidationError("An active session already exists.")
        serializer.save()
    @action(detail=False, methods=["get"])
    def active(self, request):
        session = Session.objects.filter(status="active").first()

        if session:
            serializer = self.get_serializer(session)
            return Response(serializer.data)
        return Response({"message": "No active session"}, status=404)
    @action(detail=True, methods=["patch"])
    def end(self, request, pk=None):
        session = self.get_object()

        if session.status != "active":
            return Response(
                {"error": "Session is not active"},
                status=400
            )
        session.status = "completed"
        session.save()

        return Response({"message": "Session ended"})

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

class SetViewSet(viewsets.ModelViewSet):
    queryset = Set.objects.all()
    serializer_class = SetSerializer
