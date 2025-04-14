#!/bin/bash

echo "در حال متوقف کردن سرویس face-detection..."
docker-compose stop face-detection
docker-compose rm -f face-detection

echo "در حال بازسازی سرویس face-detection..."
docker-compose build --no-cache face-detection

echo "در حال راه‌اندازی سرویس face-detection..."
docker-compose up -d face-detection

echo "لاگ‌های سرویس face-detection:"
docker-compose logs face-detection 