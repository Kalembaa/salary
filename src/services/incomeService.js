import { getIncomes, saveIncomes } from './storage.js'
const createId = () => typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `income-${Date.now()}-${Math.random().toString(16).slice(2)}`
export const getAllIncomes = () => getIncomes()
export const getIncomeById = (id = '') => getAllIncomes().find((item) => item?.id === id) ?? null
export const addIncome = (data = {}) => {
  const item = { id: createId(), type: 'income', category: data.category || 'other', categoryLabel: data.categoryLabel || 'Прочее', amount: Number(data.amount ?? 0), date: data.date || new Date().toISOString().split('T')[0], comment: data.comment?.trim() || '', createdAt: new Date().toISOString() }
  saveIncomes([...getAllIncomes(), item]); return item
}
export const updateIncome = (id = '', data = {}) => {
  const current = getIncomeById(id); if (!current) return null
  const updated = { ...current, ...data, id: current.id, type: 'income', amount: Number(data.amount ?? current.amount ?? 0), updatedAt: new Date().toISOString() }
  saveIncomes(getAllIncomes().map((item) => item.id === id ? updated : item)); return updated
}
export const deleteIncome = (id = '') => {
  if (!getIncomeById(id)) return false
  saveIncomes(getAllIncomes().filter((item) => item.id !== id)); return true
}
