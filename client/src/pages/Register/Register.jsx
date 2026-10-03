import { useState } from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'
import { register } from '../../services/authService.js'
import styles from '../Auth.module.css'

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setIsLoading(true)

    try {
      await register({
        name,
        email,
        password,
      })

      navigate('/')
    } catch (error) {
      setError(
        error.message ||
          'Не удалось зарегистрироваться'
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
            Создание аккаунта
          </h1>

          <p className={styles.subtitle}>
            Зарегистрируйтесь, чтобы вести
            личный учёт доходов и расходов
          </p>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.field}>
            <label
              className={styles.label}
              htmlFor="name"
            >
              Имя
            </label>

            <input
              className={styles.input}
              id="name"
              type="text"
              placeholder="Введите ваше имя"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              autoComplete="name"
              required
            />
          </div>

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
              placeholder="Минимум 6 символов"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="new-password"
              minLength={6}
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
              ? 'Создание аккаунта...'
              : 'Зарегистрироваться'}
          </button>
        </form>

        <p className={styles.footer}>
          Уже есть аккаунт?{' '}
          <Link
            className={styles.footerLink}
            to="/login"
          >
            Войти
          </Link>
        </p>
      </section>
    </main>
  )
}

export default Register