<?php
session_start();
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($_SESSION['student_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No active session to logout"]);
    exit;
}

$user_id = $_SESSION['student_id'];
$username = $_SESSION['username'] ?? 'unknown';

session_unset();
session_destroy();

setcookie(session_name(), '', time() - 3600, '/');

echo json_encode([
    "message" => "Logout successful",
    "user_id" => $user_id,
    "username" => $username,
    "session" => "destroyed"
]);
?>