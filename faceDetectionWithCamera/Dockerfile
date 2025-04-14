FROM python:3.9-slim

WORKDIR /app

# نصب وابستگی‌های سیستمی برای کامپایل dlib و OpenCV
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    pkg-config \
    libx11-dev \
    libatlas-base-dev \
    libgtk-3-dev \
    libboost-python-dev \
    python3-dev \
    python3-numpy \
    libgl1-mesa-glx \
    libglib2.0-0 \
    git \
    && rm -rf /var/lib/apt/lists/*

# نصب وابستگی‌های پایتون از PyPI
RUN pip install --no-cache-dir Flask==2.3.3 requests==2.31.0 pillow==10.0.1
RUN pip install --no-cache-dir numpy==1.24.3 opencv-python-headless==4.8.0.76 opencv-contrib-python-headless==4.8.0.76

# نصب dlib از منبع (به جای استفاده از pip)
RUN pip install --no-cache-dir cmake
RUN git clone -b 'v19.22' --single-branch https://github.com/davisking/dlib.git dlib/ && \
    cd dlib/ && \
    python setup.py install && \
    cd .. && \
    rm -rf dlib/

# نصب face-recognition بعد از نصب موفق dlib
RUN pip install --no-cache-dir face_recognition==1.3.0

# کپی کردن کل پوشه برنامه
COPY . .

# باز کردن پورت
EXPOSE 5000

# استفاده از فایل simple_server.py به عنوان پشتیبان در صورت خطا
RUN echo '#!/bin/bash\n\
if python get-face-data.py; then\n\
  echo "get-face-data.py اجرا شد."\n\
else\n\
  echo "خطا در اجرای get-face-data.py، در حال اجرای سرور ساده پشتیبان..."\n\
  python simple_server.py\n\
fi' > start.sh && chmod +x start.sh

# اجرای اسکریپت راه‌اندازی
CMD ["./start.sh"] 