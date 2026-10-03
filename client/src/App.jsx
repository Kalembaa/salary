import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import Layout from './components/Layout/Layout.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import History from './pages/History/History.jsx'
import Analytics from './pages/Analytics/Analytics.jsx'
import Profile from './pages/Profile/Profile.jsx'
import Login from './pages/Login/Login.jsx'
import Register from './pages/Register/Register.jsx'
import { isAuthenticated } from './services/authService.js'
import styles from './App.module.css'

// Защищаем основную часть приложения
function ProtectedLayout() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return <Layout />
}

// Не показываем вход и регистрацию
// уже авторизованному пользователю
function PublicRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <div className={styles.app}>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route element={<ProtectedLayout />}>
          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="history"
            element={<History />}
          />

          <Route
            path="analytics"
            element={<Analytics />}
          />

          <Route
            path="profile"
            element={<Profile />}
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </div>
  )
}

export default App