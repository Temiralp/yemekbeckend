-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 25 Mar 2025, 08:38:35
-- Sunucu sürümü: 10.4.32-MariaDB
-- PHP Sürümü: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `donerci_db`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `addresses`
--

CREATE TABLE `addresses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_type` enum('registered','guest') DEFAULT 'registered',
  `title` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `district` varchar(50) NOT NULL,
  `neighborhood` varchar(50) NOT NULL,
  `street` varchar(100) DEFAULT NULL,
  `address_detail` text NOT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `guest_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `user_type`, `title`, `city`, `district`, `neighborhood`, `street`, `address_detail`, `is_default`, `guest_id`) VALUES
(1, 1, 'registered', 'Ev Adresi', 'İstanbul', 'Kadıköy', 'Fenerbahçe', 'Bağdat Caddesi', 'No: 123', 1, NULL),
(2, NULL, 'guest', 'Geçici Adres', 'Ankara', 'Çankaya', 'Kızılay', 'Atatürk Bulvarı', 'No: 456', 0, 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_type` enum('registered','guest') DEFAULT 'registered',
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `options` longtext DEFAULT NULL CHECK (json_valid(`options`)),
  `note` text DEFAULT NULL,
  `added_at` datetime DEFAULT current_timestamp(),
  `guest_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `user_type`, `product_id`, `quantity`, `options`, `note`, `added_at`, `guest_id`) VALUES
(1, 1, 'registered', 1, 2, '{\"option\": \"Ekstra Peynir\"}', 'Az tuzlu olsun', '2025-03-24 16:56:28', NULL),
(2, NULL, 'guest', 1, 1, NULL, 'Hızlı teslimat', '2025-03-24 16:58:21', 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Burger', NULL, 1, '2025-03-24 16:50:22', '2025-03-24 16:50:22');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `coupons`
--

CREATE TABLE `coupons` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_type` enum('percentage','fixed') NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT 0.00,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `usage_count` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `coupons`
--

INSERT INTO `coupons` (`id`, `code`, `description`, `discount_type`, `discount_amount`, `min_order_amount`, `start_date`, `end_date`, `usage_limit`, `usage_count`, `created_at`, `updated_at`, `created_by`, `active`) VALUES
(1, 'INDIRIM10', NULL, '', 10.00, 50.00, '2025-01-01 00:00:00', '2025-12-31 00:00:00', 100, 0, '2025-03-24 16:58:21', '2025-03-24 16:58:21', NULL, 1);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `guest_users`
--

