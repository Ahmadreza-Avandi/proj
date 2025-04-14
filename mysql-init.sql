-- اسکریپت راه‌اندازی اولیه دیتابیس

-- اطمینان از وجود دیتابیس
CREATE DATABASE IF NOT EXISTS mydatabase CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mydatabase;

-- جدول نقش‌ها
CREATE TABLE IF NOT EXISTS `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `permissions` JSON NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Role_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول کاربران
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullName` varchar(191) NOT NULL,
  `nationalCode` varchar(191) NOT NULL,
  `phoneNumber` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `roleId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`roleId`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول مکان‌ها
CREATE TABLE IF NOT EXISTS `location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(191) NOT NULL,
  `representative` varchar(191) NOT NULL,
  `grade` varchar(191) NOT NULL,
  `major` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول حضور و غیاب
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `national_code` varchar(20) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `checkin_time` datetime DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول آخرین مشاهده
CREATE TABLE IF NOT EXISTS `last_seen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullName` varchar(255) NOT NULL,
  `nationalCode` varchar(20) NOT NULL,
  `checkin_time` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nationalCode` (`nationalCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول مهاجرت‌های Prisma
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ایجاد داده‌های پیش‌فرض فقط اگر جدول خالی باشد

-- داده‌های پیش‌فرض برای نقش‌ها
INSERT IGNORE INTO `role` (`id`, `name`, `permissions`) VALUES
(1, 'Admin', '{"viewPlaces":true,"editPlaces":true,"deletePlaces":true,"viewPersons":true,"editPersons":true,"deletePersons":true,"viewRoles":true,"editRoles":true,"deleteRoles":true}'),
(3, 'teacher', '{"viewPlaces":true,"editPlaces":true,"deletePlaces":true,"viewPersons":true,"editPersons":true,"deletePersons":true,"viewRoles":true,"editRoles":true,"deleteRoles":true}'),
(4, 'user', '{"viewPlaces":false,"editPlaces":false,"deletePlaces":false,"viewPersons":false,"editPersons":false,"deletePersons":false,"viewRoles":false,"editRoles":false,"deleteRoles":false}');

-- داده‌های پیش‌فرض برای کاربران (رمز عبور: password123)
INSERT IGNORE INTO `user` (`id`, `fullName`, `nationalCode`, `phoneNumber`, `password`, `roleId`) VALUES
(1, 'امیرعلی هاشمی پور', '3381608681', '09369890707', '$2b$12$F.VzTzQhGZ6uXod2oeNUuewqVFL/XiOD/8v47GtTHRleh5CN0ORrO', 1),
(17, 'احمد رضا آوندی ', '457264874', '457264874', '$2a$10$iW0REpw.qaek3yD.smg7bekGau7raguiJYE/mwD1DlNpbgx08hYVq', 4);

-- داده‌های پیش‌فرض برای مکان‌ها
INSERT IGNORE INTO `location` (`id`, `title`, `representative`, `grade`, `major`, `createdAt`, `updatedAt`) VALUES
(1, 'کلاس 101', 'استاد رضایی', 'دوازدهم', 'مکاترونیک', '2024-10-16 14:20:06.584', '2024-10-16 14:20:06.584'),
(2, 'کلاس 102', 'استاد محمدی', 'یازدهم', 'شبکه و نرم‌افزار', '2024-10-16 14:22:40.467', '2024-10-16 14:22:40.467'); 