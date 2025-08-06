<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Include DB connection
require_once 'db.php';

// Check for POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
    exit;
}

// Get raw input data
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
$title = trim($data['title'] ?? '');
$announcement_text = trim($data['announcement_text'] ?? '');
$content = trim($data['content'] ?? '');
$posted_by = trim($data['posted_by'] ?? 'Admin');

if (empty($title) || empty($announcement_text)) {
    echo json_encode(["success" => false, "message" => "Title and announcement text are required."]);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO announcements (title, announcement_text, content, posted_by) VALUES (?, ?, ?, ?)");
    $stmt->execute([$title, $announcement_text, $content, $posted_by]);

    echo json_encode(["success" => true, "message" => "Announcement created successfully."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
