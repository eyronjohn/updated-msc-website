<?php
session_start();
require 'db.php';

header("Content-Type: application/json");

$type = $_GET['type'] ?? 'all'; // 'active', 'archived', or 'all'

try {
    if ($type === 'active') {
        $stmt = $pdo->prepare("SELECT * FROM announcements WHERE is_archived = 0 ORDER BY date_posted DESC");
    } elseif ($type === 'archived') {
        $stmt = $pdo->prepare("SELECT * FROM announcements WHERE is_archived = 1 ORDER BY date_posted DESC");
    } else {
        $stmt = $pdo->prepare("SELECT * FROM announcements ORDER BY date_posted DESC");
    }

    $stmt->execute();
    $announcements = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "announcements" => $announcements
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage(),
        "announcements" => []
    ]);
}
