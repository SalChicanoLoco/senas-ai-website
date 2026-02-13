<?php
/**
 * New Mexico Socialists - Form Submission Handler
 * Processes join form submissions and stores them in MySQL database
 * Sends email notifications to admin
 */

// Load database configuration
require_once 'config.php';

// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Email configuration
define('ADMIN_EMAIL', NOTIFICATION_EMAIL);
define('FROM_NAME', 'New Mexico Socialists Website');
define('FROM_EMAIL_DOMAIN', 'newmexicosocialists.org');

// Set JSON response header
header('Content-Type: application/json');

/**
 * Sanitize input data
 */
function sanitize_input($data) {
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

/**
 * Validate email address
 */
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * Send email notification
 */
function send_notification($data) {
    $subject = 'New Join Form Submission - New Mexico Socialists';
    
    $message = "New member signup received:\n\n";
    $message .= "Name: " . $data['name'] . "\n";
    $message .= "Email: " . $data['email'] . "\n";
    $message .= "City: " . ($data['city'] ?: 'Not provided') . "\n";
    $message .= "Preferred Language: " . $data['language'] . "\n";
    $message .= "Interests: " . ($data['interests'] ?: 'Not provided') . "\n";
    $message .= "\nSubmitted: " . date('Y-m-d H:i:s') . "\n";
    $message .= "IP Address: " . $data['ip_address'] . "\n";
    
    // Sanitize email for Reply-To header (prevent header injection)
    $reply_to_email = str_replace(["\r", "\n", "%0d", "%0a"], '', $data['email']);
    
    $headers = "From: " . FROM_NAME . " <noreply@" . FROM_EMAIL_DOMAIN . ">\r\n";
    $headers .= "Reply-To: " . $reply_to_email . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    return mail(ADMIN_EMAIL, $subject, $message, $headers);
}

try {
    // Get form data
    $name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
    $email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
    $city = isset($_POST['city']) ? sanitize_input($_POST['city']) : '';
    $language = isset($_POST['language']) ? sanitize_input($_POST['language']) : 'both';
    $interests = isset($_POST['interests']) ? sanitize_input($_POST['interests']) : '';
    
    // Validate required fields
    if (empty($name)) {
        throw new InvalidArgumentException('Name is required / El nombre es requerido');
    }
    
    if (empty($email)) {
        throw new InvalidArgumentException('Email is required / El correo electrónico es requerido');
    }
    
    if (!validate_email($email)) {
        throw new InvalidArgumentException('Invalid email address / Dirección de correo electrónico no válida');
    }
    
    // Validate language field
    $valid_languages = ['en', 'es', 'both'];
    if (!in_array($language, $valid_languages)) {
        $language = 'both';
    }
    
    // Get IP address (use first IP from X-Forwarded-For if present)
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
    if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        // Take only the first IP from the comma-separated list
        $forwarded_ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $ip_address = trim($forwarded_ips[0]);
    }
    // Validate IP address format, set to null if invalid
    if (!filter_var($ip_address, FILTER_VALIDATE_IP)) {
        $ip_address = null;
    }
    
    // Connect to database
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception('Database connection failed. Please try again later.');
    }
    
    // Set charset
    $conn->set_charset('utf8mb4');
    
    // Prepare SQL statement
    $stmt = $conn->prepare(
        "INSERT INTO form_submissions (name, email, city, language, interests, submitted_at, ip_address) 
         VALUES (?, ?, ?, ?, ?, NOW(), ?)"
    );
    
    if (!$stmt) {
        throw new Exception('Database error. Please try again later.');
    }
    
    // Bind parameters
    $stmt->bind_param('ssssss', $name, $email, $city, $language, $interests, $ip_address);
    
    // Execute statement
    if (!$stmt->execute()) {
        throw new Exception('Failed to save submission. Please try again later.');
    }
    
    // Close statement and connection
    $stmt->close();
    $conn->close();
    
    // Send email notification (log if it fails)
    $email_data = [
        'name' => $name,
        'email' => $email,
        'city' => $city,
        'language' => $language,
        'interests' => $interests,
        'ip_address' => $ip_address
    ];
    
    $email_sent = send_notification($email_data);
    if (!$email_sent) {
        // Log email failure (submission is still saved to database)
        error_log("Failed to send email notification for submission from: " . $email);
    }
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Thanks for signing up! ¡Gracias por unirte!'
    ]);
    
} catch (InvalidArgumentException $e) {
    // Client-side validation error
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} catch (Exception $e) {
    // Internal server error
    error_log('Form submission error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected error occurred. Please try again later / Ocurrió un error inesperado. Por favor intenta más tarde.'
    ]);
}
?>
