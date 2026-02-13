<?php
/**
 * New Mexico Socialists - Unsubscribe Handler
 * Handles email unsubscribe requests via token-based links
 * CAN-SPAM Act compliant
 */

// Load database configuration
if (!file_exists('config.php')) {
    http_response_code(500);
    die('Configuration error. Please contact us at xava@newmexicosocialists.org');
}
require_once 'config.php';

// Verify required constants are defined
if (!defined('DB_HOST') || !defined('DB_NAME') || !defined('DB_USER') || !defined('DB_PASS')) {
    http_response_code(500);
    die('Configuration error. Please contact us at xava@newmexicosocialists.org');
}

// Rate limiting: Simple session-based rate limiting
session_start();
$rate_limit_key = 'unsubscribe_attempts';
$max_attempts = 10;
$time_window = 3600; // 1 hour

if (!isset($_SESSION[$rate_limit_key])) {
    $_SESSION[$rate_limit_key] = ['count' => 0, 'start_time' => time()];
}

// Reset counter if time window has passed
if (time() - $_SESSION[$rate_limit_key]['start_time'] > $time_window) {
    $_SESSION[$rate_limit_key] = ['count' => 0, 'start_time' => time()];
}

// Check rate limit
if ($_SESSION[$rate_limit_key]['count'] >= $max_attempts) {
    http_response_code(429);
    die('Too many requests. Please try again later.');
}

// Increment attempt counter
$_SESSION[$rate_limit_key]['count']++;

// Get and validate token
$token = isset($_GET['token']) ? trim($_GET['token']) : '';

if (empty($token)) {
    render_error_page('Invalid unsubscribe link', 'Enlace de baja no válido');
    exit;
}

// Validate token format (should be 64 hexadecimal characters)
if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
    render_error_page('Invalid unsubscribe token', 'Token de baja no válido');
    exit;
}

// Connect to database
try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        throw new Exception('Database connection failed');
    }
    
    $conn->set_charset('utf8mb4');
    
    // Check if token exists and get subscription info
    $stmt = $conn->prepare("SELECT id, email, unsubscribed FROM form_submissions WHERE unsubscribe_token = ?");
    if (!$stmt) {
        throw new Exception('Database error');
    }
    
    $stmt->bind_param('s', $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        $stmt->close();
        $conn->close();
        render_error_page('Unsubscribe link not found or expired', 'Enlace de baja no encontrado o expirado');
        exit;
    }
    
    $row = $result->fetch_assoc();
    $id = $row['id'];
    $email = $row['email'];
    $already_unsubscribed = $row['unsubscribed'];
    
    $stmt->close();
    
    // If already unsubscribed, show that status
    if ($already_unsubscribed) {
        $conn->close();
        render_already_unsubscribed_page($email);
        exit;
    }
    
    // Update database to mark as unsubscribed
    $update_stmt = $conn->prepare("UPDATE form_submissions SET unsubscribed = TRUE, unsubscribed_at = NOW() WHERE id = ?");
    if (!$update_stmt) {
        throw new Exception('Database error');
    }
    
    $update_stmt->bind_param('i', $id);
    
    if (!$update_stmt->execute()) {
        throw new Exception('Failed to update unsubscribe status');
    }
    
    $update_stmt->close();
    $conn->close();
    
    // Show success page
    render_success_page($email);
    
} catch (Exception $e) {
    error_log('Unsubscribe error: ' . $e->getMessage());
    http_response_code(500);
    render_error_page('An error occurred processing your request', 'Ocurrió un error al procesar tu solicitud');
}

/**
 * Render success page
 */
