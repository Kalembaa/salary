import { NavLink } from 'react-router-dom'
import styles from './Header.module.css'

function Header() {
  const getLinkClass = ({ isActive }) =>
    `${styles.link} ${isActive ? styles.active : ''}`

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.logo}>Salary Tracker</NavLink>
        <nav className={styles.nav} aria-label="Основная навигация">
          <NavLink to="/" end className={getLinkClass}>Главная</NavLink>
          <NavLink to="/history" className={getLinkClass}>История</NavLink>
          <NavLink to="/analytics" className={getLinkClass}>Аналитика</NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
