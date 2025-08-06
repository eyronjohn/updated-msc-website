<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "student_portal");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Connection failed"]);
    exit();
}

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing event ID"]);
    exit();
}

$event_id = intval($_GET['id']);

$stmt = $conn->prepare("DELETE FROM events WHERE event_id = ?");
$stmt->bind_param("i", $event_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Event deleted successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to delete event"]);
}

$stmt->close();
$conn->close();
