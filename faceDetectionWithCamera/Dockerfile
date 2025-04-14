FROM python:3.8

WORKDIR /app

# نصب وابستگی‌های سیستمی
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    python3-dev \
    python3-numpy \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# نصب وابستگی‌های پایتون
RUN pip install --no-cache-dir numpy==1.19.5 
RUN pip install --no-cache-dir opencv-python-headless==4.5.4.60 opencv-contrib-python-headless==4.5.4.60
RUN pip install --no-cache-dir Flask==2.0.1 requests==2.26.0 pillow==8.3.2

# نصب dlib با نسخه سازگار
RUN pip install --no-cache-dir dlib==19.19.0

# نصب face-recognition
RUN pip install --no-cache-dir face_recognition==1.3.0

# کپی کد برنامه
COPY . .

# باز کردن پورت
EXPOSE 5000

# ایجاد اسکریپت پشتیبان با امکان اجرای هر دو حالت
RUN echo '#!/bin/bash\n\
if [ -f "get-face-data.py" ]; then\n\
  echo "تلاش برای اجرای get-face-data.py..."\n\
  if python get-face-data.py; then\n\
    echo "get-face-data.py با موفقیت اجرا شد."\n\
  else\n\
    echo "خطا در اجرای get-face-data.py، در حال اجرای سرور ساده..."\n\
    python simple_server.py\n\
  fi\n\
else\n\
  echo "فایل get-face-data.py یافت نشد. در حال اجرای سرور ساده..."\n\
  python simple_server.py\n\
fi' > start.sh && chmod +x start.sh

# اجرای اسکریپت راه‌اندازی
CMD ["./start.sh"] 