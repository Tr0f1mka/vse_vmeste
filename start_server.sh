#!/bin/bash
echo "Активация виртуального окружения..."
source venv/bin/activate

echo "Создание миграций..."
python manage.py makemigrations

echo "Применение миграций..."
python manage.py migrate

echo "Запуск сервера..."
python manage.py runserver