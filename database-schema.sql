-- New Mexico Socialists - Database Schema
-- This file creates the form_submissions table for storing join form data
-- Import this file via IONOS phpMyAdmin

-- Create the form_submissions table
CREATE TABLE IF NOT EXISTS `form_submissions` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `city` VARCHAR(255) DEFAULT NULL,
  `language` VARCHAR(10) DEFAULT 'both',
  `interests` TEXT DEFAULT NULL,
  `submitted_at` DATETIME NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_submitted_at` (`submitted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
