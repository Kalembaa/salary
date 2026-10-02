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
db.exec(fs.readFileSync(schemaPath, 'utf8'));

export default db;
