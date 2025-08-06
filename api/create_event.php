<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require 'db.php';

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
$requiredFields = [
  'event_name', 'event_date', 'event_time_start', 'event_time_end',
  'event_duration', 'location', 'event_type', 'registration_required',
  'event_status', 'description', 'image_url'
];

foreach ($requiredFields as $field) {
  if (empty($data[$field]) && $data[$field] !== "0") {
    echo json_encode([
      "success" => false,
      "message" => "Missing or empty required field: $field"
    ]);
    exit;
  }
}

// Prepare data
try {
  $stmt = $pdo->prepare("
    INSERT INTO events (
      event_name, event_date, event_time_start, event_time_end,
      event_duration, location, event_type, registration_required,
      event_status, description, image_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ");

  $stmt->execute([
    $data['event_name'],
    $data['event_date'],
    $data['event_time_start'],
    $data['event_time_end'],
    $data['event_duration'],
    $data['location'],
    $data['event_type'],
    $data['registration_required'],
    $data['event_status'],
    $data['description'],
    $data['image_url']
  ]);

  echo json_encode([
    "success" => true,
    "message" => "Event created successfully."
  ]);
} catch (Exception $e) {
  echo json_encode([
    "success" => false,
    "message" => "Database error: " . $e->getMessage()
  ]);
}
