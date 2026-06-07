<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') error('Method not allowed', 405);

$admin = requireAdmin(); // ensures logged in admin and gets ['id', 'username']

$body        = json_decode(file_get_contents('php://input'), true);
$oldPassword = $body['old_password'] ?? '';
$newPassword = $body['new_password'] ?? '';

if (!$oldPassword || !$newPassword) {
    error('Old and new password are required');
}
if (strlen($newPassword) < 6) {
    error('New password must be at least 6 characters');
}

$db   = getDB();
$stmt = $db->prepare('SELECT password FROM admin WHERE id = ?');
$stmt->bind_param('i', $admin['id']);
$stmt->execute();
$row = $stmt->get_result()->fetch_assoc();

if (!password_verify($oldPassword, $row['password'])) {
    error('Incorrect old password', 400);
}

$hashed = password_hash($newPassword, PASSWORD_BCRYPT);
$stmt = $db->prepare('UPDATE admin SET password = ? WHERE id = ?');
$stmt->bind_param('si', $hashed, $admin['id']);

if ($stmt->execute()) {
    success([], 'Password changed successfully');
} else {
    error('Failed to change password');
}
