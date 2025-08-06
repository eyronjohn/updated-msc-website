<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "student_portal");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Connection failed"]);
    exit();
}

$event_id = $_GET['id'] ?? null;

if (!$event_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing event ID"]);
    exit();
}

$stmt = $conn->prepare("SELECT * FROM events WHERE event_id = ?");
$stmt->bind_param("i", $event_id);
$stmt->execute();

$result = $stmt->get_result();
$event = $result->fetch_assoc();

echo json_encode($event);

$stmt->close();
$conn->close();
