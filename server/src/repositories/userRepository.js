import db from '../db/connection.js';

// Ищем пользователя по email
export function findByEmail(email) {
  const statement = db.prepare(`
    SELECT
      id,
      name,
      email,
      password_hash,
      created_at
    FROM users
    WHERE email = ?
  `);

  return statement.get(email);
}

// Ищем пользователя по ID
export function findById(id) {
  const statement = db.prepare(`
    SELECT
      id,
      name,
      email,
      created_at
    FROM users
    WHERE id = ?
  `);

  return statement.get(id);
}

// Создаём нового пользователя
export function createUser({
  name,
  email,
  passwordHash,
}) {
  const statement = db.prepare(`
    INSERT INTO users (
      name,
      email,
      password_hash
    )
    VALUES (?, ?, ?)
  `);

  const result = statement.run(
    name,
    email,
    passwordHash
  );

  return findById(result.lastInsertRowid);
}