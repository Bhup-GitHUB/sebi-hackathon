
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    kyc_status TEXT DEFAULT 'not_registered',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE kyc (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    pan TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    validated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE INDEX idx_kyc_user_id ON kyc(user_id);
CREATE INDEX idx_kyc_pan ON kyc(pan);


INSERT INTO users (username, email, phone, password_hash, name) VALUES 
('testuser', 'test@example.com', '+919876543210', 'hashedpassword123', 'Test User');