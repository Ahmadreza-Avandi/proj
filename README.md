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