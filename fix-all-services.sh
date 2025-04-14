#!/bin/bash

echo "=== توقف و حذف تمام سرویس‌ها ==="
docker-compose down -v

echo "=== پاکسازی تصاویر قبلی ==="
docker rmi proj-face-detection proj-backend proj-frontend || true

echo "=== اطمینان از پاک شدن کانتینرهای قبلی ==="
docker rm -f proj-face-detection-1 proj-backend-1 proj-mysql-1 proj-redis-1 proj-frontend-1 face-detection-standalone || true

echo "=== اصلاح دیتابیس ==="
docker-compose up -d mysql
echo "منتظر راه‌اندازی MySQL..."
sleep 10

echo "=== پاکسازی جدول‌های دیتابیس ==="
docker-compose exec -T mysql mysql -u user -puserpassword -e "CREATE DATABASE IF NOT EXISTS mydatabase;"
docker-compose exec -T mysql mysql -u user -puserpassword mydatabase -e "DROP TABLE IF EXISTS _prisma_migrations;"
docker-compose exec -T mysql mysql -u user -puserpassword mydatabase -e "DROP TABLE IF EXISTS subject;"
docker-compose exec -T mysql mysql -u user -puserpassword mydatabase -e "DROP TABLE IF EXISTS Location;"
docker-compose exec -T mysql mysql -u user -puserpassword mydatabase -e "DROP TABLE IF EXISTS LastSeen;"
docker-compose exec -T mysql mysql -u user -puserpassword mydatabase -e "DROP TABLE IF EXISTS User;"
docker-compose exec -T mysql mysql -u user -puserpassword mydatabase -e "DROP TABLE IF EXISTS Role;"
docker-compose exec -T mysql mysql -u user -puserpassword mydatabase -e "DROP TABLE IF EXISTS attendance;"

echo "=== راه‌اندازی سرویس face-detection به صورت مستقل ==="
docker-compose -f face-detection-docker-compose.yml build --no-cache
docker-compose -f face-detection-docker-compose.yml up -d

echo "=== راه‌اندازی سایر سرویس‌ها ==="
docker-compose up -d backend frontend redis

echo "=== نمایش وضعیت سرویس‌ها ==="
docker ps

echo "=== نمایش لاگ سرویس face-detection ==="
docker logs face-detection-standalone

echo "برای دیدن وضعیت کامل سرویس‌ها، دستور زیر را اجرا کنید:"
echo "bash check-all.sh" 