import * as incomeService from '../services/incomeService.js';

export function getAll(req, res, next) {
  try { res.status(200).json(incomeService.getAll(req.query)); } catch (error) { next(error); }
}
export function getById(req, res, next) {
  try {
    const income = incomeService.getById(req.params.id);
    if (!income) { const error = new Error('Доход не найден'); error.statusCode = 404; error.code = 'INCOME_NOT_FOUND'; throw error; }
    res.status(200).json(income);
  } catch (error) { next(error); }
}
export function create(req, res, next) {
  try { res.status(201).json(incomeService.create(req.body)); } catch (error) { next(error); }
}
export function update(req, res, next) {
  try {
    const income = incomeService.update(req.params.id, req.body);
    if (!income) { const error = new Error('Доход не найден'); error.statusCode = 404; error.code = 'INCOME_NOT_FOUND'; throw error; }
    res.status(200).json(income);
  } catch (error) { next(error); }
}
export function remove(req, res, next) {
  try {
    if (!incomeService.remove(req.params.id)) { const error = new Error('Доход не найден'); error.statusCode = 404; error.code = 'INCOME_NOT_FOUND'; throw error; }
    res.status(204).send();
  } catch (error) { next(error); }
}
