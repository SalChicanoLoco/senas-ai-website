<?php
/**
 * New Mexico Socialists - Pledge Contribution Handler
 * Processes pledge contributions, stores them in MySQL database
 * and triggers bilingual coordination email notifications
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
define('FROM_NAME', 'New Mexico Socialists Portal');
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
 * Send welcome / thank you email to contributor (Bilingual)
 */
function send_contributor_thankyou($name, $email, $amount, $frequency, $platform) {
    // Sanitize email for headers
    $safe_email = str_replace(["\r", "\n", "%0d", "%0a"], '', $email);
    
    // Email subject (bilingual)
    $subject = 'Thank you for your pledge to NM Socialists / Gracias por tu contribución';
    
    // Platforms details
    $platformDetails = [
        'venmo' => 'Venmo details will be sent in a follow-up coordination email from Salvador.',
        'cashapp' => 'Cash App cashtag details will be coordinated shortly via email.',
        'paypal' => 'PayPal link details will be shared in a follow-up message.',
        'check' => 'Mailing address details will be sent shortly to arrange check delivery.',
        'other' => 'In-kind or alternative payment details will be coordinated with you directly.'
    ];
    
    $platformDetailsEs = [
        'venmo' => 'Los detalles de Venmo se enviarán en un correo de coordinación de seguimiento de Salvador.',
        'cashapp' => 'Los detalles de Cash App se coordinarán en breve a través de correo electrónico.',
        'paypal' => 'Los detalles de la cuenta de PayPal se compartirán en un mensaje de seguimiento.',
        'check' => 'La dirección postal se enviará en breve para organizar la entrega del cheque.',
        'other' => 'Los detalles de donaciones en especie o alternativas se coordinarán directamente con usted.'
    ];
    
    $platform_key = strtolower($platform);
    $detailEn = isset($platformDetails[$platform_key]) ? $platformDetails[$platform_key] : $platformDetails['other'];
    $detailEs = isset($platformDetailsEs[$platform_key]) ? $platformDetailsEs[$platform_key] : $platformDetailsEs['other'];
    
    // Email body (bilingual)
    $message = "Dear $name,\n\n";
    $message .= "Thank you for your generous pledge to support New Mexico Socialists! Your contribution helps us organize, print materials, and fund mutual aid projects.\n\n";
    $message .= "Your Pledge Summary:\n";
    $message .= "- Amount: $$amount ($frequency)\n";
    $message .= "- Preferred Method: " . strtoupper($platform) . "\n\n";
    $message .= "Coordination details:\n$detailEn\n\n";
    $message .= "Salvador Sena will reach out to you shortly to coordinate this contribution securely.\n\n";
    $message .= "Solidarity,\nNew Mexico Socialists\nsalvadorsena@senacolectivo.com\n\n";
    $message .= "---\n\n";
    $message .= "Estimado/a $name,\n\n";
    $message .= "¡Gracias por tu generoso compromiso para apoyar a New Mexico Socialists! Tu contribución nos ayuda a organizar, imprimir materiales y financiar proyectos de ayuda mutua.\n\n";
    $message .= "Resumen de tu contribución:\n";
    $message .= "- Cantidad: $$amount (" . ($frequency === 'monthly' ? 'mensual' : 'una sola vez') . ")\n";
    $message .= "- Método Preferido: " . strtoupper($platform) . "\n\n";
    $message .= "Detalles de coordinación:\n$detailEs\n\n";
    $message .= "Salvador Sena se pondrá en contacto contigo en breve para coordinar esta contribución de forma segura.\n\n";
    $message .= "En Solidaridad,\nNew Mexico Socialists\nsalvadorsena@senacolectivo.com\n";
    
    // Headers (CAN-SPAM compliant)
    $safe_from_name = str_replace(["\r", "\n", "%0d", "%0a"], '', FROM_NAME);
    $headers = "From: " . $safe_from_name . " <noreply@" . FROM_EMAIL_DOMAIN . ">\r\n";
    $headers .= "Reply-To: salvadorsena@senacolectivo.com\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    return mail($safe_email, $subject, $message, $headers);
}

/**
 * Send admin email alert
 */
