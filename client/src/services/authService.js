import {
  get,
  post,
  put,
  setAuthToken,
  removeAuthToken,
  getAuthToken,
} from './api.js'

// Регистрация нового пользователя
export async function register({
  name,
  email,
  password,
}) {
  const response = await post(
    '/api/v1/auth/register',
    {
      name,
      email,
      password,
    }
  )

  const authData = response.data

  if (authData?.token) {
    setAuthToken(authData.token)
  }

  return authData
}

// Вход пользователя
export async function login({
  email,
  password,
}) {
  const response = await post(
    '/api/v1/auth/login',
    {
      email,
      password,
    }
  )

  const authData = response.data

  if (authData?.token) {
    setAuthToken(authData.token)
  }

  return authData
}

// Получаем данные текущего пользователя
export async function getCurrentUser() {
  const response = await get('/api/v1/auth/me')

  return response.data
}

// Изменяем имя и email текущего пользователя
export async function updateProfile({
  name,
  email,
}) {
  const response = await put(
    '/api/v1/auth/me',
    {
      name,
      email,
    }
  )

  return response.data
}

// Выход из аккаунта
export function logout() {
  removeAuthToken()
}

// Проверяем, есть ли сохранённый токен
export function isAuthenticated() {
  return Boolean(getAuthToken())
}