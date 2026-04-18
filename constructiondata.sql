-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 11, 2026 at 12:41 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
-- Table structure for table `billing`
--

CREATE TABLE `billing` (
  `billing_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `invoice_number` varchar(50) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` enum('draft','sent','paid','overdue') DEFAULT 'draft',
  `billing_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `billing`
--

INSERT INTO `billing` (`billing_id`, `project_id`, `invoice_number`, `amount`, `status`, `billing_date`, `due_date`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 1, 'INV-GRC-2025-001', 1500000.00, 'paid', '2025-01-31', '2025-02-15', 2, '2026-04-11 09:59:48', NULL),
(2, 1, 'INV-GRC-2025-002', 1800000.00, 'paid', '2025-02-28', '2025-03-15', 2, '2026-04-11 09:59:48', NULL),
(3, 1, 'INV-GRC-2025-003', 2100000.00, 'sent', '2025-03-31', '2025-04-15', 2, '2026-04-11 09:59:48', NULL),
(4, 2, 'INV-CRR-2025-001', 900000.00, 'paid', '2025-02-28', '2025-03-15', 2, '2026-04-11 09:59:48', NULL),
(5, 2, 'INV-CRR-2025-002', 1200000.00, 'sent', '2025-03-31', '2025-04-15', 2, '2026-04-11 09:59:48', NULL),
(6, 3, 'INV-LCH-2024-003', 2500000.00, 'paid', '2024-12-31', '2025-01-15', 2, '2026-04-11 09:59:48', NULL),
(7, 3, 'INV-LCH-2025-001', 450000.00, 'overdue', '2025-01-31', '2025-02-15', 2, '2026-04-11 09:59:48', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `db_audit_log`
--

CREATE TABLE `db_audit_log` (
  `id` bigint(20) NOT NULL,
  `table_name` varchar(100) NOT NULL,
  `record_id` int(11) NOT NULL,
  `action` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `changed_by` int(11) DEFAULT NULL,
  `changed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `expense_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` text DEFAULT NULL,
  `expense_date` date NOT NULL,
  `recorded_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`expense_id`, `project_id`, `category_id`, `amount`, `description`, `expense_date`, `recorded_by`, `created_at`) VALUES
(1, 1, 1, 45000.00, 'Generator fuel — January', '2025-01-31', 3, '2026-04-11 09:59:32'),
(2, 1, 3, 18000.00, 'Site office rent — January', '2025-01-31', 2, '2026-04-11 09:59:32'),
(3, 1, 4, 22000.00, 'Material transport — cement & steel', '2025-01-20', 3, '2026-04-11 09:59:32'),
(4, 1, 5, 8500.00, 'Safety helmets and gear — 30 workers', '2025-01-10', 3, '2026-04-11 09:59:32'),
(5, 1, 1, 52000.00, 'Generator fuel — February', '2025-02-28', 3, '2026-04-11 09:59:32'),
(6, 1, 3, 18000.00, 'Site office rent — February', '2025-02-28', 2, '2026-04-11 09:59:32'),
(7, 1, 4, 28000.00, 'Material transport — RMC deliveries', '2025-02-15', 3, '2026-04-11 09:59:32'),
(8, 1, 5, 12000.00, 'First aid kits and site safety signage', '2025-02-10', 4, '2026-04-11 09:59:32'),
(9, 1, 1, 48000.00, 'Generator fuel — March', '2025-03-31', 3, '2026-04-11 09:59:32'),
(10, 1, 3, 18000.00, 'Site office rent — March', '2025-03-31', 2, '2026-04-11 09:59:32'),
(11, 1, 4, 35000.00, 'Transport — tiles and electrical items', '2025-03-20', 4, '2026-04-11 09:59:32'),
(12, 1, 5, 5500.00, 'Miscellaneous site expenses — March', '2025-03-31', 3, '2026-04-11 09:59:32');

-- --------------------------------------------------------

--
-- Table structure for table `expense_categories`
--

CREATE TABLE `expense_categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expense_categories`
--

INSERT INTO `expense_categories` (`category_id`, `category_name`) VALUES
(1, 'Equipment'),
(2, 'Labor'),
(5, 'Miscellaneous'),
(3, 'Overhead'),
(4, 'Transport');

-- --------------------------------------------------------

--
-- Table structure for table `financiers`
--

CREATE TABLE `financiers` (
  `financier_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `financiers`
--

INSERT INTO `financiers` (`financier_id`, `name`, `phone`, `email`, `created_at`) VALUES
(1, 'Indian Bank — SME Branch', '0452-2345678', 'sme@indianbank.in', '2026-04-11 09:58:01'),
(2, 'HDFC Project Finance', '1800-202-6161', 'projects@hdfc.com', '2026-04-11 09:58:01');

-- --------------------------------------------------------

--
-- Table structure for table `interest_payments`
--

CREATE TABLE `interest_payments` (
  `id` int(11) NOT NULL,
  `loan_id` int(11) NOT NULL,
  `payment_date` date NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` enum('paid','pending') DEFAULT 'pending',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interest_payments`
--

INSERT INTO `interest_payments` (`id`, `loan_id`, `payment_date`, `amount`, `status`, `created_by`, `created_at`) VALUES
(1, 1, '2025-02-01', 30625.00, 'paid', 2, '2026-04-11 09:58:54'),
(2, 1, '2025-03-01', 30625.00, 'paid', 2, '2026-04-11 09:58:54'),
(3, 1, '2025-04-01', 30625.00, 'pending', 2, '2026-04-11 09:58:54'),
(4, 2, '2025-02-15', 12187.50, 'paid', 2, '2026-04-11 09:58:54'),
(5, 2, '2025-03-15', 12187.50, 'paid', 2, '2026-04-11 09:58:54'),
(6, 2, '2025-04-15', 12187.50, 'pending', 2, '2026-04-11 09:58:54'),
(7, 3, '2025-03-01', 34166.67, 'paid', 2, '2026-04-11 09:58:54'),
(8, 3, '2025-04-01', 34166.67, 'pending', 2, '2026-04-11 09:58:54');

-- --------------------------------------------------------

--
-- Table structure for table `investors`
--

CREATE TABLE `investors` (
  `investor_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `investors`
--

INSERT INTO `investors` (`investor_id`, `name`, `phone`, `email`, `created_at`) VALUES
(1, 'Rajesh Mehta', '9900001111', 'rajesh@mehtagroup.in', '2026-04-11 09:57:46'),
(2, 'Anitha Constructions Pvt Ltd', '9900002222', 'anitha@acpl.in', '2026-04-11 09:57:46'),
(3, 'Tamil Nadu Infra Fund', '9900003333', 'fund@tninfra.gov.in', '2026-04-11 09:57:46');

-- --------------------------------------------------------

--
-- Table structure for table `machines_master`
--

CREATE TABLE `machines_master` (
  `machine_id` int(11) NOT NULL,
  `machine_name` varchar(100) NOT NULL,
  `machine_type` varchar(100) DEFAULT NULL,
  `hourly_rate` decimal(10,2) DEFAULT NULL,
  `ownership_type` enum('owned','rented') DEFAULT 'owned',
  `status` enum('available','in_use','maintenance') DEFAULT 'available',
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `machines_master`
--

INSERT INTO `machines_master` (`machine_id`, `machine_name`, `machine_type`, `hourly_rate`, `ownership_type`, `status`, `is_deleted`, `created_at`) VALUES
(1, 'JCB Backhoe Loader', 'Excavator', 1800.00, 'rented', 'in_use', 0, '2026-04-11 09:42:04'),
(2, 'Concrete Mixer 500L', 'Mixer', 450.00, 'owned', 'in_use', 0, '2026-04-11 09:42:04'),
(3, 'Tower Crane TC-5028', 'Crane', 3500.00, 'rented', 'in_use', 0, '2026-04-11 09:42:04'),
(4, 'Plate Compactor', 'Compactor', 350.00, 'owned', 'available', 0, '2026-04-11 09:42:04'),
(5, 'Concrete Vibrator', 'Vibrator', 200.00, 'owned', 'available', 0, '2026-04-11 09:42:04'),
(6, 'Transit Mixer Truck', 'Transport', 2200.00, 'rented', 'maintenance', 0, '2026-04-11 09:42:04');

-- --------------------------------------------------------

--
-- Table structure for table `machine_usage`
--

CREATE TABLE `machine_usage` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `machine_id` int(11) NOT NULL,
  `usage_hours` decimal(8,2) NOT NULL COMMENT 'DECIMAL supports fractional hours e.g. 4.5',
  `hourly_rate` decimal(10,2) NOT NULL COMMENT 'snapshot rate at time of entry',
  `usage_date` date NOT NULL,
  `recorded_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `machine_usage`
--

INSERT INTO `machine_usage` (`id`, `project_id`, `machine_id`, `usage_hours`, `hourly_rate`, `usage_date`, `recorded_by`, `created_at`) VALUES
(1, 1, 1, 120.00, 1800.00, '2025-01-31', 3, '2026-04-11 09:57:27'),
(2, 1, 2, 200.00, 450.00, '2025-01-31', 3, '2026-04-11 09:57:27'),
(3, 1, 1, 96.00, 1800.00, '2025-02-28', 3, '2026-04-11 09:57:27'),
(4, 1, 2, 180.00, 450.00, '2025-02-28', 3, '2026-04-11 09:57:27'),
(5, 1, 3, 80.00, 3500.00, '2025-02-28', 3, '2026-04-11 09:57:27'),
(6, 1, 5, 120.00, 200.00, '2025-02-28', 4, '2026-04-11 09:57:27'),
(7, 1, 2, 200.00, 450.00, '2025-03-31', 3, '2026-04-11 09:57:27'),
(8, 1, 3, 120.00, 3500.00, '2025-03-31', 3, '2026-04-11 09:57:27'),
(9, 1, 4, 60.00, 350.00, '2025-03-31', 4, '2026-04-11 09:57:27'),
(10, 1, 5, 150.00, 200.00, '2025-03-31', 4, '2026-04-11 09:57:27');

-- --------------------------------------------------------

--
-- Table structure for table `manpower_usage`
--

CREATE TABLE `manpower_usage` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `worker_id` int(11) NOT NULL COMMENT 'FK to workers master - fixes BCNF violation',
  `work_days` decimal(5,1) NOT NULL COMMENT 'DECIMAL supports half-days e.g. 0.5',
  `daily_rate` decimal(8,2) NOT NULL COMMENT 'snapshot rate at time of entry',
  `work_date` date NOT NULL,
  `recorded_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `manpower_usage`
--

INSERT INTO `manpower_usage` (`id`, `project_id`, `worker_id`, `work_days`, `daily_rate`, `work_date`, `recorded_by`, `created_at`) VALUES
(1, 1, 1, 26.0, 800.00, '2025-01-31', 3, '2026-04-11 09:57:12'),
(2, 1, 2, 26.0, 800.00, '2025-01-31', 3, '2026-04-11 09:57:12'),
(3, 1, 3, 22.0, 750.00, '2025-01-31', 3, '2026-04-11 09:57:12'),
(4, 1, 6, 26.0, 550.00, '2025-01-31', 3, '2026-04-11 09:57:12'),
(5, 1, 7, 26.0, 550.00, '2025-01-31', 3, '2026-04-11 09:57:12'),
(6, 1, 1, 24.0, 800.00, '2025-02-28', 3, '2026-04-11 09:57:12'),
(7, 1, 2, 24.0, 800.00, '2025-02-28', 3, '2026-04-11 09:57:12'),
(8, 1, 4, 20.0, 900.00, '2025-02-28', 4, '2026-04-11 09:57:12'),
(9, 1, 5, 18.0, 850.00, '2025-02-28', 4, '2026-04-11 09:57:12'),
(10, 1, 8, 15.0, 950.00, '2025-02-28', 3, '2026-04-11 09:57:12'),
(11, 1, 1, 27.0, 800.00, '2025-03-31', 3, '2026-04-11 09:57:12'),
(12, 1, 9, 25.0, 700.00, '2025-03-31', 4, '2026-04-11 09:57:12'),
(13, 1, 10, 27.0, 820.00, '2025-03-31', 3, '2026-04-11 09:57:12'),
(14, 1, 4, 27.0, 900.00, '2025-03-31', 4, '2026-04-11 09:57:12');

-- --------------------------------------------------------

--
-- Table structure for table `materials_master`
--

CREATE TABLE `materials_master` (
  `material_id` int(11) NOT NULL,
  `material_name` varchar(100) NOT NULL,
  `unit` varchar(50) NOT NULL COMMENT 'e.g. kg, bags, m3',
  `unit_price` decimal(10,2) DEFAULT NULL,
  `total_purchased` decimal(12,2) DEFAULT 0.00,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `materials_master`
--

INSERT INTO `materials_master` (`material_id`, `material_name`, `unit`, `unit_price`, `total_purchased`, `is_deleted`, `created_at`) VALUES
(1, 'Cement (OPC 53 Grade)', 'bags', 400.00, 0.00, 0, '2026-04-11 09:42:04'),
(2, 'Steel TMT Bar (Fe500)', 'kg', 75.00, 0.00, 0, '2026-04-11 09:42:04'),
(3, 'praveen Sand', 'm3', 1200.00, 0.00, 0, '2026-04-11 09:42:04'),
(4, 'M20 Ready Mix Concrete', 'm3', 4500.00, 0.00, 0, '2026-04-11 09:42:04'),
(5, 'Red Bricks', 'units', 8.00, 0.00, 0, '2026-04-11 09:42:04'),
(6, 'Plumbing PVC Pipe', 'meters', 85.00, 0.00, 0, '2026-04-11 09:42:04'),
(7, 'Electrical Wire (6mm)', 'meters', 55.00, 0.00, 0, '2026-04-11 09:42:04'),
(8, 'Ceramic Floor Tiles', 'm2', 650.00, 0.00, 0, '2026-04-11 09:42:04');

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

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `project_id` int(11) NOT NULL,
  `project_name` varchar(150) NOT NULL,
  `location` varchar(150) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `estimated_budget` decimal(15,2) DEFAULT NULL,
  `status` enum('ongoing','completed','on_hold') DEFAULT 'ongoing',
  `created_by` int(11) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`project_id`, `project_name`, `location`, `start_date`, `end_date`, `estimated_budget`, `status`, `created_by`, `is_deleted`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Greenfield Residential Complex', 'Madurai, Tamil Nadu', '2025-01-01', '2025-06-30', 12000000.00, 'ongoing', 2, 0, NULL, '2026-04-11 09:42:04', NULL),
(2, 'City Ring Road Extension', 'Coimbatore, TN', '2025-02-01', '2025-08-31', 8500000.00, 'ongoing', 2, 0, NULL, '2026-04-11 09:42:04', NULL),
(3, 'Lakeside Commercial Hub', 'Chennai, Tamil Nadu', '2024-10-01', '2025-03-31', 5000000.00, 'completed', 2, 0, NULL, '2026-04-11 09:42:04', NULL),
(4, 'Greenfield Residential Complex', 'Madurai, Tamil Nadu', '2025-01-01', '2025-06-30', 12000000.00, 'ongoing', 2, 0, NULL, '2026-04-11 09:54:46', NULL),
(5, 'City Ring Road Extension', 'Coimbatore, TN', '2025-02-01', '2025-08-31', 8500000.00, 'ongoing', 2, 0, NULL, '2026-04-11 09:54:46', NULL),
(6, 'Lakeside Commercial Hub', 'Chennai, Tamil Nadu', '2024-10-01', '2025-03-31', 5000000.00, 'completed', 2, 0, NULL, '2026-04-11 09:54:46', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `project_investments`
--

CREATE TABLE `project_investments` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `investor_id` int(11) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `investment_date` date NOT NULL,
  `notes` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_investments`
--

INSERT INTO `project_investments` (`id`, `project_id`, `investor_id`, `amount`, `investment_date`, `notes`, `created_by`, `created_at`) VALUES
(1, 1, 1, 4000000.00, '2024-12-15', 'Initial equity investment — Rajesh Mehta', 2, '2026-04-11 09:58:18'),
(2, 1, 2, 3000000.00, '2024-12-20', 'Strategic investment — Anitha Constructions', 2, '2026-04-11 09:58:18'),
(3, 1, 3, 1500000.00, '2025-01-05', 'Government infrastructure fund tranche 1', 2, '2026-04-11 09:58:18'),
(4, 2, 1, 2000000.00, '2025-01-25', 'Road project equity — Rajesh Mehta', 2, '2026-04-11 09:58:18'),
(5, 2, 2, 2500000.00, '2025-02-01', 'Road project equity — Anitha Constructions', 2, '2026-04-11 09:58:18');

-- --------------------------------------------------------

--
-- Table structure for table `project_loans`
--

CREATE TABLE `project_loans` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `financier_id` int(11) NOT NULL,
  `principal` decimal(15,2) NOT NULL,
  `interest_rate` decimal(5,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_loans`
--

INSERT INTO `project_loans` (`id`, `project_id`, `financier_id`, `principal`, `interest_rate`, `start_date`, `end_date`, `created_by`, `created_at`) VALUES
(1, 1, 1, 3500000.00, 10.50, '2025-01-01', '2026-12-31', 2, '2026-04-11 09:58:36'),
(2, 1, 2, 1500000.00, 9.75, '2025-01-15', '2026-06-30', 2, '2026-04-11 09:58:36'),
(3, 2, 1, 4000000.00, 10.25, '2025-02-01', '2027-01-31', 2, '2026-04-11 09:58:36');

-- --------------------------------------------------------

--
-- Table structure for table `project_progress`
--

CREATE TABLE `project_progress` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `month` int(11) NOT NULL CHECK (`month` between 1 and 12),
  `year` int(11) NOT NULL,
  `progress_percentage` decimal(5,2) NOT NULL CHECK (`progress_percentage` between 0 and 100),
  `remarks` text DEFAULT NULL,
  `recorded_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_progress`
--

INSERT INTO `project_progress` (`id`, `project_id`, `month`, `year`, `progress_percentage`, `remarks`, `recorded_by`, `created_at`) VALUES
(1, 1, 1, 2025, 12.00, 'Foundation excavation complete. Pile work 80% done.', 3, '2026-04-11 10:06:12'),
(2, 1, 2, 2025, 28.00, 'Pile foundation complete. Ground floor columns and slab poured.', 3, '2026-04-11 10:06:12'),
(3, 1, 3, 2025, 45.00, 'First floor slab complete. Second floor columns in progress.', 3, '2026-04-11 10:06:12'),
(4, 2, 2, 2025, 8.00, 'Land clearing and sub-base preparation started.', 3, '2026-04-11 10:06:12'),
(5, 2, 3, 2025, 20.00, 'Sub-base compaction 60% done. Culvert construction started.', 3, '2026-04-11 10:06:12'),
(6, 3, 10, 2024, 75.00, 'Structure complete. MEP works in progress.', 4, '2026-04-11 10:06:12'),
(7, 3, 11, 2024, 90.00, 'Finishing works 70% complete. Electrical commissioning started.', 4, '2026-04-11 10:06:12'),
(8, 3, 12, 2024, 98.00, 'Snag list clearance. Handed over to client pending final inspection.', 4, '2026-04-11 10:06:12'),
(9, 3, 1, 2025, 100.00, 'Final inspection passed. Project closed.', 4, '2026-04-11 10:06:12');

-- --------------------------------------------------------

--
-- Table structure for table `project_team`
--

CREATE TABLE `project_team` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` enum('site_engineer','project_manager','supervisor','accountant') NOT NULL,
  `joined_at` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_team`
--

INSERT INTO `project_team` (`id`, `project_id`, `user_id`, `role`, `joined_at`, `created_at`) VALUES
(1, 1, 2, 'project_manager', '2025-01-01', '2026-04-11 09:42:04'),
(2, 1, 3, 'site_engineer', '2025-01-01', '2026-04-11 09:42:04'),
(3, 1, 4, 'supervisor', '2025-01-05', '2026-04-11 09:42:04'),
(4, 2, 2, 'project_manager', '2025-02-01', '2026-04-11 09:42:04'),
(5, 2, 3, 'site_engineer', '2025-02-01', '2026-04-11 09:42:04'),
(6, 3, 2, 'project_manager', '2024-10-01', '2026-04-11 09:42:04'),
(7, 3, 4, 'site_engineer', '2024-10-01', '2026-04-11 09:42:04');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'admin'),
(3, 'engineer'),
(2, 'manager'),
(4, 'viewer');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL COMMENT 'bcrypt/Argon2id only - never plaintext',
  `role_id` int(11) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password_hash`, `role_id`, `is_deleted`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'Test Admin', 'admin@test.com', '$2b$10$JXsZj3RRMfCf3ebYviewc.AD4V676I97K17IkrAwOliEu.R4.ej0W', 3, 0, NULL, '2026-04-11 07:51:25', NULL),
(2, 'Admin User', 'admin@example.com', '$2b$10$BpnPN64Q4HmCZ/qfIsZXmO9GMEig65t1BwQi/AX3ry1sVoX435M9K', 1, 0, NULL, '2026-04-11 07:52:35', NULL),
(3, 'Arjun Sharma', 'arjun@constructco.in', 'admin@123', 1, 0, NULL, '2026-04-11 09:42:04', NULL),
(4, 'Priya Nair', 'priya@constructco.in', '$2b$12$KIXabcHashManager01xx', 2, 0, NULL, '2026-04-11 09:42:04', NULL),
(5, 'Ravi Kumar', 'ravi@constructco.in', '$2b$12$KIXabcHashEngineer1xx', 3, 0, NULL, '2026-04-11 09:42:04', NULL),
(6, 'Meena Selvam', 'meena@constructco.in', '$2b$12$KIXabcHashEngineer2xx', 3, 0, NULL, '2026-04-11 09:42:04', NULL),
(7, 'Siva Prakash', 'siva@constructco.in', '$2b$12$KIXabcHashViewer001xx', 4, 0, NULL, '2026-04-11 09:42:04', NULL),
(13, 'Harish', 'harish@gmail.com', '$2b$10$qOlZnpx7d7gaBuDyDZ6sPOn9V/5jxutHx/Gz.ld6ToqI7aGc7pE9G', 1, 0, NULL, '2026-04-11 10:18:43', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `workers`
--

CREATE TABLE `workers` (
  `worker_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `aadhar_number` varchar(20) DEFAULT NULL,
  `worker_role_id` int(11) DEFAULT NULL,
  `daily_rate` decimal(8,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `workers`
--

INSERT INTO `workers` (`worker_id`, `name`, `contact`, `aadhar_number`, `worker_role_id`, `daily_rate`, `is_active`, `is_deleted`, `deleted_at`, `created_at`) VALUES
(1, 'Murugan K', '9876543210', '1234-5678-9101', 1, 800.00, 1, 0, NULL, '2026-04-11 09:42:04'),
(2, 'Selvam R', '9876543211', '1234-5678-9102', 1, 800.00, 1, 0, NULL, '2026-04-11 09:42:04'),
(3, 'Kannan P', '9876543212', '1234-5678-9103', 2, 750.00, 1, 0, NULL, '2026-04-11 09:42:04'),
(4, 'Rajan S', '9876543213', '1234-5678-9104', 3, 900.00, 1, 0, NULL, '2026-04-11 09:42:04'),
(5, 'Balu M', '9876543214', '1234-5678-9105', 4, 850.00, 1, 0, NULL, '2026-04-11 09:42:04'),
(6, 'Suresh T', '9876543215', '1234-5678-9106', 5, 550.00, 1, 0, NULL, '2026-04-11 09:42:04'),
(7, 'Pandi L', '9876543216', '1234-5678-9107', 5, 550.00, 1, 0, NULL, '2026-04-11 09:42:04'),
(8, 'Vijay N', '9876543217', '1234-5678-9108', 6, 950.00, 1, 0, NULL, '2026-04-11 09:42:04'),
(9, 'Anbu C', '9876543218', '1234-5678-9109', 7, 700.00, 1, 0, NULL, '2026-04-11 09:42:04'),
(10, 'Durai G', '9876543219', '1234-5678-9110', 1, 820.00, 1, 0, NULL, '2026-04-11 09:42:04');

-- --------------------------------------------------------

--
-- Table structure for table `worker_roles`
--

CREATE TABLE `worker_roles` (
  `worker_role_id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL COMMENT 'mason, carpenter, electrician, etc.',
  `daily_rate` decimal(8,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `worker_roles`
--

INSERT INTO `worker_roles` (`worker_role_id`, `role_name`, `daily_rate`) VALUES
(1, 'Mason', 800.00),
(2, 'Carpenter', 750.00),
(3, 'Electrician', 900.00),
(4, 'Plumber', 850.00),
(5, 'Helper / Unskilled', 550.00),
(6, 'Welder', 950.00),
(7, 'Painter', 700.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `billing`
--
ALTER TABLE `billing`
  ADD PRIMARY KEY (`billing_id`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_billing_project` (`project_id`),
  ADD KEY `idx_billing_status` (`status`);

--
-- Indexes for table `db_audit_log`
--
ALTER TABLE `db_audit_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_audit_table_record` (`table_name`,`record_id`),
  ADD KEY `idx_audit_changed_at` (`changed_at`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`expense_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `recorded_by` (`recorded_by`),
  ADD KEY `idx_expenses_project_date` (`project_id`,`expense_date`);

--
-- Indexes for table `expense_categories`
--
ALTER TABLE `expense_categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_name` (`category_name`);

--
-- Indexes for table `financiers`
--
ALTER TABLE `financiers`
  ADD PRIMARY KEY (`financier_id`);

--
-- Indexes for table `interest_payments`
--
ALTER TABLE `interest_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_interest_loan` (`loan_id`),
  ADD KEY `idx_interest_status` (`status`);

--
-- Indexes for table `investors`
--
ALTER TABLE `investors`
  ADD PRIMARY KEY (`investor_id`);

--
-- Indexes for table `machines_master`
--
ALTER TABLE `machines_master`
  ADD PRIMARY KEY (`machine_id`),
  ADD UNIQUE KEY `machine_name` (`machine_name`);

--
-- Indexes for table `machine_usage`
--
ALTER TABLE `machine_usage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `machine_id` (`machine_id`),
  ADD KEY `recorded_by` (`recorded_by`),
  ADD KEY `idx_machine_usage_project_date` (`project_id`,`usage_date`);

--
-- Indexes for table `manpower_usage`
--
ALTER TABLE `manpower_usage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recorded_by` (`recorded_by`),
  ADD KEY `idx_manpower_usage_project_date` (`project_id`,`work_date`),
  ADD KEY `idx_manpower_usage_worker` (`worker_id`);

--
-- Indexes for table `materials_master`
--
ALTER TABLE `materials_master`
  ADD PRIMARY KEY (`material_id`),
  ADD UNIQUE KEY `material_name` (`material_name`);

--
-- Indexes for table `material_usage`
--
ALTER TABLE `material_usage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `material_id` (`material_id`),
  ADD KEY `recorded_by` (`recorded_by`),
  ADD KEY `idx_material_usage_project_date` (`project_id`,`usage_date`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `idx_projects_status` (`status`),
  ADD KEY `idx_projects_created_by` (`created_by`);

--
-- Indexes for table `project_investments`
--
ALTER TABLE `project_investments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `investor_id` (`investor_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_investments_project` (`project_id`);

--
-- Indexes for table `project_loans`
--
ALTER TABLE `project_loans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `financier_id` (`financier_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_loans_project` (`project_id`);

--
-- Indexes for table `project_progress`
--
ALTER TABLE `project_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_project_progress_month` (`project_id`,`year`,`month`),
  ADD KEY `recorded_by` (`recorded_by`),
  ADD KEY `idx_progress_project_month` (`project_id`,`year`,`month`);

--
-- Indexes for table `project_team`
--
ALTER TABLE `project_team`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_project_user` (`project_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `idx_users_email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `workers`
--
ALTER TABLE `workers`
  ADD PRIMARY KEY (`worker_id`),
  ADD UNIQUE KEY `aadhar_number` (`aadhar_number`),
  ADD KEY `idx_workers_role` (`worker_role_id`);

--
-- Indexes for table `worker_roles`
--
ALTER TABLE `worker_roles`
  ADD PRIMARY KEY (`worker_role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `billing`
--
ALTER TABLE `billing`
  MODIFY `billing_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `db_audit_log`
--
ALTER TABLE `db_audit_log`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expense_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `expense_categories`
--
ALTER TABLE `expense_categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `financiers`
--
ALTER TABLE `financiers`
  MODIFY `financier_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `interest_payments`
--
ALTER TABLE `interest_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `investors`
--
ALTER TABLE `investors`
  MODIFY `investor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `machines_master`
--
ALTER TABLE `machines_master`
  MODIFY `machine_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `machine_usage`
--
ALTER TABLE `machine_usage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `manpower_usage`
--
ALTER TABLE `manpower_usage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `materials_master`
--
ALTER TABLE `materials_master`
  MODIFY `material_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `material_usage`
--
ALTER TABLE `material_usage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `project_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `project_investments`
--
ALTER TABLE `project_investments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `project_loans`
--
ALTER TABLE `project_loans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `project_progress`
--
ALTER TABLE `project_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `project_team`
--
ALTER TABLE `project_team`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `workers`
--
ALTER TABLE `workers`
  MODIFY `worker_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `worker_roles`
--
ALTER TABLE `worker_roles`
  MODIFY `worker_role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `billing`
--
ALTER TABLE `billing`
  ADD CONSTRAINT `billing_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`),
  ADD CONSTRAINT `billing_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`),
  ADD CONSTRAINT `expenses_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `expense_categories` (`category_id`),
  ADD CONSTRAINT `expenses_ibfk_3` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `interest_payments`
--
ALTER TABLE `interest_payments`
  ADD CONSTRAINT `interest_payments_ibfk_1` FOREIGN KEY (`loan_id`) REFERENCES `project_loans` (`id`),
  ADD CONSTRAINT `interest_payments_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `machine_usage`
--
ALTER TABLE `machine_usage`
  ADD CONSTRAINT `machine_usage_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`),
  ADD CONSTRAINT `machine_usage_ibfk_2` FOREIGN KEY (`machine_id`) REFERENCES `machines_master` (`machine_id`),
  ADD CONSTRAINT `machine_usage_ibfk_3` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `manpower_usage`
--
ALTER TABLE `manpower_usage`
  ADD CONSTRAINT `manpower_usage_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`),
  ADD CONSTRAINT `manpower_usage_ibfk_2` FOREIGN KEY (`worker_id`) REFERENCES `workers` (`worker_id`),
  ADD CONSTRAINT `manpower_usage_ibfk_3` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `material_usage`
--
ALTER TABLE `material_usage`
  ADD CONSTRAINT `material_usage_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`),
  ADD CONSTRAINT `material_usage_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `materials_master` (`material_id`),
  ADD CONSTRAINT `material_usage_ibfk_3` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `project_investments`
--
ALTER TABLE `project_investments`
  ADD CONSTRAINT `project_investments_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`),
  ADD CONSTRAINT `project_investments_ibfk_2` FOREIGN KEY (`investor_id`) REFERENCES `investors` (`investor_id`),
  ADD CONSTRAINT `project_investments_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `project_loans`
--
ALTER TABLE `project_loans`
  ADD CONSTRAINT `project_loans_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`),
  ADD CONSTRAINT `project_loans_ibfk_2` FOREIGN KEY (`financier_id`) REFERENCES `financiers` (`financier_id`),
  ADD CONSTRAINT `project_loans_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `project_progress`
--
ALTER TABLE `project_progress`
  ADD CONSTRAINT `project_progress_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`),
  ADD CONSTRAINT `project_progress_ibfk_2` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `project_team`
--
ALTER TABLE `project_team`
  ADD CONSTRAINT `project_team_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`),
  ADD CONSTRAINT `project_team_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);

--
-- Constraints for table `workers`
--
ALTER TABLE `workers`
  ADD CONSTRAINT `workers_ibfk_1` FOREIGN KEY (`worker_role_id`) REFERENCES `worker_roles` (`worker_role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
