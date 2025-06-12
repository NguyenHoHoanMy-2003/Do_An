-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 12, 2025 at 07:17 AM
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
-- Database: `phongtro123`
--

-- --------------------------------------------------------

--
-- Table structure for table `attributes`
--

CREATE TABLE `attributes` (
  `id` varchar(255) NOT NULL,
  `price` varchar(255) DEFAULT NULL,
  `acreage` varchar(255) DEFAULT NULL,
  `published` varchar(255) DEFAULT NULL,
  `hashtag` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attributes`
--

INSERT INTO `attributes` (`id`, `price`, `acreage`, `published`, `hashtag`, `created_at`, `updated_at`) VALUES
('00ca3a7d-0d5d-446b-a06d-beac6ca9e909', '49999', '20', '2025-06-12T05:14:58.153Z', '#50669', '2025-06-12 05:14:58', '2025-06-12 05:14:58'),
('9998f90e-915c-444c-9573-d3d3a36ee921', '5400000', '40', '2025-06-11T10:50:11.590Z', '#13213', '2025-06-11 10:50:11', '2025-06-11 10:50:11'),
('e701256b-1344-46c2-9576-4fab2b3a04eb', '0', '', '2025-06-12T05:13:12.794Z', '#68864', '2025-06-12 05:13:12', '2025-06-12 05:13:12');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `header` varchar(255) DEFAULT NULL,
  `subheader` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `code`, `value`, `header`, `subheader`, `created_at`, `updated_at`) VALUES
('6133ff28-e418-4f8e-a9b6-31962218abce', 'AN ', 'An entire place', 'An entire place - header', 'An entire place - subheader', '2025-06-12 05:13:04', '2025-06-12 05:13:04'),
('f5f87feb-2774-4669-9e12-c4ebeddf3986', 'A S', 'A Shared Room', 'A Shared Room - header', 'A Shared Room - subheader', '2025-06-11 10:50:11', '2025-06-11 10:50:11');

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cities`
--

INSERT INTO `cities` (`id`, `name`, `created_at`, `updated_at`) VALUES
('6fbd9d00-7038-43f6-96de-d8ffe3e089d6', 'Đà Nẵng', '2025-06-11 10:48:54', '2025-06-11 10:48:54');

-- --------------------------------------------------------

--
-- Table structure for table `contracts`
--

CREATE TABLE `contracts` (
  `id_contract` varchar(255) NOT NULL,
  `subroom_id` varchar(255) NOT NULL,
  `tenant_id` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('pending','approved','cancelled','terminated') DEFAULT 'pending',
  `giaThue` float DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `districts`
--

CREATE TABLE `districts` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `city_id` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `districts`
--

INSERT INTO `districts` (`id`, `name`, `city_id`, `created_at`, `updated_at`) VALUES
('35fa5545-ea19-43df-bfd0-3f8054852768', 'Hải Châu', '6fbd9d00-7038-43f6-96de-d8ffe3e089d6', '2025-06-11 10:48:54', '2025-06-11 10:48:54'),
('445ac09a-2926-48c5-ac30-1acebc9c677f', 'Đà lạt', '6fbd9d00-7038-43f6-96de-d8ffe3e089d6', '2025-06-12 05:13:04', '2025-06-12 05:13:04');

-- --------------------------------------------------------

--
-- Table structure for table `floors`
--

CREATE TABLE `floors` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `property_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `floors`
--

INSERT INTO `floors` (`id`, `name`, `property_id`, `created_at`, `updated_at`) VALUES
('748efaeb-4a1f-4ef4-b715-1f679fa32240', 'Tầng 1', '86ef4dc0-9f26-4dfa-9c56-d821d7a2e82c', '2025-06-11 10:48:59', '2025-06-11 10:48:59');

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `id` varchar(255) NOT NULL,
  `room_id` varchar(255) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`id`, `room_id`, `image_url`, `created_at`, `updated_at`) VALUES
('37f0f05d-6630-4b3c-954b-2b4a8a6ac1dd', '4b78f238-f6b7-4540-9351-0de040d31f9b', '/uploads/1749639011546-camping_cat.jpg', '2025-06-11 10:50:11', '2025-06-11 10:50:11'),
('727ffec4-984c-4147-8cf4-523cd64580bb', '2aa6bc02-bec5-46f7-b673-58639acb8593', '/uploads/1749705298096-barn_cat.jpg', '2025-06-12 05:14:58', '2025-06-12 05:14:58');

-- --------------------------------------------------------

--
-- Table structure for table `labels`
--

CREATE TABLE `labels` (
  `id` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `overviews`
--

CREATE TABLE `overviews` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `target` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `expire` datetime DEFAULT NULL,
  `bonus` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `overviews`
--

INSERT INTO `overviews` (`id`, `code`, `area`, `type`, `target`, `created`, `expire`, `bonus`, `created_at`, `updated_at`) VALUES
('3488a77a-d600-4336-9912-54477265f404', NULL, NULL, NULL, 'Mọi đối tượng', '2025-06-11 10:50:11', '0000-00-00 00:00:00', 'Tin thường', '2025-06-11 10:50:11', '2025-06-11 10:50:11'),
('89b15a4f-c56a-4519-8fb6-e55b861e8684', NULL, NULL, NULL, 'Mọi đối tượng', '2025-06-12 05:13:12', '0000-00-00 00:00:00', 'Tin thường', '2025-06-12 05:13:12', '2025-06-12 05:13:12'),
('dfcedcfa-8dd6-481e-9898-bf6a6b93bae3', NULL, NULL, NULL, 'Mọi đối tượng', '2025-06-12 05:14:58', '0000-00-00 00:00:00', 'Tin thường', '2025-06-12 05:14:58', '2025-06-12 05:14:58');

-- --------------------------------------------------------

--
-- Table structure for table `payments_history`
--

CREATE TABLE `payments_history` (
  `id_payment` varchar(255) NOT NULL,
  `invoice_id` varchar(255) DEFAULT NULL,
  `contract_id` varchar(255) DEFAULT NULL,
  `amount_total` float DEFAULT NULL,
  `method` enum('cash','bank_transfer','momo','zalo_pay') DEFAULT 'cash',
  `payment_date` date DEFAULT NULL,
  `status` enum('pending','paid','failed') DEFAULT 'pending',
  `type` enum('deposit','rent') DEFAULT 'rent',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id_post` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `star` int(11) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `attributes_id` varchar(255) DEFAULT NULL,
  `label_id` varchar(255) DEFAULT NULL,
  `overview_id` varchar(255) DEFAULT NULL,
  `district_id` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `property_id` varchar(255) DEFAULT NULL,
  `room_id` varchar(255) DEFAULT NULL,
  `category_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id_post`, `title`, `description`, `user_id`, `star`, `address`, `attributes_id`, `label_id`, `overview_id`, `district_id`, `created_at`, `updated_at`, `property_id`, `room_id`, `category_id`) VALUES
('35f70c9f-577c-4c96-a2be-77833da2c1c3', '', '', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 5, '11 Thái Thị Bôi, Đà lạt, Đà Nẵng', 'e701256b-1344-46c2-9576-4fab2b3a04eb', NULL, '89b15a4f-c56a-4519-8fb6-e55b861e8684', '445ac09a-2926-48c5-ac30-1acebc9c677f', '2025-06-12 05:13:12', '2025-06-12 05:13:12', '4dd84868-9034-48b6-a64a-a4e98f3a2824', NULL, '6133ff28-e418-4f8e-a9b6-31962218abce'),
('45c9acac-1eea-4665-b727-c89785839bd8', 'adadad', 'bbbbbb', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 5, '1000 Lê Thanh Nghị, Hải Châu, Đà Nẵng', '9998f90e-915c-444c-9573-d3d3a36ee921', NULL, '3488a77a-d600-4336-9912-54477265f404', '35fa5545-ea19-43df-bfd0-3f8054852768', '2025-06-11 10:50:11', '2025-06-11 10:50:11', '86ef4dc0-9f26-4dfa-9c56-d821d7a2e82c', '4b78f238-f6b7-4540-9351-0de040d31f9b', 'f5f87feb-2774-4669-9e12-c4ebeddf3986'),
('5fd02ac9-c083-44b1-a4aa-b49b890c97df', 'Quá ngon quá rẻ', 'Ngon lắm', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 5, '11 Thái Thị Bôi, Đà lạt, Đà Nẵng', '00ca3a7d-0d5d-446b-a06d-beac6ca9e909', NULL, 'dfcedcfa-8dd6-481e-9898-bf6a6b93bae3', '445ac09a-2926-48c5-ac30-1acebc9c677f', '2025-06-12 05:14:58', '2025-06-12 05:14:58', '4dd84868-9034-48b6-a64a-a4e98f3a2824', '2aa6bc02-bec5-46f7-b673-58639acb8593', '6133ff28-e418-4f8e-a9b6-31962218abce');

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

CREATE TABLE `properties` (
  `id_property` varchar(255) NOT NULL,
  `host_id` varchar(255) DEFAULT NULL,
  `name_bd` varchar(255) NOT NULL,
  `district_id` varchar(255) DEFAULT NULL,
  `street_address` varchar(255) DEFAULT NULL,
  `city_id` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `properties`
--

INSERT INTO `properties` (`id_property`, `host_id`, `name_bd`, `district_id`, `street_address`, `city_id`, `description`, `created_at`, `updated_at`, `category_id`) VALUES
('4dd84868-9034-48b6-a64a-a4e98f3a2824', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 'Dãy B', '445ac09a-2926-48c5-ac30-1acebc9c677f', '11 Thái Thị Bôi', '6fbd9d00-7038-43f6-96de-d8ffe3e089d6', NULL, '2025-06-12 05:13:04', '2025-06-12 05:13:04', NULL),
('86ef4dc0-9f26-4dfa-9c56-d821d7a2e82c', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 'Dãy A', '35fa5545-ea19-43df-bfd0-3f8054852768', '1000 Lê Thanh Nghị', '6fbd9d00-7038-43f6-96de-d8ffe3e089d6', NULL, '2025-06-11 10:48:54', '2025-06-11 10:48:54', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `rental_invoices`
--

CREATE TABLE `rental_invoices` (
  `id_invoice` varchar(255) NOT NULL,
  `room_id` varchar(255) DEFAULT NULL,
  `tenant_id` varchar(255) DEFAULT NULL,
  `billing_month` date DEFAULT NULL,
  `room_fee` float DEFAULT NULL,
  `service_fee` float DEFAULT NULL,
  `electricity_bill` float DEFAULT NULL,
  `water_bill` float DEFAULT NULL,
  `total_amount` float DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id_room` varchar(255) NOT NULL,
  `property_id` varchar(255) DEFAULT NULL,
  `num_tenant` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bedroom_count` int(11) DEFAULT NULL,
  `bed_count` int(11) DEFAULT NULL,
  `bathroom_count` int(11) DEFAULT NULL,
  `category_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `amenities` text DEFAULT NULL,
  `floor_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id_room`, `property_id`, `num_tenant`, `description`, `created_at`, `updated_at`, `bedroom_count`, `bed_count`, `bathroom_count`, `category_id`, `name`, `amenities`, `floor_id`) VALUES
('2aa6bc02-bec5-46f7-b673-58639acb8593', '4dd84868-9034-48b6-a64a-a4e98f3a2824', 2, 'Ngon lắm', '2025-06-12 05:14:58', '2025-06-12 05:14:58', 2, 1, 1, '6133ff28-e418-4f8e-a9b6-31962218abce', '120-125', '[\"Dryer\",\"TV\",\"Air Conditioning\"]', NULL),
('4b78f238-f6b7-4540-9351-0de040d31f9b', '86ef4dc0-9f26-4dfa-9c56-d821d7a2e82c', 2, 'bbbbbb', '2025-06-11 10:50:11', '2025-06-11 10:50:11', 2, 1, 1, 'f5f87feb-2774-4669-9e12-c4ebeddf3986', '101-110', '[\"Fire extinguisher\",\"First Aid\",\"TV\",\"Dryer\"]', '748efaeb-4a1f-4ef4-b715-1f679fa32240');

-- --------------------------------------------------------

--
-- Table structure for table `sub_rooms`
--

CREATE TABLE `sub_rooms` (
  `id` varchar(255) NOT NULL,
  `room_id` varchar(255) NOT NULL,
  `name` varchar(50) NOT NULL,
  `status` enum('available','occupied','pending','disabled') DEFAULT 'available',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sub_rooms`
--

INSERT INTO `sub_rooms` (`id`, `room_id`, `name`, `status`, `created_at`, `updated_at`) VALUES
('041c87c9-7a7d-4c26-a6be-8178aefdda53', '4b78f238-f6b7-4540-9351-0de040d31f9b', '110', 'available', '2025-06-11 10:50:11', '2025-06-11 10:50:11'),
('09aaedc1-106d-4e72-8305-9b33da46e07e', '2aa6bc02-bec5-46f7-b673-58639acb8593', '123', 'available', '2025-06-12 05:14:58', '2025-06-12 05:14:58'),
('0c3d7041-5ba4-40fc-9d64-ee1ff0029b71', '4b78f238-f6b7-4540-9351-0de040d31f9b', '108', 'available', '2025-06-11 10:50:11', '2025-06-11 10:50:11'),
('2d432489-9718-410e-9ecd-ef693b446786', '4b78f238-f6b7-4540-9351-0de040d31f9b', '106', 'available', '2025-06-11 10:50:11', '2025-06-11 10:50:11'),
('46351562-04ba-4e8f-817b-eb10f7d0cdf3', '2aa6bc02-bec5-46f7-b673-58639acb8593', '124', 'available', '2025-06-12 05:14:58', '2025-06-12 05:14:58'),
('5bf23469-8f53-4f9a-93b7-e9ba77d4b496', '2aa6bc02-bec5-46f7-b673-58639acb8593', '125', 'available', '2025-06-12 05:14:58', '2025-06-12 05:14:58'),
('6e9775ff-7938-43d1-a9fa-89695f07fb95', '2aa6bc02-bec5-46f7-b673-58639acb8593', '122', 'available', '2025-06-12 05:14:58', '2025-06-12 05:14:58'),
('82d5ff99-91e8-4d7c-9867-256dc8b69310', '4b78f238-f6b7-4540-9351-0de040d31f9b', '107', 'available', '2025-06-11 10:50:11', '2025-06-11 10:50:11'),
('850939db-f777-4ec0-890f-0ed6fe0d3901', '4b78f238-f6b7-4540-9351-0de040d31f9b', '101', 'available', '2025-06-11 10:50:11', '2025-06-11 10:50:11'),
('aff0a1bd-d625-4350-809c-09eff3b4fedb', '4b78f238-f6b7-4540-9351-0de040d31f9b', '103', 'available', '2025-06-11 10:50:11', '2025-06-11 10:50:11'),
('c7a09b26-a2a1-46af-a5e8-92ac870e8eef', '4b78f238-f6b7-4540-9351-0de040d31f9b', '104', 'available', '2025-06-11 10:50:11', '2025-06-11 10:50:11'),
('ca7b9457-0e52-4bbc-8ea0-849d4634fc55', '4b78f238-f6b7-4540-9351-0de040d31f9b', '105', 'available', '2025-06-11 10:50:11', '2025-06-11 10:50:11'),
('ca90740c-6414-4124-8a05-8c8cee599a97', '4b78f238-f6b7-4540-9351-0de040d31f9b', '102', 'available', '2025-06-11 10:50:11', '2025-06-11 10:50:11'),
('e7934b3f-5672-4c11-b8c4-cf670c21dc6e', '4b78f238-f6b7-4540-9351-0de040d31f9b', '109', 'available', '2025-06-11 10:50:11', '2025-06-11 10:50:11'),
('f07c6cc3-253b-4c2e-ac7a-aa73b7d461ae', '2aa6bc02-bec5-46f7-b673-58639acb8593', '121', 'available', '2025-06-12 05:14:58', '2025-06-12 05:14:58'),
('f8c71b3e-fd3b-45c0-a2d9-443a9e30b67a', '2aa6bc02-bec5-46f7-b673-58639acb8593', '120', 'available', '2025-06-12 05:14:58', '2025-06-12 05:14:58');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `role` enum('admin','host','renter') DEFAULT 'renter',
  `date_of_birth` date DEFAULT NULL,
  `gender` varchar(5) DEFAULT NULL,
  `date_of_issue` date DEFAULT NULL,
  `place_of_issue` varchar(100) DEFAULT NULL,
  `permanent_address` text DEFAULT NULL,
  `national_id` varchar(20) DEFAULT NULL,
  `created_by` varchar(36) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `name`, `email`, `password`, `phone`, `role`, `date_of_birth`, `gender`, `date_of_issue`, `place_of_issue`, `permanent_address`, `national_id`, `created_by`, `status`, `created_at`, `updated_at`) VALUES
('051186ec-ab47-4292-ac10-527cc7895960', 'Nguyễn Anh Văn2', 'nguyenhohoanmy@gmail.com', 'anhmydep123', '0387204209', 'renter', '2025-06-04', 'Nam', '2025-06-04', 'Đà Nẵng', '100 Lê Thanh Nghị', '123456789101', NULL, 'active', '2025-06-11 11:25:53', '2025-06-11 14:48:01'),
('1f58b09a-1fe8-4dcf-a2f8-82b65965b91b', 'Nguyễn Đức Minh Khôi', NULL, 'anhcumy12345', '0387204208', 'renter', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-06-10 08:13:05', '2025-06-10 08:13:05'),
('617e7775-596f-44d0-ac75-219b3637c911', 'Nguyễn Anh Văn', NULL, 'anhmydep123', '0935404352', 'renter', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-06-08 09:03:53', '2025-06-08 09:03:53'),
('9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 'Nguyễn Hồ Hoàn Mỹ', NULL, 'anhcumy123', '0774455916', 'host', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2025-05-20 14:19:32', '2025-05-20 14:19:32');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attributes`
--
ALTER TABLE `attributes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `contracts`
--
ALTER TABLE `contracts`
  ADD PRIMARY KEY (`id_contract`),
  ADD KEY `tenant_id` (`tenant_id`),
  ADD KEY `subroom_id` (`subroom_id`);

--
-- Indexes for table `districts`
--
ALTER TABLE `districts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `city_id` (`city_id`);

--
-- Indexes for table `floors`
--
ALTER TABLE `floors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `floors_ibfk_1` (`property_id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `labels`
--
ALTER TABLE `labels`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `overviews`
--
ALTER TABLE `overviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments_history`
--
ALTER TABLE `payments_history`
  ADD PRIMARY KEY (`id_payment`),
  ADD KEY `invoice_id` (`invoice_id`),
  ADD KEY `contract_id` (`contract_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id_post`),
  ADD KEY `posts_propertyId_foreign_idx` (`property_id`),
  ADD KEY `posts_roomId_foreign_idx` (`room_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `overview_id` (`overview_id`),
  ADD KEY `attributes_id` (`attributes_id`),
  ADD KEY `district_id` (`district_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id_property`),
  ADD KEY `host_id` (`host_id`),
  ADD KEY `district_id` (`district_id`),
  ADD KEY `properties_category_id_foreign_idx` (`category_id`),
  ADD KEY `city_id` (`city_id`);

--
-- Indexes for table `rental_invoices`
--
ALTER TABLE `rental_invoices`
  ADD PRIMARY KEY (`id_invoice`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `tenant_id` (`tenant_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id_room`),
  ADD KEY `rooms_category_id_foreign_idx` (`category_id`),
  ADD KEY `rooms_ibfk_1` (`property_id`),
  ADD KEY `fk_rooms_floors` (`floor_id`);

--
-- Indexes for table `sub_rooms`
--
ALTER TABLE `sub_rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_room_id` (`room_id`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `national_id` (`national_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contracts`
--
ALTER TABLE `contracts`
  ADD CONSTRAINT `contracts_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id_user`),
  ADD CONSTRAINT `contracts_ibfk_3` FOREIGN KEY (`subroom_id`) REFERENCES `sub_rooms` (`id`);

--
-- Constraints for table `districts`
--
ALTER TABLE `districts`
  ADD CONSTRAINT `districts_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`);

--
-- Constraints for table `floors`
--
ALTER TABLE `floors`
  ADD CONSTRAINT `floors_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id_property`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `images`
--
ALTER TABLE `images`
  ADD CONSTRAINT `images_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id_room`);

--
-- Constraints for table `payments_history`
--
ALTER TABLE `payments_history`
  ADD CONSTRAINT `payments_history_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `rental_invoices` (`id_invoice`),
  ADD CONSTRAINT `payments_history_ibfk_2` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id_contract`);

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id_user`),
  ADD CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`overview_id`) REFERENCES `overviews` (`id`),
  ADD CONSTRAINT `posts_ibfk_3` FOREIGN KEY (`attributes_id`) REFERENCES `attributes` (`id`),
  ADD CONSTRAINT `posts_ibfk_4` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`),
  ADD CONSTRAINT `posts_ibfk_6` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `posts_propertyId_foreign_idx` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id_property`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `posts_roomId_foreign_idx` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id_room`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `properties`
--
ALTER TABLE `properties`
  ADD CONSTRAINT `properties_category_id_foreign_idx` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `properties_ibfk_1` FOREIGN KEY (`host_id`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `properties_ibfk_2` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`),
  ADD CONSTRAINT `properties_ibfk_3` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`);

--
-- Constraints for table `rental_invoices`
--
ALTER TABLE `rental_invoices`
  ADD CONSTRAINT `rental_invoices_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id_room`),
  ADD CONSTRAINT `rental_invoices_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id_user`);

--
-- Constraints for table `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `fk_rooms_floors` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rooms_category_id_foreign_idx` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id_property`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sub_rooms`
--
ALTER TABLE `sub_rooms`
  ADD CONSTRAINT `sub_rooms_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id_room`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
