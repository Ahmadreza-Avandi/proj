FROM python:3.8-slim

WORKDIR /app

# نصب وابستگی‌های حداقلی
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# کپی کد برنامه
COPY simple_server.py .
COPY requirements-simple.txt .

# نصب وابستگی‌های ساده با نسخه‌های دقیق
RUN pip install --no-cache-dir Flask==2.0.1 Werkzeug==2.0.1 
RUN pip install --no-cache-dir requests==2.26.0 pillow==8.3.2
RUN pip install --no-cache-dir redis==4.1.0

# باز کردن پورت
EXPOSE 5000

# اجرای مستقیم سرور ساده
CMD ["python", "simple_server.py"] 