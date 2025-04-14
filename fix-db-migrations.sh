#!/bin/bash

echo "متوقف کردن سرویس‌ها..."
docker-compose stop backend
docker-compose stop face-detection

echo "پاکسازی دیتابیس..."
# حذف جدول‌های مایگریشن پریسما
docker-compose exec -T mysql mysql -u user -puserpassword mydatabase -e "DROP TABLE IF EXISTS _prisma_migrations;"

# حذف تمام جدول‌های موجود (با احتیاط)
docker-compose exec -T mysql mysql -u user -puserpassword mydatabase -e "SET FOREIGN_KEY_CHECKS=0;"
docker-compose exec -T mysql mysql -u user -puserpassword mydatabase -e "DROP TABLE IF EXISTS attendance;"
docker-compose exec -T mysql mysql -u user -puserpassword mydatabase -e "DROP TABLE IF EXISTS subject;"
docker-compose exec -T mysql mysql -u user -puserpassword mydatabase -e "DROP TABLE IF EXISTS last_seen;"
docker-compose exec -T mysql mysql -u user -puserpassword mydatabase -e "DROP TABLE IF EXISTS LastSeen;"
docker-compose exec -T mysql mysql -u user -puserpassword mydatabase -e "DROP TABLE IF EXISTS User;"
docker-compose exec -T mysql mysql -u user -puserpassword mydatabase -e "DROP TABLE IF EXISTS Role;"
docker-compose exec -T mysql mysql -u user -puserpassword mydatabase -e "DROP TABLE IF EXISTS Location;"
docker-compose exec -T mysql mysql -u user -puserpassword mydatabase -e "SET FOREIGN_KEY_CHECKS=1;"

echo "بازسازی سرویس face-detection..."
docker-compose build --no-cache face-detection

echo "راه‌اندازی مجدد سرویس‌ها..."
docker-compose up -d backend face-detection

echo "نمایش لاگ‌های سرویس بک‌اند..."
docker-compose logs backend

echo "وضعیت سرویس‌ها:"
docker-compose ps 