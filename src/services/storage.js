const STORAGE_KEYS = { INCOMES: 'incomes', EXPENSES: 'expenses' }
const available = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
const read = (key) => {
  if (!available()) return []
  try { const value = JSON.parse(window.localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value : [] } catch { return [] }
}
const write = (key, data = []) => {
  if (!available()) return false
  try { window.localStorage.setItem(key, JSON.stringify(Array.isArray(data) ? data : [])); return true } catch { return false }
}
export const getIncomes = () => read(STORAGE_KEYS.INCOMES)
export const saveIncomes = (data = []) => write(STORAGE_KEYS.INCOMES, data)
export const getExpenses = () => read(STORAGE_KEYS.EXPENSES)
export const saveExpenses = (data = []) => write(STORAGE_KEYS.EXPENSES, data)
export const clearIncomes = () => { if (!available()) return false; localStorage.removeItem(STORAGE_KEYS.INCOMES); return true }
export const clearExpenses = () => { if (!available()) return false; localStorage.removeItem(STORAGE_KEYS.EXPENSES); return true }
export const clearAllStorage = () => clearIncomes() && clearExpenses()
export { STORAGE_KEYS }
