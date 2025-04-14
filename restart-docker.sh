#!/bin/bash

# توقف همه سرویس‌ها
echo "در حال توقف سرویس‌ها..."
docker-compose down --remove-orphans

# پاکسازی کش داکر (اختیاری)
echo "در حال پاکسازی کش داکر..."
docker system prune -f

# ساخت مجدد تصاویر
echo "در حال ساخت مجدد تصاویر..."
docker-compose build --no-cache

# راه‌اندازی همه سرویس‌ها
echo "در حال راه‌اندازی سرویس‌ها..."
docker-compose up -d

# نمایش وضعیت سرویس‌ها
echo "وضعیت سرویس‌ها:"
docker-compose ps

echo "برای مشاهده لاگ‌ها، دستورات زیر را اجرا کنید:"
echo "docker-compose logs -f"
echo "docker-compose logs -f backend"
echo "docker-compose logs -f frontend"
echo "docker-compose logs -f mysql"
echo "docker-compose logs -f redis"
echo "docker-compose logs -f face-detection"

# تست اتصال به سرویس تشخیص چهره
echo "در حال تست اتصال به سرویس تشخیص چهره..."
sleep 10
curl http://localhost:5000/health 