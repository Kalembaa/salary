import * as expenseService from '../services/expenseService.js';

export function getAll(req, res, next) {
  try { res.status(200).json(expenseService.getAll(req.query)); } catch (error) { next(error); }
}
export function getById(req, res, next) {
  try {
    const expense = expenseService.getById(req.params.id);
    if (!expense) { const error = new Error('Расход не найден'); error.statusCode = 404; error.code = 'EXPENSE_NOT_FOUND'; throw error; }
    res.status(200).json(expense);
  } catch (error) { next(error); }
}
export function create(req, res, next) {
  try { res.status(201).json(expenseService.create(req.body)); } catch (error) { next(error); }
}
export function update(req, res, next) {
  try {
    const expense = expenseService.update(req.params.id, req.body);
    if (!expense) { const error = new Error('Расход не найден'); error.statusCode = 404; error.code = 'EXPENSE_NOT_FOUND'; throw error; }
    res.status(200).json(expense);
  } catch (error) { next(error); }
}
export function remove(req, res, next) {
  try {
    if (!expenseService.remove(req.params.id)) { const error = new Error('Расход не найден'); error.statusCode = 404; error.code = 'EXPENSE_NOT_FOUND'; throw error; }
    res.status(204).send();
  } catch (error) { next(error); }
}
