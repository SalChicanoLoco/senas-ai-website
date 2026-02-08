<?php
/**
 * Lead Capture Form Handler
 * Handles form submissions, sends email notifications, and stores data in MySQL database
 * 
 * Security features:
 * - Input validation and sanitization
 * - SQL injection prevention using prepared statements
 * - XSS protection
 * - CSRF token validation (recommended to add in production)
 * - Rate limiting (recommended to add in production)
 */

// Set headers for JSON response
header('Content-Type: application/json');

// Enable error reporting for debugging (disable in production)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

// Database configuration (update these values for your IONOS database)
define('DB_HOST', 'localhost');          // Usually 'localhost' for IONOS
define('DB_NAME', 'your_database_name'); // Your database name from IONOS
define('DB_USER', 'your_database_user'); // Your database username
define('DB_PASS', 'your_database_pass'); // Your database password

// Email configuration
define('ADMIN_EMAIL', 'salvador.sena@quetzalcoro.com');
define('FROM_EMAIL', 'noreply@' . $_SERVER['HTTP_HOST']);
define('FROM_NAME', 'Senas AI Website');

// Response array
$response = array(
    'success' => false,
    'message' => ''
);

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Invalid request method';
    echo json_encode($response);
    exit;
}

// Validate and sanitize input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Get and sanitize form data
$name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
$phone = isset($_POST['phone']) ? sanitize_input($_POST['phone']) : '';
$company = isset($_POST['company']) ? sanitize_input($_POST['company']) : '';
$interest = isset($_POST['interest']) ? sanitize_input($_POST['interest']) : '';
$message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';

// Validate required fields
if (empty($name) || empty($email) || empty($interest)) {
    $response['message'] = 'Please fill in all required fields';
    echo json_encode($response);
    exit;
}

// Validate email format
if (!validate_email($email)) {
    $response['message'] = 'Invalid email address';
    echo json_encode($response);
    exit;
}

// Validate interest selection
$valid_interests = array('business', 'education', 'personal', 'partnership');
if (!in_array($interest, $valid_interests)) {
    $response['message'] = 'Invalid interest selection';
    echo json_encode($response);
    exit;
}

// Database connection and insertion
try {
    // Create database connection with error handling
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception('Database connection failed');
    }
    
    // Set charset to UTF-8
    $conn->set_charset('utf8mb4');
    
    // Prepare SQL statement to prevent SQL injection
    $stmt = $conn->prepare("INSERT INTO leads (name, email, phone, company, interest, message, submitted_at, ip_address) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)");
    
    if (!$stmt) {
        throw new Exception('Failed to prepare statement');
    }
    
    // Get client IP address
    $ip_address = $_SERVER['REMOTE_ADDR'];
    
    // Bind parameters
    $stmt->bind_param("sssssss", $name, $email, $phone, $company, $interest, $message, $ip_address);
    
    // Execute statement
    if (!$stmt->execute()) {
        throw new Exception('Failed to save data');
    }
    
    $stmt->close();
    $conn->close();
    
} catch (Exception $e) {
    // Log error (in production, log to file instead of displaying)
    error_log('Database error: ' . $e->getMessage());
    $response['message'] = 'There was an error processing your request. Please try again later.';
    echo json_encode($response);
    exit;
}

// Send email notification
try {
    $interest_labels = array(
        'business' => 'Business Solutions',
        'education' => 'Education & Training',
        'personal' => 'Personal Use',
        'partnership' => 'Partnership Opportunities'
    );
    
    $interest_label = isset($interest_labels[$interest]) ? $interest_labels[$interest] : $interest;
    
    // Prepare email content
    $email_subject = 'New Lead from Senas AI Website';
    
    $email_body = "New lead submission from Senas AI website:\n\n";
    $email_body .= "Name: " . $name . "\n";
    $email_body .= "Email: " . $email . "\n";
    $email_body .= "Phone: " . ($phone ? $phone : 'Not provided') . "\n";
    $email_body .= "Company: " . ($company ? $company : 'Not provided') . "\n";
    $email_body .= "Interest: " . $interest_label . "\n";
    $email_body .= "Message: " . ($message ? $message : 'No message provided') . "\n\n";
    $email_body .= "Submitted: " . date('Y-m-d H:i:s') . "\n";
    $email_body .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";
    
    // Set email headers
    $headers = "From: " . FROM_NAME . " <" . FROM_EMAIL . ">\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Send email
    if (!mail(ADMIN_EMAIL, $email_subject, $email_body, $headers)) {
        error_log('Failed to send email notification');
        // Don't fail the request if email fails, as data is already saved
    }
    
} catch (Exception $e) {
    error_log('Email error: ' . $e->getMessage());
    // Don't fail the request if email fails
}

// Success response
$response['success'] = true;
$response['message'] = 'Thank you for your interest! We will contact you soon.';
echo json_encode($response);
exit;
?>
