#!/bin/bash

echo "در حال پاک کردن مایگریشن‌های خراب..."
docker-compose exec mysql mysql -u user -puserpassword mydatabase -e "DROP TABLE IF EXISTS _prisma_migrations;"
docker-compose exec mysql mysql -u user -puserpassword mydatabase -e "DROP TABLE IF EXISTS subject;"

echo "در حال راه‌اندازی مجدد سرویس بک‌اند..."
docker-compose restart backend

echo "وضعیت سرویس‌ها:"
docker-compose ps 