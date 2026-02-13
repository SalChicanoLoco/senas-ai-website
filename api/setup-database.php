<?php
/**
 * New Mexico Socialists - Database Setup Script
 * 
 * This script creates the form_submissions table if it doesn't exist.
 * Run this once after deployment to initialize the database.
 * 
 * Access via: https://your-domain.com/api/setup-database.php?key=YOUR_SECRET_KEY
 * 
 * Security: Requires a secret key to prevent unauthorized access.
 * Set the SETUP_KEY in your environment variables or config.php
 */

// Set JSON response header
header('Content-Type: application/json');

// Load database configuration
if (!file_exists('../config.php')) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Configuration file missing']);
    exit;
}
require_once '../config.php';

// Security: Require a setup key
$required_key = defined('SETUP_KEY') ? SETUP_KEY : 'change-me-in-production';
$provided_key = $_GET['key'] ?? '';

if ($provided_key !== $required_key) {
    http_response_code(403);
    echo json_encode([
        'success' => false, 
        'message' => 'Unauthorized. Provide the correct setup key as ?key=YOUR_KEY'
    ]);
    exit;
}

// Verify required constants are defined
if (!defined('DB_HOST') || !defined('DB_NAME') || !defined('DB_USER') || !defined('DB_PASS')) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database configuration incomplete']);
    exit;
}

try {
    // Connect to database
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }
    
    // Set charset
    $conn->set_charset('utf8mb4');
    
    // Create table if it doesn't exist
    $sql = "CREATE TABLE IF NOT EXISTS `form_submissions` (
      `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      `name` VARCHAR(255) NOT NULL DEFAULT 'Anonymous',
      `email` VARCHAR(255) NOT NULL,
      `country` VARCHAR(100) NOT NULL,
      `state` VARCHAR(100) NOT NULL,
      `city` VARCHAR(100) NOT NULL,
      `zip_code` VARCHAR(20) NOT NULL,
      `submitted_at` DATETIME NOT NULL,
      `ip_address` VARCHAR(45) DEFAULT NULL,
      PRIMARY KEY (`id`),
      UNIQUE KEY `idx_email` (`email`),
      KEY `idx_submitted_at` (`submitted_at`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    if (!$conn->query($sql)) {
        throw new Exception('Failed to create table: ' . $conn->error);
    }
    
    // Check if table exists and get row count
    $result = $conn->query("SELECT COUNT(*) as total FROM form_submissions");
    if (!$result) {
        throw new Exception('Failed to query table: ' . $conn->error);
    }
    
    $row = $result->fetch_assoc();
    $count = (int)$row['total'];
    
    // Close connection
    $conn->close();
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Database setup complete!',
        'table' => 'form_submissions',
        'status' => 'ready',
        'current_members' => $count
    ]);
    
} catch (Exception $e) {
    error_log('Database setup error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database setup failed: ' . $e->getMessage()
    ]);
}
?>
