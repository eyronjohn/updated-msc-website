<?php
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'C:\xampp\apache\logs\error.log');

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

ob_start();

try {
    error_log("=== UPDATE PROFILE REQUEST START ===");

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    require_once __DIR__ . '/db.php';

    if (!isset($pdo)) {
        throw new Exception('Database connection failed');
    }

    if (!isset($_SESSION['student_id'])) {
        ob_clean();
        http_response_code(401);
        echo json_encode(['error' => 'Not authenticated']);
        exit;
    }

    $studentId = $_SESSION['student_id'];

    $input = file_get_contents("php://input");
    if (empty($input)) {
        ob_clean();
        http_response_code(400);
        echo json_encode(['error' => 'No input data received']);
        exit;
    }

    $data = json_decode($input, true);
    if ($data === null) {
        ob_clean();
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON: ' . json_last_error_msg()]);
        exit;
    }

    $checkStmt = $pdo->prepare("SELECT id FROM students WHERE id = ?");
    $checkStmt->execute([$studentId]);
    if (!$checkStmt->fetch()) {
        ob_clean();
        http_response_code(404);
        echo json_encode(['error' => 'Student record not found']);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE students SET 
        name_suffix = ?, 
        birthdate = ?, 
        gender = ?, 
        section = ?, 
        address = ?, 
        phone = ?, 
        facebook_link = ? 
        WHERE id = ?");

    $success = $stmt->execute([
        $data['nameSuffix'] ?? '',
        $data['birthdate'] ?? null,
        $data['gender'] ?? '',
        $data['section'] ?? '',
        $data['address'] ?? '',
        $data['phone'] ?? '',
        $data['facebookLink'] ?? '',
        $studentId
    ]);

    if (!$success) {
        $errorInfo = $stmt->errorInfo();
        throw new Exception('Update failed: ' . $errorInfo[2]);
    }

    ob_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Profile updated successfully',
        'rows_affected' => $stmt->rowCount()
    ]);

    error_log("=== UPDATE PROFILE REQUEST SUCCESS ===");

} catch (PDOException $e) {
    error_log("PDO Error: " . $e->getMessage());
    ob_clean();
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    ob_clean();
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}

ob_end_flush();
?>