from rest_framework import serializers
from .models import Session, Exercise, Set

class SetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields= '__all__'

class ExerciseSerializer(serializers.ModelSerializer):
    sets = SetSerializer(many=True, read_only=True)

    class Meta:
        model = Exercise
        fields = '__all__'

class SessionSerializer(serializers.ModelSerializer):
    exercises = ExerciseSerializer(many=True, read_only=True)

    class Meta:
        model = Session
        fields = '__all__'
        