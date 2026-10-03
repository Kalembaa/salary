import * as authService from '../services/authService.js'

// Регистрация нового пользователя
export async function register(req, res) {
  try {
    const result = await authService.register(req.body)

    return res.status(201).json({
      data: result,
    })
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
      return res.status(400).json({
        error: error.message,
      })
    }

    if (error.code === 'EMAIL_ALREADY_EXISTS') {
      return res.status(409).json({
        error: error.message,
      })
    }

    console.error('Ошибка регистрации:', error)

    return res.status(500).json({
      error: 'Не удалось зарегистрировать пользователя',
    })
  }
}

// Вход пользователя
export async function login(req, res) {
  try {
    const result = await authService.login(req.body)

    return res.status(200).json({
      data: result,
    })
  } catch (error) {
    if (
      error.code === 'VALIDATION_ERROR' ||
      error.code === 'INVALID_CREDENTIALS'
    ) {
      return res.status(401).json({
        error: error.message,
      })
    }

    console.error('Ошибка авторизации:', error)

    return res.status(500).json({
      error: 'Не удалось выполнить вход',
    })
  }
}