import {
  useEffect,
  useState,
} from 'react'
import {
  NavLink,
  useNavigate,
} from 'react-router-dom'
import {
  getCurrentUser,
  logout,
} from '../../services/authService.js'
import styles from './Header.module.css'

function Header() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  const getLinkClass = ({ isActive }) =>
    `${styles.link} ${isActive ? styles.active : ''}`

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error(
          'Не удалось загрузить пользователя:',
          error
        )
      }
    }

    loadCurrentUser()
  }, [])

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink
          to="/"
          className={styles.logo}
        >
          Salary Tracker
        </NavLink>

        <nav
          className={styles.nav}
          aria-label="Основная навигация"
        >
          <NavLink
            to="/"
            end
            className={getLinkClass}
          >
            Главная
          </NavLink>

          <NavLink
            to="/history"
            className={getLinkClass}
          >
            История
          </NavLink>

          <NavLink
            to="/analytics"
            className={getLinkClass}
          >
            Аналитика
          </NavLink>

          {user && (
            <span className={styles.userName}>
              {user.name}
            </span>
          )}

          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Выйти
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
