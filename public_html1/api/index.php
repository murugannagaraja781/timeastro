<?php
// c:/timeastro/api/index.php
// Simple front controller for the TimeAstro plain PHP API

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/CommentController.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
// Remove any leading /api segment if present
$uri = preg_replace('#^/api#', '', $uri);
$uri = trim($uri, '/');

$controller = new CommentController($pdo);

switch ($method) {
    case 'GET':
        if ($uri === 'comments' || $uri === '') {
            // List all comments
            $controller->listComments();
        } elseif (preg_match('#^comments/([0-9]+)$#', $uri, $matches)) {
            $controller->getComment((int)$matches[1]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Not Found']);
        }
        break;
    case 'POST':
        if ($uri === 'comments') {
            $controller->createComment();
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Not Found']);
        }
        break;
    case 'PUT':
        if (preg_match('#^comments/([0-9]+)$#', $uri, $matches)) {
            $controller->updateComment((int)$matches[1]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Not Found']);
        }
        break;
    case 'DELETE':
        if (preg_match('#^comments/([0-9]+)$#', $uri, $matches)) {
            $controller->deleteComment((int)$matches[1]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Not Found']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}
?>
