# مرحله اول: ساخت برنامه 
FROM node:18-alpine AS builder

# تنظیم محیط کار
WORKDIR /usr/src/app

# کپی کردن فایل‌های package.json و package-lock.json
COPY package*.json ./

# نصب وابستگی‌ها
RUN npm install --force

# کپی کردن کدها و فایل‌های پروژه
COPY . .

# ساخت برنامه Next.js
RUN npm run build

# مرحله دوم: اجرای برنامه در محیط تولید
FROM node:18-alpine AS runner

# تنظیم محیط کار
WORKDIR /usr/src/app

# متغیرهای محیطی برای محیط تولید
ENV NODE_ENV=production

# کپی فایل‌های مورد نیاز از مرحله قبلی
COPY --from=builder /usr/src/app/next.config.js ./
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

# ایجاد دایرکتوری برای گواهی‌نامه‌های SSL
RUN mkdir -p /certs

# پورتی که Next.js در محیط تولید از آن استفاده می‌کند
EXPOSE 3000

# دستور اجرای برنامه در محیط تولید
CMD ["npm", "start"]
