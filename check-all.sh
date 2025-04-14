#!/bin/bash

echo "بررسی وضعیت سرویس‌ها:"
echo "======================="

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

# بررسی سرویس Redis
echo -n "Redis: "
if docker-compose exec -T redis redis-cli ping | grep -q "PONG"; then
  echo "فعال ✅"
else
  echo "غیرفعال ❌"
fi

# بررسی سرویس MySQL
echo -n "MySQL: "
if docker-compose exec -T mysql mysqladmin -u user -puserpassword ping | grep -q "mysqld is alive"; then
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

echo ""
echo "اطلاعات کانتینرها:"
echo "==================="
docker-compose ps

echo ""
echo "لاگ‌های خطا:"
echo "==========="
docker-compose logs --tail=10 face-detection
echo "-----------------"
docker-compose logs --tail=10 backend 