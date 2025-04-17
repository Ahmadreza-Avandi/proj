#!/bin/bash

# ایجاد دایرکتوری اگر وجود ندارد
mkdir -p nginx/conf.d

# فایل کانفیگ جدید را بدون ریدایرکت HTTPS و فقط با پشتیبانی از HTTP ایجاد می‌کنیم
cat > nginx/conf.d/default.conf << 'EOL'
server {
    listen 80;
    server_name a.networklearnzero.shop;
    
    # فرانت‌اند (Next.js)
    location / {
        proxy_pass http://nextjs:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # بک‌اند (Nest.js)
    location /api {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://nestjs:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # سرویس تشخیص چهره (Python)
    location /faceapi {
        rewrite ^/faceapi/(.*) /$1 break;
        proxy_pass http://pythonserver:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # phpMyAdmin - تغییر مسیر به صورت مستقیم
    location /phpmyadmin/ {
        proxy_pass http://phpmyadmin:80/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Redis Commander
    location /redis/ {
        proxy_pass http://redis-commander:8081/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # تنظیم محدودیت اندازه آپلود
    client_max_body_size 20M;
}
EOL

# به‌روزرسانی فایل‌های .env به حالت HTTP
sed -i 's|https://a.networklearnzero.shop|http://a.networklearnzero.shop|g' next/.env.local

# راه‌اندازی مجدد سرویس‌های next و nginx
docker-compose restart nextjs
docker-compose restart nginx

echo "✅ فایل کانفیگ Nginx اصلاح شد و سرویس‌ها راه‌اندازی مجدد شدند."
echo "🌐 اکنون می‌توانید از طریق HTTP به سایت دسترسی داشته باشید:"
echo "   - وب‌سایت اصلی: http://a.networklearnzero.shop"
echo "   - مدیریت دیتابیس: http://a.networklearnzero.shop/phpmyadmin/"
echo "   - مدیریت Redis: http://a.networklearnzero.shop/redis/" 