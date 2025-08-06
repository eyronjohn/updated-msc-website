<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "student_portal");

if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

$query = "SELECT event_id, event_name, event_date, event_time_start, event_time_end, event_status FROM events";
$result = $conn->query($query);

$calendarEvents = [];

while ($row = $result->fetch_assoc()) {
    $startDateTime = $row['event_date'];
    if (!empty($row['event_time_start'])) {
        $startDateTime .= "T" . $row['event_time_start'];
    }

    $endDateTime = $row['event_date'];
    if (!empty($row['event_time_end'])) {
        $endDateTime .= "T" . $row['event_time_end'];
    }

    $calendarEvents[] = [
        "id" => $row['event_id'],
        "title" => $row['event_name'],
        "start" => $startDateTime,
        "end" => $endDateTime,
        "status" => $row['event_status'],
    ];
}

echo json_encode($calendarEvents);
