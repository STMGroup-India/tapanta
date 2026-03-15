<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

// Database config
$host = 'localhost';
$db   = 'u137290818_Tapanta_Expert';
$user = 'u137290818_tapanta';
$pass = 'Tapanta@2026'; // 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Auto-create experts table if not exists
$pdo->exec("CREATE TABLE IF NOT EXISTS experts (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    gender VARCHAR(30),
    category VARCHAR(255),
    specialty VARCHAR(255),
    experience INT DEFAULT 0,
    qualifications TEXT,
    bio TEXT,
    price INT DEFAULT 0,
    linkedin VARCHAR(500),
    availDays VARCHAR(100),
    availFrom VARCHAR(10),
    availTo VARCHAR(10),
    status VARCHAR(20) DEFAULT 'pending',
    rating DECIMAL(2,1) DEFAULT 0,
    reviews INT DEFAULT 0,
    appliedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)");

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// GET /api.php?action=approved
if ($method === 'GET' && $action === 'approved') {
    $stmt = $pdo->query("SELECT * FROM experts WHERE status = 'approved' ORDER BY appliedAt DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

// GET /api.php?action=all
if ($method === 'GET' && $action === 'all') {
    $stmt = $pdo->query("SELECT * FROM experts ORDER BY appliedAt DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

// GET /api.php?action=get&id=xxx
if ($method === 'GET' && $action === 'get') {
    $id = $_GET['id'] ?? '';
    $stmt = $pdo->prepare("SELECT * FROM experts WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($row ?: null);
    exit;
}

// POST /api.php?action=add
if ($method === 'POST' && $action === 'add') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) { echo json_encode(['error' => 'Invalid data']); exit; }
    $id = substr(base_convert(time(), 10, 36) . substr(str_shuffle('abcdefghijklmnopqrstuvwxyz0123456789'), 0, 4), 0, 16);
    $stmt = $pdo->prepare("INSERT INTO experts (id, name, email, phone, gender, category, specialty, experience, qualifications, bio, price, linkedin, availDays, availFrom, availTo, status, rating, reviews, appliedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 0, 0, NOW())");
    $stmt->execute([
        $id,
        $data['name'] ?? '',
        $data['email'] ?? '',
        $data['phone'] ?? '',
        $data['gender'] ?? '',
        $data['category'] ?? '',
        $data['specialty'] ?? '',
        intval($data['experience'] ?? 0),
        $data['qualifications'] ?? '',
        $data['bio'] ?? '',
        intval($data['price'] ?? 0),
        $data['linkedin'] ?? '',
        $data['availDays'] ?? '',
        $data['availFrom'] ?? '',
        $data['availTo'] ?? ''
    ]);
    echo json_encode(['success' => true, 'id' => $id]);
    exit;
}

// PATCH /api.php?action=approve&id=xxx
if ($method === 'PATCH' && $action === 'approve') {
    $id = $_GET['id'] ?? '';
    $stmt = $pdo->prepare("UPDATE experts SET status = 'approved' WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

// PATCH /api.php?action=reject&id=xxx
if ($method === 'PATCH' && $action === 'reject') {
    $id = $_GET['id'] ?? '';
    $stmt = $pdo->prepare("UPDATE experts SET status = 'rejected' WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

// DELETE /api.php?action=delete&id=xxx
if ($method === 'DELETE' && $action === 'delete') {
    $id = $_GET['id'] ?? '';
    $stmt = $pdo->prepare("DELETE FROM experts WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

echo json_encode(['error' => 'Unknown action']);
