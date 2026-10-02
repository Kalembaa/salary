export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || error.status || 500;
  const code = error.code || 'INTERNAL_SERVER_ERROR';
  const message = statusCode === 500 ? 'Внутренняя ошибка сервера' : error.message || 'Произошла ошибка';
  if (statusCode >= 500) console.error(error);
  res.status(statusCode).json({ error: { code, message } });
}
