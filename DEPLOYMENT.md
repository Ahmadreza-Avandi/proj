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

# انتقال فایل‌های پروژه به سرور (در سیستم محلی)
scp -r /path/to/your/local/project/* user@server_ip:/opt/attendance-app/

# یا اگر از گیت استفاده می‌کنید
git clone https://github.com/your-repo/attendance-app.git .
```

## مرحله 3: دریافت گواهی SSL

```bash
# اجرای اسکریپت دریافت گواهی (قبلاً توسط ما آماده شده)
cd /opt/attendance-app
chmod +x get-ssl-cert.sh
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

- وب‌سایت اصلی: https://a.networklearnzero.shop
- API بک‌اند: https://a.networklearnzero.shop/api
- API تشخیص چهره: https://a.networklearnzero.shop/faceapi
- مدیریت دیتابیس: https://a.networklearnzero.shop/phpmyadmin
- مدیریت Redis: https://a.networklearnzero.shop/redis

## عیب‌یابی

### مشکل در دریافت گواهی SSL
```bash
# بررسی لاگ certbot
sudo certbot certificates
sudo systemctl status certbot.timer
```

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
git pull  # اگر از گیت استفاده می‌کنید
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### بکاپ گیری از دیتابیس
```bash
cd /opt/attendance-app
docker-compose exec mysql sh -c 'mysqldump -u root -prootpassword mydatabase' > backup-$(date +%Y%m%d).sql
``` 