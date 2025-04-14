FROM python:3.7-slim

WORKDIR /app

# نصب وابستگی‌های حداقلی
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# کپی کد برنامه ساده
COPY simple_server.py /app/

# نصب وابستگی‌های ساده با نسخه‌های کاملاً مشخص و سازگار
RUN pip install --no-cache-dir flask==1.1.4 werkzeug==1.0.1
RUN pip install --no-cache-dir redis==4.1.0
RUN pip install --no-cache-dir requests==2.26.0 pillow==8.3.2

# باز کردن پورت
EXPOSE 5000

# اجرای مستقیم سرور ساده
CMD ["python", "simple_server.py"] 