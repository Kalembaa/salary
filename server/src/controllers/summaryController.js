import * as summaryService from '../services/summaryService.js';

// Возвращаем баланс текущего пользователя
export function getBalance(req, res, next) {
  try {
    const data = summaryService.getBalance(
      req.user.id
    );

    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Возвращаем статистику по категориям текущего пользователя
export function getByCategory(req, res, next) {
  try {
    const data = summaryService.getByCategory(
      req.user.id
    );

    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
}

// Возвращаем статистику по месяцам текущего пользователя
export function getByMonth(req, res, next) {
  try {
    const data = summaryService.getByMonth(
      req.user.id
    );

    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
}