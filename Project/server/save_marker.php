<?php
require 'config.php';

$panorama = $_POST['panorama'];
$marker = json_decode($_POST['marker'], true);
$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("INSERT INTO markers (panorama, pitch, yaw, label, user_id) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sddsi", $panorama, $marker['pitch'], $marker['yaw'], $marker['label'], $user_id);
$stmt->execute();
$stmt->close();

$conn->close();
echo "Marker saved successfully.";
?>
