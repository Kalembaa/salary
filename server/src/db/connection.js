import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const databaseDirectory = path.dirname(config.databasePath);

if (!fs.existsSync(databaseDirectory)) {
  fs.mkdirSync(databaseDirectory, { recursive: true });
}

const db = new Database(config.databasePath);

db.pragma('foreign_keys = ON');

const schemaPath = path.join(__dirname, 'schema.sql');

// Создаём отсутствующие таблицы и индексы
db.exec(fs.readFileSync(schemaPath, 'utf8'));

// Проверяем наличие столбца в таблице
function hasColumn(tableName, columnName) {
  const columns = db
    .prepare(`PRAGMA table_info(${tableName})`)
    .all();

  return columns.some(
    (column) => column.name === columnName
  );
}

// Обновляем существующую таблицу доходов
if (!hasColumn('incomes', 'user_id')) {
  db.exec(`
    ALTER TABLE incomes
    ADD COLUMN user_id INTEGER REFERENCES users(id);
  `);
}

// Обновляем существующую таблицу расходов
if (!hasColumn('expenses', 'user_id')) {
  db.exec(`
    ALTER TABLE expenses
    ADD COLUMN user_id INTEGER REFERENCES users(id);
  `);
}

// Создаём индексы после добавления столбцов
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_incomes_user_id
  ON incomes(user_id);

  CREATE INDEX IF NOT EXISTS idx_expenses_user_id
  ON expenses(user_id);
`);

export default db;