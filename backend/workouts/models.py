from django.db import models

# Create your models here.
class Session(models.Model):
    date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, default="active")

    def __str__(self):
        return f"Session {self.id} - {self.date}"

class Exercise(models.Model):
    sessions = models.ForeignKey(Session, on_delete=models.CASCADE, related_name="exercises")
    name = models.CharField(max_length=100)
    muscle_group = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Set(models.Model):
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name="sets")
    reps = models.PositiveIntegerField()
    weight = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"{self.reps} reps"