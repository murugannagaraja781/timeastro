<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$body = json_decode(file_get_contents('php://input'), true);

$firstName = trim($body['first_name'] ?? '');
$lastName  = trim($body['last_name'] ?? '');
$username  = trim($body['username'] ?? '');
$email     = trim($body['email'] ?? '');
$mobile    = trim($body['mobile'] ?? '');
$password  = $body['password'] ?? '';
$plan      = $body['plan'] ?? 'free';

// Validate
if (!$firstName || !$lastName || !$username || !$email || !$mobile || !$password) {
    error('All fields are required');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    error('Invalid email address');
}
if (strlen($password) < 6) {
    error('Password must be at least 6 characters');
}

$db = getDB();

// Check duplicates
$stmt = $db->prepare('SELECT id FROM users WHERE email = ? OR username = ?');
$stmt->bind_param('ss', $email, $username);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    error('Email or username already exists');
}

// Generate approve token
$token = bin2hex(random_bytes(32));

// Hash password
$hashed = password_hash($password, PASSWORD_BCRYPT);

// Check auto-approve setting
$settingsStmt = $db->prepare('SELECT setting_value FROM settings WHERE setting_key = "auto_approve_users"');
$settingsStmt->execute();
$autoApproveResult = $settingsStmt->get_result();
$isAutoApprove = false;
if ($autoApproveResult->num_rows > 0) {
    $isAutoApprove = $autoApproveResult->fetch_assoc()['setting_value'] === '1';
}

$status = $isAutoApprove ? 'approved' : 'pending';
$stmt = $db->prepare('INSERT INTO users (first_name, last_name, username, email, mobile, password, plan, status, approve_token) VALUES (?,?,?,?,?,?,?,?,?)');
$stmt->bind_param('sssssssss', $firstName, $lastName, $username, $email, $mobile, $hashed, $plan, $status, $token);
if (!$stmt->execute()) {
    error('Registration failed. Please try again.');
}

$userId = $db->insert_id;

// Build WhatsApp message
$approveUrl  = BASE_URL . '/admin/approve_user.php?token=' . $token;
$rejectUrl   = BASE_URL . '/admin/approve_user.php?token=' . $token . '&action=reject';
$waMessage   = urlencode(
    "🌟 *New Signup - TimAstro*\n\n" .
    "👤 Name: {$firstName} {$lastName}\n" .
    "📧 Email: {$email}\n" .
    "📱 Mobile: {$mobile}\n" .
    "📋 Plan: {$plan}\n\n" .
    "✅ Approve: {$approveUrl}\n" .
    "❌ Reject: {$rejectUrl}\n\n" .
    "Sent automatically from TimAstro"
);

$waLink = 'https://wa.me/' . ADMIN_WHATSAPP . '?text=' . $waMessage;

$msg = $isAutoApprove ? 'Registration successful! You can now log in.' : 'Registration successful! Awaiting admin approval.';

success([
    'user_id'    => $userId,
    'wa_link'    => $waLink,
    'approve_url' => $approveUrl,
], $msg, 201);
