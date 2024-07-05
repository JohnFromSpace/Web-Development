Финална версия на Проекта

•	project_root/ <br />
•	├── server/ <br />
•	│   ├── config.php <br />
•	│   ├── login.php <br />
•	│   ├── register.php <br />
•	│   ├── save_marker.php <br />
•	│   ├── load_markers.php <br />
•	├── styles/ <br />
•	│   ├── styles.css <br />
•	├── scripts/ <br />
•	│   ├── scripts.js <br />
•	├── index.html <br />
•	├── main.html <br />

Инсталация
За да инсталирате приложението, първо трябва да инсталирате технологиите, които се използват за разработката:
1.	PHP - https://www.php.net/manual/en/install.php
2.	MySQL - https://www.apachefriends.org/ или директно може да инсталирате
3.	Инсталирайте XAMPP/MAMP.
4.	Клонирайте проекта в htdocs (за XAMPP) или Sites (за MAMP).
5.	Стартирайте Apache и MySQL сървърите.

Настройки на сървъра
<?php
session_start();
// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "panorama_db";

// Create connection
$conn = new mysqli($servername, $username,
$password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn
>connect_error);
}
?> 


Адрес за стартиране на приложението:
	http://localhost/your_project_directory/
