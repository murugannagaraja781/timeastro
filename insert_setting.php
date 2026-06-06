<?php
require_once __DIR__ . '/api/config.php';
$db = getDB();
$db->query("INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('enroll_whatsapp_number', '919876543210')");
echo "Inserted enroll_whatsapp_number setting.";
?>
