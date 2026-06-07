<?php
// ============================================================
// CONFIGURATION — Edit these values
// ============================================================
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');          // XAMPP default: empty
define('DB_NAME', 'timeastro_db');

// ⚠️ CHANGE THIS to admin's actual WhatsApp number (with country code, no +)
define('ADMIN_WHATSAPP', '919876543210');  // e.g. 919876543210 for +91 98765 43210

// Base URL for approve links
define('BASE_URL', 'http://localhost/timeastro/api');

// Upload directory for images
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('UPLOAD_URL', 'http://localhost/timeastro/api/uploads/');

// ============================================================
// DB Connection
// ============================================================
function getDB(): mysqli {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        http_response_code(500);
        die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}

// ============================================================
// CORS + JSON headers
// ============================================================
function setCorsHeaders(): void {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Content-Type: application/json; charset=UTF-8');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// ============================================================
// Response helpers
// ============================================================
function success(array $data = [], string $message = 'OK', int $code = 200): void {
    http_response_code($code);
    echo json_encode(['success' => true, 'message' => $message, 'data' => $data]);
    exit();
}

function error(string $message, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    exit();
}

// ============================================================
// Admin session check (Bearer token = base64 of username)
// ============================================================
function requireAdmin(): array {
    $token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    
    // Fallback for Apache stripping Authorization header
    if (empty($token) && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $token = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }
    
    $token = str_replace('Bearer ', '', trim($token));
    if (empty($token)) error('Unauthorized: No token provided', 401);

    $decoded = base64_decode($token);
    $parts   = explode(':', $decoded);
    $uname   = $parts[0] ?? '';

    $db   = getDB();
    $stmt = $db->prepare('SELECT id, username FROM admin WHERE username = ? LIMIT 1');
    $stmt->bind_param('s', $uname);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows === 0) error('Unauthorized: Invalid token', 401);

    return $result->fetch_assoc();
}

// Ensure upload dir exists
if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}
