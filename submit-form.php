<?php
/**
 * New Mexico Socialists - Form Submission Handler
 * Processes join form submissions and stores them in MySQL database
 * Sends email notifications to admin
 */

// Load database configuration
if (!file_exists('config.php')) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Configuration file missing']);
    exit;
}
require_once 'config.php';

// Verify required constants are defined
if (!defined('DB_HOST') || !defined('DB_NAME') || !defined('DB_USER') || !defined('DB_PASS') || !defined('NOTIFICATION_EMAIL')) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Configuration incomplete']);
    exit;
}

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
 * Generate a cryptographically secure unsubscribe token
 */
function generate_unsubscribe_token() {
    return bin2hex(random_bytes(32));
}

/**
 * Send welcome email to new subscriber
 */
function send_welcome_email($subscriber_data, $unsubscribe_token) {
    $name = $subscriber_data['name'];
    $email = $subscriber_data['email'];
    
    // Sanitize email for headers (prevent header injection)
    $safe_email = str_replace(["\r", "\n", "%0d", "%0a"], '', $email);
    
    // Build unsubscribe URL
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    // Use configured domain instead of HTTP_HOST to prevent Host header injection
    $host = FROM_EMAIL_DOMAIN;
    $unsubscribe_url = $protocol . '://' . $host . '/unsubscribe.php?token=' . urlencode($unsubscribe_token);
    
    // Email subject (bilingual)
    $subject = 'Welcome to New Mexico Socialists / Bienvenido a New Mexico Socialists';
    
    // Email body (bilingual - English first, then Spanish)
    $message = "Dear $name,\n\n";
    $message .= "Thank you for joining New Mexico Socialists! We're excited to have you as part of our community.\n\n";
    $message .= "You will receive updates about:\n";
    $message .= "- Community events and meetings\n";
    $message .= "- Educational resources and workshops\n";
    $message .= "- Organizing opportunities\n";
    $message .= "- Important announcements\n\n";
    $message .= "We respect your privacy and will never share your information with third parties.\n\n";
    $message .= "---\n\n";
    $message .= "Estimado/a $name,\n\n";
    $message .= "¡Gracias por unirte a New Mexico Socialists! Estamos emocionados de tenerte como parte de nuestra comunidad.\n\n";
    $message .= "Recibirás actualizaciones sobre:\n";
    $message .= "- Eventos y reuniones comunitarias\n";
    $message .= "- Recursos educativos y talleres\n";
    $message .= "- Oportunidades de organización\n";
    $message .= "- Anuncios importantes\n\n";
    $message .= "Respetamos tu privacidad y nunca compartiremos tu información con terceros.\n\n";
    $message .= "---\n\n";
    $message .= "If you wish to unsubscribe from our emails, click here:\n";
    $message .= "$unsubscribe_url\n\n";
    $message .= "Si deseas darte de baja de nuestros correos, haz clic aquí:\n";
    $message .= "$unsubscribe_url\n\n";
    $message .= "---\n";
    $message .= "New Mexico Socialists\n";
    $message .= "Email: xava@newmexicosocialists.org\n";
    
    // Email headers (CAN-SPAM compliant)
    // Sanitize FROM_NAME to prevent header injection
    $safe_from_name = str_replace(["\r", "\n", "%0d", "%0a"], '', FROM_NAME);
    $headers = "From: " . $safe_from_name . " <noreply@" . FROM_EMAIL_DOMAIN . ">\r\n";
    $headers .= "Reply-To: xava@newmexicosocialists.org\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "List-Unsubscribe: <" . $unsubscribe_url . ">\r\n";
    $headers .= "List-Unsubscribe-Post: List-Unsubscribe=One-Click\r\n";
    
    return mail($safe_email, $subject, $message, $headers);
}

/**
 * Send email notification to admin
 */
