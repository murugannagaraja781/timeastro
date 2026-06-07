<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = file_get_contents('php://input');
    file_put_contents(__DIR__ . '/../../browser_debug.txt', $body . PHP_EOL, FILE_APPEND);
    success();
}
error('Method not allowed');
?>
