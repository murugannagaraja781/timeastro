<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$body     = json_decode(file_get_contents('php://input'), true);
$username = trim($body['username'] ?? '');
$password = $body['password'] ?? '';

if (!$username || !$password) error('Username and password are required');

$db   = getDB();
$stmt = $db->prepare('SELECT id, username, password FROM admin WHERE username = ? LIMIT 1');
$stmt->bind_param('s', $username);
$stmt->execute();
$admin = $stmt->get_result()->fetch_assoc();

if (!$admin || !password_verify($password, $admin['password'])) {
    error('Invalid credentials', 401);
}

// Token = base64(username:timestamp)
$token = base64_encode($admin['username'] . ':' . time());

success([
    'token'    => $token,
    'username' => $admin['username'],
], 'Admin login successful');