function send_notification($data) {
    $subject = 'New Join Form Submission - New Mexico Socialists';
    
    $message = "New member signup received:\n\n";
    $message .= "Name: " . $data['name'] . "\n";
    $message .= "Email: " . $data['email'] . "\n";
    $message .= "Country: " . $data['country'] . "\n";
    $message .= "State/Province: " . $data['state'] . "\n";
    $message .= "City: " . $data['city'] . "\n";
    $message .= "Zip/Postal Code: " . $data['zip_code'] . "\n";
    $message .= "\nSubmitted: " . date('Y-m-d H:i:s') . "\n";
    $message .= "IP Address: " . $data['ip_address'] . "\n";
    
    // Sanitize email for Reply-To header (prevent header injection)
    $reply_to_email = str_replace(["\r", "\n", "%0d", "%0a"], '', $data['email']);
    
    // Sanitize FROM_NAME to prevent header injection
    $safe_from_name = str_replace(["\r", "\n", "%0d", "%0a"], '', FROM_NAME);
    $headers = "From: " . $safe_from_name . " <noreply@" . FROM_EMAIL_DOMAIN . ">\r\n";
    $headers .= "Reply-To: " . $reply_to_email . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    return mail(ADMIN_EMAIL, $subject, $message, $headers);
}

try {
    // Get form data
    $name = isset($_POST['name']) ? sanitize_input($_POST['name']) : 'Anonymous';
    $email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
    $country = isset($_POST['country']) ? sanitize_input($_POST['country']) : '';
    $state = isset($_POST['state']) ? sanitize_input($_POST['state']) : '';
    $city = isset($_POST['city']) ? sanitize_input($_POST['city']) : '';
    $zip_code = isset($_POST['zip_code']) ? sanitize_input($_POST['zip_code']) : '';
    
    // Default to Anonymous if name is empty
    if (empty($name)) {
        $name = 'Anonymous';
    }
    
    // Validate required fields
    if (empty($email)) {
        throw new InvalidArgumentException('Email is required / El correo electrónico es requerido');
    }
    
    if (!validate_email($email)) {
        throw new InvalidArgumentException('Invalid email address / Dirección de correo electrónico no válida');
    }
    
    if (empty($country)) {
        throw new InvalidArgumentException('Country is required / El país es requerido');
    }
    
    if (empty($state)) {
        throw new InvalidArgumentException('State/Province is required / El estado/provincia es requerido');
    }
    
    if (empty($city)) {
        throw new InvalidArgumentException('City is required / La ciudad es requerida');
    }
    
    if (empty($zip_code)) {
        throw new InvalidArgumentException('Zip/Postal code is required / El código postal es requerido');
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
    
    // Generate unique unsubscribe token
    $unsubscribe_token = generate_unsubscribe_token();
    
    // Prepare SQL statement (now includes unsubscribe_token)
    $stmt = $conn->prepare(
        "INSERT INTO form_submissions (name, email, country, state, city, zip_code, submitted_at, ip_address, unsubscribe_token) 
         VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)"
    );
    
    if (!$stmt) {
        throw new Exception('Database error. Please try again later.');
    }
    
    // Bind parameters (added unsubscribe_token)
    $stmt->bind_param('ssssssss', $name, $email, $country, $state, $city, $zip_code, $ip_address, $unsubscribe_token);
    
    // Execute statement
    if (!$stmt->execute()) {
        // Check if error is due to duplicate email
        if ($conn->errno === 1062) {  // MySQL duplicate entry error code
            throw new InvalidArgumentException('This email is already registered. If you need to update your information, please contact us at xava@newmexicosocialists.org / Este correo ya está registrado. Si necesitas actualizar tu información, contáctanos en xava@newmexicosocialists.org');
        }
        throw new Exception('Failed to save submission. Please try again later.');
    }
    
    // Close statement and connection
    $stmt->close();
    $conn->close();
    
    // Send email notifications
    $email_data = [
        'name' => $name,
        'email' => $email,
        'country' => $country,
        'state' => $state,
        'city' => $city,
        'zip_code' => $zip_code,
        'ip_address' => $ip_address
    ];
    
    // Send admin notification email (log if it fails)
    $admin_email_sent = send_notification($email_data);
    if (!$admin_email_sent) {
        error_log("Failed to send admin notification for submission from: " . $email);
    }
    
    // Send welcome email to subscriber (log if it fails, but don't fail the request)
    try {
        $welcome_email_sent = send_welcome_email($email_data, $unsubscribe_token);
        if (!$welcome_email_sent) {
            error_log("Failed to send welcome email to: " . $email);
        }
    } catch (Exception $e) {
        error_log("Error sending welcome email to " . $email . ": " . $e->getMessage());
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
