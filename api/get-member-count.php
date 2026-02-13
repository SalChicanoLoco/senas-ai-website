<?php
/**
 * New Mexico Socialists - Member Counter API
 * Returns total count of form submissions
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: public, max-age=300'); // Cache for 5 minutes

// Load database configuration
if (!file_exists('../config.php')) {
    http_response_code(500);
    echo json_encode(['success' => false, 'count' => 0, 'error' => 'Configuration missing']);
    exit;
}

require_once '../config.php';

// Verify required constants
if (!defined('DB_HOST') || !defined('DB_NAME') || !defined('DB_USER') || !defined('DB_PASS')) {
    http_response_code(500);
    echo json_encode(['success' => false, 'count' => 0, 'error' => 'Configuration incomplete']);
    exit;
}

try {
    // Connect to database
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        throw new Exception('Database connection failed');
    }
    
    $conn->set_charset('utf8mb4');
    
    // Get count of all submissions
    $result = $conn->query("SELECT COUNT(*) as total FROM form_submissions");
    
    if (!$result) {
        throw new Exception('Query failed');
    }
    
    $row = $result->fetch_assoc();
    $count = (int)$row['total'];
    
    $conn->close();
    
    // Return success response
    echo json_encode([
        'success' => true,
        'count' => $count
    ]);
    
} catch (Exception $e) {
    error_log('Member count error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'count' => 0,
        'error' => 'Unable to fetch member count'
    ]);
}
?>
