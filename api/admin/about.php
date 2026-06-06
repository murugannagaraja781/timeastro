<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();
requireAdmin();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->prepare('SELECT * FROM about_sections ORDER BY id ASC');
    $stmt->execute();
    $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    foreach ($rows as &$row) {
        if ($row['image']) {
            $row['image_url'] = UPLOAD_URL . $row['image'];
        }
    }
    success($rows);
}

if ($method === 'POST') {
    // Handle form data including potential image
    $sectionKey = $_POST['section_key'] ?? '';
    $title      = $_POST['title'] ?? '';
    $content    = $_POST['content'] ?? '';

    if (!$sectionKey || !$title) error('Section key and Title are required');

    $imageName = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $imageName = 'about_' . $sectionKey . '_' . time() . '.' . $ext;
        move_uploaded_file($_FILES['image']['tmp_name'], UPLOAD_DIR . $imageName);
    }

    if ($imageName) {
        $stmt = $db->prepare('INSERT INTO about_sections (section_key, title, content, image) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content), image=VALUES(image)');
        $stmt->bind_param('ssss', $sectionKey, $title, $content, $imageName);
    } else {
        $stmt = $db->prepare('INSERT INTO about_sections (section_key, title, content) VALUES (?,?,?) ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content)');
        $stmt->bind_param('sss', $sectionKey, $title, $content);
    }

    if ($stmt->execute()) {
        success([], 'About section updated successfully');
    } else {
        error('Failed to update about section');
    }
}

error('Method not allowed', 405);