function send_admin_alert($name, $email, $amount, $frequency, $platform, $note, $ip_address) {
    $subject = "New Pledge Contribution: $$amount via " . strtoupper($platform);
    
    $message = "New Pledge Contribution Received:\n\n";
    $message .= "Name: $name\n";
    $message .= "Email: $email\n";
    $message .= "Amount: $$amount\n";
    $message .= "Frequency: $frequency\n";
    $message .= "Platform: $platform\n";
    $message .= "Message: " . ($note ?: 'No message') . "\n\n";
    $message .= "Submitted: " . date('Y-m-d H:i:s') . "\n";
    $message .= "IP Address: $ip_address\n";
    
    // Sanitize email for Reply-To header
    $reply_to_email = str_replace(["\r", "\n", "%0d", "%0a"], '', $email);
    
    $safe_from_name = str_replace(["\r", "\n", "%0d", "%0a"], '', FROM_NAME);
    $headers = "From: " . $safe_from_name . " <noreply@" . FROM_EMAIL_DOMAIN . ">\r\n";
    $headers .= "Reply-To: $reply_to_email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    return mail(ADMIN_EMAIL, $subject, $message, $headers);
}

try {
    // Parse raw JSON or POST params
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (!$data) {
        $data = $_POST;
    }
    
    // Get parameters
    $name = isset($data['name']) ? sanitize_input($data['name']) : '';
    $email = isset($data['email']) ? sanitize_input($data['email']) : '';
    $amount = isset($data['amount']) ? sanitize_input($data['amount']) : '';
    $frequency = isset($data['frequency']) ? sanitize_input($data['frequency']) : 'one-time';
    $platform = isset($data['platform']) ? sanitize_input($data['platform']) : '';
    $message = isset($data['message']) ? sanitize_input($data['message']) : '';
    
    // Validate required fields
    if (empty($name) || empty($email) || empty($amount) || empty($platform)) {
        throw new InvalidArgumentException('Missing required fields / Faltan campos requeridos');
    }
    
    if (!validate_email($email)) {
        throw new InvalidArgumentException('Invalid email address / Dirección de correo no válida');
    }
    
    $numericAmount = floatval($amount);
    if ($numericAmount <= 0) {
        throw new InvalidArgumentException('Invalid amount / Cantidad no válida');
    }
    
    // Get IP address
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
    if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $forwarded_ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $ip_address = trim($forwarded_ips[0]);
    }
    if (!filter_var($ip_address, FILTER_VALIDATE_IP)) {
        $ip_address = null;
    }
    
    // Save to local database if connection works
    $db_saved = false;
    $db_error = null;
    
    try {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if (!$conn->connect_error) {
            $conn->set_charset('utf8mb4');
            
            // Check if pledges table exists or create it
            $conn->query("
                CREATE TABLE IF NOT EXISTS `pledges` (
                  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                  `name` VARCHAR(255) NOT NULL,
                  `email` VARCHAR(255) NOT NULL,
                  `amount` DECIMAL(10,2) NOT NULL,
                  `frequency` VARCHAR(50) NOT NULL DEFAULT 'one-time',
                  `platform` VARCHAR(50) NOT NULL,
                  `message` TEXT DEFAULT NULL,
                  `submitted_at` DATETIME NOT NULL,
                  `ip_address` VARCHAR(45) DEFAULT NULL,
                  PRIMARY KEY (`id`),
                  KEY `idx_platform` (`platform`),
                  KEY `idx_submitted_at` (`submitted_at`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            ");
            
            $stmt = $conn->prepare("
                INSERT INTO pledges (name, email, amount, frequency, platform, message, submitted_at, ip_address)
                VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)
            ");
            
            if ($stmt) {
                $stmt->bind_param('ssdssss', $name, $email, $numericAmount, $frequency, $platform, $message, $ip_address);
                if ($stmt->execute()) {
                    $db_saved = true;
                } else {
                    $db_error = $stmt->error;
                }
                $stmt->close();
            } else {
                $db_error = $conn->error;
            }
            $conn->close();
        } else {
            $db_error = $conn->connect_error;
        }
    } catch (Exception $e) {
        $db_error = $e->getMessage();
    }
    
    // Dispatch emails
    $admin_email_sent = send_admin_alert($name, $email, $numericAmount, $frequency, $platform, $message, $ip_address);
    $thankyou_email_sent = send_contributor_thankyou($name, $email, $numericAmount, $frequency, $platform);
    
    echo json_encode([
        'success' => true,
        'message' => 'Pledge received successfully! Check your email for next steps. / ¡Compromiso recibido! Revisa tu correo.',
        'db_saved' => $db_saved,
        'db_error' => $db_error,
        'admin_notified' => $admin_email_sent,
        'contributor_notified' => $thankyou_email_sent
    ]);
    
} catch (InvalidArgumentException $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log('Pledge submission error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected error occurred. Please try again later / Ocurrió un error inesperado. Por favor intenta más tarde.'
    ]);
}
?>
