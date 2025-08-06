<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['student_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized: No student ID in session."]);
    exit;
}

$student_id = $_SESSION['student_id'];

$query = "SELECT 
    id, msc_id, role, username, email, first_name, middle_name, last_name, name_suffix,
    birthdate, gender, student_no, year_level, college, program,
    section, address, phone, facebook_link, created_at
    FROM students WHERE id = :id";

$stmt = $pdo->prepare($query);
$stmt->execute(['id' => $student_id]);
$student = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$student) {
    http_response_code(404);
    echo json_encode(["error" => "Student not found."]);
    exit;
}

// Fetch school year start date
$syStmt = $pdo->prepare("SELECT value FROM settings WHERE key_name = 'school_year_start'");
$syStmt->execute();
$schoolYearStart = $syStmt->fetchColumn() ?: '2025-07-01';

$response = [
    "id" => $student["id"],
    "mscId" => $student["msc_id"],
    "role" => $student["role"],
    "username" => $student["username"],
    "email" => $student["email"],
    "firstName" => $student["first_name"],
    "middleName" => $student["middle_name"],
    "lastName" => $student["last_name"],
    "nameSuffix" => $student["name_suffix"],
    "birthdate" => $student["birthdate"],
    "gender" => $student["gender"],
    "studentNo" => $student["student_no"],
    "yearLevel" => $student["year_level"],
    "college" => $student["college"],
    "program" => $student["program"],
    "section" => $student["section"],
    "address" => $student["address"],
    "phone" => $student["phone"],
    "facebookLink" => $student["facebook_link"],
    "createdAt" => $student["created_at"],
    "eventsJoinedCount" => 0,
    "preregisteredEventsCount" => 0,
    "membershipStatus" => getMembershipStatus($student["created_at"], $schoolYearStart)
];

echo json_encode($response);

function getMembershipStatus($createdAt, $schoolYearStart) {
    $created = new DateTime($createdAt);
    $schoolYearStartDate = new DateTime($schoolYearStart);

    // Find the next school year start after createdAt
    $end = clone $schoolYearStartDate;
    while ($end <= $created) {
        $end->modify('+1 year');
    }

    $now = new DateTime();
    return ($now < $end) ? "Active" : "Inactive";
}
?>