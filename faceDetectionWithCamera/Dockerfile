FROM python:3.9-slim

WORKDIR /app

# نصب وابستگی‌های سیستمی لازم برای کامپایل dlib و OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# نصب وابستگی‌های پایتون
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# کپی کد برنامه
COPY . .

# باز کردن پورت
EXPOSE 5000

# اجرای برنامه
CMD ["python", "get-face-data.py"] 