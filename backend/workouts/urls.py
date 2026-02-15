from rest_framework.routers import DefaultRouter
from .views import SessionViewSet, ExerciseViewSet, SetViewSet

router = DefaultRouter()
router.register(r'sessions', SessionViewSet)
router.register(r'exercises', ExerciseViewSet)
router.register(r'sets', SetViewSet)

urlpatterns = router.urls