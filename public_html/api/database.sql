-- TimAstro Database Setup
-- Run this in phpMyAdmin inside your newly created database

-- Tables setup starts below

-- Admin table
CREATE TABLE IF NOT EXISTS `admin` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (password: admin@2026)
INSERT INTO `admin` (`username`, `password`)
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `mobile` VARCHAR(15) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `plan` ENUM('free','pro','premium') DEFAULT 'free',
  `status` ENUM('pending','approved','rejected') DEFAULT 'pending',
  `approve_token` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS `courses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10,2) DEFAULT 0.00,
  `image` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(100) DEFAULT 'General',
  `duration` VARCHAR(100) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default sample courses
INSERT INTO `courses` (`title`, `description`, `price`, `category`, `duration`) VALUES
('Basic Jothidam', 'Learn the fundamentals of Tamil astrology. Understand rasi, nakshatra and planetary movements.', 999.00, 'Beginner', '4 Weeks'),
('Horoscope Reading', 'Deep dive into reading and interpreting birth charts. Practical horoscope analysis.', 2499.00, 'Intermediate', '8 Weeks'),
('Numerology & Astrology', 'Combine the power of numbers with astrology for accurate predictions.', 1499.00, 'Beginner', '6 Weeks'),
('Advanced Jothidam', 'Master advanced techniques in Tamil astrology including muhurtham and prashna.', 4999.00, 'Advanced', '12 Weeks');

-- About sections table
CREATE TABLE IF NOT EXISTS `about_sections` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `section_key` VARCHAR(100) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT,
  `image` VARCHAR(255) DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default about content
INSERT INTO `about_sections` (`section_key`, `title`, `content`) VALUES
('hero', 'About MyAstroLabs', 'We are a dedicated team of Tamil astrology experts bringing ancient wisdom to the modern world.'),
('mission', 'Our Mission', 'To make authentic Tamil astrology accessible to everyone through technology and education.'),
('team', 'Meet Our Experts', 'Our team of certified Jothidam experts have decades of experience in Tamil astrology.'),
('contact', 'Contact Us', 'Reach out to us for personalized astrology consultations and course inquiries.');

-- Offers / Softer menu table
CREATE TABLE IF NOT EXISTS `offers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `image` VARCHAR(255) DEFAULT NULL,
  `link` VARCHAR(255) DEFAULT NULL,
  `badge` VARCHAR(50) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
