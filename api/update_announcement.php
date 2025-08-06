<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require 'db.php';

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate fields
if (
    !isset($data['id']) ||
    !isset($data['title']) ||
    !isset($data['announcement_text']) ||
    !isset($data['content']) ||
    !isset($data['posted_by'])
) {
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);
    exit;
}

$id = intval($data['id']);
$title = $data['title'];
$announcement_text = $data['announcement_text'];
$content = $data['content'];
$posted_by = $data['posted_by'];

try {
    $stmt = $pdo->prepare("UPDATE announcements SET title = ?, announcement_text = ?, content = ?, posted_by = ? WHERE id = ?");
    $stmt->execute([$title, $announcement_text, $content, $posted_by, $id]);

    echo json_encode([
        "success" => true,
        "message" => "Announcement updated successfully"
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
