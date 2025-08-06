-- Create database
CREATE DATABASE IF NOT EXISTS student_portal;
USE student_portal;

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    msc_id VARCHAR(32) UNIQUE,
    role ENUM('member', 'officer') DEFAULT 'member', 

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

    profile_image_path TEXT,
    is_active BOOLEAN,
    officer_role VARCHAR(20)
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255),
    event_date DATE,
    event_time_start TIME,
    event_time_end TIME,
    location TEXT,
    event_type ENUM('onsite', 'online', 'hybrid') DEFAULT 'onsite',
    registration_required BOOLEAN,
    event_status ENUM('upcoming', 'canceled', 'completed') DEFAULT 'upcoming',
    description TEXT,
    event_image_url TEXT,
    event_batch_image TEXT,
    attendants 
    event_restriction ENUM('public', 'members', 'officers'), 
);

CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    date_posted DATETIME DEFAULT CURRENT_TIMESTAMP,
    posted_by VARCHAR(100) DEFAULT 'Admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_archived BOOLEAN,
);
