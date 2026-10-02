import * as api from './api.js'

// Формируем параметры периода для запроса
const createPeriodParams = (period = {}) => {
  if (!period || typeof period !== 'object') {
    return {}
  }

  return {
    from: period.from,
    to: period.to,
  }
}

// Получаем общий баланс за выбранный период
export const getBalance = async (period = {}) => {
  const params = createPeriodParams(period)

  return api.get('/api/v1/summary', params)
}

// Получаем статистику по категориям
export const getByCategory = async (
  period = {},
  type = ''
) => {
  const params = {
    ...createPeriodParams(period),
    type,
  }

  return api.get('/api/v1/summary/category', params)
}

// Получаем статистику по месяцам
export const getMonthlySummary = async (period = {}) => {
  const params = createPeriodParams(period)

  return api.get('/api/v1/summary/month', params)
}