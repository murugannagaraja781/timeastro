<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

$db = getDB();
$stmt = $db->prepare('SELECT * FROM about_sections ORDER BY id ASC');
$stmt->execute();
$rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
foreach ($rows as &$row) {
    if ($row['image']) {
        $row['image_url'] = UPLOAD_URL . $row['image'];
    }
}
success($rows);
