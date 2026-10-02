// Базовый адрес backend берём из .env
const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Выполняем HTTP-запрос к backend
async function request(path, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    // DELETE может вернуть ответ без содержимого
    if (response.status === 204) {
      return undefined
    }

    let result = null

    try {
      result = await response.json()
    } catch {
      result = null
    }

    // Обрабатываем ошибку, которую вернул backend
    if (!response.ok || result?.error) {
      const error = new Error(
        result?.error?.message ||
          `Ошибка HTTP: ${response.status}`
      )

      error.code =
        result?.error?.code || `HTTP_${response.status}`

      throw error
    }

    // Для списков сохраняем и data, и pagination
    if (result?.pagination) {
      return {
        data: result.data ?? [],
        pagination: result.pagination,
      }
    }

    // Для одного объекта возвращаем структуру с data
    if (
      result &&
      Object.prototype.hasOwnProperty.call(result, 'data')
    ) {
      return {
        data: result.data,
      }
    }

    return result
  } catch (error) {
    // Сохраняем ошибки backend без изменения
    if (error?.code) {
      throw error
    }

    // Преобразуем сетевую ошибку в единый формат
    const networkError = new Error(
      'Не удалось подключиться к серверу'
    )

    networkError.code = 'NETWORK_ERROR'
    networkError.cause = error

    throw networkError
  }
}

// GET-запрос с поддержкой query-параметров
export async function get(path, params = {}) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ''
    ) {
      searchParams.append(key, String(value))
    }
  })

  const query = searchParams.toString()
  const url = query ? `${path}?${query}` : path

  return request(url, {
    method: 'GET',
  })
}

// POST-запрос
export async function post(path, body) {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// PUT-запрос
export async function put(path, body) {
  return request(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

// DELETE-запрос
export async function del(path) {
  return request(path, {
    method: 'DELETE',
  })
}