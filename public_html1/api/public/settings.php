<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

$db = getDB();
$stmt = $db->prepare('SELECT setting_key, setting_value FROM settings WHERE setting_key IN ("enroll_whatsapp_number", "site_title", "site_logo", "contact_number", "contact_email", "contact_address")');
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
?>
