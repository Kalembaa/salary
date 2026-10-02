export const TRANSACTION_TYPES = { INCOME: 'income', EXPENSE: 'expense' }
export const TRANSACTION_TYPE_LABELS = { income: 'Доход', expense: 'Расход' }

export const INCOME_CATEGORIES = [
  { id: 'salary', label: 'Зарплата' }, { id: 'freelance', label: 'Подработка' },
  { id: 'bonus', label: 'Премия' }, { id: 'debt_return', label: 'Возврат долга' },
  { id: 'deposit_interest', label: 'Проценты по вкладу' }, { id: 'gift', label: 'Подарок' },
  { id: 'other', label: 'Прочее' },
]

export const EXPENSE_CATEGORIES = [
  { id: 'groceries', label: 'Продукты' }, { id: 'utilities', label: 'Коммуналка' },
  { id: 'rent', label: 'Аренда' }, { id: 'subscriptions', label: 'Подписки' },
  { id: 'transport', label: 'Транспорт' }, { id: 'health', label: 'Здоровье' },
  { id: 'clothing', label: 'Одежда' }, { id: 'entertainment', label: 'Развлечения' },
  { id: 'communication', label: 'Связь' }, { id: 'other', label: 'Прочее' },
]

export const CATEGORY_MAP = { income: INCOME_CATEGORIES, expense: EXPENSE_CATEGORIES }
export const getCategoriesByType = (type) => CATEGORY_MAP[type] ?? EXPENSE_CATEGORIES
export const getCategoryLabel = (type, categoryId) => getCategoriesByType(type).find((item) => item.id === categoryId)?.label ?? 'Без категории'
