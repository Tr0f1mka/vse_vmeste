from django.contrib import admin
from .models import CharityFund, HelpRequest

@admin.register(CharityFund)
class CharityFundAdmin(admin.ModelAdmin):
    list_display = ['name', 'contact_email', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['is_active']

@admin.register(HelpRequest)
class HelpRequestAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'location', 'is_urgent', 'is_active', 'created_at']
    list_filter = ['category', 'is_urgent', 'is_active', 'created_at']
    search_fields = ['title', 'description', 'location']
    list_editable = ['is_urgent', 'is_active']