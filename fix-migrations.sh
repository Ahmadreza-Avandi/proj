#!/bin/bash

echo "=== توقف سرویس‌های backend و face-detection ==="
docker-compose stop backend face-detection

echo "=== پاکسازی کامل دیتابیس ==="
docker-compose exec -T mysql mysql -u root -prootpassword -e "DROP DATABASE IF EXISTS mydatabase;"
docker-compose exec -T mysql mysql -u root -prootpassword -e "CREATE DATABASE mydatabase;"
docker-compose exec -T mysql mysql -u root -prootpassword -e "GRANT ALL PRIVILEGES ON mydatabase.* TO 'user'@'%';"
docker-compose exec -T mysql mysql -u root -prootpassword -e "FLUSH PRIVILEGES;"

echo "=== راه‌اندازی سرویس backend ==="
docker-compose up -d backend

echo "=== نمایش لاگ مایگریشن‌ها ==="
sleep 5
docker-compose logs backend 