<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$conn = new mysqli("localhost", "root", "", "student_portal");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed."]));
}

$data = json_decode(file_get_contents("php://input"), true);

$event_id = $data['event_id'] ?? null;
if (!$event_id) {
    echo json_encode(["success" => false, "message" => "Event ID is required."]);
    exit;
}

$fields = [];
$params = [];
$types = "";

$possible_fields = [
  "event_name", "event_date", "event_time_start", "event_time_end", "event_duration",
  "location", "event_type", "registration_required", "event_status",
  "description", "image_url"
];

foreach ($possible_fields as $field) {
    if (isset($data[$field])) {
        $fields[] = "$field = ?";
        $params[] = $data[$field];
        $types .= "s";
    }
}

if (empty($fields)) {
    echo json_encode(["success" => false, "message" => "No fields to update."]);
    exit;
}

$params[] = $event_id;
$types .= "i";

$sql = "UPDATE events SET " . implode(", ", $fields) . " WHERE event_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed."]);
}
