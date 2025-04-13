# استفاده از تصویر Node.js به عنوان پایه
FROM node:latest

# تنظیم محیط کار
WORKDIR /usr/src/app

# کپی کردن فایل‌های package.json و package-lock.json
COPY package*.json ./

# نصب وابستگی‌ها
RUN npm install --force

# کپی کردن کدها و فایل‌های پروژه
COPY . .

# پورتی که Next.js از آن استفاده می‌کند
EXPOSE 3000

# دستوری برای اجرای پروژه در حالت توسعه
CMD ["npm", "run", "dev"]
