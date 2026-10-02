import db from '../db/connection.js';

export function getBalance() {
  const totalIncome = Number(db.prepare('SELECT COALESCE(SUM(amount), 0) AS total FROM incomes').get().total);
  const totalExpense = Number(db.prepare('SELECT COALESCE(SUM(amount), 0) AS total FROM expenses').get().total);
  return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
}

export function getByCategory() {
  const incomes = db.prepare('SELECT category, SUM(amount) AS total FROM incomes GROUP BY category ORDER BY total DESC').all();
  const expenses = db.prepare('SELECT category, SUM(amount) AS total FROM expenses GROUP BY category ORDER BY total DESC').all();
  return {
    incomes: incomes.map((row) => ({ category: row.category, total: Number(row.total) })),
    expenses: expenses.map((row) => ({ category: row.category, total: Number(row.total) })),
  };
}

export function getByMonth() {
  const rows = db.prepare(`
    WITH months AS (
      SELECT substr(date, 1, 7) AS month FROM incomes
      UNION
      SELECT substr(date, 1, 7) AS month FROM expenses
    ),
    income_totals AS (
      SELECT substr(date, 1, 7) AS month, SUM(amount) AS total FROM incomes GROUP BY substr(date, 1, 7)
    ),
    expense_totals AS (
      SELECT substr(date, 1, 7) AS month, SUM(amount) AS total FROM expenses GROUP BY substr(date, 1, 7)
    )
    SELECT months.month,
      COALESCE(income_totals.total, 0) AS total_income,
      COALESCE(expense_totals.total, 0) AS total_expense
    FROM months
    LEFT JOIN income_totals ON months.month = income_totals.month
    LEFT JOIN expense_totals ON months.month = expense_totals.month
    ORDER BY months.month DESC
  `).all();

  return rows.map((row) => {
    const totalIncome = Number(row.total_income);
    const totalExpense = Number(row.total_expense);
    return { month: row.month, totalIncome, totalExpense, balance: totalIncome - totalExpense };
  });
}
