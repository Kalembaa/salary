import jwt from 'jsonwebtoken'

// Проверяем JWT-токен пользователя
export function requireAuth(req, res, next) {
  const authorization = req.headers.authorization

  if (!authorization) {
    return res.status(401).json({
      error: 'Требуется авторизация',
    })
  }

  const [type, token] = authorization.split(' ')

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'Некорректный токен авторизации',
    })
  }

  const secret = process.env.JWT_SECRET

  if (!secret) {
    console.error(
      'JWT_SECRET не задан в переменных окружения'
    )

    return res.status(500).json({
      error: 'Ошибка конфигурации сервера',
    })
  }

  try {
    const payload = jwt.verify(token, secret)

    req.user = {
      id: payload.userId,
      email: payload.email,
    }

    next()
  } catch (error) {
    return res.status(401).json({
      error: 'Недействительный или просроченный токен',
    })
  }
}