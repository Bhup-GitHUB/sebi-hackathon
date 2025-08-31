
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


CREATE TABLE balance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount DECIMAL(15,2) DEFAULT 0.00,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE balance_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL, -- 'credit' or 'debit'
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE INDEX idx_kyc_user_id ON kyc(user_id);
CREATE INDEX idx_kyc_pan ON kyc(pan);
CREATE INDEX idx_balance_user_id ON balance(user_id);
CREATE INDEX idx_balance_transactions_user_id ON balance_transactions(user_id);


INSERT INTO users (username, email, phone, password_hash, name) VALUES 
('testuser', 'test@example.com', '+919876543210', 'hashedpassword123', 'Test User');

-- Initialize balance for test user
INSERT INTO balance (user_id, amount) VALUES (1, 0.00);