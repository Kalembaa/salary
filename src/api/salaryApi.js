const API_BASE_URL = 'http://localhost:3001/api/v1';

// Универсальная функция для запросов к backend
async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error?.message || 'Ошибка при обращении к серверу'
    );
  }

  return data;
}

// Доходы
export function getIncomes() {
  return request('/incomes');
}

export function createIncome(income) {
  return request('/incomes', {
    method: 'POST',
    body: JSON.stringify(income),
  });
}

export function updateIncome(id, income) {
  return request(`/incomes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(income),
  });
}

export function deleteIncome(id) {
  return request(`/incomes/${id}`, {
    method: 'DELETE',
  });
}

// Расходы
export function getExpenses() {
  return request('/expenses');
}

export function createExpense(expense) {
  return request('/expenses', {
    method: 'POST',
    body: JSON.stringify(expense),
  });
}

export function updateExpense(id, expense) {
  return request(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expense),
  });
}

export function deleteExpense(id) {
  return request(`/expenses/${id}`, {
    method: 'DELETE',
  });
}

// Финансовая сводка
export function getSummary() {
  return request('/summary');
}

export function getSummaryByCategory() {
  return request('/summary/category');
}

export function getSummaryByMonth() {
  return request('/summary/month');
}