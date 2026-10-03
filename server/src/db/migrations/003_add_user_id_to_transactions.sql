-- Добавляем владельца каждой записи о доходе
ALTER TABLE incomes
ADD COLUMN user_id INTEGER REFERENCES users(id);

-- Добавляем владельца каждой записи о расходе
ALTER TABLE expenses
ADD COLUMN user_id INTEGER REFERENCES users(id);

-- Индексы для быстрого получения операций конкретного пользователя
CREATE INDEX IF NOT EXISTS idx_incomes_user_id
ON incomes(user_id);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id
ON expenses(user_id);