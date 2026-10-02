import {
  getIncomes,
  createIncome,
  updateIncome as updateIncomeApi,
  deleteIncome as deleteIncomeApi,
} from '../api/salaryApi.js';

import { INCOME_CATEGORIES } from '../utils/constants.js';

// Добавляем данные, необходимые существующему интерфейсу
function mapIncome(income) {
  if (!income) {
    return null;
  }

  const category = INCOME_CATEGORIES.find(
    (item) => item.id === income.category
  );

  return {
    ...income,
    type: 'income',
    categoryLabel: category?.label || 'Прочее',
    amount: Number(income.amount),
  };
}

// Получаем все доходы из backend
export async function getAllIncomes() {
  const result = await getIncomes();

  return result.data.map(mapIncome);
}

// Получаем один доход по ID
export async function getIncomeById(id = '') {
  const incomes = await getAllIncomes();

  return incomes.find((item) => item.id === id) ?? null;
}

// Добавляем доход в SQLite через backend
export async function addIncome(data = {}) {
  const income = await createIncome({
    amount: Number(data.amount ?? 0),
    date:
      data.date ||
      new Date().toISOString().split('T')[0],
    category: data.category || 'other',
    comment: data.comment?.trim() || '',
  });

  return mapIncome(income);
}

// Обновляем доход в SQLite
export async function updateIncome(id = '', data = {}) {
  const income = await updateIncomeApi(id, {
    amount: Number(data.amount ?? 0),
    date:
      data.date ||
      new Date().toISOString().split('T')[0],
    category: data.category || 'other',
    comment: data.comment?.trim() || '',
  });

  return mapIncome(income);
}

// Удаляем доход из SQLite
export async function deleteIncome(id = '') {
  await deleteIncomeApi(id);

  return true;
}