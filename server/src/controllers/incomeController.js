import * as incomeService from '../services/incomeService.js';

export function getAll(req, res, next) {
  try {
    const incomes = incomeService.getAll(
      req.user.id,
      req.query
    );

    res.status(200).json(incomes);
  } catch (error) {
    next(error);
  }
}

export function getById(req, res, next) {
  try {
    const income = incomeService.getById(
      req.user.id,
      req.params.id
    );

    if (!income) {
      const error = new Error('Доход не найден');
      error.statusCode = 404;
      error.code = 'INCOME_NOT_FOUND';
      throw error;
    }

    res.status(200).json(income);
  } catch (error) {
    next(error);
  }
}

export function create(req, res, next) {
  try {
    const income = incomeService.create(
      req.user.id,
      req.body
    );

    res.status(201).json(income);
  } catch (error) {
    next(error);
  }
}

export function update(req, res, next) {
  try {
    const income = incomeService.update(
      req.user.id,
      req.params.id,
      req.body
    );

    if (!income) {
      const error = new Error('Доход не найден');
      error.statusCode = 404;
      error.code = 'INCOME_NOT_FOUND';
      throw error;
    }

    res.status(200).json(income);
  } catch (error) {
    next(error);
  }
}

export function remove(req, res, next) {
  try {
    const deleted = incomeService.remove(
      req.user.id,
      req.params.id
    );

    if (!deleted) {
      const error = new Error('Доход не найден');
      error.statusCode = 404;
      error.code = 'INCOME_NOT_FOUND';
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}