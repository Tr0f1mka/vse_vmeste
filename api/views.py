from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from .models import CharityFund, HelpRequest
from .serializers import CharityFundSerializer, HelpRequestSerializer

class CharityFundViewSet(viewsets.ModelViewSet):
    queryset = CharityFund.objects.filter(is_active=True)
    serializer_class = CharityFundSerializer
    
    def get_queryset(self):
        queryset = CharityFund.objects.filter(is_active=True)
        # Можно добавить фильтрацию по параметрам
        return queryset

class HelpRequestViewSet(viewsets.ModelViewSet):
    queryset = HelpRequest.objects.filter(is_active=True)
    serializer_class = HelpRequestSerializer
    
    def get_queryset(self):
        queryset = HelpRequest.objects.filter(is_active=True)
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        return queryset

@api_view(['GET'])
def api_overview(request):
    api_urls = {
        'message': 'Добро пожаловать в API благотворительной платформы!',
        'endpoints': {
            'funds': '/api/funds/',
            'help-requests': '/api/help-requests/',
            'admin': '/admin/',
        },
        'instructions': {
            'get_all_funds': 'GET /api/funds/',
            'get_single_fund': 'GET /api/funds/{id}/',
            'create_fund': 'POST /api/funds/',
            'get_help_requests': 'GET /api/help-requests/',
            'filter_help_requests': 'GET /api/help-requests/?category=food',
        }
    }
    return Response(api_urls)