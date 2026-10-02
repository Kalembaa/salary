import {
  getExpenses,
  createExpense,
  updateExpense as updateExpenseApi,
  deleteExpense as deleteExpenseApi,
} from '../api/salaryApi.js';

import { EXPENSE_CATEGORIES } from '../utils/constants.js';

// Добавляем данные, необходимые существующему интерфейсу
function mapExpense(expense) {
  if (!expense) {
    return null;
  }

  const category = EXPENSE_CATEGORIES.find(
    (item) => item.id === expense.category
  );

  return {
    ...expense,
    type: 'expense',
    categoryLabel: category?.label || 'Прочее',
    amount: Number(expense.amount),
    isRecurring: Boolean(expense.isRecurring),
  };
}

// Получаем все расходы из backend
export async function getAllExpenses() {
  const result = await getExpenses();

  return result.data.map(mapExpense);
}

// Получаем один расход по ID
export async function getExpenseById(id = '') {
  const expenses = await getAllExpenses();

  return expenses.find((item) => item.id === id) ?? null;
}

// Добавляем расход в SQLite через backend
export async function addExpense(data = {}) {
  const expense = await createExpense({
    amount: Number(data.amount ?? 0),
    date:
      data.date ||
      new Date().toISOString().split('T')[0],
    category: data.category || 'other',
    comment: data.comment?.trim() || '',
    isRecurring: Boolean(data.isRecurring),
  });

  return mapExpense(expense);
}

// Обновляем расход в SQLite
export async function updateExpense(id = '', data = {}) {
  const expense = await updateExpenseApi(id, {
    amount: Number(data.amount ?? 0),
    date:
      data.date ||
      new Date().toISOString().split('T')[0],
    category: data.category || 'other',
    comment: data.comment?.trim() || '',
    isRecurring: Boolean(data.isRecurring),
  });

  return mapExpense(expense);
}

// Удаляем расход из SQLite
export async function deleteExpense(id = '') {
  await deleteExpenseApi(id);

  return true;
}