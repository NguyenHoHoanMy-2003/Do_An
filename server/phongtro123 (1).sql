-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 06, 2025 at 09:36 AM
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
('22564836-cc4c-49eb-acee-5db9db6c111f', '500000', '40', '2025-06-06T07:12:07.104Z', '#67851', '2025-06-06 07:12:07', '2025-06-06 07:12:07'),
('22587dff-6188-446e-846f-5bd1faad226d', '20', '60', '2025-05-20T16:47:49.825Z', '#82710', '2025-05-20 16:47:49', '2025-05-20 16:47:49'),
('369b11c0-ce36-4eb8-9110-ee558c092987', '500000', '20', '2025-05-20T15:56:55.046Z', '#45684', '2025-05-20 15:56:55', '2025-05-20 15:56:55'),
('5909997e-04b3-4d1c-9234-6f90c4ee56b5', '0', '', '2025-05-20T16:40:20.160Z', '#37290', '2025-05-20 16:40:20', '2025-05-20 16:40:20'),
('80d4123b-7204-47c4-b8ec-08519d836da2', '399999', '40', '2025-05-20T16:37:17.700Z', '#83226', '2025-05-20 16:37:17', '2025-05-20 16:37:17'),
('8eff005d-1f22-46bb-8a78-5d847ecceb9e', '2000', '50', '2025-05-20T16:41:00.890Z', '#40994', '2025-05-20 16:41:00', '2025-05-20 16:41:00'),
('fe6d094b-d09b-4887-b50c-573530cc35af', '399999', '40', '2025-05-20T16:37:00.777Z', '#27354', '2025-05-20 16:37:00', '2025-05-20 16:37:00');

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
('19cbd250-cd4b-4418-953a-d7140c1e3d0b', 'AN ', 'An entire place', 'An entire place - header', 'An entire place - subheader', '2025-05-20 15:56:54', '2025-05-20 15:56:54'),
('5f16e10f-906b-4ffb-a732-d04875287006', 'A S', 'A Shared Room', 'A Shared Room - header', 'A Shared Room - subheader', '2025-05-20 16:40:07', '2025-05-20 16:40:07'),
('c0a5c443-2769-4e6d-86d0-e413aa6d71cb', 'MIN', 'Mini Apartment', 'Mini Apartment - header', 'Mini Apartment - subheader', '2025-05-20 16:37:00', '2025-05-20 16:37:00'),
('d66cf9f0-1a32-4e22-b77c-c218aa68b4d2', '', '', ' - header', ' - subheader', '2025-05-20 16:47:49', '2025-05-20 16:47:49');

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
('3e976a4e-1848-4ecd-abf3-fd655c705c70', 'Đà Nẵng', '2025-05-20 15:46:20', '2025-05-20 15:46:20'),
('a664c85c-ff4a-413f-ade7-250f6b0444d3', 'Sài Gòn ', '2025-05-20 16:36:19', '2025-05-20 16:36:19'),
('dd8cce70-4a4b-4d56-b88e-32d4589d0905', 'Hà Nội', '2025-06-06 07:10:54', '2025-06-06 07:10:54');

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
('35173ddb-2876-43bc-b222-63c45d45b7da', 'Liên Chiểu ', '3e976a4e-1848-4ecd-abf3-fd655c705c70', '2025-05-20 16:40:07', '2025-05-20 16:40:07'),
('8e885c41-dc8e-4f38-8c57-3c85eddc7402', '30 Nguyễn Trãi', 'dd8cce70-4a4b-4d56-b88e-32d4589d0905', '2025-06-06 07:10:54', '2025-06-06 07:10:54'),
('99aa7a1f-95b9-400d-af00-2b2fdc09679f', 'Hải Châu', 'a664c85c-ff4a-413f-ade7-250f6b0444d3', '2025-05-20 16:36:19', '2025-05-20 16:36:19'),
('ea6586e4-a628-461c-a26a-e4f1fe730544', 'Cẩm Lệ', '3e976a4e-1848-4ecd-abf3-fd655c705c70', '2025-05-20 15:46:21', '2025-05-20 15:46:21');

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
('45d49583-4f96-4d51-b2ee-e534630750e8', 'Tầng 1', '56b04cb2-791e-45aa-af8a-647d7248274c', '2025-05-20 15:56:34', '2025-05-20 15:56:34'),
('52199782-2a6b-4551-98ad-f4302afc8336', 'Tầng 2', '0688a673-2e2a-4e60-867c-6427f5969a2f', '2025-05-20 16:40:20', '2025-05-20 16:40:20'),
('567f28d5-5924-4d5e-8bf3-c4e159b990c2', 'Tầng 1', 'b2fd1815-0e7e-4e20-bfa4-18fc25fa8237', '2025-06-06 07:11:04', '2025-06-06 07:11:04'),
('bffd8dd5-ee01-42d2-a20b-d6ba6ba8e25e', 'Tầng 1', '471b1da5-f2e5-4d98-93f0-f38673f67c2c', '2025-05-20 16:36:24', '2025-05-20 16:36:24'),
('dd0f8fb4-7d14-4e2f-8986-b2c1f25c5fc9', 'Tầng 2', '56b04cb2-791e-45aa-af8a-647d7248274c', '2025-05-20 16:46:57', '2025-05-20 16:46:57');

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
('092bfe32-2ef2-4dae-9ded-6179173c7110', 'a66799cd-883b-49c0-9c38-357c2cc01e57', '/uploads/1747759260871-denny.jpeg', '2025-05-20 16:41:00', '2025-05-20 16:41:00'),
('36103bad-b322-4b10-89fd-ada8075de104', 'b09a9942-833c-4fe0-967a-72c8b8aa2d7b', '/uploads/1749193927060-conchongu.png', '2025-06-06 07:12:07', '2025-06-06 07:12:07'),
('da4debc1-1db1-4fc6-a846-02fae15e875d', 'b9b974b5-03be-4cb5-a125-ecad001f2eda', '/uploads/1747759020705-pool_cat.jpg', '2025-05-20 16:37:00', '2025-05-20 16:37:00'),
('db74b05b-26a4-467a-bf13-2bb04770ff24', '690443ca-3a57-4a9a-906c-102f1bf13396', '/uploads/1747756614923-barn_cat.jpg', '2025-05-20 15:56:55', '2025-05-20 15:56:55'),
('dd4bfaf8-ce95-4a8f-87b5-ac0f1f13539b', 'b987e988-888f-45a2-ade8-95e49abddd46', '/uploads/1747759669781-cave_cat.jpg', '2025-05-20 16:47:49', '2025-05-20 16:47:49');

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
('02b8af01-5f92-41ab-aa52-ed6eed3fa10b', NULL, NULL, NULL, 'Mọi đối tượng', '2025-05-20 15:56:55', '0000-00-00 00:00:00', 'Tin thường', '2025-05-20 15:56:55', '2025-05-20 15:56:55'),
('6f82c7d4-5a7f-4d35-9a29-1b17deb0a7a4', NULL, NULL, NULL, 'Mọi đối tượng', '2025-05-20 16:37:00', '0000-00-00 00:00:00', 'Tin thường', '2025-05-20 16:37:00', '2025-05-20 16:37:00'),
('76a13255-2d78-4e3d-a75f-d8d95d6ce153', NULL, NULL, NULL, 'Mọi đối tượng', '2025-05-20 16:47:49', '0000-00-00 00:00:00', 'Tin thường', '2025-05-20 16:47:49', '2025-05-20 16:47:49'),
('87bbdb7e-c223-4e7f-803c-175685f7233d', NULL, NULL, NULL, 'Mọi đối tượng', '2025-05-20 16:41:00', '0000-00-00 00:00:00', 'Tin thường', '2025-05-20 16:41:00', '2025-05-20 16:41:00'),
('c37da8ed-972e-43e8-b2b3-4c4e895213cd', NULL, NULL, NULL, 'Mọi đối tượng', '2025-05-20 16:37:17', '0000-00-00 00:00:00', 'Tin thường', '2025-05-20 16:37:17', '2025-05-20 16:37:17'),
('c7c99001-34f9-4cde-ab8b-4c24bc1814d5', NULL, NULL, NULL, 'Mọi đối tượng', '2025-05-20 16:40:20', '0000-00-00 00:00:00', 'Tin thường', '2025-05-20 16:40:20', '2025-05-20 16:40:20'),
('fa65e495-1d56-4283-b750-1d1a54212ba3', NULL, NULL, NULL, 'Mọi đối tượng', '2025-06-06 07:12:07', '0000-00-00 00:00:00', 'Tin thường', '2025-06-06 07:12:07', '2025-06-06 07:12:07');

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
('2cd95b37-c89d-47ce-af6b-6837156cdd74', 'Bình thường', 'Thuê cũng được ', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 5, '101 Hoàng Hiệp, Hải Châu, Sài Gòn ', 'fe6d094b-d09b-4887-b50c-573530cc35af', NULL, '6f82c7d4-5a7f-4d35-9a29-1b17deb0a7a4', '99aa7a1f-95b9-400d-af00-2b2fdc09679f', '2025-05-20 16:37:00', '2025-05-20 16:37:00', '471b1da5-f2e5-4d98-93f0-f38673f67c2c', 'b9b974b5-03be-4cb5-a125-ecad001f2eda', 'c0a5c443-2769-4e6d-86d0-e413aa6d71cb'),
('3ef9a228-a027-47b9-87ad-d950af892660', 'Quá ngon quá rẻ', 'Thuê đi', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 5, '100 Lê Quý Đôn, Cẩm Lệ, Đà Nẵng', '369b11c0-ce36-4eb8-9110-ee558c092987', NULL, '02b8af01-5f92-41ab-aa52-ed6eed3fa10b', 'ea6586e4-a628-461c-a26a-e4f1fe730544', '2025-05-20 15:56:55', '2025-05-20 15:56:55', '56b04cb2-791e-45aa-af8a-647d7248274c', '690443ca-3a57-4a9a-906c-102f1bf13396', '19cbd250-cd4b-4418-953a-d7140c1e3d0b'),
('8d44f218-b9bb-45a9-a39a-6514cb90c7e2', 'Phòng  ở ghép', 'Tối đa 2 bạn trong 1 phòng ', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 5, '200 Lê Thanh Nghị, 30 Nguyễn Trãi, Hà Nội', '22564836-cc4c-49eb-acee-5db9db6c111f', NULL, 'fa65e495-1d56-4283-b750-1d1a54212ba3', '8e885c41-dc8e-4f38-8c57-3c85eddc7402', '2025-06-06 07:12:07', '2025-06-06 07:12:07', 'b2fd1815-0e7e-4e20-bfa4-18fc25fa8237', 'b09a9942-833c-4fe0-967a-72c8b8aa2d7b', '5f16e10f-906b-4ffb-a732-d04875287006'),
('b1cdd9a7-393f-4009-8185-91820ea7eabb', '500 bao phòng', 'thật ra free', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 5, '100 Lê Quý Đôn, Cẩm Lệ, Đà Nẵng', '22587dff-6188-446e-846f-5bd1faad226d', NULL, '76a13255-2d78-4e3d-a75f-d8d95d6ce153', 'ea6586e4-a628-461c-a26a-e4f1fe730544', '2025-05-20 16:47:49', '2025-05-20 16:47:49', '56b04cb2-791e-45aa-af8a-647d7248274c', 'b987e988-888f-45a2-ade8-95e49abddd46', 'd66cf9f0-1a32-4e22-b77c-c218aa68b4d2'),
('c9972dc2-9a17-4476-a892-44230dbbfaf2', 'Rental', 'Host', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 5, '11 Hoàng Hiệp, Liên Chiểu , Đà Nẵng', '8eff005d-1f22-46bb-8a78-5d847ecceb9e', NULL, '87bbdb7e-c223-4e7f-803c-175685f7233d', '35173ddb-2876-43bc-b222-63c45d45b7da', '2025-05-20 16:41:00', '2025-05-20 16:41:00', '0688a673-2e2a-4e60-867c-6427f5969a2f', 'a66799cd-883b-49c0-9c38-357c2cc01e57', '5f16e10f-906b-4ffb-a732-d04875287006'),
('e296ce46-3092-4ea2-99f4-3473a07b66c3', '', '', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 5, '11 Hoàng Hiệp, Liên Chiểu , Đà Nẵng', '5909997e-04b3-4d1c-9234-6f90c4ee56b5', NULL, 'c7c99001-34f9-4cde-ab8b-4c24bc1814d5', '35173ddb-2876-43bc-b222-63c45d45b7da', '2025-05-20 16:40:20', '2025-05-20 16:40:20', '0688a673-2e2a-4e60-867c-6427f5969a2f', '0bec066c-a62e-4b04-b01a-00a6949daa3c', '5f16e10f-906b-4ffb-a732-d04875287006');

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
('0688a673-2e2a-4e60-867c-6427f5969a2f', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 'Dãy C', '35173ddb-2876-43bc-b222-63c45d45b7da', '11 Hoàng Hiệp', '3e976a4e-1848-4ecd-abf3-fd655c705c70', NULL, '2025-05-20 16:40:07', '2025-05-20 16:40:07', NULL),
('471b1da5-f2e5-4d98-93f0-f38673f67c2c', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 'Dãy B', '99aa7a1f-95b9-400d-af00-2b2fdc09679f', '101 Hoàng Hiệp', 'a664c85c-ff4a-413f-ade7-250f6b0444d3', NULL, '2025-05-20 16:36:19', '2025-05-20 16:36:19', NULL),
('56b04cb2-791e-45aa-af8a-647d7248274c', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 'Dãy A', 'ea6586e4-a628-461c-a26a-e4f1fe730544', '100 Lê Quý Đôn', '3e976a4e-1848-4ecd-abf3-fd655c705c70', NULL, '2025-05-20 15:56:28', '2025-05-20 15:56:28', NULL),
('b2fd1815-0e7e-4e20-bfa4-18fc25fa8237', '9fa87ebe-13fa-4f7a-a55b-a22078462b4a', 'Dãy D', '8e885c41-dc8e-4f38-8c57-3c85eddc7402', '200 Lê Thanh Nghị', 'dd8cce70-4a4b-4d56-b88e-32d4589d0905', NULL, '2025-06-06 07:10:54', '2025-06-06 07:10:54', NULL);

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
  `status` enum('available','occupied','pending','disabled') DEFAULT 'available',
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

