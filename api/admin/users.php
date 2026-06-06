<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();
requireAdmin();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $status = $_GET['status'] ?? '';
    if ($status && in_array($status, ['pending','approved','rejected'])) {
        $stmt = $db->prepare('SELECT id,first_name,last_name,username,email,mobile,plan,status,created_at FROM users WHERE status=? ORDER BY created_at DESC');
        $stmt->bind_param('s', $status);
    } else {
        $stmt = $db->prepare('SELECT id,first_name,last_name,username,email,mobile,plan,status,created_at FROM users ORDER BY created_at DESC');
    }
    $stmt->execute();
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    success($rows);
}

if ($method === 'POST') {
    $body   = json_decode(file_get_contents('php://input'), true);
    $userId = (int)($body['user_id'] ?? 0);
    $action = $body['action'] ?? ''; // 'approve' or 'reject'

    if (!$userId || !in_array($action, ['approve','reject'])) {
        error('Invalid request');
    }

    $newStatus = $action === 'approve' ? 'approved' : 'rejected';
    $stmt = $db->prepare('UPDATE users SET status=?, approve_token=NULL WHERE id=?');
    $stmt->bind_param('si', $newStatus, $userId);
    $stmt->execute();

    success([], "User {$newStatus} successfully");
}

error('Method not allowed', 405);
