<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') error('Method not allowed', 405);

$db = getDB();

// Optional user check
$userId = 0;
$token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$token = str_replace('Bearer ', '', trim($token));
if (!empty($token)) {
    $decoded = base64_decode($token);
    $parts = explode(':', $decoded);
    $email = $parts[0] ?? '';
    if ($email) {
        $stmt = $db->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $res = $stmt->get_result();
        if ($res->num_rows > 0) {
            $userId = $res->fetch_assoc()['id'];
        }
    }
}

$stmt = $db->prepare('SELECT * FROM courses WHERE is_active = 1 ORDER BY created_at DESC');
$stmt->execute();
$rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

foreach ($rows as &$row) {
    if ($row['image']) {
        $row['image_url'] = UPLOAD_URL . $row['image'];
    }
    
    $row['is_enrolled'] = false;
    if ($userId > 0) {
        $checkStmt = $db->prepare('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?');
        $checkStmt->bind_param('ii', $userId, $row['id']);
        $checkStmt->execute();
        if ($checkStmt->get_result()->num_rows > 0) {
            $row['is_enrolled'] = true;
        }
    }
}
success($rows);
