<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');
$conn = new mysqli("localhost", "root", "", "student_portal");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed"]));
}

$status = $_GET['status'] ?? '';
$search = $_GET['search'] ?? '';

$query = "SELECT * FROM events WHERE 1";

if ($status !== '') {
    $query .= " AND event_status = ?";
}

if ($search !== '') {
    $query .= " AND event_name LIKE ?";
}

$stmt = $conn->prepare($query);

if ($status !== '' && $search !== '') {
    $like = "%$search%";
    $stmt->bind_param("ss", $status, $like);
} elseif ($status !== '') {
    $stmt->bind_param("s", $status);
} elseif ($search !== '') {
    $like = "%$search%";
    $stmt->bind_param("s", $like);
}

$stmt->execute();
$result = $stmt->get_result();

$events = [];

while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}

echo json_encode(["events" => $events]);

