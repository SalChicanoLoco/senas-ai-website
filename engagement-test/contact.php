<?php
require_once 'config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success'=>false]);
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$org = trim($_POST['organization'] ?? '');
$interest = trim($_POST['interest'] ?? '');
$message = trim($_POST['message'] ?? '');
$preferred = trim($_POST['preferred_time'] ?? '');

if (!$name || !$email || !$message) {
    echo json_encode(['success'=>false]);
    exit;
}

try {
    $pdo = new PDO(DB_DSN, DB_USER, DB_PASS);
    $stmt = $pdo->prepare("INSERT INTO engagement_contacts (name,email,organization,interest,message,preferred_time,created_at) VALUES (?,?,?,?,?,?,NOW())");
    $stmt->execute([$name,$email,$org,$interest,$message,$preferred]);
} catch (Exception $e) {}

$body = "Name: $name\nEmail: $email\nOrg: $org\nInterest: $interest\nPreferred: $preferred\n\n$message";
mail(ADMIN_EMAIL,'New Lead',$body);

echo json_encode(['success'=>true]);
