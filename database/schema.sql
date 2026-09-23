-- ================================================================================
-- ÀDÙKẸ́ GASTRONOMY & HOSPITALITY COMMAND - MYSQL DATABASE SCHEMA
-- Compatible with PHP 8.x, MySQL 8.0+, MariaDB, and Laravel 10/11 Eloquent ORM
-- ================================================================================

CREATE DATABASE IF NOT EXISTS `aduke_restaurant` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `aduke_restaurant`;

-- --------------------------------------------------------------------------------
-- Table 1: users (Staff & Management Accounts)
-- --------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `phone` VARCHAR(50) NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `staff_pin` VARCHAR(10) NOT NULL DEFAULT '1122',
  `role` ENUM('owner', 'manager', 'chef', 'waiter', 'cashier', 'customer') NOT NULL DEFAULT 'waiter',
  `branch_location` VARCHAR(100) NOT NULL DEFAULT 'Victoria Island, Lagos',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `remember_token` VARCHAR(100) NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------------
-- Table 2: menu_items (Nigerian Woodfire & Gastronomy Menu)
-- --------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `menu_items` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `item_code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(191) NOT NULL,
  `yoruba_name` VARCHAR(191) NULL,
  `category` ENUM('mains', 'grill', 'soups', 'starters', 'drinks', 'desserts') NOT NULL,
  `price_naira` DECIMAL(12, 2) NOT NULL,
  `description` TEXT NOT NULL,
  `cultural_story` TEXT NULL,
  `prep_time_minutes` INT UNSIGNED NOT NULL DEFAULT 20,
  `spice_level` INT UNSIGNED NOT NULL DEFAULT 2,
  `is_available` TINYINT(1) NOT NULL DEFAULT 1,
  `is_popular` TINYINT(1) NOT NULL DEFAULT 0,
  `image_url` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------------
-- Table 3: table_sessions (Pavilion Dining Tables Matrix)
-- --------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `table_sessions` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `table_number` VARCHAR(50) NOT NULL UNIQUE,
  `seating_area_id` VARCHAR(50) NOT NULL,
  `area_name` VARCHAR(100) NOT NULL,
  `capacity` INT UNSIGNED NOT NULL DEFAULT 4,
  `status` ENUM('available', 'occupied', 'reserved', 'service_needed') NOT NULL DEFAULT 'available',
  `current_service_call` ENUM('none', 'water', 'waiter', 'bill', 'clear_plates') NOT NULL DEFAULT 'none',
  `total_spend_naira` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `opened_at` TIMESTAMP NULL,
  `closed_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------------
-- Table 4: orders (Restaurant Orders & POS Transactions)
-- --------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` BIGINT UNSIGNED NULL,
  `order_type` ENUM('dine-in-table', 'dine-in-pavilion', 'takeaway-pickup', 'vip-delivery') NOT NULL,
  `customer_name` VARCHAR(191) NOT NULL,
  `customer_phone` VARCHAR(50) NOT NULL,
  `customer_email` VARCHAR(191) NULL,
  `table_number` VARCHAR(50) NULL,
  `delivery_address` TEXT NULL,
  `status` ENUM('placed', 'confirmed', 'cooking', 'ready', 'served', 'completed', 'cancelled') NOT NULL DEFAULT 'placed',
  `payment_status` ENUM('unpaid', 'pending', 'paid', 'refunded') NOT NULL DEFAULT 'unpaid',
  `payment_method` ENUM('pos_terminal', 'bank_transfer', 'ussd', 'cash', 'card') NULL,
  `subtotal_naira` DECIMAL(12, 2) NOT NULL,
  `vat_tax_naira` DECIMAL(12, 2) NOT NULL,
  `service_charge_naira` DECIMAL(12, 2) NOT NULL,
  `total_naira` DECIMAL(12, 2) NOT NULL,
  `special_notes` TEXT NULL,
  `placed_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------------
-- Table 5: order_items (Ordered Dish Line Items)
-- --------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `menu_item_id` BIGINT UNSIGNED NOT NULL,
  `item_name` VARCHAR(191) NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `unit_price_naira` DECIMAL(12, 2) NOT NULL,
  `total_price_naira` DECIMAL(12, 2) NOT NULL,
  `selected_options_json` JSON NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------------------
-- Table 6: reservations (Dining Table Booking System)
-- --------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `booking_code` VARCHAR(50) NOT NULL UNIQUE,
  `guest_name` VARCHAR(191) NOT NULL,
  `guest_email` VARCHAR(191) NOT NULL,
  `guest_phone` VARCHAR(50) NOT NULL,
  `party_size` INT UNSIGNED NOT NULL DEFAULT 2,
  `reservation_date` DATE NOT NULL,
  `time_slot` VARCHAR(20) NOT NULL,
  `seating_area_id` VARCHAR(50) NOT NULL,
  `seating_area_name` VARCHAR(100) NOT NULL,
  `occasion` VARCHAR(100) NULL,
  `special_requests` TEXT NULL,
  `status` ENUM('confirmed', 'seated', 'completed', 'cancelled') NOT NULL DEFAULT 'confirmed',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================
-- SEED INITIAL DATA (MANAGEMENT & CHEF ACCOUNTS)
-- ================================================================================
INSERT INTO `users` (`full_name`, `email`, `phone`, `password_hash`, `staff_pin`, `role`) VALUES
('Executive CEO / Owner', 'Odubelatomiwa508@gmail.com', '+234 803 000 0001', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0000', 'owner'),
('Head Chef Tunde Adebayo', 'chef@aduke.com', '+234 802 111 2233', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1122', 'chef'),
('Floor Waiter Sarah Okafor', 'waiter@aduke.com', '+234 805 333 4455', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '3344', 'waiter'),
('Cashier Nkechi Eze', 'cashier@aduke.com', '+234 807 555 6677', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '5566', 'cashier');
