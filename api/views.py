from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.db.models import Q
from math import radians, sin, cos, sqrt, atan2
from .models import CharityFund, HelpRequest
from .serializers import CharityFundSerializer, HelpRequestSerializer

class CharityFundViewSet(viewsets.ModelViewSet):
    queryset = CharityFund.objects.filter(is_active=True)
    serializer_class = CharityFundSerializer

class HelpRequestViewSet(viewsets.ModelViewSet):
    queryset = HelpRequest.objects.filter(is_active=True, is_fulfilled=False)
    serializer_class = HelpRequestSerializer
    
    @action(detail=False, methods=['get'])
    def nearby(self, request):
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        radius = request.query_params.get('radius', 10)  # км
        
        if not lat or not lng:
            return Response({'error': 'Требуются параметры lat и lng'}, status=400)
        
        try:
            lat = float(lat)
            lng = float(lng)
            radius = float(radius)
            
            # Простая фильтрация по квадрату (для демо)
            # В реальном приложении используй PostGIS или геобиблиотеки
            lat_range = 0.09 * radius  # ~10km на градус широты
            lng_range = 0.14 * radius  # ~10km на градус долготы (для Москвы)
            
            nearby_requests = HelpRequest.objects.filter(
                latitude__range=(lat - lat_range, lat + lat_range),
                longitude__range=(lng - lng_range, lng + lng_range),
                is_active=True,
                is_fulfilled=False
            )
            
            serializer = self.get_serializer(nearby_requests, many=True)
            return Response(serializer.data)
            
        except ValueError:
            return Response({'error': 'Неверные координаты'}, status=400)

@api_view(['GET'])
def api_overview(request):
    api_urls = {
        'message': 'Добро пожаловать в API карты взаимопомощи!',
        'endpoints': {
            'funds': '/api/funds/',
            'help-requests': '/api/help-requests/',
            'nearby-requests': '/api/help-requests/nearby/?lat=55.75&lng=37.61&radius=10',
            'admin': '/admin/',
        }
    }
    return Response(api_urls)