from rest_framework import serializers
from .models import CharityFund, HelpRequest

class CharityFundSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CharityFund
        fields = ['id', 'name', 'description', 'image', 'image_url', 'website', 
                 'contact_email', 'is_active', 'created_at']
    
    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None

class HelpRequestSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    urgency_display = serializers.CharField(source='get_urgency_display', read_only=True)
    
    class Meta:
        model = HelpRequest
        fields = ['id', 'title', 'description', 'category', 'category_display', 
                 'urgency', 'urgency_display', 'address', 'latitude', 'longitude',
                 'contact_name', 'contact_phone', 'contact_email', 
                 'is_active', 'is_fulfilled', 'created_at']