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
        if ($row['setting_key'] === 'site_logo') {
            $settings[$row['setting_key']] = UPLOAD_URL . $row['setting_value'];
        } else {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
    }
    success($settings);
}

if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true) ?: [];
    
    $autoApprove = $_POST['auto_approve_users'] ?? $body['auto_approve_users'] ?? null;
    $whatsapp = $_POST['enroll_whatsapp_number'] ?? $body['enroll_whatsapp_number'] ?? null;
    $siteTitle = $_POST['site_title'] ?? $body['site_title'] ?? null;

    if ($autoApprove !== null) {
        $stmt = $db->prepare('UPDATE settings SET setting_value = ? WHERE setting_key = "auto_approve_users"');
        $stmt->bind_param('s', $autoApprove);
        $stmt->execute();
    }
    
    if ($whatsapp !== null) {
        $stmt = $db->prepare('UPDATE settings SET setting_value = ? WHERE setting_key = "enroll_whatsapp_number"');
        $stmt->bind_param('s', $whatsapp);
        $stmt->execute();
    }
    
    if ($siteTitle !== null) {
        $stmt = $db->prepare('UPDATE settings SET setting_value = ? WHERE setting_key = "site_title"');
        $stmt->bind_param('s', $siteTitle);
        $stmt->execute();
    }
    
    $contactNumber = $_POST['contact_number'] ?? $body['contact_number'] ?? null;
    $contactEmail = $_POST['contact_email'] ?? $body['contact_email'] ?? null;
    $contactAddress = $_POST['contact_address'] ?? $body['contact_address'] ?? null;

    if ($contactNumber !== null) {
        $stmt = $db->prepare('UPDATE settings SET setting_value = ? WHERE setting_key = "contact_number"');
        $stmt->bind_param('s', $contactNumber);
        $stmt->execute();
    }
    if ($contactEmail !== null) {
        $stmt = $db->prepare('UPDATE settings SET setting_value = ? WHERE setting_key = "contact_email"');
        $stmt->bind_param('s', $contactEmail);
        $stmt->execute();
    }
    if ($contactAddress !== null) {
        $stmt = $db->prepare('UPDATE settings SET setting_value = ? WHERE setting_key = "contact_address"');
        $stmt->bind_param('s', $contactAddress);
        $stmt->execute();
    }
    
    if (isset($_FILES['site_logo']) && $_FILES['site_logo']['error'] === UPLOAD_ERR_OK) {
        $ext = pathinfo($_FILES['site_logo']['name'], PATHINFO_EXTENSION);
        $filename = 'logo_' . time() . '.' . $ext;
        $dest = __DIR__ . '/../uploads/' . $filename;
        if (move_uploaded_file($_FILES['site_logo']['tmp_name'], $dest)) {
            $stmt = $db->prepare('UPDATE settings SET setting_value = ? WHERE setting_key = "site_logo"');
            $stmt->bind_param('s', $filename);
            $stmt->execute();
        }
    }

    success([], 'Settings updated successfully');
}

error('Method not allowed', 405);
