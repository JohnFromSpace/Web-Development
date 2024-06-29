CREATE DATABASE panorama_db;

USE panorama_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE markers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    panorama VARCHAR(255) NOT NULL,
    pitch FLOAT NOT NULL,
    yaw FLOAT NOT NULL,
    label VARCHAR(255) NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
