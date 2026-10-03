import express from 'express'
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
} from '../controllers/authController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

// Регистрация нового пользователя
router.post('/register', register)

// Авторизация пользователя
router.post('/login', login)

// Получение текущего авторизованного пользователя
router.get('/me', requireAuth, getCurrentUser)

// Изменение профиля текущего пользователя
router.put('/me', requireAuth, updateProfile)

export default router