function render_success_page($email) {
    $safe_email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Unsubscribed / Dado de baja</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .container {
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                max-width: 600px;
                width: 100%;
                padding: 40px;
                text-align: center;
            }
            .icon {
                font-size: 64px;
                margin-bottom: 20px;
            }
            h1 {
                color: #2c3e50;
                margin-bottom: 20px;
                font-size: 28px;
            }
            .divider {
                height: 2px;
                background: linear-gradient(90deg, transparent, #667eea, transparent);
                margin: 30px 0;
            }
            p {
                font-size: 16px;
                color: #555;
                margin-bottom: 15px;
            }
            .email {
                font-weight: bold;
                color: #667eea;
            }
            .contact {
                margin-top: 30px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
            }
            .contact a {
                color: #667eea;
                text-decoration: none;
                font-weight: 500;
            }
            .contact a:hover {
                text-decoration: underline;
            }
            @media (max-width: 600px) {
                .container {
                    padding: 30px 20px;
                }
                h1 {
                    font-size: 24px;
                }
                p {
                    font-size: 14px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon" role="img" aria-label="Success checkmark">✓</div>
            <h1>You Have Been Unsubscribed</h1>
            <p>The email address <span class="email"><?php echo $safe_email; ?></span> has been successfully removed from our mailing list.</p>
            <p>You will no longer receive emails from New Mexico Socialists.</p>
            
            <div class="divider"></div>
            
            <h1>Te Has Dado de Baja</h1>
            <p>La dirección de correo <span class="email"><?php echo $safe_email; ?></span> ha sido eliminada exitosamente de nuestra lista de correo.</p>
            <p>Ya no recibirás correos de New Mexico Socialists.</p>
            
            <div class="contact">
                <p><strong>Want to rejoin or have questions?</strong><br>
                Contact us at <a href="mailto:xava@newmexicosocialists.org">xava@newmexicosocialists.org</a></p>
                <p><strong>¿Quieres volver a unirte o tienes preguntas?</strong><br>
                Contáctanos en <a href="mailto:xava@newmexicosocialists.org">xava@newmexicosocialists.org</a></p>
            </div>
        </div>
    </body>
    </html>
    <?php
}

/**
 * Render already unsubscribed page
 */
function render_already_unsubscribed_page($email) {
    $safe_email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Already Unsubscribed / Ya dado de baja</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .container {
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                max-width: 600px;
                width: 100%;
                padding: 40px;
                text-align: center;
            }
            .icon {
                font-size: 64px;
                margin-bottom: 20px;
            }
            h1 {
                color: #2c3e50;
                margin-bottom: 20px;
                font-size: 28px;
            }
            .divider {
                height: 2px;
                background: linear-gradient(90deg, transparent, #667eea, transparent);
                margin: 30px 0;
            }
            p {
                font-size: 16px;
                color: #555;
                margin-bottom: 15px;
            }
            .email {
                font-weight: bold;
                color: #667eea;
            }
            .contact {
                margin-top: 30px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
            }
            .contact a {
                color: #667eea;
                text-decoration: none;
                font-weight: 500;
            }
            .contact a:hover {
                text-decoration: underline;
            }
            @media (max-width: 600px) {
                .container {
                    padding: 30px 20px;
                }
                h1 {
                    font-size: 24px;
                }
                p {
                    font-size: 14px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon" role="img" aria-label="Information">ℹ️</div>
            <h1>Already Unsubscribed</h1>
            <p>The email address <span class="email"><?php echo $safe_email; ?></span> was already unsubscribed from our mailing list.</p>
            <p>You are not receiving emails from New Mexico Socialists.</p>
            
            <div class="divider"></div>
            
            <h1>Ya Dado de Baja</h1>
            <p>La dirección de correo <span class="email"><?php echo $safe_email; ?></span> ya estaba dada de baja de nuestra lista de correo.</p>
            <p>No estás recibiendo correos de New Mexico Socialists.</p>
            
            <div class="contact">
                <p><strong>Want to rejoin?</strong><br>
                Contact us at <a href="mailto:xava@newmexicosocialists.org">xava@newmexicosocialists.org</a></p>
                <p><strong>¿Quieres volver a unirte?</strong><br>
                Contáctanos en <a href="mailto:xava@newmexicosocialists.org">xava@newmexicosocialists.org</a></p>
            </div>
        </div>
    </body>
    </html>
    <?php
}

/**
 * Render error page
 */
function render_error_page($error_en, $error_es) {
    $safe_error_en = htmlspecialchars($error_en, ENT_QUOTES, 'UTF-8');
    $safe_error_es = htmlspecialchars($error_es, ENT_QUOTES, 'UTF-8');
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error / Error</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .container {
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                max-width: 600px;
                width: 100%;
                padding: 40px;
                text-align: center;
            }
            .icon {
                font-size: 64px;
                margin-bottom: 20px;
            }
            h1 {
                color: #e74c3c;
                margin-bottom: 20px;
                font-size: 28px;
            }
            .divider {
                height: 2px;
                background: linear-gradient(90deg, transparent, #e74c3c, transparent);
                margin: 30px 0;
            }
            p {
                font-size: 16px;
                color: #555;
                margin-bottom: 15px;
            }
            .contact {
                margin-top: 30px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
            }
            .contact a {
                color: #667eea;
                text-decoration: none;
                font-weight: 500;
            }
            .contact a:hover {
                text-decoration: underline;
            }
            @media (max-width: 600px) {
                .container {
                    padding: 30px 20px;
                }
                h1 {
                    font-size: 24px;
                }
                p {
                    font-size: 14px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon" role="img" aria-label="Warning">⚠️</div>
            <h1>Error</h1>
            <p><?php echo $safe_error_en; ?></p>
            
            <div class="divider"></div>
            
            <h1>Error</h1>
            <p><?php echo $safe_error_es; ?></p>
            
            <div class="contact">
                <p><strong>Need help?</strong><br>
                Contact us at <a href="mailto:xava@newmexicosocialists.org">xava@newmexicosocialists.org</a></p>
                <p><strong>¿Necesitas ayuda?</strong><br>
                Contáctanos en <a href="mailto:xava@newmexicosocialists.org">xava@newmexicosocialists.org</a></p>
            </div>
        </div>
    </body>
    </html>
    <?php
}
?>
