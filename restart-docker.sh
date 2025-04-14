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

echo "برای مشاهده لاگ‌ها، دستور زیر را اجرا کنید:"
echo "docker-compose logs -f" 