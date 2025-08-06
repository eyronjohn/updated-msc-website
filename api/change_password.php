<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();
require 'db.php';
header('Content-Type: application/json');

file_put_contents("debug_session.log", print_r($_SESSION, true));


// Check if the user is logged in
if (!isset($_SESSION['student_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (empty($data['current_password']) || empty($data['new_password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing fields."]);
    exit;
}

$currentPassword = $data['current_password'];
$newPassword = $data['new_password'];
$userId = $_SESSION['student_id'];

// Fetch current user password from DB
$sql = "SELECT password FROM students WHERE id = :id";
$stmt = $pdo->prepare($sql);
$stmt->execute(['id' => $userId]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($currentPassword, $user['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Current password is incorrect."]);
    exit;
}

// Hash new password
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

// Update password
$update = $pdo->prepare("UPDATE students SET password = :password WHERE id = :id");
$success = $update->execute([
    'password' => $hashedPassword,
    'id' => $userId
]);

if ($success) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update password."]);
}
?>
