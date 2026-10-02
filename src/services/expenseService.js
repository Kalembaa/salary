import { getExpenses, saveExpenses } from './storage.js'
const createId = () => typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `expense-${Date.now()}-${Math.random().toString(16).slice(2)}`
export const getAllExpenses = () => getExpenses()
export const getExpenseById = (id = '') => getAllExpenses().find((item) => item?.id === id) ?? null
export const addExpense = (data = {}) => {
  const item = { id: createId(), type: 'expense', category: data.category || 'other', categoryLabel: data.categoryLabel || 'Прочее', amount: Number(data.amount ?? 0), date: data.date || new Date().toISOString().split('T')[0], comment: data.comment?.trim() || '', createdAt: new Date().toISOString() }
  saveExpenses([...getAllExpenses(), item]); return item
}
export const updateExpense = (id = '', data = {}) => {
  const current = getExpenseById(id); if (!current) return null
  const updated = { ...current, ...data, id: current.id, type: 'expense', amount: Number(data.amount ?? current.amount ?? 0), updatedAt: new Date().toISOString() }
  saveExpenses(getAllExpenses().map((item) => item.id === id ? updated : item)); return updated
}
export const deleteExpense = (id = '') => {
  if (!getExpenseById(id)) return false
  saveExpenses(getAllExpenses().filter((item) => item.id !== id)); return true
}
