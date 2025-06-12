-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 11, 2025 at 11:46 AM
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
('36208811-8159-4d07-96c2-b0861a8399ef', '399999', '20', '2025-06-11T09:34:22.229Z', '#35610', '2025-06-11 09:34:22', '2025-06-11 09:34:22'),
('3e0704f1-575b-4ece-8adb-c21f5f57cf25', '399999', '20', '2025-06-11T09:32:22.757Z', '#40126', '2025-06-11 09:32:22', '2025-06-11 09:32:22'),
('aa871e5d-72f4-4438-97bc-505e0d8137bc', '0', '', '2025-06-11T09:45:21.880Z', '#24946', '2025-06-11 09:45:21', '2025-06-11 09:45:21'),
('dbcf75b9-6972-4854-b057-01537cccd367', '49999', '30', '2025-06-11T09:36:35.455Z', '#91057', '2025-06-11 09:36:35', '2025-06-11 09:36:35');

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
('90ded041-a9e9-4a0b-b6e0-4bf3f05d2672', 'AN ', 'An entire place', 'An entire place - header', 'An entire place - subheader', '2025-06-11 09:32:22', '2025-06-11 09:32:22');

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
('0bae17c0-1138-4b3f-be4e-7d7a696e2dfe', 'Hà Nội', '2025-06-11 09:34:22', '2025-06-11 09:34:22'),
('f4a194c4-5b56-4c7e-ab3f-7941f5d36152', 'Đà Nẵng', '2025-06-11 09:31:47', '2025-06-11 09:31:47');

-- --------------------------------------------------------

--
-- Table structure for table `contracts`
--

