SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS forum_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE forum_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic_id INT NOT NULL,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (username, email) VALUES 
('admin_k23', 'admin@forum.local'),
('sv_nguyena', 'nguyena@student.edu.vn');

INSERT INTO topics (name, description) VALUES 
('Công nghệ thông tin', 'Thảo luận về Lập trình, DevOps, Kiến trúc hệ thống'),
('Thủ tục học tập', 'Giải đáp thắc mắc về môn học và tín chỉ');

INSERT INTO posts (topic_id, user_id, title, content) VALUES 
(1, 1, 'Hướng dẫn triển khai Docker Compose', 'Bài viết chi tiết về cấu hình Nginx, Prometheus và Loki.'),
(2, 2, 'Hỏi về lịch thi môn TKQT HTPM', 'Các bạn cho mình hỏi lịch thi cụ thể vào tuần nào thế?');

INSERT INTO comments (post_id, user_id, content) VALUES 
(1, 2, 'Bài viết rất hữu ích, cảm ơn admin!'),
(2, 1, 'Lịch thi chính thức sẽ được thông báo trên portal.');
