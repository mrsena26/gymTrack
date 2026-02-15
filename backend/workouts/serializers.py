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
        
    def validate(self,data):

        if self.instance is None:
            if Session.objects.filter(status="active").exists():
                raise serializers.ValidationError("" \
                    "An active session already exists."
                )
        return data