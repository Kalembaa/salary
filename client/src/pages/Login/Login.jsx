import { useState } from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'
import { login } from '../../services/authService.js'
import styles from '../Auth.module.css'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setIsLoading(true)

    try {
      await login({
        email,
        password,
      })

      navigate('/')
    } catch (error) {
      setError(
        error.message || 'Не удалось выполнить вход'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            ₽
          </div>

          <h1 className={styles.title}>
            Добро пожаловать
          </h1>

          <p className={styles.subtitle}>
            Войдите в Salary Tracker,
            чтобы управлять своими финансами
          </p>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.field}>
            <label
              className={styles.label}
              htmlFor="email"
            >
              Email
            </label>

            <input
              className={styles.input}
              id="email"
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.field}>
            <label
              className={styles.label}
              htmlFor="password"
            >
              Пароль
            </label>

            <input
              className={styles.input}
              id="password"
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p
              className={styles.error}
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            className={styles.button}
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? 'Выполняется вход...'
              : 'Войти'}
          </button>
        </form>

        <p className={styles.footer}>
          Нет аккаунта?{' '}
          <Link
            className={styles.footerLink}
            to="/register"
          >
            Зарегистрироваться
          </Link>
        </p>
      </section>
    </main>
  )
}

export default Login