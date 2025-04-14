#!/bin/bash

echo "=========================================="
echo "شروع فرآیند اصلاح کامل سیستم"
echo "=========================================="

echo "=== توقف و حذف همه سرویس‌ها ==="
docker-compose down

echo "=== حذف تصاویر قدیمی ==="
docker rmi proj-face-detection || true

echo "=== اصلاح دیتابیس ==="
docker-compose up -d mysql
echo "صبر برای راه‌اندازی MySQL..."
sleep 15

echo "=== پاکسازی کامل دیتابیس ==="
docker-compose exec -T mysql mysql -u root -prootpassword -e "DROP DATABASE IF EXISTS mydatabase;"
docker-compose exec -T mysql mysql -u root -prootpassword -e "CREATE DATABASE mydatabase;"
docker-compose exec -T mysql mysql -u root -prootpassword -e "GRANT ALL PRIVILEGES ON mydatabase.* TO 'user'@'%';"
docker-compose exec -T mysql mysql -u root -prootpassword -e "FLUSH PRIVILEGES;"

echo "=== ساخت و راه‌اندازی سرویس‌ها ==="
docker-compose build --no-cache
docker-compose up -d

echo "=== نمایش وضعیت سرویس‌ها ==="
docker ps

echo "=== نمایش لاگ‌های سرویس face-detection ==="
sleep 3
docker-compose logs face-detection

echo "=== نمایش لاگ‌های سرویس backend ==="
sleep 3
docker-compose logs backend

echo "=========================================="
echo "فرآیند اصلاح کامل شد."
echo "برای بررسی وضعیت، مرورگر را در آدرس زیر باز کنید:"
echo "http://localhost:3000/ - فرانت‌اند"
echo "http://localhost:3001/ - بک‌اند"
echo "http://localhost:5000/ - سرویس تشخیص چهره"
echo "==========================================" 