CREATE TABLE `guest_users` (
  `id` int(11) NOT NULL,
  `token` varchar(2000) NOT NULL,
  `device_id` varchar(255) NOT NULL,
  `device_type` varchar(50) DEFAULT NULL,
  `device_model` varchar(100) DEFAULT NULL,
  `first_seen` datetime DEFAULT current_timestamp(),
  `last_active` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `guest_users`
--

INSERT INTO `guest_users` (`id`, `token`, `device_id`, `device_type`, `device_model`, `first_seen`, `last_active`) VALUES
(1, 'test-token-123', 'device-123', 'Android', 'Samsung Galaxy S21', '2025-03-24 16:47:57', '2025-03-24 16:47:57');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `recipient_id` int(11) NOT NULL,
  `recipient_type` enum('customer','staff') NOT NULL,
  `title` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `type` varchar(50) NOT NULL,
  `related_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` enum('registered','guest') DEFAULT 'registered',
  `address_id` int(11) NOT NULL,
  `order_time` datetime DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) NOT NULL,
  `payment_type` enum('cash','credit_card') NOT NULL,
  `order_status` enum('pending','preparing','on_the_way','delivered','cancelled') DEFAULT 'pending',
  `note` text DEFAULT NULL,
  `coupon_code` varchar(50) DEFAULT NULL,
  `guest_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `order_status_history`
--

CREATE TABLE `order_status_history` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `old_status` enum('pending','preparing','on_the_way','delivered','cancelled') DEFAULT NULL,
  `new_status` enum('pending','preparing','on_the_way','delivered','cancelled') NOT NULL,
  `changed_at` datetime DEFAULT current_timestamp(),
  `staff_id` int(11) DEFAULT NULL,
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `ingredients` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ingredients`)),
  `is_active` tinyint(1) DEFAULT 1,
  `category_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `base_price`, `image_url`, `options`, `ingredients`, `is_active`, `category_id`, `created_at`, `updated_at`) VALUES
(2, 'Cheese Burger', 'Lezzetli bir cheese burger', 45.00, NULL, '[{\"name\": \"Ekstra Peynir\", \"price_modifier\": 5}]', '[\"peynir\", \"ekmek\", \"et\"]', 1, 1, '2025-03-24 16:50:22', '2025-03-24 16:50:22');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `guest_id` int(11) DEFAULT NULL,
  `token` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL,
  `expires_at` datetime NOT NULL,
  `device_info` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `guest_id`, `token`, `created_at`, `expires_at`, `device_info`) VALUES
(26, 1, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6InJlZ2lzdGVyZWQiLCJpYXQiOjE3NDI4ODgyMjQsImV4cCI6MTc0Mjg5MTgyNH0.pn4u_VCSf7qsTglceu0ptxbXMVAvMWgY5lxKI6vCQ5A', '2025-03-25 10:37:04', '2025-03-25 11:37:04', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `sliders`
--

CREATE TABLE `sliders` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `order_number` int(11) DEFAULT 0,
  `link` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','order_manager','kitchen') NOT NULL,
  `last_login_date` datetime DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `staff`
--

INSERT INTO `staff` (`id`, `full_name`, `phone`, `email`, `password`, `role`, `last_login_date`, `status`) VALUES
(3, 'Admin User', '5551234567', 'admin@donerci.com', '$2b$10$j3NdL94k8lBzta2LWJ5IZuIbDFzLjeOLi28Eq0LH7LOjztDiascvK', 'admin', '2025-03-25 10:38:10', 'active');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `registration_date` datetime DEFAULT current_timestamp(),
  `last_login_date` datetime DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`id`, `full_name`, `phone`, `email`, `registration_date`, `last_login_date`, `status`) VALUES
(1, 'Test Kullanıcı', '5551234567', 'test@ornek.com', '2025-03-24 16:47:57', NULL, 'active');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `verification_codes`
--

CREATE TABLE `verification_codes` (
  `id` int(11) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `code` varchar(6) NOT NULL,
  `purpose` enum('login','registration') NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `verification_codes`
--

INSERT INTO `verification_codes` (`id`, `phone`, `code`, `purpose`, `created_at`, `expires_at`, `used`) VALUES
(1, '5415', '273745', '', '2025-03-18 18:21:10', '2025-03-18 18:31:10', 0),
(2, '45454', '764600', '', '2025-03-18 18:28:38', '2025-03-18 18:38:38', 0),
(3, '05346403437', '312738', '', '2025-03-19 10:30:14', '2025-03-19 10:40:14', 0),
(4, '05346403439', '831141', '', '2025-03-19 10:37:01', '2025-03-19 10:47:01', 0),
(5, '05346403437', '123456', 'login', '2025-03-19 11:42:53', '2025-03-19 11:52:52', 1),
(6, '05346403437', '123456', 'login', '2025-03-19 11:43:28', '2025-03-19 11:53:28', 1),
(7, '05346403437', '123456', 'login', '2025-03-19 11:45:14', '2025-03-19 11:55:14', 1),
(8, '05346403437', '123456', 'login', '2025-03-19 11:57:38', '2025-03-19 12:07:38', 1),
(9, '05346403437', '123456', 'login', '2025-03-19 12:01:31', '2025-03-19 12:11:31', 1),
(10, '05346403437', '123456', 'login', '2025-03-19 12:19:09', '2025-03-19 12:29:09', 1),
(11, '05346403437', '123456', 'login', '2025-03-19 12:23:33', '2025-03-19 12:26:33', 1),
(12, '05346403437', '123456', 'login', '2025-03-19 12:24:12', '2025-03-19 12:27:12', 1),
(13, '05346403437', '123456', 'login', '2025-03-19 12:24:39', '2025-03-19 12:27:39', 1),
(14, '05346403437', '123456', 'login', '2025-03-19 12:31:42', '2025-03-19 12:34:42', 1),
(15, '05346403437', '123456', 'login', '2025-03-19 12:35:49', '2025-03-19 12:38:49', 1),
(16, '05346403437', '123456', 'login', '2025-03-19 12:37:21', '2025-03-19 12:40:21', 1),
(17, '05346403437', '123456', 'login', '2025-03-19 12:39:23', '2025-03-19 12:42:23', 1),
(18, '05346403437', '123456', 'login', '2025-03-19 12:44:06', '2025-03-19 12:47:06', 1),
(19, '05346403437', '123456', 'login', '2025-03-19 12:55:46', '2025-03-19 12:58:46', 1),
(20, '05346403437', '123456', 'login', '2025-03-19 12:59:02', '2025-03-19 13:02:02', 1),
(21, '05346403437', '123456', 'login', '2025-03-19 13:04:04', '2025-03-19 13:07:04', 1),
(22, '05346403437', '123456', 'login', '2025-03-19 14:26:22', '2025-03-19 14:29:22', 1),
(23, '05346403437', '123456', 'login', '2025-03-19 15:39:49', '2025-03-19 15:42:49', 1),
(24, '05346403437', '123456', 'login', '2025-03-19 15:47:36', '2025-03-19 15:50:36', 1),
(25, '05346403432', '123456', 'login', '2025-03-20 11:03:13', '2025-03-20 11:06:13', 1),
(26, '05346403437', '123456', 'login', '2025-03-20 15:37:11', '2025-03-20 15:40:11', 1),
(27, '05346403437', '123456', 'login', '2025-03-20 15:42:36', '2025-03-20 15:45:36', 1),
(28, '05346403437', '123456', 'login', '2025-03-20 16:09:43', '2025-03-20 16:12:43', 1),
(29, '05346403437', '123456', 'login', '2025-03-20 16:11:59', '2025-03-20 16:14:59', 1),
(30, '05346403437', '123456', 'login', '2025-03-20 16:14:47', '2025-03-20 16:17:47', 1),
(31, '05346403437', '123456', 'login', '2025-03-20 16:16:52', '2025-03-20 16:19:52', 1),
(32, '05346403437', '123456', 'login', '2025-03-20 16:19:45', '2025-03-20 16:22:45', 1),
(33, '05346403437', '123456', 'login', '2025-03-20 16:21:51', '2025-03-20 16:24:51', 1),
(34, '05346403437', '123456', 'login', '2025-03-20 17:46:36', '2025-03-20 17:49:36', 1),
(35, '05346403437', '123456', 'login', '2025-03-20 17:46:47', '2025-03-20 17:49:47', 1),
(36, '05346403437', '123456', 'login', '2025-03-20 18:11:05', '2025-03-20 18:14:05', 1),
(37, '05346403437', '123456', 'login', '2025-03-20 18:17:53', '2025-03-20 18:20:53', 1),
(38, '05346403437', '123456', 'login', '2025-03-20 18:20:47', '2025-03-20 18:23:47', 1),
(39, '05346403437', '123456', 'login', '2025-03-20 18:23:21', '2025-03-20 18:26:21', 1),
(40, '05346403437', '123456', 'login', '2025-03-20 18:24:43', '2025-03-20 18:27:43', 1),
(41, '05346403437', '123456', 'login', '2025-03-20 18:24:56', '2025-03-20 18:27:56', 1),
(42, '05346403437', '123456', 'login', '2025-03-20 18:25:31', '2025-03-20 18:28:31', 1),
(43, '05346403437', '123456', 'login', '2025-03-20 18:33:12', '2025-03-20 18:36:12', 1),
(44, '05346403437', '123456', 'login', '2025-03-20 18:34:09', '2025-03-20 18:37:09', 1),
(45, '5551234567', '123456', 'login', '2025-03-25 10:36:40', '2025-03-25 10:39:40', 1);

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_addresses_guest` (`guest_id`);

