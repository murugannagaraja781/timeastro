<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();
requireAdmin();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->prepare('SELECT * FROM offers ORDER BY created_at DESC');
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
    $title       = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    $link        = $_POST['link'] ?? '';
    $badge       = $_POST['badge'] ?? '';
    $isActive    = $_POST['is_active'] ?? 1;

    if (!$title) error('Title is required');

    $imageName = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $imageName = 'offer_' . time() . '_' . rand(100, 999) . '.' . $ext;
        move_uploaded_file($_FILES['image']['tmp_name'], UPLOAD_DIR . $imageName);
    }

    $stmt = $db->prepare('INSERT INTO offers (title, description, image, link, badge, is_active) VALUES (?,?,?,?,?,?)');
    $stmt->bind_param('sssssi', $title, $description, $imageName, $link, $badge, $isActive);
    if ($stmt->execute()) {
        success(['id' => $db->insert_id], 'Offer created successfully');
    } else {
        error('Failed to create offer');
    }
}

if ($method === 'PUT') {
    $body = json_decode(file_get_contents('php://input'), true);
    if (!$body && isset($_POST['_method']) && $_POST['_method'] === 'PUT') {
        $body = $_POST;
    }

    $id          = $body['id'] ?? 0;
    $title       = $body['title'] ?? '';
    $description = $body['description'] ?? '';
    $link        = $body['link'] ?? '';
    $badge       = $body['badge'] ?? '';
    $isActive    = $body['is_active'] ?? 1;

    if (!$id || !$title) error('ID and Title are required');

    $imageName = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $imageName = 'offer_' . time() . '_' . rand(100, 999) . '.' . $ext;
        move_uploaded_file($_FILES['image']['tmp_name'], UPLOAD_DIR . $imageName);
        
        $stmt = $db->prepare('UPDATE offers SET title=?, description=?, image=?, link=?, badge=?, is_active=? WHERE id=?');
        $stmt->bind_param('sssssii', $title, $description, $imageName, $link, $badge, $isActive, $id);
    } else {
        $stmt = $db->prepare('UPDATE offers SET title=?, description=?, link=?, badge=?, is_active=? WHERE id=?');
        $stmt->bind_param('ssssii', $title, $description, $link, $badge, $isActive, $id);
    }

    if ($stmt->execute()) {
        success([], 'Offer updated successfully');
    } else {
        error('Failed to update offer');
    }
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? 0;
    if (!$id) error('Offer ID is required');

    $stmt = $db->prepare('DELETE FROM offers WHERE id=?');
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        success([], 'Offer deleted successfully');
    } else {
        error('Failed to delete offer');
    }
}

error('Method not allowed', 405);
