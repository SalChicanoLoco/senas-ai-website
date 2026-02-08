-- ============================================================================
-- Senas AI Website - MySQL Database Schema
-- ============================================================================
-- This script creates the necessary database structure for the lead capture
-- system on IONOS hosting.
--
-- IMPORTANT: Before running this script:
-- 1. Log in to your IONOS control panel
-- 2. Navigate to "Databases" section
-- 3. Create a new MySQL database or select an existing one
-- 4. Update the database credentials in submit-form.php
-- 5. Run this script using phpMyAdmin or MySQL command line
-- ============================================================================

-- Create database (if not already created in IONOS panel)
-- Note: On IONOS, you typically create the database through the control panel
-- Uncomment the following lines only if you have permissions to create databases
-- CREATE DATABASE IF NOT EXISTS senas_ai_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE senas_ai_db;

-- ============================================================================
-- Table: leads
-- Stores all lead capture form submissions
-- ============================================================================

DROP TABLE IF EXISTS `leads`;

CREATE TABLE `leads` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL COMMENT 'Full name of the lead',
  `email` VARCHAR(255) NOT NULL COMMENT 'Email address',
  `phone` VARCHAR(50) DEFAULT NULL COMMENT 'Phone number (optional)',
  `company` VARCHAR(255) DEFAULT NULL COMMENT 'Company or organization name',
  `interest` VARCHAR(50) NOT NULL COMMENT 'Type of interest: business, education, personal, partnership',
  `message` TEXT DEFAULT NULL COMMENT 'Additional message from the lead',
  `submitted_at` DATETIME NOT NULL COMMENT 'Timestamp when the form was submitted',
  `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'IP address of the submitter',
  `status` ENUM('new', 'contacted', 'qualified', 'converted', 'archived') DEFAULT 'new' COMMENT 'Lead status',
  `notes` TEXT DEFAULT NULL COMMENT 'Internal notes about the lead',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record last update timestamp',
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_submitted_at` (`submitted_at`),
  KEY `idx_status` (`status`),
  KEY `idx_interest` (`interest`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores lead capture form submissions';

-- ============================================================================
-- Create indexes for better query performance
-- ============================================================================

-- Composite index for common queries
CREATE INDEX `idx_status_submitted` ON `leads` (`status`, `submitted_at`);

-- ============================================================================
-- Sample data (optional - for testing purposes)
-- ============================================================================

-- Uncomment to insert sample data for testing
-- INSERT INTO `leads` (`name`, `email`, `phone`, `company`, `interest`, `message`, `submitted_at`, `ip_address`, `status`) 
-- VALUES 
-- ('John Doe', 'john.doe@example.com', '+1-555-0100', 'Acme Corp', 'business', 'Interested in enterprise solutions', NOW(), '192.168.1.1', 'new'),
-- ('Jane Smith', 'jane.smith@example.com', '+1-555-0200', 'Tech School', 'education', 'Looking for educational licensing', NOW(), '192.168.1.2', 'new'),
-- ('Bob Johnson', 'bob.johnson@example.com', NULL, NULL, 'personal', 'Personal use inquiry', NOW(), '192.168.1.3', 'new');

-- ============================================================================
-- Useful queries for managing leads
-- ============================================================================

-- View all leads ordered by submission date
-- SELECT * FROM leads ORDER BY submitted_at DESC;

-- Count leads by interest type
-- SELECT interest, COUNT(*) as count FROM leads GROUP BY interest;

-- View new leads that need follow-up
-- SELECT * FROM leads WHERE status = 'new' ORDER BY submitted_at DESC;

-- Search for a specific lead by email
-- SELECT * FROM leads WHERE email LIKE '%example.com%';

-- Update lead status
-- UPDATE leads SET status = 'contacted', notes = 'Initial contact made' WHERE id = 1;

-- Get leads submitted in the last 7 days
-- SELECT * FROM leads WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) ORDER BY submitted_at DESC;

-- ============================================================================
-- Maintenance queries
-- ============================================================================

-- Archive old leads (leads older than 1 year with status 'archived')
-- UPDATE leads SET status = 'archived' WHERE submitted_at < DATE_SUB(NOW(), INTERVAL 1 YEAR) AND status != 'converted';

-- Delete test leads (be careful with this query)
-- DELETE FROM leads WHERE email LIKE '%test%' OR email LIKE '%example.com%';

-- ============================================================================
-- Backup reminder
-- ============================================================================
-- IMPORTANT: Regular backups are essential!
-- IONOS typically provides automated backups, but you can also:
-- 1. Use phpMyAdmin export feature regularly
-- 2. Set up automated mysqldump scripts
-- 3. Keep backups in a secure location
-- ============================================================================
