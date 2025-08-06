<?php
require 'db.php';
header('Content-Type: application/json');


$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['student_no']) || empty($data['last_name']) || empty($data['birthdate'])) {
    http_response_code(400);
    echo json_encode(["error" => "All fields are required"]);
    exit;
}

$sql = "SELECT id, username, email FROM students
        WHERE student_no = :student_no
          AND last_name = :last_name
          AND birthdate = :birthdate";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    'student_no' => $data['student_no'],
    'last_name' => $data['last_name'],
    'birthdate' => $data['birthdate']
]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo json_encode([
        "match" => true,
        "message" => "Student found",
        "data" => [
            "username" => $user['username'],
            "email" => $user['email']
        ]
    ]);
} else {
    http_response_code(404);
    echo json_encode([
        "match" => false,
        "message" => "No student matched that information"
    ]);
}