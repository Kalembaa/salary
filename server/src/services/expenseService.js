import { randomUUID } from 'node:crypto';
import db from '../db/connection.js';

function mapExpense(row) {
  if (!row) return null;
  return {
    id: row.id,
    amount: Number(row.amount),
    date: row.date,
    category: row.category,
    comment: row.comment,
    isRecurring: Boolean(row.is_recurring),
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
  if (filters.isRecurring !== undefined && filters.isRecurring !== '') {
    conditions.push('is_recurring = @isRecurring');
    params.isRecurring = filters.isRecurring === true || filters.isRecurring === 'true' || filters.isRecurring === '1' ? 1 : 0;
  }
  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = db.prepare(`SELECT * FROM expenses ${whereClause} ORDER BY date DESC, created_at DESC LIMIT @limit OFFSET @offset`).all({...params, limit, offset});
  const total = Number(db.prepare(`SELECT COUNT(*) AS total FROM expenses ${whereClause}`).get(params).total);
  return { data: rows.map(mapExpense), pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export function getById(id) {
  return mapExpense(db.prepare('SELECT * FROM expenses WHERE id = ?').get(id));
}

export function create(data) {
  const id = randomUUID();
  db.prepare('INSERT INTO expenses (id, amount, date, category, comment, is_recurring) VALUES (@id, @amount, @date, @category, @comment, @isRecurring)')
    .run({ id, amount: Number(data.amount), date: data.date, category: data.category, comment: data.comment ?? '', isRecurring: data.isRecurring ? 1 : 0 });
  return getById(id);
}

export function update(id, data) {
  if (!getById(id)) return null;
  db.prepare("UPDATE expenses SET amount=@amount, date=@date, category=@category, comment=@comment, is_recurring=@isRecurring, updated_at=datetime('now') WHERE id=@id")
    .run({ id, amount: Number(data.amount), date: data.date, category: data.category, comment: data.comment ?? '', isRecurring: data.isRecurring ? 1 : 0 });
  return getById(id);
}

export function remove(id) {
  return db.prepare('DELETE FROM expenses WHERE id = ?').run(id).changes > 0;
}
