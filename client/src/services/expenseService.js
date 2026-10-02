import * as api from './api.js'

// Получаем список расходов с поддержкой фильтров
export const getExpenses = async (filters = {}) => {
  return api.get('/api/v1/expenses', filters)
}

// Получаем один расход по ID
export const getExpenseById = async (id) => {
  return api.get(`/api/v1/expenses/${id}`)
}

// Создаём новый расход
export const addExpense = async (expenseData) => {
  return api.post('/api/v1/expenses', expenseData)
}

// Обновляем существующий расход
export const updateExpense = async (id, data) => {
  return api.put(`/api/v1/expenses/${id}`, data)
}

// Удаляем расход
export const deleteExpense = async (id) => {
  await api.del(`/api/v1/expenses/${id}`)
}