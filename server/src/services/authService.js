import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as userRepository from '../repositories/userRepository.js'

const SALT_ROUNDS = 10

// Создаём JWT-токен пользователя
function createToken(user) {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET не задан в переменных окружения')
  }

  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    secret,
    {
      expiresIn: '7d',
    }
  )
}

// Регистрируем нового пользователя
export async function register({
  name,
  email,
  password,
}) {
  const normalizedName = name?.trim()
  const normalizedEmail = email?.trim().toLowerCase()

  if (!normalizedName || !normalizedEmail || !password) {
    const error = new Error(
      'Имя, email и пароль обязательны'
    )
    error.code = 'VALIDATION_ERROR'
    throw error
  }

  if (password.length < 6) {
    const error = new Error(
      'Пароль должен содержать минимум 6 символов'
    )
    error.code = 'VALIDATION_ERROR'
    throw error
  }

  const existingUser =
    userRepository.findByEmail(normalizedEmail)

  if (existingUser) {
    const error = new Error(
      'Пользователь с таким email уже существует'
    )
    error.code = 'EMAIL_ALREADY_EXISTS'
    throw error
  }

  const passwordHash = await bcrypt.hash(
    password,
    SALT_ROUNDS
  )

  const user = userRepository.createUser({
    name: normalizedName,
    email: normalizedEmail,
    passwordHash,
  })

  return {
    user,
    token: createToken(user),
  }
}

// Авторизуем пользователя
export async function login({
  email,
  password,
}) {
  const normalizedEmail = email?.trim().toLowerCase()

  if (!normalizedEmail || !password) {
    const error = new Error(
      'Email и пароль обязательны'
    )
    error.code = 'VALIDATION_ERROR'
    throw error
  }

  const user =
    userRepository.findByEmail(normalizedEmail)

  if (!user) {
    const error = new Error(
      'Неверный email или пароль'
    )
    error.code = 'INVALID_CREDENTIALS'
    throw error
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash
  )

  if (!passwordMatches) {
    const error = new Error(
      'Неверный email или пароль'
    )
    error.code = 'INVALID_CREDENTIALS'
    throw error
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  }

  return {
    user: safeUser,
    token: createToken(safeUser),
  }
}