--
-- Tablo için indeksler `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_cart_guest` (`guest_id`);

--
-- Tablo için indeksler `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `fk_coupon_staff` (`created_by`);

--
-- Tablo için indeksler `guest_users`
--
ALTER TABLE `guest_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `device_id` (`device_id`);

--
-- Tablo için indeksler `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `address_id` (`address_id`),
  ADD KEY `fk_orders_guest` (`guest_id`),
  ADD KEY `fk_order_updated_by` (`updated_by`);

--
-- Tablo için indeksler `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Tablo için indeksler `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Tablo için indeksler `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_product_category` (`category_id`);

--
-- Tablo için indeksler `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Tablo için indeksler `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `guest_id` (`guest_id`);

--
-- Tablo için indeksler `sliders`
--
ALTER TABLE `sliders`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Tablo için indeksler `verification_codes`
--
ALTER TABLE `verification_codes`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Tablo için AUTO_INCREMENT değeri `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `guest_users`
--
ALTER TABLE `guest_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tablo için AUTO_INCREMENT değeri `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `order_status_history`
--
ALTER TABLE `order_status_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Tablo için AUTO_INCREMENT değeri `sliders`
--
ALTER TABLE `sliders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- Tablo için AUTO_INCREMENT değeri `verification_codes`
--
ALTER TABLE `verification_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_addresses_guest` FOREIGN KEY (`guest_id`) REFERENCES `guest_users` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cart_guest` FOREIGN KEY (`guest_id`) REFERENCES `guest_users` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `coupons`
--
ALTER TABLE `coupons`
  ADD CONSTRAINT `fk_coupon_staff` FOREIGN KEY (`created_by`) REFERENCES `staff` (`id`) ON DELETE SET NULL;

--
-- Tablo kısıtlamaları `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_order_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `staff` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_orders_guest` FOREIGN KEY (`guest_id`) REFERENCES `guest_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`);

--
-- Tablo kısıtlamaları `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `order_status_history`
--
ALTER TABLE `order_status_history`
  ADD CONSTRAINT `order_status_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_status_history_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`);

--
-- Tablo kısıtlamaları `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Tablo kısıtlamaları `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Tablo kısıtlamaları `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sessions_ibfk_2` FOREIGN KEY (`guest_id`) REFERENCES `guest_users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
