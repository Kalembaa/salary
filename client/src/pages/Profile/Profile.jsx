import {
  useEffect,
  useState,
} from 'react'
import {
  getCurrentUser,
  updateProfile,
} from '../../services/authService.js'
import styles from './Profile.module.css'

function Profile() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser()

        setName(currentUser.name)
        setEmail(currentUser.email)
      } catch (loadError) {
        setError(
          loadError.message ||
            'Не удалось загрузить данные пользователя'
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setSuccess('')
    setIsSaving(true)

    try {
      const updatedUser = await updateProfile({
        name,
        email,
      })

      setName(updatedUser.name)
      setEmail(updatedUser.email)

      // Сообщаем другим компонентам,
      // что данные пользователя изменились
      window.dispatchEvent(
        new CustomEvent('profile-updated', {
          detail: updatedUser,
        })
      )

      setSuccess('Профиль успешно обновлён')
    } catch (saveError) {
      setError(
        saveError.message ||
          'Не удалось сохранить изменения'
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <p className={styles.message}>
        Загрузка профиля...
      </p>
    )
  }

  return (
    <section className={styles.profile}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Профиль
        </h1>

        <p className={styles.subtitle}>
          Изменение данных вашего аккаунта
        </p>
      </div>

      <form
        className={styles.card}
        onSubmit={handleSubmit}
      >
        <div className={styles.row}>
          <label
            className={styles.label}
            htmlFor="profile-name"
          >
            Имя
          </label>

          <input
            id="profile-name"
            className={styles.input}
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            autoComplete="name"
            required
          />
        </div>

        <div className={styles.row}>
          <label
            className={styles.label}
            htmlFor="profile-email"
          >
            Email
          </label>

          <input
            id="profile-email"
            className={styles.input}
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            autoComplete="email"
            required
          />
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.saveButton}
            disabled={isSaving}
          >
            {isSaving
              ? 'Сохранение...'
              : 'Сохранить изменения'}
          </button>
        </div>
      </form>

      {success && (
        <p className={styles.success}>
          {success}
        </p>
      )}

      {error && (
        <p className={styles.error}>
          {error}
        </p>
      )}
    </section>
  )
}

export default Profile