FROM python:3.10-slim

# تنظیم دایرکتوری کاری
WORKDIR /app

# نصب ابزارهای موردنیاز برای اجرای OpenCV و دیگر وابستگی‌ها
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    pkg-config \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgl1-mesa-glx \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libavcodec-dev \
    libavformat-dev \
    libswscale-dev \
    libv4l-dev \
    curl \
    openssl && rm -rf /var/lib/apt/lists/*

# کپی و نصب وابستگی‌ها
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ایجاد پوشه‌های مورد نیاز
RUN mkdir -p trainer labels assets

# کپی کردن تمام فایل‌های پروژه
COPY . .

# باز کردن پورت پیش‌فرض Flask
EXPOSE 5000

# اجرای اپلیکیشن
CMD ["python", "get-face-data.py"] 