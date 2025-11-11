from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'funds', views.CharityFundViewSet)
router.register(r'help-requests', views.HelpRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('overview/', views.api_overview, name='api-overview'),
]