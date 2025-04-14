-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 14, 2025 at 06:44 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `proj`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `nationalCode` varchar(10) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `classId` int(11) DEFAULT NULL,
  `className` varchar(255) DEFAULT NULL,
  `jalali_date` varchar(10) NOT NULL,
  `gregorian_date` date NOT NULL,
  `checkin_time` varchar(8) NOT NULL,
  `location` varchar(255) NOT NULL,
  `dayOfWeek` varchar(20) DEFAULT NULL,
  `status` enum('present','absent') DEFAULT 'present',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `subjectId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `nationalCode`, `fullName`, `classId`, `className`, `jalali_date`, `gregorian_date`, `checkin_time`, `location`, `dayOfWeek`, `status`, `created_at`, `subjectId`) VALUES
(2, '1', 'احمدرضا آوندی', 2, 'دوازدهم مکاترونیک', '1404/01/13', '2025-04-02', '09:00:26', 'دوازدهم مکاترونیک', 'چهارشنبه', 'present', '2025-04-02 15:55:24', NULL),
(3, '1', 'احمدرضا آوندی', NULL, 'دوازدهم مکاترونیک', '1404/01/13', '2025-04-02', '11:55:23', 'سیستم مدیریت', 'چهارشنبه', 'present', '2025-04-06 08:25:23', 1),
(4, '1', 'احمدرضا آوندی', 2, 'دوازدهم مکاترونیک', '1404/01/17', '2025-04-06', '12:30:19', 'دوازدهم مکاترونیک', 'یکشنبه', 'present', '2025-04-06 08:30:38', NULL),
(8, '2', 'صیام', 2, 'دوازدهم مکاترونیک', '1404/01/17', '2025-04-06', '13:13:50', 'دوازدهم مکاترونیک', 'یکشنبه', 'present', '2025-04-06 09:43:47', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `class`
--

CREATE TABLE `class` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `majorId` int(11) NOT NULL,
  `gradeId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `class`
--

