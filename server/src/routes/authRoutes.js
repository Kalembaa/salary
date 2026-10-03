import express from 'express'
import {
  register,
  login,
} from '../controllers/authController.js'

const router = express.Router()

// Регистрация нового пользователя
router.post('/register', register)

// Авторизация пользователя
router.post('/login', login)

export default router