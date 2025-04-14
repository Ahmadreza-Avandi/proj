#!/bin/bash

echo "بررسی وضعیت سرویس‌ها:"
echo "----------------------"

# بررسی سرویس فرانت‌اند
echo -n "فرانت‌اند: "
if curl -s http://localhost:3000 > /dev/null; then
  echo "فعال ✅"
else
  echo "غیرفعال ❌"
fi

# بررسی سرویس بک‌اند
echo -n "بک‌اند: "
if curl -s http://localhost:3001 > /dev/null; then
  echo "فعال ✅"
else
  echo "غیرفعال ❌"
fi

# بررسی سرویس دیتابیس
echo -n "دیتابیس: "
MYSQL_STATUS=$(docker-compose exec mysql mysqladmin -u user -puserpassword ping 2>/dev/null || echo "غیرفعال")
if [[ $MYSQL_STATUS == *"mysqld is alive"* ]]; then
  echo "فعال ✅"
else
  echo "غیرفعال ❌"
fi

# بررسی سرویس Redis
echo -n "Redis: "
REDIS_STATUS=$(docker-compose exec redis redis-cli ping 2>/dev/null || echo "غیرفعال")
if [[ $REDIS_STATUS == "PONG" ]]; then
  echo "فعال ✅"
else
  echo "غیرفعال ❌"
fi

# بررسی سرویس تشخیص چهره
echo -n "تشخیص چهره: "
if curl -s http://localhost:5000/health > /dev/null; then
  echo "فعال ✅"
else
  echo "غیرفعال ❌"
fi

echo "----------------------"
echo "اطلاعات کانتینرها:"
docker-compose ps 