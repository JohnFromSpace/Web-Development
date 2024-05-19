<?php

// Check if a POST request is received
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Read the data from the POST request
    $data = json_decode(file_get_contents("php://input"), true);

    // Initialize an array for errors
    $errors = array();

    // Validate the "name" field
    if (!isset($data["name"]) || strlen($data["name"]) < 2 || strlen($data["name"]) > 150) {
        $errors["name"] = "The name of the subject must be between 2 and 150 characters";
    }

    // Validate the "teacher" field
    if (!isset($data["teacher"]) || strlen($data["teacher"]) < 3 || strlen($data["teacher"]) > 200) {
        $errors["teacher"] = "The teacher's name must be between 3 and 200 characters";
    }

    // Validate the "description" field
    if (!isset($data["description"]) || strlen($data["description"]) < 10) {
        $errors["description"] = "The description must be at least 10 characters long";
    }

    // Validate the "group" field
    $valid_groups = array("М", "ПМ", "ОКН", "ЯКН");
    if (!isset($data["group"]) || !in_array($data["group"], $valid_groups)) {
        $errors["group"] = "Invalid group, choose one of М, ПМ, ОКН and ЯКН";
    }

    // Validate the "credits" field
    if (!isset($data["credits"]) || !is_numeric($data["credits"]) || $data["credits"] <= 0 || $data["credits"] != intval($data["credits"])) {
        $errors["credits"] = "The number of credits must be a positive integer";
    }

    // Check for errors
    if (count($errors) == 0) {
        // If there are no errors, output a success message in JSON format
        echo json_encode(array("success" => true));
    } else {
        // If there are errors, output the errors in JSON format
        echo json_encode(array("success" => false, "errors" => $errors));
    }
} else {
    // If the request is not POST, return an error
    echo json_encode(array("success" => false, "error" => "Please send the data using HTTP POST method"));
}

?>
