-- New Mexico Socialists - Pledges Database Schema Migration
-- Create the pledges table for tracking contribution pledges locally in MySQL/phpMyAdmin
-- Run this migration in your IONOS database console or phpMyAdmin

CREATE TABLE IF NOT EXISTS `pledges` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `frequency` VARCHAR(50) NOT NULL DEFAULT 'one-time',
  `platform` VARCHAR(50) NOT NULL, -- 'venmo', 'cashapp', 'paypal', 'check', 'other'
  `message` TEXT DEFAULT NULL,
  `submitted_at` DATETIME NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_platform` (`platform`),
  KEY `idx_submitted_at` (`submitted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