INSERT INTO `class` (`id`, `name`, `majorId`, `gradeId`) VALUES
(1, 'یازدهم شبکه و نرم افزار', 1, 1),
(2, 'دوازدهم مکاترونیک', 2, 2),
(3, 'دهم شبکه و نرم افزار', 1, 3),
(4, 'دهم مکاترونیک', 2, 3),
(5, 'یازدهم مکاترونیک', 2, 1),
(6, 'دوازدهم ماشین ابزار', 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `grade`
--

CREATE TABLE `grade` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `grade`
--

INSERT INTO `grade` (`id`, `name`) VALUES
(3, 'دهم'),
(2, 'دوازدهم'),
(1, 'یازدهم');

-- --------------------------------------------------------

--
-- Table structure for table `lastseen`
--

CREATE TABLE `lastseen` (
  `id` int(11) NOT NULL,
  `fullName` varchar(191) NOT NULL,
  `nationalCode` varchar(191) NOT NULL,
  `checkin_time` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `last_seen`
--

CREATE TABLE `last_seen` (
  `id` int(11) NOT NULL,
  `fullName` varchar(191) NOT NULL,
  `nationalCode` varchar(191) NOT NULL,
  `checkin_time` datetime(3) NOT NULL,
  `location` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `id` int(11) NOT NULL,
  `title` varchar(191) NOT NULL,
  `representative` varchar(191) NOT NULL,
  `grade` varchar(191) NOT NULL,
  `major` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `major`
--

CREATE TABLE `major` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `major`
--

INSERT INTO `major` (`id`, `name`) VALUES
(1, 'شبکه و نرم افزار'),
(3, 'ماشین ابزار'),
(2, 'مکاترونیک');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`permissions`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`, `permissions`) VALUES
(1, 'مدیر', '{\"viewPlaces\": true, \"editPlaces\": true, \"deletePlaces\": true, \"viewPersons\": true, \"editPersons\": true, \"deletePersons\": true, \"viewRoles\": true, \"editRoles\": true, \"deleteRoles\": true}'),
(2, 'معلم', '{\"viewPlaces\": true, \"editPlaces\": true, \"deletePlaces\": true, \"viewPersons\": true, \"editPersons\": true, \"deletePersons\": true, \"viewRoles\": true, \"editRoles\": true, \"deleteRoles\": true}'),
(3, 'دانش آموز', '{\"viewPlaces\": false, \"editPlaces\": false, \"deletePlaces\": false, \"viewPersons\": false, \"editPersons\": false, \"deletePersons\": false, \"viewRoles\": false, \"editRoles\": false, \"deleteRoles\": false}');

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

CREATE TABLE `subject` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `classId` int(11) NOT NULL,
  `teacherId` int(11) NOT NULL,
  `dayOfWeek` enum('شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنج‌شنبه','جمعه') NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subject`
--

INSERT INTO `subject` (`id`, `name`, `classId`, `teacherId`, `dayOfWeek`, `startTime`, `endTime`) VALUES
(1, 'فارسی', 2, 12, 'چهارشنبه', '08:00:00', '09:30:00'),
(2, 'دینی', 2, 12, 'یکشنبه', '07:59:36', '12:00:00'),
(3, 'عربی', 2, 12, 'یکشنبه', '12:17:10', '14:17:10');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `fullName` varchar(191) NOT NULL,
  `nationalCode` varchar(191) NOT NULL,
  `phoneNumber` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `roleId` int(11) NOT NULL,
  `majorId` int(11) DEFAULT NULL,
  `gradeId` int(11) DEFAULT NULL,
  `classId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `fullName`, `nationalCode`, `phoneNumber`, `password`, `roleId`, `majorId`, `gradeId`, `classId`) VALUES
(12, 'احمدرضا آوندی', '1', '1', '$2a$10$j/KCE2ssT13HxS505UR7HecVmy53oekUg.2k5/8omY6CDoFEvYgU2', 3, 2, 2, 2),
(13, 'صیام', '2', '1', '$2a$10$OzCRnpap9Ih42BAOXgyYSenNfqG.I7K.hkool5z8wQtQ.N5aJX.Hu', 3, 2, 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('43e0695d-502a-4a31-96e5-47292bf97292', '2d0f4118cbd9e3882d108d0c25822f7d55ac4a4bd53aab776006ce399848c3cd', '2025-03-30 09:41:29.138', '20250326160744_init', NULL, NULL, '2025-03-30 09:41:28.897', 1),
('45cbd36c-2551-4666-b11c-b2370c85b59f', '7ca4957545b82c7bc0b50971a58f482bdd2006ddb22943c3c071250da306489d', '2025-03-30 09:41:29.775', '20250330094129_update_schema', NULL, NULL, '2025-03-30 09:41:29.735', 1),
('e6ee7284-324f-4864-9236-afc0033e2fba', '2d0f4118cbd9e3882d108d0c25822f7d55ac4a4bd53aab776006ce399848c3cd', '2025-03-26 16:07:44.623', '20250326160744_init', NULL, NULL, '2025-03-26 16:07:44.453', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `classId` (`classId`),
  ADD KEY `nationalCode` (`nationalCode`),
  ADD KEY `subject_fk` (`subjectId`);

--
-- Indexes for table `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Class_majorId_fkey` (`majorId`),
  ADD KEY `Class_gradeId_fkey` (`gradeId`);

--
-- Indexes for table `grade`
--
ALTER TABLE `grade`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Grade_name_key` (`name`);

--
-- Indexes for table `lastseen`
--
ALTER TABLE `lastseen`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `last_seen`
--
ALTER TABLE `last_seen`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `major`
--
ALTER TABLE `major`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Major_name_key` (`name`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Role_name_key` (`name`);

--
-- Indexes for table `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Subject_classId_fkey` (`classId`),
  ADD KEY `Subject_teacherId_fkey` (`teacherId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_nationalCode_key` (`nationalCode`),
  ADD KEY `User_roleId_fkey` (`roleId`),
  ADD KEY `User_majorId_fkey` (`majorId`),
  ADD KEY `User_gradeId_fkey` (`gradeId`),
  ADD KEY `User_classId_fkey` (`classId`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `class`
--
ALTER TABLE `class`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `grade`
--
ALTER TABLE `grade`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `lastseen`
--
ALTER TABLE `lastseen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `last_seen`
--
ALTER TABLE `last_seen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1854;

--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `major`
--
ALTER TABLE `major`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`classId`) REFERENCES `class` (`id`),
  ADD CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`nationalCode`) REFERENCES `user` (`nationalCode`),
  ADD CONSTRAINT `subject_fk` FOREIGN KEY (`subjectId`) REFERENCES `subject` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `class`
--
ALTER TABLE `class`
  ADD CONSTRAINT `Class_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `grade` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Class_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `major` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `subject`
--
ALTER TABLE `subject`
  ADD CONSTRAINT `Subject_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Subject_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `User_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `class` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `User_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `grade` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `User_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `major` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
