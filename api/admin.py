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
    list_display = ['title', 'category', 'urgency', 'address', 'contact_name', 'is_active', 'is_fulfilled', 'created_at']
    list_filter = ['category', 'urgency', 'is_active', 'is_fulfilled', 'created_at']
    search_fields = ['title', 'description', 'address', 'contact_name']
    list_editable = ['is_active', 'is_fulfilled']
    readonly_fields = ['created_at']