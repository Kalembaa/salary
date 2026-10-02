import {
  getSummary as getSummaryApi,
  getSummaryByCategory,
  getSummaryByMonth,
} from '../api/salaryApi.js';

// Безопасно преобразуем значение в массив
const safe = (data) => (Array.isArray(data) ? data : []);

// Безопасно преобразуем сумму в число
const amount = (value) =>
  Number.isFinite(Number(value)) ? Number(value) : 0;

// Считаем общую сумму переданных операций
export const calculateTotal = (transactions = []) =>
  safe(transactions).reduce(
    (sum, item) => sum + amount(item?.amount),
    0
  );

// Считаем доходы из уже загруженного массива
export const getTotalIncome = (incomes = []) =>
  calculateTotal(incomes);

// Считаем расходы из уже загруженного массива
export const getTotalExpense = (expenses = []) =>
  calculateTotal(expenses);

// Считаем баланс из уже загруженных массивов
export const getBalance = (incomes = [], expenses = []) =>
  getTotalIncome(incomes) - getTotalExpense(expenses);

// Получаем основную сводку напрямую из backend
export async function getSummary() {
  return getSummaryApi();
}

// Группируем уже загруженные операции по категориям
export const groupByCategory = (transactions = []) =>
  Object.values(
    safe(transactions).reduce((result, item) => {
      const key = item?.category || 'other';

      if (!result[key]) {
        result[key] = {
          id: key,
          name: item?.categoryLabel || 'Без категории',
          value: 0,
        };
      }

      result[key].value += amount(item?.amount);

      return result;
    }, {})
  )
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

// Группируем доходы по категориям
export const getIncomeByCategory = (incomes = []) =>
  groupByCategory(incomes);

// Группируем расходы по категориям
export const getExpenseByCategory = (expenses = []) =>
  groupByCategory(expenses);

// Получаем сводку категорий непосредственно из backend
export async function getCategorySummary() {
  return getSummaryByCategory();
}

// Формируем подпись месяца
function monthLabel(key) {
  const [year, month] = key.split('-');

  return new Intl.DateTimeFormat('ru-RU', {
    month: 'short',
    year: 'numeric',
  }).format(
    new Date(Number(year), Number(month) - 1, 1)
  );
}

// Получаем месячную статистику из backend
export async function getMonthlySummary() {
  const rows = await getSummaryByMonth();

  return rows.map((item) => ({
    monthKey: item.month,
    month: monthLabel(item.month),
    income: amount(item.totalIncome),
    expense: amount(item.totalExpense),
    balance: amount(item.balance),
  }));
}

// Объединяем уже загруженные доходы и расходы
export const getAllTransactions = (
  incomes = [],
  expenses = []
) =>
  [
    ...safe(incomes),
    ...safe(expenses),
  ].sort(
    (a, b) =>
      new Date(b?.date || 0).getTime() -
      new Date(a?.date || 0).getTime()
  );