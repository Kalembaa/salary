import * as authService from '../services/authService.js'
import * as userRepository from '../repositories/userRepository.js'

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

// Авторизация пользователя
export async function login(req, res) {
  try {
    const result = await authService.login(req.body)

    return res.status(200).json({
      data: result,
    })
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
      return res.status(400).json({
        error: error.message,
      })
    }

    if (error.code === 'INVALID_CREDENTIALS') {
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

// Получение текущего авторизованного пользователя
export function getCurrentUser(req, res) {
  try {
    const user = userRepository.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        error: 'Пользователь не найден',
      })
    }

    return res.status(200).json({
      data: user,
    })
  } catch (error) {
    console.error(
      'Ошибка получения пользователя:',
      error
    )

    return res.status(500).json({
      error: 'Не удалось получить данные пользователя',
    })
  }
}

// Изменение имени и email текущего пользователя
export function updateProfile(req, res) {
  try {
    const user = authService.updateProfile(
      req.user.id,
      req.body
    )

    return res.status(200).json({
      data: user,
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

    if (error.code === 'USER_NOT_FOUND') {
      return res.status(404).json({
        error: error.message,
      })
    }

    console.error(
      'Ошибка обновления профиля:',
      error
    )

    return res.status(500).json({
      error: 'Не удалось обновить профиль',
    })
  }
}