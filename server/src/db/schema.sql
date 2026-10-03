CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email
ON users(email);


CREATE TABLE IF NOT EXISTS incomes (
  id TEXT PRIMARY KEY,
  user_id INTEGER,
  amount REAL NOT NULL CHECK(amount > 0),
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  comment TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  user_id INTEGER,
  amount REAL NOT NULL CHECK(amount > 0),
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  comment TEXT DEFAULT '',
  is_recurring INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);