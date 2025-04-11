# استفاده از تصویر Node.js به عنوان پایه
FROM node:18-alpine AS builder

# تنظیم محیط کار
WORKDIR /usr/src/app

# کپی کردن فایل‌های package.json و package-lock.json
COPY package*.json ./

# نصب وابستگی‌ها
RUN npm install --force
RUN npm install express --save
RUN npm install @types/node --save-dev
RUN npm install @types/express --save-dev
RUN npm install typescript ts-node --save-dev

# کپی کردن کدها و فایل‌های پروژه
COPY . .

# کامپایل سرور TypeScript
RUN npx tsc --skipLibCheck server.ts

# مرحله نهایی
FROM node:18-alpine

WORKDIR /usr/src/app

# کپی فایل‌های package.json و package-lock.json
COPY package*.json ./

# فقط وابستگی‌های محیط تولید را نصب کنید
RUN npm install --production --force
RUN npm install express --save

# کپی فایل‌های کامپایل شده از مرحله قبل
COPY --from=builder /usr/src/app/server.js ./
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/next.config.js ./

# پورت‌هایی که Next.js از آن استفاده می‌کند
EXPOSE 3000
EXPOSE 80
EXPOSE 443

# دستوری برای اجرای سرور
CMD ["node", "server.js"]
