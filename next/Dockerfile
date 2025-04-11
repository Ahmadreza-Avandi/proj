# استفاده از تصویر Node.js به عنوان پایه
FROM node:18

# تنظیم محیط کار
WORKDIR /usr/src/app

# کپی کردن فایل‌های package.json و package-lock.json
COPY package*.json ./

# نصب وابستگی‌ها
RUN npm install --force
RUN npm install express --save
RUN npm install @types/node --save-dev
RUN npm install @types/express --save-dev
RUN npm install ts-node --save-dev

# کپی کردن کدها و فایل‌های پروژه
COPY . .

# پورت‌هایی که Next.js از آن استفاده می‌کند
EXPOSE 3000
EXPOSE 80
EXPOSE 443

# دستوری برای اجرای سرور نوشته شده با Express
CMD ["npx", "ts-node", "server.ts"]
