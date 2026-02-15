from django.test import TestCase
from rest_framework.test import APIClient
from .models import Session
# Create your tests here.

class SessionTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_session_success(self):
        response = self.client.post("/api/sessions/", {})
        self.assertEqual(response.status_code,201)
    
    def test_cannot_create_two_active_sessions(self):
        self.client.post("/api/sessions/",{})
        response = self.client.post("/api/sessions/",{})
        
        self.assertEqual(response.status_code,400)
