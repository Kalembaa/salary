import { getAllIncomes } from './incomeService.js'
import { getAllExpenses } from './expenseService.js'

const safe = (data) => Array.isArray(data) ? data : []
const amount = (value) => Number.isFinite(Number(value)) ? Number(value) : 0
export const calculateTotal = (transactions = []) => safe(transactions).reduce((sum, item) => sum + amount(item?.amount), 0)
export const getTotalIncome = (incomes = null) => calculateTotal(incomes === null ? getAllIncomes() : incomes)
export const getTotalExpense = (expenses = null) => calculateTotal(expenses === null ? getAllExpenses() : expenses)
export const getBalance = (incomes = null, expenses = null) => getTotalIncome(incomes) - getTotalExpense(expenses)
export const getSummary = (incomes = null, expenses = null) => {
  const totalIncome = getTotalIncome(incomes), totalExpense = getTotalExpense(expenses)
  return { totalIncome, totalExpense, balance: totalIncome - totalExpense }
}
export const groupByCategory = (transactions = []) => Object.values(safe(transactions).reduce((result, item) => {
  const key = item?.category || 'other'
  if (!result[key]) result[key] = { id: key, name: item?.categoryLabel || 'Без категории', value: 0 }
  result[key].value += amount(item?.amount)
  return result
}, {})).filter((item) => item.value > 0).sort((a,b) => b.value - a.value)
export const getIncomeByCategory = (incomes = null) => groupByCategory(incomes === null ? getAllIncomes() : incomes)
export const getExpenseByCategory = (expenses = null) => groupByCategory(expenses === null ? getAllExpenses() : expenses)

const monthKey = (date) => {
  const d = new Date(date)
  if (!date || Number.isNaN(d.getTime())) return null
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
}
const monthLabel = (key) => {
  const [year, month] = key.split('-')
  return new Intl.DateTimeFormat('ru-RU', { month: 'short', year: 'numeric' }).format(new Date(Number(year), Number(month)-1, 1))
}
export const getMonthlySummary = (incomes = null, expenses = null) => {
  const result = {}
  const apply = (items, field) => safe(items).forEach((item) => {
    const key = monthKey(item?.date); if (!key) return
    if (!result[key]) result[key] = { monthKey: key, month: monthLabel(key), income: 0, expense: 0 }
    result[key][field] += amount(item?.amount)
  })
  apply(incomes === null ? getAllIncomes() : incomes, 'income')
  apply(expenses === null ? getAllExpenses() : expenses, 'expense')
  return Object.values(result).sort((a,b) => a.monthKey.localeCompare(b.monthKey))
}
export const getAllTransactions = (incomes = null, expenses = null) => [
  ...safe(incomes === null ? getAllIncomes() : incomes),
  ...safe(expenses === null ? getAllExpenses() : expenses),
].sort((a,b) => new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime())
