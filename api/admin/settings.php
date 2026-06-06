<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();
requireAdmin();

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->prepare('SELECT setting_key, setting_value FROM settings');
    $stmt->execute();
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $settings = [];
    foreach ($rows as $row) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }
    success($settings);
}

if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    
    if (isset($body['auto_approve_users'])) {
        $stmt = $db->prepare('UPDATE settings SET setting_value = ? WHERE setting_key = "auto_approve_users"');
        $stmt->bind_param('s', $body['auto_approve_users']);
        $stmt->execute();
    }
    
    if (isset($body['enroll_whatsapp_number'])) {
        $stmt = $db->prepare('UPDATE settings SET setting_value = ? WHERE setting_key = "enroll_whatsapp_number"');
        $stmt->bind_param('s', $body['enroll_whatsapp_number']);
        $stmt->execute();
    }

    success([], 'Settings updated successfully');
}

error('Method not allowed', 405);
