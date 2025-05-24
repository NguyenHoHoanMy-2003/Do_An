

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


CREATE TABLE `attributes` (
  `id` varchar(255) NOT NULL,
  `price` varchar(255) DEFAULT NULL,
  `acreage` varchar(255) DEFAULT NULL,
  `published` varchar(255) DEFAULT NULL,
  `hashtag` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;




CREATE TABLE `categories` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `header` varchar(255) DEFAULT NULL,
  `subheader` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;




CREATE TABLE `cities` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


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



CREATE TABLE `districts` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `city_id` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE `floors` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `property_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `hosts` (
  `id_user` char(36) NOT NULL,
  `cccd` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `date_of_issue` date DEFAULT NULL,
  `place_of_issue` varchar(100) DEFAULT NULL,
  `permanent_address` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `images` (
  `id` varchar(255) NOT NULL,
  `room_id` varchar(255) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;




CREATE TABLE `labels` (
  `id` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



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


CREATE TABLE `renters` (
  `id_user` varchar(255) NOT NULL,
  `date_of_birth` datetime DEFAULT NULL,
  `gender` varchar(5) DEFAULT NULL,
  `hometown` varchar(50) DEFAULT NULL,
  `national_id` varchar(20) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;


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



INSERT INTO `rooms` (`id_room`, `property_id`, `num_tenant`, `status`, `description`, `created_at`, `updated_at`, `bedroom_count`, `bed_count`, `bathroom_count`, `category_id`, `name`, `amenities`, `floor_id`) VALUES
('abc123', NULL, 2, 'available', NULL, '2025-05-02 20:26:38', '2025-05-02 20:26:38', NULL, NULL, NULL, NULL, 'Phòng 1', NULL, NULL);



CREATE TABLE `users` (
  `id_user` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `role` enum('admin','host','renter') DEFAULT 'renter',
  `created_by` varchar(36) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



ALTER TABLE `attributes`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `contracts`
--
ALTER TABLE `contracts`
  ADD PRIMARY KEY (`id_contract`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `tenant_id` (`tenant_id`);

--
-- Chỉ mục cho bảng `districts`
--
ALTER TABLE `districts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `city_id` (`city_id`);

--
-- Chỉ mục cho bảng `floors`
--
ALTER TABLE `floors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `floors_ibfk_1` (`property_id`);

--
-- Chỉ mục cho bảng `hosts`
--
ALTER TABLE `hosts`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `cccd` (`cccd`);

--
-- Chỉ mục cho bảng `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`);

--
-- Chỉ mục cho bảng `labels`
--
ALTER TABLE `labels`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `overviews`
--
ALTER TABLE `overviews`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `payments_history`
--
ALTER TABLE `payments_history`
  ADD PRIMARY KEY (`id_payment`),
  ADD KEY `invoice_id` (`invoice_id`),
  ADD KEY `contract_id` (`contract_id`);

--
-- Chỉ mục cho bảng `posts`
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
-- Chỉ mục cho bảng `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id_property`),
  ADD KEY `host_id` (`host_id`),
  ADD KEY `district_id` (`district_id`),
  ADD KEY `properties_category_id_foreign_idx` (`category_id`),
  ADD KEY `city_id` (`city_id`);

--
-- Chỉ mục cho bảng `rental_invoices`
--
ALTER TABLE `rental_invoices`
  ADD PRIMARY KEY (`id_invoice`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `tenant_id` (`tenant_id`);

--
-- Chỉ mục cho bảng `renters`
--
ALTER TABLE `renters`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `national_id` (`national_id`);

--
-- Chỉ mục cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id_room`),
  ADD KEY `rooms_category_id_foreign_idx` (`category_id`),
  ADD KEY `rooms_ibfk_1` (`property_id`),
  ADD KEY `fk_rooms_floors` (`floor_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `created_by` (`created_by`);

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `contracts`
--
ALTER TABLE `contracts`
  ADD CONSTRAINT `contracts_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id_room`),
  ADD CONSTRAINT `contracts_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id_user`);

--
-- Các ràng buộc cho bảng `districts`
--
ALTER TABLE `districts`
  ADD CONSTRAINT `districts_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`);

--
-- Các ràng buộc cho bảng `floors`
--
ALTER TABLE `floors`
  ADD CONSTRAINT `floors_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id_property`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `hosts`
--
ALTER TABLE `hosts`
  ADD CONSTRAINT `fk_hosts_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `images`
--
ALTER TABLE `images`
  ADD CONSTRAINT `images_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id_room`);

--
-- Các ràng buộc cho bảng `payments_history`
--
ALTER TABLE `payments_history`
  ADD CONSTRAINT `payments_history_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `rental_invoices` (`id_invoice`),
  ADD CONSTRAINT `payments_history_ibfk_2` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id_contract`);

--
-- Các ràng buộc cho bảng `posts`
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
-- Các ràng buộc cho bảng `properties`
--
ALTER TABLE `properties`
  ADD CONSTRAINT `properties_category_id_foreign_idx` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `properties_ibfk_1` FOREIGN KEY (`host_id`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `properties_ibfk_2` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`),
  ADD CONSTRAINT `properties_ibfk_3` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`);

--
-- Các ràng buộc cho bảng `rental_invoices`
--
ALTER TABLE `rental_invoices`
  ADD CONSTRAINT `rental_invoices_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id_room`),
  ADD CONSTRAINT `rental_invoices_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `users` (`id_user`);

--
-- Các ràng buộc cho bảng `renters`
--
ALTER TABLE `renters`
  ADD CONSTRAINT `renters_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `fk_rooms_floors` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rooms_category_id_foreign_idx` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id_property`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id_user`);
COMMIT;

