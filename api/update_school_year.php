<?php
require_once 'db.php';
session_start();
header("Content-Type: application/json");

// (Optional) Only allow logged-in users (add more checks for admin/officer as needed)
if (!isset($_SESSION['student_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

// Parse input
$data = json_decode(file_get_contents("php://input"), true);
if (empty($data['school_year_code'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing school_year_code"]);
    exit;
}

// Update the school year code
$stmt = $pdo->prepare("UPDATE settings SET value = :val WHERE key_name = 'school_year_code'");
$stmt->execute(['val' => $data['school_year_code']]);

echo json_encode(["message" => "School year code updated"]);
?>