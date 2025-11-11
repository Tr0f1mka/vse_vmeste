from django.db import models

class CharityFund(models.Model):
    name = models.CharField(max_length=200, verbose_name="Название фонда")
    description = models.TextField(verbose_name="Описание")
    image = models.ImageField(upload_to='funds/', blank=True, null=True, verbose_name="Логотип")
    website = models.URLField(blank=True, verbose_name="Веб-сайт")
    contact_email = models.EmailField(blank=True, verbose_name="Контактный email")
    is_active = models.BooleanField(default=True, verbose_name="Активный")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    
    class Meta:
        verbose_name = "Благотворительный фонд"
        verbose_name_plural = "Благотворительные фонды"
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name

class HelpRequest(models.Model):
    CATEGORY_CHOICES = [
        ('food', 'Еда'),
        ('clothes', 'Одежда'),
        ('medicine', 'Лекарства'),
        ('other', 'Другое'),
    ]
    
    title = models.CharField(max_length=200, verbose_name="Заголовок заявки")
    description = models.TextField(verbose_name="Описание потребности")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, verbose_name="Категория")
    location = models.CharField(max_length=200, verbose_name="Местоположение")
    contact_info = models.CharField(max_length=200, verbose_name="Контактная информация")
    is_urgent = models.BooleanField(default=False, verbose_name="Срочно")
    is_active = models.BooleanField(default=True, verbose_name="Активная")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    
    class Meta:
        verbose_name = "Заявка на помощь"
        verbose_name_plural = "Заявки на помощь"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} ({self.get_category_display()})"