INSERT INTO `rooms` (`id_room`, `property_id`, `num_tenant`, `status`, `description`, `created_at`, `updated_at`, `bedroom_count`, `bed_count`, `bathroom_count`, `category_id`, `name`, `amenities`, `floor_id`) VALUES
('0bec066c-a62e-4b04-b01a-00a6949daa3c', '0688a673-2e2a-4e60-867c-6427f5969a2f', 2, 'available', '', '2025-05-20 16:40:20', '2025-05-20 16:40:20', 1, 2, 1, '5f16e10f-906b-4ffb-a732-d04875287006', 'A104', NULL, NULL),
('690443ca-3a57-4a9a-906c-102f1bf13396', '56b04cb2-791e-45aa-af8a-647d7248274c', 2, 'available', 'Thuê đi', '2025-05-20 15:56:55', '2025-05-20 15:56:55', 2, 1, 1, '19cbd250-cd4b-4418-953a-d7140c1e3d0b', '101-105', '[\"Washer\",\"Dryer\",\"TV\"]', '45d49583-4f96-4d51-b2ee-e534630750e8'),
('a66799cd-883b-49c0-9c38-357c2cc01e57', '0688a673-2e2a-4e60-867c-6427f5969a2f', 2, 'available', 'Host', '2025-05-20 16:41:00', '2025-05-20 16:41:00', 1, 2, 1, '5f16e10f-906b-4ffb-a732-d04875287006', '304-307', '[\"TV\",\"Air Conditioning\"]', '52199782-2a6b-4551-98ad-f4302afc8336'),
('b09a9942-833c-4fe0-967a-72c8b8aa2d7b', 'b2fd1815-0e7e-4e20-bfa4-18fc25fa8237', 1, 'available', 'Tối đa 2 bạn trong 1 phòng ', '2025-06-06 07:12:07', '2025-06-06 07:12:07', 2, 2, 1, '5f16e10f-906b-4ffb-a732-d04875287006', '101-109', '[\"TV\",\"Air Conditioning\"]', '567f28d5-5924-4d5e-8bf3-c4e159b990c2'),
('b987e988-888f-45a2-ade8-95e49abddd46', '56b04cb2-791e-45aa-af8a-647d7248274c', 1, 'available', 'thật ra free', '2025-05-20 16:47:49', '2025-05-20 16:47:49', 1, 1, 2, 'd66cf9f0-1a32-4e22-b77c-c218aa68b4d2', '110-120', '[\"Security cameras\",\"Air Conditioning\"]', 'dd0f8fb4-7d14-4e2f-8986-b2c1f25c5fc9'),
('b9b974b5-03be-4cb5-a125-ecad001f2eda', '471b1da5-f2e5-4d98-93f0-f38673f67c2c', 1, 'available', 'Thuê cũng được ', '2025-05-20 16:37:00', '2025-05-20 16:37:00', 1, 2, 2, 'c0a5c443-2769-4e6d-86d0-e413aa6d71cb', '201-205', '[\" Pet allowed\",\"Private patio or Balcony\",\"Refrigerator\"]', 'bffd8dd5-ee01-42d2-a20b-d6ba6ba8e25e');

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
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
