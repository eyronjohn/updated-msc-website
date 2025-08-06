-- Create database
CREATE DATABASE IF NOT EXISTS student_portal;
USE student_portal;

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    msc_id VARCHAR(32) UNIQUE,
    role ENUM('member', 'officer') DEFAULT 'member', -- member/officer

    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,

    first_name VARCHAR(100),
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    name_suffix VARCHAR(20),
    birthdate DATE,
    gender ENUM('Male', 'Female', 'Other'),

    student_no VARCHAR(50),
    year_level VARCHAR(20),
    college VARCHAR(100),
    program VARCHAR(100),
    section VARCHAR(50),
    address TEXT,
    phone VARCHAR(20),
    facebook_link VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    events_joined_count INT DEFAULT 0,
    preregistered_events_count INT DEFAULT 0
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255),
    event_date DATE,
    event_time_start TIME,
    event_time_end TIME,
    event_duration VARCHAR(50), -- e.g., "8 hours", "2 days"
    location VARCHAR(255),
    event_type ENUM('onsite', 'online', 'hybrid') DEFAULT 'onsite',
    registration_required TINYINT(1) DEFAULT 1,
    event_status ENUM('upcoming', 'past', 'canceled', 'completed') DEFAULT 'upcoming',
    description TEXT,
    image_url VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    announcement_text TEXT NOT NULL,
    content TEXT,
    date_posted DATETIME DEFAULT CURRENT_TIMESTAMP,
    posted_by VARCHAR(100) DEFAULT 'Admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_archived TINYINT(1) DEFAULT 0
);

-- Event Insertions
INSERT INTO events (event_name, event_date, event_time_start, event_time_end, event_duration, location, event_type, registration_required, event_status, description, image_url) VALUES 
('Salubong', '2025-07-28', '09:00:00', '17:00:00', '8 hours', 'Roxas Hall', 'onsite', TRUE, 'upcoming', 'Welcome event for new MSC members.', 'For-Landing-Page/msc001.jpg');