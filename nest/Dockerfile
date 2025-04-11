# مرحله اول: ساخت برنامه
FROM node:18-alpine AS builder

# تنظیم محیط کار
WORKDIR /usr/src/app

# کپی کردن فایل‌های package.json و package-lock.json
COPY package*.json ./ 

# نصب وابستگی‌ها
RUN npm install --force

# کپی کردن فایل‌های مربوط به Prisma
COPY prisma ./prisma

# کپی کردن سایر فایل‌های پروژه
COPY . .

# ساخت نسخه build از پروژه NestJS
RUN npm run build

# ------------------------------
# مرحله نهایی: اجرای برنامه
# ------------------------------
FROM node:18-alpine

# تنظیم محیط کار
WORKDIR /usr/src/app

# کپی فایل‌های build و وابستگی‌ها از مرحله قبلی
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./ 

# کپی فایل‌های محیطی
COPY .env .env

# کپی پوشه prisma از مرحله اول
COPY --from=builder /usr/src/app/prisma ./prisma

# نصب وابستگی‌ها برای اطمینان از درستی فایل‌های build
RUN npm install --production --force

# اجرای برنامه NestJS
CMD node dist/main.js

# مشخص کردن پورت
EXPOSE 3001