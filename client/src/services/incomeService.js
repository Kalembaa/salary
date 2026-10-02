import * as api from './api.js'

// Получаем список доходов с поддержкой фильтров
export const getIncomes = async (filters = {}) => {
  return api.get('/api/v1/incomes', filters)
}

// Получаем один доход по ID
export const getIncomeById = async (id) => {
  return api.get(`/api/v1/incomes/${id}`)
}

// Создаём новый доход
export const addIncome = async (incomeData) => {
  return api.post('/api/v1/incomes', incomeData)
}

// Обновляем существующий доход
export const updateIncome = async (id, data) => {
  return api.put(`/api/v1/incomes/${id}`, data)
}

// Удаляем доход
export const deleteIncome = async (id) => {
  await api.del(`/api/v1/incomes/${id}`)
}