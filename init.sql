-- این فایل برای اجرای اسکریپت‌های اولیه دیتابیس است
-- میتوانید دستورات SQL مورد نیاز خود را اینجا اضافه کنید

USE mydatabase;

-- اطمینان از دسترسی‌های لازم برای کاربر دیتابیس
GRANT ALL PRIVILEGES ON mydatabase.* TO 'user'@'%';
FLUSH PRIVILEGES;

-- اسکریپت‌های خاص پروژه را میتوانید در اینجا اضافه کنید
-- برای مثال: ایجاد جداول اولیه، وارد کردن داده‌های پیش‌فرض و غیره

-- CREATE TABLE IF NOT EXISTS users (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   username VARCHAR(255) NOT NULL,
--   password VARCHAR(255) NOT NULL,
--   email VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- INSERT INTO users (username, password, email) VALUES
-- ('admin', '$2a$10$your_hashed_password', 'admin@example.com'); 