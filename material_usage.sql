-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2026 at 12:40 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `constructiondata`
--

-- --------------------------------------------------------

--
-- Table structure for table `material_usage`
--

CREATE TABLE `material_usage` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL COMMENT 'snapshot price at time of entry',
  `usage_date` date NOT NULL,
  `recorded_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `material_usage`
--

INSERT INTO `material_usage` (`id`, `project_id`, `material_id`, `quantity`, `unit_price`, `usage_date`, `recorded_by`, `created_at`) VALUES
(1, 1, 1, 500.00, 400.00, '2025-01-10', 3, '2026-04-11 09:56:57'),
(2, 1, 2, 2000.00, 75.00, '2025-01-12', 3, '2026-04-11 09:56:57'),
(3, 1, 3, 50.00, 1200.00, '2025-01-15', 3, '2026-04-11 09:56:57'),
(4, 1, 5, 10000.00, 8.00, '2025-01-18', 3, '2026-04-11 09:56:57'),
(5, 1, 1, 600.00, 400.00, '2025-02-05', 3, '2026-04-11 09:56:57'),
(6, 1, 4, 80.00, 4500.00, '2025-02-10', 3, '2026-04-11 09:56:57'),
(7, 1, 2, 1500.00, 75.00, '2025-02-14', 3, '2026-04-11 09:56:57'),
(8, 1, 6, 200.00, 85.00, '2025-02-20', 4, '2026-04-11 09:56:57'),
(9, 1, 7, 300.00, 55.00, '2025-03-08', 4, '2026-04-11 09:56:57'),
(10, 1, 8, 150.00, 650.00, '2025-03-15', 4, '2026-04-11 09:56:57'),
(11, 1, 1, 400.00, 400.00, '2025-03-20', 3, '2026-04-11 09:56:57'),
(12, 1, 4, 60.00, 4500.00, '2025-03-25', 3, '2026-04-11 09:56:57');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `material_usage`
--
ALTER TABLE `material_usage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `material_id` (`material_id`),
  ADD KEY `recorded_by` (`recorded_by`),
  ADD KEY `idx_material_usage_project_date` (`project_id`,`usage_date`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `material_usage`
--
ALTER TABLE `material_usage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `material_usage`
--
ALTER TABLE `material_usage`
  ADD CONSTRAINT `material_usage_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`),
  ADD CONSTRAINT `material_usage_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `materials_master` (`material_id`),
  ADD CONSTRAINT `material_usage_ibfk_3` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
