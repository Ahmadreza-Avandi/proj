#!/bin/bash

echo "در حال بررسی سلامت سرویس تشخیص چهره..."
curl -s http://localhost:5000/health

echo ""
echo "تست API تشخیص چهره..."
curl -s -X POST http://localhost:5000/api/detect

echo ""
echo ""
echo "اگر به عملکرد واقعی تشخیص چهره نیاز دارید، می‌توانید بعداً"
echo "فایل Dockerfile اصلی را با وابستگی‌های dlib بازگردانی کنید." 