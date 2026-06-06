<?php
require 'api/config.php';
$db = getDB();
$res = $db->query("SELECT id, title FROM about_sections");
print_r($res->fetch_all(MYSQLI_ASSOC));
?>
