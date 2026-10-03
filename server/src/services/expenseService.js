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

// Получаем только расходы текущего пользователя
export function getAll(userId, filters = {}) {
  const page = Math.max(
    1,
    Number(filters.page) || 1
  );

  const limit = Math.min(
    100,
    Math.max(1, Number(filters.limit) || 10)
  );

  const offset = (page - 1) * limit;

  const conditions = [
    'user_id = @userId',
  ];

  const params = {
    userId,
  };

  if (filters.category) {
    conditions.push('category = @category');
    params.category = filters.category;
  }

  if (filters.dateFrom) {
    conditions.push('date >= @dateFrom');
    params.dateFrom = filters.dateFrom;
  }

  if (filters.dateTo) {
    conditions.push('date <= @dateTo');
    params.dateTo = filters.dateTo;
  }

  if (
    filters.isRecurring !== undefined &&
    filters.isRecurring !== ''
  ) {
    conditions.push(
      'is_recurring = @isRecurring'
    );

    params.isRecurring =
      filters.isRecurring === true ||
      filters.isRecurring === 'true' ||
      filters.isRecurring === '1'
        ? 1
        : 0;
  }

  const whereClause =
    `WHERE ${conditions.join(' AND ')}`;

  const rows = db.prepare(`
    SELECT *
    FROM expenses
    ${whereClause}
    ORDER BY date DESC, created_at DESC
    LIMIT @limit OFFSET @offset
  `).all({
    ...params,
    limit,
    offset,
  });

  const total = Number(
    db.prepare(`
      SELECT COUNT(*) AS total
      FROM expenses
      ${whereClause}
    `).get(params).total
  );

  return {
    data: rows.map(mapExpense),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Получаем расход только текущего пользователя
export function getById(userId, id) {
  const row = db.prepare(`
    SELECT *
    FROM expenses
    WHERE id = ?
      AND user_id = ?
  `).get(id, userId);

  return mapExpense(row);
}

// Создаём расход для текущего пользователя
export function create(userId, data) {
  const id = randomUUID();

  db.prepare(`
    INSERT INTO expenses (
      id,
      user_id,
      amount,
      date,
      category,
      comment,
      is_recurring
    )
    VALUES (
      @id,
      @userId,
      @amount,
      @date,
      @category,
      @comment,
      @isRecurring
    )
  `).run({
    id,
    userId,
    amount: Number(data.amount),
    date: data.date,
    category: data.category,
    comment: data.comment ?? '',
    isRecurring: data.isRecurring ? 1 : 0,
  });

  return getById(userId, id);
}

// Изменяем только расход текущего пользователя
export function update(userId, id, data) {
  const result = db.prepare(`
    UPDATE expenses
    SET
      amount = @amount,
      date = @date,
      category = @category,
      comment = @comment,
      is_recurring = @isRecurring,
      updated_at = datetime('now')
    WHERE id = @id
      AND user_id = @userId
  `).run({
    id,
    userId,
    amount: Number(data.amount),
    date: data.date,
    category: data.category,
    comment: data.comment ?? '',
    isRecurring: data.isRecurring ? 1 : 0,
  });

  if (result.changes === 0) {
    return null;
  }

  return getById(userId, id);
}

// Удаляем только расход текущего пользователя
export function remove(userId, id) {
  const result = db.prepare(`
    DELETE FROM expenses
    WHERE id = ?
      AND user_id = ?
  `).run(id, userId);

  return result.changes > 0;
}