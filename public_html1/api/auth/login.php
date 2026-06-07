<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$body     = json_decode(file_get_contents('php://input'), true);
$email    = trim($body['email'] ?? '');
$password = $body['password'] ?? '';

if (!$email || !$password) error('Email and password are required');

$db   = getDB();
$stmt = $db->prepare('SELECT id, first_name, last_name, username, email, password, status, plan FROM users WHERE email = ? LIMIT 1');
$stmt->bind_param('s', $email);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if (!$user || !password_verify($password, $user['password'])) {
    error('Invalid email or password', 401);
}

if ($user['status'] === 'pending') {
    error('Your account is awaiting admin approval. You will be notified via WhatsApp.', 403);
}

if ($user['status'] === 'rejected') {
    error('Your account has been rejected. Please contact admin.', 403);
}

// Simple token: base64(email:timestamp)
$token = base64_encode($user['email'] . ':' . time());

success([
    'token'      => $token,
    'user'       => [
        'id'         => $user['id'],
        'first_name' => $user['first_name'],
        'last_name'  => $user['last_name'],
        'username'   => $user['username'],
        'email'      => $user['email'],
        'plan'       => $user['plan'],
    ]
], 'Login successful');
