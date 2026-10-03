import express from 'express'
import {
  register,
  login,
  getCurrentUser,
} from '../controllers/authController.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

// Регистрация нового пользователя
router.post('/register', register)

// Авторизация пользователя
router.post('/login', login)

// Получение текущего авторизованного пользователя
router.get('/me', requireAuth, getCurrentUser)

export default router