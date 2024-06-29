<?php
include 'config.php'; // Database connection file

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);
    $email = $_POST['email'];

    // Query to insert new user
    $query = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($query);
    if ($stmt) {
        $stmt->bind_param('sss', $username, $password, $email);

        if ($stmt->execute()) {
            header('Location: ../index.html');
            exit;
        } else {
            $error_message = 'Error: ' . $stmt->error;
        }
    } else {
        $error_message = 'Database query error: ' . $conn->error;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link rel="stylesheet" href="../styles/styles.css">
</head>
<body>
    <div id="auth">
        <h2>Register</h2>
        <form id="registerForm" method="POST" action="">
            <input type="text" name="username" id="regUsername" placeholder="Username" required>
            <input type="password" name="password" id="regPassword" placeholder="Password" required>
            <input type="email" name="email" id="regEmail" placeholder="Email" required>
            <?php if (isset($error_message)): ?>
                <div class="error-message"><?php echo $error_message; ?></div>
            <?php endif; ?>
            <button type="submit">Register</button>
        </form>
        <p>Already have an account? <a href="login.php">Login here</a></p>
    </div>
</body>
</html>




