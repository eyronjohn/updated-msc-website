<?php
session_start();
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['username']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "Username and password are required"]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM students WHERE username = :username OR email = :username");
$stmt->execute(['username' => $data['username']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($data['password'], $user['password'])) {
    http_response_code(401); 
    echo json_encode(["error" => "Invalid credentials"]);
    exit;
}

$_SESSION['student_id'] = $user['id'];
$_SESSION['username'] = $user['username'];

echo json_encode([
    "message" => "Login successful",
    "user_id" => $user['id'],
    "username" => $user['username'],
    "session" => session_id()
]);