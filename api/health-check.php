<?php
/**
 * New Mexico Socialists - Health Check API
 * Returns the status of database connection and table existence
 */

// Set CORS headers
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
    echo json_encode([
        'success' => false,
        'database' => 'config_missing',
        'message' => 'Configuration file missing'
    ]);
    exit;
}
require_once '../config.php';

$health = [
    'success' => true,
    'timestamp' => date('c'),
    'checks' => []
];

// Check database configuration
if (!defined('DB_HOST') || !defined('DB_NAME') || !defined('DB_USER') || !defined('DB_PASS')) {
    $health['checks']['config'] = [
        'status' => 'fail',
        'message' => 'Database configuration incomplete'
    ];
    $health['success'] = false;
} else {
    $health['checks']['config'] = [
        'status' => 'pass',
        'host' => DB_HOST,
        'database' => DB_NAME
    ];
}

// Check database connection
try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        $health['checks']['connection'] = [
            'status' => 'fail',
            'message' => 'Database connection failed'
        ];
        $health['success'] = false;
    } else {
        $health['checks']['connection'] = [
            'status' => 'pass',
            'message' => 'Connected successfully'
        ];
        
        // Check if table exists
        $result = $conn->query("SHOW TABLES LIKE 'form_submissions'");
        if ($result && $result->num_rows > 0) {
            $health['checks']['table'] = [
                'status' => 'pass',
                'message' => 'Table form_submissions exists'
            ];
            
            // Get row count
            $countResult = $conn->query("SELECT COUNT(*) as total FROM form_submissions");
            if ($countResult) {
                $row = $countResult->fetch_assoc();
                $health['checks']['table']['rows'] = (int)$row['total'];
            }
        } else {
            $health['checks']['table'] = [
                'status' => 'fail',
                'message' => 'Table form_submissions does not exist. Run api/setup-database.php to create it.'
            ];
            $health['success'] = false;
        }
        
        $conn->close();
    }
} catch (Exception $e) {
    $health['checks']['connection'] = [
        'status' => 'fail',
        'message' => 'Exception: ' . $e->getMessage()
    ];
    $health['success'] = false;
}

// Overall status
$health['status'] = $health['success'] ? 'healthy' : 'unhealthy';

// Set appropriate HTTP status code
if (!$health['success']) {
    http_response_code(503);
}

echo json_encode($health, JSON_PRETTY_PRINT);
?>
