<?php
header('Content-Type: application/json');

// Database connection settings
$host = 'localhost';
$db = 'your_database';
$user = 'your_username';
$pass = 'your_password';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $panorama = $_POST['panorama'] ?? '';

    if ($panorama) {
        $stmt = $pdo->prepare('SELECT * FROM markers WHERE panorama = ?');
        $stmt->execute([$panorama]);
        $markers = $stmt->fetchAll();

        echo json_encode($markers);
    } else {
        echo json_encode(['error' => 'Panorama not specified']);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
