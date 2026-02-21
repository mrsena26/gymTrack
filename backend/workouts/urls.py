from rest_framework.routers import DefaultRouter
from .views import SessionViewSet, ExerciseViewSet, SetViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.urls import path

router = DefaultRouter()
router.register(r'sessions', SessionViewSet)
router.register(r'exercises', ExerciseViewSet)
router.register(r'sets', SetViewSet)

urlpatterns = router.urls + [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
               ]