CREATE TABLE `contracts` (
  `id_contract` varchar(255) NOT NULL,
  `room_id` varchar(255) DEFAULT NULL,
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
('69dfd35c-dff8-49bc-be9b-43572b32ba3a', 'Liên Chiểu ', 'f4a194c4-5b56-4c7e-ab3f-7941f5d36152', '2025-06-11 09:45:13', '2025-06-11 09:45:13'),
('ebd3a84e-565c-45ca-840c-b082b28a54a4', 'Hải Châu', '0bae17c0-1138-4b3f-be4e-7d7a696e2dfe', '2025-06-11 09:34:22', '2025-06-11 09:34:22'),
('fcf79546-e477-46b4-bbdb-90af16f59b9b', 'Cẩm Lệ', 'f4a194c4-5b56-4c7e-ab3f-7941f5d36152', '2025-06-11 09:31:47', '2025-06-11 09:31:47');

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
('215f836b-4bed-467f-8346-8ccc0f139b57', 'Tầng 1', '8b6a1600-7380-4d03-9fab-c70303e1fcb9', '2025-06-11 09:31:52', '2025-06-11 09:31:52'),
('3bfcda3f-8e17-484c-b164-eebfbe519abc', 'Tầng 1', '45bd2e95-0f2d-416f-ac33-8e8ae1b4d5fb', '2025-06-11 09:34:22', '2025-06-11 09:34:22'),
('874c9888-6e46-4733-b4af-6dc0f920e6f6', 'Tầng 1', '6d379201-493e-4625-8e3a-604ac26c51b2', '2025-06-11 09:45:21', '2025-06-11 09:45:21'),
('ab5161b7-61ad-413f-b37f-1e4973f7085d', 'Tầng 1', '65f07620-ad14-4ff4-a3bd-dbd93c57df55', '2025-06-11 09:35:08', '2025-06-11 09:35:08');

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
('32a0ddf8-7967-4f31-b380-adf91113049b', 'dcfac278-17be-463c-947c-52e46db27806', '/uploads/1749634462182-barn_cat.jpg', '2025-06-11 09:34:22', '2025-06-11 09:34:22'),
('4062e6fc-9359-4aa6-b9ff-131abf110569', '34f2a4db-e02a-4eec-aa7d-1d1d17946de3', '/uploads/1749634595403-camping_cat.jpg', '2025-06-11 09:36:35', '2025-06-11 09:36:35'),
('f72c8dd2-e730-4443-9a92-ee6a7504b087', 'd78e1bac-7b50-44e9-b51e-1caf072396b7', '/uploads/1749634342726-barn_cat.jpg', '2025-06-11 09:32:22', '2025-06-11 09:32:22');

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
('15d5e5a1-6de9-4547-89f1-91b65098f700', NULL, NULL, NULL, 'Mọi đối tượng', '2025-06-11 09:32:22', '0000-00-00 00:00:00', 'Tin thường', '2025-06-11 09:32:22', '2025-06-11 09:32:22'),
('819c275c-1777-4f6f-93bd-ea9852747e49', NULL, NULL, NULL, 'Mọi đối tượng', '2025-06-11 09:36:35', '0000-00-00 00:00:00', 'Tin thường', '2025-06-11 09:36:35', '2025-06-11 09:36:35'),
('93c438ab-0016-47f9-b766-73d235674536', NULL, NULL, NULL, 'Mọi đối tượng', '2025-06-11 09:34:22', '0000-00-00 00:00:00', 'Tin thường', '2025-06-11 09:34:22', '2025-06-11 09:34:22'),
('e11973a4-cb2c-436f-853d-23875e4e4ef3', NULL, NULL, NULL, 'Mọi đối tượng', '2025-06-11 09:45:21', '0000-00-00 00:00:00', 'Tin thường', '2025-06-11 09:45:21', '2025-06-11 09:45:21');

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
('0cf4cafd-722a-49e1-a2f9-c809a57a6a0d', '', '', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 5, '12 Hoàng Hiệp, Liên Chiểu , Đà Nẵng', 'aa871e5d-72f4-4438-97bc-505e0d8137bc', NULL, 'e11973a4-cb2c-436f-853d-23875e4e4ef3', '69dfd35c-dff8-49bc-be9b-43572b32ba3a', '2025-06-11 09:45:21', '2025-06-11 09:45:21', '6d379201-493e-4625-8e3a-604ac26c51b2', 'b3c167c2-ef8c-4b55-a8f7-f88d1d497a52', '90ded041-a9e9-4a0b-b6e0-4bf3f05d2672'),
('1df4d49c-5504-4744-8525-4e77d1366596', 'abc', 'def', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 5, '100 Lê Quý Đôn, Cẩm Lệ, Đà Nẵng', '3e0704f1-575b-4ece-8adb-c21f5f57cf25', NULL, '15d5e5a1-6de9-4547-89f1-91b65098f700', 'fcf79546-e477-46b4-bbdb-90af16f59b9b', '2025-06-11 09:32:22', '2025-06-11 09:32:22', '8b6a1600-7380-4d03-9fab-c70303e1fcb9', 'd78e1bac-7b50-44e9-b51e-1caf072396b7', '90ded041-a9e9-4a0b-b6e0-4bf3f05d2672'),
('32871cee-1841-44ea-bca4-fe48583f7110', 'abc', 'def', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 5, '25 Lê Thanh Nghị, Hải Châu, Hà Nội', '36208811-8159-4d07-96c2-b0861a8399ef', NULL, '93c438ab-0016-47f9-b766-73d235674536', 'ebd3a84e-565c-45ca-840c-b082b28a54a4', '2025-06-11 09:34:22', '2025-06-11 09:34:22', '45bd2e95-0f2d-416f-ac33-8e8ae1b4d5fb', 'dcfac278-17be-463c-947c-52e46db27806', '90ded041-a9e9-4a0b-b6e0-4bf3f05d2672'),
('ba49448c-988f-4aa9-b84f-74a6e52fdeac', 'yui', 'opl', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 5, '200 Lê Thanh Nghị, Hải Châu, Hà Nội', 'dbcf75b9-6972-4854-b057-01537cccd367', NULL, '819c275c-1777-4f6f-93bd-ea9852747e49', 'ebd3a84e-565c-45ca-840c-b082b28a54a4', '2025-06-11 09:36:35', '2025-06-11 09:36:35', '65f07620-ad14-4ff4-a3bd-dbd93c57df55', '34f2a4db-e02a-4eec-aa7d-1d1d17946de3', '90ded041-a9e9-4a0b-b6e0-4bf3f05d2672');

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
('45bd2e95-0f2d-416f-ac33-8e8ae1b4d5fb', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 'Dãy B', 'fcf79546-e477-46b4-bbdb-90af16f59b9b', '100 Lê Quý Đôn', 'f4a194c4-5b56-4c7e-ab3f-7941f5d36152', NULL, '2025-06-11 09:34:06', '2025-06-11 09:34:06', NULL),
('65f07620-ad14-4ff4-a3bd-dbd93c57df55', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 'Dãy C', 'ebd3a84e-565c-45ca-840c-b082b28a54a4', '200 Lê Thanh Nghị', '0bae17c0-1138-4b3f-be4e-7d7a696e2dfe', NULL, '2025-06-11 09:35:02', '2025-06-11 09:35:02', NULL),
('6d379201-493e-4625-8e3a-604ac26c51b2', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 'Dãy D', '69dfd35c-dff8-49bc-be9b-43572b32ba3a', '12 Hoàng Hiệp', 'f4a194c4-5b56-4c7e-ab3f-7941f5d36152', NULL, '2025-06-11 09:45:13', '2025-06-11 09:45:13', NULL),
('8b6a1600-7380-4d03-9fab-c70303e1fcb9', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 'Dãy A', 'fcf79546-e477-46b4-bbdb-90af16f59b9b', '100 Lê Quý Đôn', 'f4a194c4-5b56-4c7e-ab3f-7941f5d36152', NULL, '2025-06-11 09:31:47', '2025-06-11 09:31:47', NULL);

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
('34f2a4db-e02a-4eec-aa7d-1d1d17946de3', '65f07620-ad14-4ff4-a3bd-dbd93c57df55', 1, 'opl', '2025-06-11 09:36:35', '2025-06-11 09:36:35', 1, 2, 2, '90ded041-a9e9-4a0b-b6e0-4bf3f05d2672', '201-205', '[\"Air Conditioning\",\"Security cameras\"]', 'ab5161b7-61ad-413f-b37f-1e4973f7085d'),
('b3c167c2-ef8c-4b55-a8f7-f88d1d497a52', '6d379201-493e-4625-8e3a-604ac26c51b2', 1, '', '2025-06-11 09:45:21', '2025-06-11 09:45:21', 1, 1, 1, '90ded041-a9e9-4a0b-b6e0-4bf3f05d2672', 'A105', NULL, NULL),
('d78e1bac-7b50-44e9-b51e-1caf072396b7', '8b6a1600-7380-4d03-9fab-c70303e1fcb9', 2, 'def', '2025-06-11 09:32:22', '2025-06-11 09:32:22', 2, 1, 1, '90ded041-a9e9-4a0b-b6e0-4bf3f05d2672', '101-110', '[\"Washer\",\"Dryer\"]', '215f836b-4bed-467f-8346-8ccc0f139b57'),
('dcfac278-17be-463c-947c-52e46db27806', '45bd2e95-0f2d-416f-ac33-8e8ae1b4d5fb', 2, 'def', '2025-06-11 09:34:22', '2025-06-11 09:34:22', 2, 1, 1, '90ded041-a9e9-4a0b-b6e0-4bf3f05d2672', '101-110', '[\"Washer\",\"Dryer\"]', NULL);

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
('0e442e79-2c1d-4cdf-b61e-69354771acfd', 'dcfac278-17be-463c-947c-52e46db27806', '101', 'available', '2025-06-11 09:34:22', '2025-06-11 09:34:22'),
('15778487-9796-43a9-a908-9a8364eb5e74', 'dcfac278-17be-463c-947c-52e46db27806', '106', 'available', '2025-06-11 09:34:22', '2025-06-11 09:34:22'),
('1e7dc430-fa70-454c-a684-53ba95e54ce5', '34f2a4db-e02a-4eec-aa7d-1d1d17946de3', '203', 'available', '2025-06-11 09:36:35', '2025-06-11 09:36:35'),
('2a5c1521-c4c4-4d9f-bc98-a66ca359bcdd', 'd78e1bac-7b50-44e9-b51e-1caf072396b7', '102', 'available', '2025-06-11 09:32:22', '2025-06-11 09:32:22'),
('2f1c5b3e-72a5-4af6-88ff-01b9d65db7ac', '34f2a4db-e02a-4eec-aa7d-1d1d17946de3', '201', 'available', '2025-06-11 09:36:35', '2025-06-11 09:36:35'),
('38e9e256-63f9-4cd5-8aaa-dd7993fb17ae', 'd78e1bac-7b50-44e9-b51e-1caf072396b7', '110', 'available', '2025-06-11 09:32:22', '2025-06-11 09:32:22'),
('4601af25-53e5-46ba-af2e-a3e3d15c6d41', 'd78e1bac-7b50-44e9-b51e-1caf072396b7', '106', 'available', '2025-06-11 09:32:22', '2025-06-11 09:32:22'),
('5cb299f6-66ba-4301-acb6-3d3edcf4d6d2', 'dcfac278-17be-463c-947c-52e46db27806', '102', 'available', '2025-06-11 09:34:22', '2025-06-11 09:34:22'),
('61d00c37-8d4e-4413-b621-2f2d1b727cb6', 'b3c167c2-ef8c-4b55-a8f7-f88d1d497a52', 'A105', 'available', '2025-06-11 09:45:21', '2025-06-11 09:45:21'),
('85d71095-87ac-4c51-ac90-44ee3d7cfb55', '34f2a4db-e02a-4eec-aa7d-1d1d17946de3', '205', 'available', '2025-06-11 09:36:35', '2025-06-11 09:36:35'),
('92c137da-d38e-465c-a951-fbf8100387a9', 'dcfac278-17be-463c-947c-52e46db27806', '109', 'available', '2025-06-11 09:34:22', '2025-06-11 09:34:22'),
('94b94f20-c837-4a7f-ba7e-d17b16a28a87', 'dcfac278-17be-463c-947c-52e46db27806', '107', 'available', '2025-06-11 09:34:22', '2025-06-11 09:34:22'),
('987192ba-4e90-4dc8-9c6b-14eeffcf175d', 'd78e1bac-7b50-44e9-b51e-1caf072396b7', '104', 'available', '2025-06-11 09:32:22', '2025-06-11 09:32:22'),
('9979b4f1-fb28-4d5c-85d6-9b94b1351170', 'dcfac278-17be-463c-947c-52e46db27806', '103', 'available', '2025-06-11 09:34:22', '2025-06-11 09:34:22'),
('9a6e18c2-5e3f-47d8-81f6-44d8a7697f77', 'dcfac278-17be-463c-947c-52e46db27806', '105', 'available', '2025-06-11 09:34:22', '2025-06-11 09:34:22'),
('af0d4304-5de4-4dfc-bf97-3cdce1b20a0c', 'd78e1bac-7b50-44e9-b51e-1caf072396b7', '107', 'available', '2025-06-11 09:32:22', '2025-06-11 09:32:22'),
('c5b1aecf-3499-421b-b28c-37db37625a17', '34f2a4db-e02a-4eec-aa7d-1d1d17946de3', '204', 'available', '2025-06-11 09:36:35', '2025-06-11 09:36:35'),
('e5703ee8-14e6-49b7-acae-54a0a76a1254', 'd78e1bac-7b50-44e9-b51e-1caf072396b7', '108', 'available', '2025-06-11 09:32:22', '2025-06-11 09:32:22'),
('e73e0aec-c52f-4056-822f-d32b35e84630', 'd78e1bac-7b50-44e9-b51e-1caf072396b7', '105', 'available', '2025-06-11 09:32:22', '2025-06-11 09:32:22'),
('eb59a83c-2fcc-4a50-992a-bd59273e7f25', '34f2a4db-e02a-4eec-aa7d-1d1d17946de3', '202', 'available', '2025-06-11 09:36:35', '2025-06-11 09:36:35'),
('edd5ebf7-f07b-44ee-bf16-aeefd5ea7553', 'dcfac278-17be-463c-947c-52e46db27806', '110', 'available', '2025-06-11 09:34:22', '2025-06-11 09:34:22'),
('ede26dfc-d0e7-4701-8672-5db6037759b2', 'd78e1bac-7b50-44e9-b51e-1caf072396b7', '101', 'available', '2025-06-11 09:32:22', '2025-06-11 09:32:22'),
('f77c0368-04f6-416f-be56-d9976f5bc8ce', 'd78e1bac-7b50-44e9-b51e-1caf072396b7', '109', 'available', '2025-06-11 09:32:22', '2025-06-11 09:32:22'),
('f7ce44c4-730c-4012-b106-3bb572ae5981', 'dcfac278-17be-463c-947c-52e46db27806', '104', 'available', '2025-06-11 09:34:22', '2025-06-11 09:34:22'),
('f8c18963-65ee-42f7-b2c2-23264fad00d3', 'd78e1bac-7b50-44e9-b51e-1caf072396b7', '103', 'available', '2025-06-11 09:32:22', '2025-06-11 09:32:22'),
('ffb195bd-ec2f-43b1-bf94-d8e6e972c421', 'dcfac278-17be-463c-947c-52e46db27806', '108', 'available', '2025-06-11 09:34:22', '2025-06-11 09:34:22');

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
  ADD KEY `room_id` (`room_id`),
  ADD KEY `tenant_id` (`tenant_id`);

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
  ADD CONSTRAINT `contracts_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id_room`),
  ADD CONSTRAINT `contracts_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id_user`);

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
