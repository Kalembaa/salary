import * as summaryService from '../services/summaryService.js';

export function getBalance(req, res, next) {
  try { res.status(200).json(summaryService.getBalance()); } catch (error) { next(error); }
}
export function getByCategory(req, res, next) {
  try { res.status(200).json(summaryService.getByCategory()); } catch (error) { next(error); }
}
export function getByMonth(req, res, next) {
  try { res.status(200).json(summaryService.getByMonth()); } catch (error) { next(error); }
}
