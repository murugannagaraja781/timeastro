<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error('Method not allowed', 405);

$token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$token = str_replace('Bearer ', '', trim($token));
if (empty($token)) error('Unauthorized. Please login first.', 401);

// Decode token (email:timestamp)
$decoded = base64_decode($token);
$parts = explode(':', $decoded);
$email = $parts[0] ?? '';

if (!$email) error('Invalid token', 401);

$db = getDB();

// Get user
$stmt = $db->prepare('SELECT id FROM users WHERE email = ? AND status = "approved" LIMIT 1');
$stmt->bind_param('s', $email);
$stmt->execute();
$res = $stmt->get_result();
if ($res->num_rows === 0) error('User not found or not approved', 401);

$user = $res->fetch_assoc();
$userId = $user['id'];

$body = json_decode(file_get_contents('php://input'), true);
$courseId = $body['course_id'] ?? 0;

if (!$courseId) error('Course ID is required');

// Check if already enrolled
$stmt = $db->prepare('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?');
$stmt->bind_param('ii', $userId, $courseId);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    error('You are already enrolled in this course');
}

// Enroll
$stmt = $db->prepare('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)');
$stmt->bind_param('ii', $userId, $courseId);
if ($stmt->execute()) {
    success([], 'Successfully enrolled in course!');
} else {
    error('Failed to enroll. Please try again later.');
}
