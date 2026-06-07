<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();
requireAdmin();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->prepare('SELECT * FROM courses ORDER BY created_at DESC');
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
    $price       = $_POST['price'] ?? 0;
    $category    = $_POST['category'] ?? 'General';
    $duration    = $_POST['duration'] ?? '';
    $isActive    = $_POST['is_active'] ?? 1;

    if (!$title) error('Title is required');

    $imageName = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $imageName = 'course_' . time() . '_' . rand(100, 999) . '.' . $ext;
        move_uploaded_file($_FILES['image']['tmp_name'], UPLOAD_DIR . $imageName);
    }

    $stmt = $db->prepare('INSERT INTO courses (title, description, price, image, category, duration, is_active) VALUES (?,?,?,?,?,?,?)');
    $stmt->bind_param('ssdsssi', $title, $description, $price, $imageName, $category, $duration, $isActive);
    if ($stmt->execute()) {
        success(['id' => $db->insert_id], 'Course created successfully');
    } else {
        error('Failed to create course');
    }
}

if ($method === 'PUT') {
    // Parse form-data for PUT request with file is complex in PHP, 
    // so we typically use POST with _method=PUT or just handle raw JSON if no file.
    // For simplicity, we assume frontend sends JSON for updates without file, 
    // or POST with _method for file updates.
    $body = json_decode(file_get_contents('php://input'), true);
    if (!$body && isset($_POST['_method']) && $_POST['_method'] === 'PUT') {
        $body = $_POST;
    }

    $id          = $body['id'] ?? 0;
    $title       = $body['title'] ?? '';
    $description = $body['description'] ?? '';
    $price       = $body['price'] ?? 0;
    $category    = $body['category'] ?? 'General';
    $duration    = $body['duration'] ?? '';
    $isActive    = $body['is_active'] ?? 1;

    if (!$id || !$title) error('ID and Title are required');

    $imageName = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $imageName = 'course_' . time() . '_' . rand(100, 999) . '.' . $ext;
        move_uploaded_file($_FILES['image']['tmp_name'], UPLOAD_DIR . $imageName);
        
        $stmt = $db->prepare('UPDATE courses SET title=?, description=?, price=?, image=?, category=?, duration=?, is_active=? WHERE id=?');
        $stmt->bind_param('ssdsssii', $title, $description, $price, $imageName, $category, $duration, $isActive, $id);
    } else {
        $stmt = $db->prepare('UPDATE courses SET title=?, description=?, price=?, category=?, duration=?, is_active=? WHERE id=?');
        $stmt->bind_param('ssdsiii', $title, $description, $price, $category, $duration, $isActive, $id);
    }

    if ($stmt->execute()) {
        success([], 'Course updated successfully');
    } else {
        error('Failed to update course');
    }
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? 0;
    if (!$id) error('Course ID is required');

    $stmt = $db->prepare('DELETE FROM courses WHERE id=?');
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        success([], 'Course deleted successfully');
    } else {
        error('Failed to delete course');
    }
}

error('Method not allowed', 405);
