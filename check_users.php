<?php
require_once 'api/config.php';
try {
    $db = getDB();
    $r = $db->query('SELECT * FROM users');
    if (!$r) {
        echo "SQL Error: " . $db->error . "\n";
    } else {
        $users = $r->fetch_all(MYSQLI_ASSOC);
        echo "Row count: " . count($users) . "\n";
        print_r($users);
    }
} catch (Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
}
