<?php
require_once __DIR__ . '/../config.php';
// This endpoint is accessed via browser link (no JSON, returns HTML)
header('Content-Type: text/html; charset=UTF-8');

$token  = trim($_GET['token'] ?? '');
$action = $_GET['action'] ?? 'approve';

if (empty($token)) {
    die('<h2 style="color:red">Invalid link.</h2>');
}

$db     = getDB();
$status = ($action === 'reject') ? 'rejected' : 'approved';

$stmt = $db->prepare('UPDATE users SET status = ?, approve_token = NULL WHERE approve_token = ?');
$stmt->bind_param('ss', $status, $token);
$stmt->execute();

if ($stmt->affected_rows === 0) {
    echo '<div style="font-family:sans-serif;text-align:center;padding:60px">
        <h2 style="color:orange">⚠️ Link already used or invalid.</h2>
        <p>This approval link has already been processed.</p>
    </div>';
    exit();
}

$icon  = $status === 'approved' ? '✅' : '❌';
$color = $status === 'approved' ? '#16a34a' : '#dc2626';
$label = $status === 'approved' ? 'Approved' : 'Rejected';

echo "<!DOCTYPE html>
<html lang='en'>
<head><meta charset='UTF-8'><title>User {$label} - TimAstro</title>
<meta name='viewport' content='width=device-width, initial-scale=1'>
<style>
  body{font-family:'Segoe UI',sans-serif;background:#0a0520;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
  .card{background:rgba(109,40,217,0.2);border:1px solid rgba(124,58,237,0.4);border-radius:20px;padding:48px;text-align:center;max-width:420px}
  h1{font-size:3rem;margin:0}
  h2{color:{$color}}
  p{color:#a78bfa}
  a{display:inline-block;margin-top:20px;padding:12px 24px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none}
</style>
</head>
<body>
  <div class='card'>
    <h1>{$icon}</h1>
    <h2>User {$label}!</h2>
    <p>The user account has been <strong>{$status}</strong> successfully.</p>
    <a href='http://localhost:3001/admin/dashboard'>Go to Admin Dashboard</a>
  </div>
</body>
</html>";
