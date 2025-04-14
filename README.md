# سیستم حضور و غیاب با تشخیص چهره

## نصب و راه‌اندازی با Docker

برای راه‌اندازی پروژه با استفاده از Docker:

1. نصب Docker و Docker Compose:
   - Docker را از [سایت رسمی Docker](https://www.docker.com/get-started) دانلود و نصب کنید.
   - Docker Compose معمولاً همراه با Docker نصب می‌شود.

2. راه‌اندازی سرویس‌ها:
   ```bash
   docker-compose up
   ```

3. برای اجرا در پس‌زمینه:
   ```bash
   docker-compose up -d
   ```

4. متوقف کردن سرویس‌ها:
   ```bash
   docker-compose down
   ```

## سرویس‌های موجود:

- **Frontend (Next.js)**: قابل دسترسی در پورت 3000 - `http://localhost:3000`
- **Backend (Nest.js)**: قابل دسترسی در پورت 3001 - `http://localhost:3001`
- **MySQL Database**: قابل دسترسی در پورت 3306

## راه‌اندازی بخش تشخیص چهره (بدون Docker)

سیستم تشخیص چهره با دوربین به صورت محلی اجرا می‌شود (بدون Docker):

1. نصب وابستگی‌های پایتون:
   ```bash
   pip install opencv-python numpy face-recognition dlib
   ```

2. اجرای برنامه تشخیص چهره:
   ```bash
   cd faceDetectionWithCamera
   python faceDetectionWithCamera.py
   ```

## نکات مهم

- پایگاه داده MySQL با کاربر `user` و رمز عبور `userpassword` و نام دیتابیس `mydatabase` راه‌اندازی می‌شود.
- در صورت نیاز به تغییر تنظیمات پایگاه داده، فایل `docker-compose.yml` و فایل `.env` در پوشه `nest` را ویرایش کنید.
- برنامه تشخیص چهره نیاز به دسترسی به دوربین سیستم شما دارد.

## Docker Setup and Configuration

This project includes multiple services configured with Docker:

1. Frontend (Next.js)
2. Backend (Nest.js)
3. MySQL Database
4. Redis Cache
5. Face Detection (Python service)

### Running with Docker

1. Make sure Docker and Docker Compose are installed on your system
2. Clone this repository
3. Build and start all services:

```bash
docker-compose up -d
```

4. Check if all services are running:

```bash
docker-compose ps
```

### Troubleshooting

If you encounter issues:

1. Check container logs:

```bash
docker-compose logs -f [service_name]
```

2. Make sure all required ports are available
3. If database connection fails, you might need to wait for the database to initialize before starting the backend

### Accessing Services

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Face Detection API: http://localhost:5000 