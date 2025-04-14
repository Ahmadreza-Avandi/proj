/*
  Warnings:

  - You are about to drop the column `first_name` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `attendance` table. All the data in the column will be lost.
  - You are about to alter the column `dayOfWeek` on the `subject` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the `last_seen` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fullName` to the `attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendance` DROP COLUMN `first_name`,
    DROP COLUMN `last_name`,
    ADD COLUMN `fullName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `subject` MODIFY `dayOfWeek` ENUM('SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY') NOT NULL;

-- DropTable
DROP TABLE `last_seen`;

-- CreateTable
CREATE TABLE `LastSeen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `nationalCode` VARCHAR(191) NOT NULL,
    `checkin_time` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- اضافه کردن چک برای وجود جدول subject
CREATE TABLE IF NOT EXISTS `subject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
