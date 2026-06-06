<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

$db = getDB();
$stmt = $db->prepare('SELECT setting_key, setting_value FROM settings WHERE setting_key IN ("enroll_whatsapp_number")');
$stmt->execute();
$rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

$settings = [];
foreach ($rows as $row) {
    $settings[$row['setting_key']] = $row['setting_value'];
}
success($settings);
?>
