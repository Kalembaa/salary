import {
  NavLink,
  useNavigate,
} from 'react-router-dom'
import { logout } from '../../services/authService.js'
import styles from './Header.module.css'

function Header() {
  const navigate = useNavigate()

  const getLinkClass = ({ isActive }) =>
    `${styles.link} ${isActive ? styles.active : ''}`

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
