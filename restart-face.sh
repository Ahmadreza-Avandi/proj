#!/bin/bash

echo "=== حذف کانتینر face-detection ==="
docker-compose stop face-detection
docker-compose rm -f face-detection

echo "=== حذف کانتینر standalone ==="
docker rm -f face-detection-standalone || true

echo "=== ساخت مجدد تصویر face-detection ==="
docker-compose -f face-detection-docker-compose.yml build --no-cache

echo "=== راه‌اندازی سرویس face-detection ==="
docker-compose -f face-detection-docker-compose.yml up -d

echo "=== نمایش لاگ‌ها ==="
sleep 2
docker logs face-detection-standalone 