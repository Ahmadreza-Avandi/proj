# راهنمای دیپلوی پروژه حضور و غیاب با HTTPS

این راهنما مراحل کامل راه‌اندازی پروژه روی سرور اوبونتو با پشتیبانی از SSL/HTTPS برای دامنه `a.networklearnzero.shop` را توضیح می‌دهد.

## پیش‌نیازها

- سرور اوبونتو با دسترسی SSH
- دامنه `a.networklearnzero.shop` که به IP سرور اشاره می‌کند (تنظیم رکورد A در DNS)
- پورت‌های 80 و 443 باز در فایروال سرور

## مرحله 1: نصب Docker و Docker Compose

```bash
# اتصال به سرور
ssh user@server_ip

# نصب Docker
sudo apt update
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# نصب Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# بررسی نصب
docker --version
docker-compose --version

# اضافه کردن کاربر به گروه docker
sudo usermod -aG docker $USER
newgrp docker
```

## مرحله 2: آماده‌سازی پروژه

```bash
# ایجاد پوشه برای پروژه
mkdir -p /opt/attendance-app
cd /opt/attendance-app

# دریافت پروژه از گیت‌هاب
git clone https://github.com/Ahmadreza-Avandi/proj.git .

# در صورتی که از سیستم محلی می‌خواهید فایل‌ها را انتقال دهید
# scp -r /path/to/your/local/project/* user@server_ip:/opt/attendance-app/
```

## روش موقت: راه‌اندازی بدون SSL (برای شروع سریع)

اگر می‌خواهید ابتدا سیستم را بدون SSL راه‌اندازی کنید و بعدا SSL را اضافه کنید، می‌توانید از روش زیر استفاده کنید:

```bash
# ایجاد اسکریپت تنظیم HTTP
cat > fix-nginx.sh << 'EOL'
#!/bin/bash

# ایجاد دایرکتوری اگر وجود ندارد
mkdir -p nginx/conf.d

# فایل کانفیگ جدید را بدون ریدایرکت HTTPS و فقط با پشتیبانی از HTTP ایجاد می‌کنیم
cat > nginx/conf.d/default.conf << 'EOF'
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
EOF

# به‌روزرسانی فایل‌های .env به حالت HTTP
sed -i 's|https://a.networklearnzero.shop|http://a.networklearnzero.shop|g' next/.env.local
echo 'USE_HTTPS="false"' >> nest/.env

# راه‌اندازی مجدد سرویس‌های next و nginx
docker-compose restart nextjs
docker-compose restart nginx
EOL

# اجرای اسکریپت
chmod +x fix-nginx.sh
./fix-nginx.sh

# راه‌اندازی سرویس‌ها
docker-compose up -d
```

## مرحله 3: دریافت گواهی SSL

```bash
# اجرای اسکریپت دریافت گواهی
cd /opt/attendance-app
chmod +x get-ssl-cert.sh
# جایگزینی ایمیل با ایمیل شما
sed -i 's/ahmadreza.avandi@gmail.com/ahmadreza.avandi@gmail.com/g' get-ssl-cert.sh
./get-ssl-cert.sh
```

اسکریپت فوق به صورت خودکار گواهی SSL را برای دامنه `a.networklearnzero.shop` دریافت کرده و در پوشه `certs` قرار می‌دهد. همچنین یک کرون‌جاب برای تمدید خودکار هر ماه تنظیم می‌کند.

## مرحله 4: راه‌اندازی سرویس‌ها

```bash
# ساخت و راه‌اندازی کانتینرها
cd /opt/attendance-app
docker-compose build --no-cache
docker-compose up -d

# بررسی وضعیت سرویس‌ها
docker-compose ps
```

## مرحله 5: بررسی دسترسی

پس از اجرای دستورات فوق، سرویس‌های زیر در دسترس خواهند بود:

- وب‌سایت اصلی: http://a.networklearnzero.shop
- API بک‌اند: http://a.networklearnzero.shop/api
- API تشخیص چهره: http://a.networklearnzero.shop/faceapi
- مدیریت دیتابیس: http://a.networklearnzero.shop/phpmyadmin/
- مدیریت Redis: http://a.networklearnzero.shop/redis/

## عیب‌یابی

### مشکل در دریافت گواهی SSL
```bash
# بررسی لاگ certbot
sudo certbot certificates
sudo systemctl status certbot.timer
```

### مشکل "certificate not found" در nginx
اگر با خطای `cannot load certificate "/etc/nginx/certs/fullchain.pem"` مواجه شدید، باید ابتدا گواهی SSL را با اسکریپت `get-ssl-cert.sh` دریافت کنید. اگر نمی‌توانید فوراً SSL را پیکربندی کنید، می‌توانید از اسکریپت `fix-nginx.sh` که در بخش "روش موقت" آمده است استفاده کنید.

```bash
# بررسی وجود فایل‌های گواهی
ls -la certs/

# بررسی لاگ nginx
docker-compose logs nginx
```

### مشکل در دسترسی به phpMyAdmin
اگر به phpMyAdmin دسترسی ندارید، می‌توانید موارد زیر را بررسی کنید:

```bash
# بررسی وضعیت کانتینر phpmyadmin
docker-compose ps phpmyadmin

# بررسی لاگ‌های phpmyadmin
docker-compose logs phpmyadmin

# بررسی مستقیم از طریق پورت 8081
curl -v http://localhost:8081
```

همچنین اطمینان حاصل کنید که در فایل کانفیگ Nginx، مسیر phpMyAdmin به درستی تنظیم شده باشد. برای این منظور، مطمئن شوید که از مسیر `/phpmyadmin/` (با اسلش انتهایی) استفاده می‌کنید.

### مشکل در دسترسی به سایت
```bash
# بررسی لاگ‌ها
docker-compose logs nginx
docker-compose logs nextjs
```

### مشکل در اتصال سرویس‌ها به یکدیگر
```bash
# بررسی شبکه داکر
docker network ls
docker network inspect proj_app-network
```

## مدیریت روزمره

### راه‌اندازی مجدد همه سرویس‌ها
```bash
cd /opt/attendance-app
docker-compose restart
```

### به‌روزرسانی پروژه
```bash
cd /opt/attendance-app
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### بکاپ گیری از دیتابیس
```bash
cd /opt/attendance-app
docker-compose exec mysql sh -c 'mysqldump -u root -prootpassword mydatabase' > backup-$(date +%Y%m%d).sql
``` 