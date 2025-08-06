<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require 'db.php';

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate
if (!isset($data['id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Missing announcement ID"
    ]);
    exit;
}

$id = intval($data['id']);

try {
    $stmt = $pdo->prepare("UPDATE announcements SET is_archived = 1 WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode([
        "success" => true,
        "message" => "Announcement archived successfully"
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error archiving announcement: " . $e->getMessage()
    ]);
}
