<?php
require_once 'config.php';
header('Content-Type: application/json');
$email = trim($_POST['email'] ?? '');
$list = trim($_POST['list_name'] ?? 'general');
if (!$email) { echo json_encode(['success'=>false]); exit; }
try {
 $pdo = new PDO(DB_DSN, DB_USER, DB_PASS);
 $stmt = $pdo->prepare("INSERT INTO newsletter_subscribers (email,list_name,created_at) VALUES (?,?,NOW())");
 $stmt->execute([$email,$list]);
} catch (Exception $e) {}
echo json_encode(['success'=>true]);
