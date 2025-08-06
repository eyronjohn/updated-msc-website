<?php
session_start();
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$expectedFields = [
    'username', 'email', 'password', 'first_name', 'middle_name', 'last_name', 'name_suffix',
    'birthdate', 'gender', 'student_no', 'year_level', 'college', 'program',
    'section', 'address', 'phone', 'facebook_link'
];

// Optionally accept 'role' from frontend, default to 'member'
$role = isset($data['role']) && $data['role'] === 'officer' ? 'officer' : 'member';

$missing = [];
foreach ($expectedFields as $field) {
    if (!isset($data[$field]) || trim($data[$field]) === '') {
        $missing[] = $field;
    }
}

if (count($missing) > 0) {
    http_response_code(400);
    echo json_encode(["error" => "Missing fields: " . implode(', ', $missing)]);
    exit;
}

$check = $pdo->prepare("SELECT id FROM students WHERE username = :username OR email = :email");
$check->execute([
    'username' => $data['username'],
    'email' => $data['email']
]);
if ($check->fetch()) {
    http_response_code(409);
    echo json_encode(["error" => "Username or email already exists"]);
    exit;
}

$hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

// Get school year code from settings table
$syStmt = $pdo->prepare("SELECT value FROM settings WHERE key_name = 'school_year_code'");
$syStmt->execute();
$schoolYearCode = $syStmt->fetchColumn() ?: '2526';

// Insert student without msc_id first
$sql = "INSERT INTO students (
    username, email, password, first_name, middle_name, last_name, name_suffix,
    birthdate, gender, student_no, year_level, college, program,
    section, address, phone, facebook_link, role
) VALUES (
    :username, :email, :password, :first_name, :middle_name, :last_name, :name_suffix,
    :birthdate, :gender, :student_no, :year_level, :college, :program,
    :section, :address, :phone, :facebook_link, :role
)";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    'username' => $data['username'],
    'email' => $data['email'],
    'password' => $hashedPassword,
    'first_name' => $data['first_name'],
    'middle_name' => $data['middle_name'],
    'last_name' => $data['last_name'],
    'name_suffix' => $data['name_suffix'],
    'birthdate' => $data['birthdate'],
    'gender' => $data['gender'],
    'student_no' => $data['student_no'],
    'year_level' => $data['year_level'],
    'college' => $data['college'],
    'program' => $data['program'],
    'section' => $data['section'],
    'address' => $data['address'],
    'phone' => $data['phone'],
    'facebook_link' => $data['facebook_link'],
    'role' => $role
]);

$userId = $pdo->lastInsertId();

// Generate MSC ID
if ($role === 'officer') {
    // Count officers for this school year
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM students WHERE role = 'officer' AND msc_id LIKE CONCAT('MSC', :sy, 'EB-%')");
    $countStmt->execute(['sy' => $schoolYearCode]);
    $officerNumber = $countStmt->fetchColumn() + 1;
    $mscId = sprintf("MSC%sEB-%03d", $schoolYearCode, $officerNumber);
} else {
    // Count members
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM students WHERE role = 'member'");
    $countStmt->execute();
    $memberNumber = $countStmt->fetchColumn() + 1;
    $mscId = sprintf("MSC-%04d", $memberNumber);
}

// Update student with msc_id
$updateStmt = $pdo->prepare("UPDATE students SET msc_id = :msc_id WHERE id = :id");
$updateStmt->execute(['msc_id' => $mscId, 'id' => $userId]);

$_SESSION['student_id'] = $userId;
$_SESSION['username'] = $data['username'];

echo json_encode([
    "message" => "Registered successfully",
    "user_id" => $userId,
    "msc_id" => $mscId,
    "role" => $role,
    "session" => session_id()
]);