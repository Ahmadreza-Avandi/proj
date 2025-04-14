#!/bin/bash

echo "در حال حذف کانتینر قبلی..."
docker-compose stop face-detection
docker-compose rm -f face-detection

echo "در حال ساخت تصویر جدید..."
docker-compose build --no-cache face-detection

echo "در حال اجرای سرویس به صورت مستقل..."
docker-compose up face-detection 