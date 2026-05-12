import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

export function useAdmin() {
  const { login, logout } = useApp()
  const navigate = useNavigate()

  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  const handleLogin = (email, password) => {
    const ok = login(email, password)
    if (ok) navigate('/admin')
    return ok
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return { isAdmin, handleLogin, handleLogout }
}
