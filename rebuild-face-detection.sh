#!/bin/bash

echo "در حال توقف سرویس تشخیص چهره..."
docker-compose stop face-detection
docker-compose rm -f face-detection

echo "در حال ساخت مجدد سرویس تشخیص چهره..."
docker-compose build --no-cache face-detection

echo "در حال راه‌اندازی سرویس تشخیص چهره..."
docker-compose up -d face-detection

echo "در حال نمایش لاگ‌های سرویس تشخیص چهره..."
docker-compose logs -f face-detection 