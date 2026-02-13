<?php
/**
 * New Mexico Socialists - Member Count API
 * Returns the total number of members in the database
 */

// Set CORS headers to allow frontend access
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Content-Type: application/json');

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Load database configuration
if (!file_exists('../config.php')) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Configuration file missing']);
    exit;
}
require_once '../config.php';

// Verify required constants are defined
if (!defined('DB_HOST') || !defined('DB_NAME') || !defined('DB_USER') || !defined('DB_PASS')) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Configuration incomplete']);
    exit;
}

try {
    // Connect to database
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception('Database connection failed');
    }
    
    // Set charset
    $conn->set_charset('utf8mb4');
    
    // Query member count
    $result = $conn->query("SELECT COUNT(*) as total FROM form_submissions");
    
    if (!$result) {
        throw new Exception('Query failed');
    }
    
    $row = $result->fetch_assoc();
    $count = (int)$row['total'];
    
    // Close connection
    $conn->close();
    
    // Return success response
    echo json_encode([
        'success' => true,
        'count' => $count
    ]);
    
} catch (Exception $e) {
    // Internal server error
    error_log('Member count error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to retrieve member count'
    ]);
}
?>
