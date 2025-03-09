CREATE DATABASE wfh_app;

USE wfh_app;

CREATE TABLE karyawan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role ENUM('admin', 'karyawan') DEFAULT 'karyawan'
);

CREATE TABLE absensi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    karyawan_id INT,
    tanggal DATE,
    waktu TIME,
    foto VARCHAR(255),
    FOREIGN KEY (karyawan_id) REFERENCES karyawan(id)
);

-- Tambahkan data dummy untuk testing
INSERT INTO karyawan (nama, email, password, role) VALUES 
('Admin', 'admin@example.com', 'admin123', 'admin'),
('John Doe', 'john.doe@example.com', 'password123', 'karyawan'),
('Jane Smith', 'jane.smith@example.com', 'password456', 'karyawan');