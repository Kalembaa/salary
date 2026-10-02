import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories.js';

function isValidDate(date) {
  if (typeof date !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsedDate = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === date;
}

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = 'VALIDATION_ERROR';
  return error;
}

export function validateTransaction(type) {
  return function validate(req, res, next) {
    try {
      const { amount, date, category } = req.body;
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        throw createValidationError('Сумма должна быть числом больше нуля');
      }
      if (!isValidDate(date)) {
        throw createValidationError('Дата должна быть корректной и иметь формат YYYY-MM-DD');
      }
      const categories = type === 'income' ? INCOME_CATEGORIES : type === 'expense' ? EXPENSE_CATEGORIES : null;
      if (!categories) throw createValidationError('Неизвестный тип финансовой операции');
      if (!categories.some((item) => item.id === category)) {
        throw createValidationError('Указана недопустимая категория');
      }
      req.body.amount = numericAmount;
      next();
    } catch (error) {
      next(error);
    }
  };
}
