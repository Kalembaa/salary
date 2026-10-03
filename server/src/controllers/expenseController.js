import * as expenseService from '../services/expenseService.js';

export function getAll(req, res, next) {
  try {
    const expenses = expenseService.getAll(
      req.user.id,
      req.query
    );

    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
}

export function getById(req, res, next) {
  try {
    const expense = expenseService.getById(
      req.user.id,
      req.params.id
    );

    if (!expense) {
      const error = new Error('Расход не найден');
      error.statusCode = 404;
      error.code = 'EXPENSE_NOT_FOUND';
      throw error;
    }

    res.status(200).json(expense);
  } catch (error) {
    next(error);
  }
}

export function create(req, res, next) {
  try {
    const expense = expenseService.create(
      req.user.id,
      req.body
    );

    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
}

export function update(req, res, next) {
  try {
    const expense = expenseService.update(
      req.user.id,
      req.params.id,
      req.body
    );

    if (!expense) {
      const error = new Error('Расход не найден');
      error.statusCode = 404;
      error.code = 'EXPENSE_NOT_FOUND';
      throw error;
    }

    res.status(200).json(expense);
  } catch (error) {
    next(error);
  }
}

export function remove(req, res, next) {
  try {
    const deleted = expenseService.remove(
      req.user.id,
      req.params.id
    );

    if (!deleted) {
      const error = new Error('Расход не найден');
      error.statusCode = 404;
      error.code = 'EXPENSE_NOT_FOUND';
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}