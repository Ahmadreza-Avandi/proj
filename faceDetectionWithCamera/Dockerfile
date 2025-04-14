FROM python:3.10-slim

# تنظیم دایرکتوری کاری
WORKDIR /app

# نصب ابزارهای موردنیاز برای OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgl1-mesa-glx \
    curl \
    && rm -rf /var/lib/apt/lists/*

# نصب کتابخانه‌های اصلی بدون نیاز به dlib
RUN pip install --no-cache-dir flask==2.3.3 \
    flask-cors==4.0.0 \
    redis==4.6.0 \
    numpy==1.23.5 \
    opencv-python-headless==4.8.0.76 \
    persiantools==3.0.1 \
    pytz==2023.3 \
    requests==2.31.0 \
    pillow==10.0.1 \
    boto3==1.28.38 \
    cryptography==41.0.3

# ایجاد پوشه‌های مورد نیاز
RUN mkdir -p trainer labels assets/face_detection data

# کپی فایل‌های موردنیاز
COPY get-face-data.py .
COPY assets/face_detection/*.xml assets/face_detection/

# تنظیم متغیرهای محیطی
ENV FLASK_APP=get-face-data.py
ENV FLASK_ENV=production
ENV REDIS_HOST=redis
ENV PYTHONUNBUFFERED=1

# باز کردن پورت پیش‌فرض Flask
EXPOSE 5000

# اجرای اپلیکیشن
CMD ["flask", "run", "--host=0.0.0.0"] 