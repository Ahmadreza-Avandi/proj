#!/bin/bash

# اسکریپت نصب و پیکربندی Let's Encrypt SSL برای دامنه a.networklearnzero.shop

# نصب Certbot
echo "🔄 Installing certbot..."
sudo apt update
sudo apt install -y certbot

# توقف موقت nginx اگر در حال اجراست
if [ "$(docker ps -q -f name=nginx)" ]; then
    echo "🛑 Stopping nginx container temporarily..."
    docker-compose stop nginx
fi

# دریافت گواهی SSL
echo "🔒 Obtaining SSL certificate for a.networklearnzero.shop..."
sudo certbot certonly --standalone \
  -d a.networklearnzero.shop \
  --non-interactive \
  --agree-tos \
  --email your-email@example.com \
  --preferred-challenges http

# کپی گواهی‌نامه به پوشه پروژه
echo "📂 Copying certificates to project directory..."
sudo cp /etc/letsencrypt/live/a.networklearnzero.shop/fullchain.pem ./certs/
sudo cp /etc/letsencrypt/live/a.networklearnzero.shop/privkey.pem ./certs/
sudo chmod 644 ./certs/*.pem

# پیکربندی تمدید خودکار
echo "⏰ Setting up auto-renewal..."
cat > renew-ssl.sh << 'EOL'
#!/bin/bash

# توقف موقت Nginx
docker-compose stop nginx

# تمدید گواهی
certbot renew --quiet

# کپی گواهی‌نامه‌های جدید
cp /etc/letsencrypt/live/a.networklearnzero.shop/fullchain.pem ./certs/
cp /etc/letsencrypt/live/a.networklearnzero.shop/privkey.pem ./certs/
chmod 644 ./certs/*.pem

# راه‌اندازی مجدد Nginx
docker-compose start nginx
EOL

chmod +x renew-ssl.sh

# اضافه کردن کرون‌جاب برای تمدید خودکار (هر ماه)
echo "🔄 Adding cron job for automatic renewal..."
crontab -l > mycron || echo "" > mycron
if ! grep -q "renew-ssl.sh" mycron; then
    echo "0 3 1 * * $(pwd)/renew-ssl.sh > $(pwd)/ssl-renewal.log 2>&1" >> mycron
    crontab mycron
fi
rm mycron

# راه‌اندازی مجدد سرویس‌ها
echo "🚀 Restarting services..."
docker-compose up -d

echo "✅ SSL setup completed for a.networklearnzero.shop!"
echo "💻 Your site should now be available at: https://a.networklearnzero.shop" 