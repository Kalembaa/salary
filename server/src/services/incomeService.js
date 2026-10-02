import { randomUUID } from 'node:crypto';
import db from '../db/connection.js';

function mapIncome(row) {
  if (!row) return null;
  return {
    id: row.id,
    amount: Number(row.amount),
    date: row.date,
    category: row.category,
    comment: row.comment,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getAll(filters = {}) {
  const page = Math.max(1, Number(filters.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(filters.limit) || 10));
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = {};
  if (filters.category) { conditions.push('category = @category'); params.category = filters.category; }
  if (filters.dateFrom) { conditions.push('date >= @dateFrom'); params.dateFrom = filters.dateFrom; }
  if (filters.dateTo) { conditions.push('date <= @dateTo'); params.dateTo = filters.dateTo; }
  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = db.prepare(`SELECT * FROM incomes ${whereClause} ORDER BY date DESC, created_at DESC LIMIT @limit OFFSET @offset`).all({...params, limit, offset});
  const total = Number(db.prepare(`SELECT COUNT(*) AS total FROM incomes ${whereClause}`).get(params).total);
  return { data: rows.map(mapIncome), pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export function getById(id) {
  return mapIncome(db.prepare('SELECT * FROM incomes WHERE id = ?').get(id));
}

export function create(data) {
  const id = randomUUID();
  db.prepare('INSERT INTO incomes (id, amount, date, category, comment) VALUES (@id, @amount, @date, @category, @comment)')
    .run({ id, amount: Number(data.amount), date: data.date, category: data.category, comment: data.comment ?? '' });
  return getById(id);
}

export function update(id, data) {
  if (!getById(id)) return null;
  db.prepare("UPDATE incomes SET amount=@amount, date=@date, category=@category, comment=@comment, updated_at=datetime('now') WHERE id=@id")
    .run({ id, amount: Number(data.amount), date: data.date, category: data.category, comment: data.comment ?? '' });
  return getById(id);
}

export function remove(id) {
  return db.prepare('DELETE FROM incomes WHERE id = ?').run(id).changes > 0;
}
