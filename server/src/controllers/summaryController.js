import * as summaryService from '../services/summaryService.js'

// Возвращаем общий баланс
export function getBalance(req, res, next) {
  try {
    const data = summaryService.getBalance()

    res.status(200).json({
      data,
    })
  } catch (error) {
    next(error)
  }
}

// Возвращаем статистику по категориям
export function getByCategory(req, res, next) {
  try {
    const data = summaryService.getByCategory()

    res.status(200).json({
      data,
    })
  } catch (error) {
    next(error)
  }
}

// Возвращаем статистику по месяцам
export function getByMonth(req, res, next) {
  try {
    const data = summaryService.getByMonth()

    res.status(200).json({
      data,
    })
  } catch (error) {
    next(error)
  }
}