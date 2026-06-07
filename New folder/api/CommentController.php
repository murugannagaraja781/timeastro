<?php
// c:/timeastro/api/CommentController.php
// Plain PHP controller for comment CRUD operations using PDO

class CommentController {
    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    // GET /comments
    public function listComments() {
        $stmt = $this->pdo->query('SELECT * FROM comments ORDER BY created_at DESC');
        $comments = $stmt->fetchAll();
        echo json_encode($comments);
    }

    // GET /comments/{id}
    public function getComment(int $id) {
        $stmt = $this->pdo->prepare('SELECT * FROM comments WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $comment = $stmt->fetch();
        if ($comment) {
            echo json_encode($comment);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Comment not found']);
        }
    }

    // POST /comments
    public function createComment() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['userName'], $data['text'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            return;
        }
        $stmt = $this->pdo->prepare('INSERT INTO comments (userName, text, created_at) VALUES (:userName, :text, NOW())');
        $stmt->execute([
            'userName' => $data['userName'],
            'text' => $data['text'],
        ]);
        $id = $this->pdo->lastInsertId();
        $this->getComment((int)$id);
    }

    // PUT /comments/{id}
    public function updateComment(int $id) {
        $data = json_decode(file_get_contents('php://input'), true);
        $fields = [];
        $params = ['id' => $id];
        if (isset($data['userName'])) { $fields[] = 'userName = :userName'; $params['userName'] = $data['userName']; }
        if (isset($data['text'])) { $fields[] = 'text = :text'; $params['text'] = $data['text']; }
        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            return;
        }
        $sql = 'UPDATE comments SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $this->getComment($id);
    }

    // DELETE /comments/{id}
    public function deleteComment(int $id) {
        $stmt = $this->pdo->prepare('DELETE FROM comments WHERE id = :id');
        $stmt->execute(['id' => $id]);
        echo json_encode(['status' => 'deleted']);
    }
}
?>
