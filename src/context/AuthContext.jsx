import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchClient } from '../api/client'
import { AuthContext } from './AuthContextValue'

const readStoredUser = () => {
  const storedUser = localStorage.getItem('taskTrackerUser')
  if (!storedUser) return null

  try {
    return JSON.parse(storedUser)
  } catch {
    localStorage.removeItem('taskTrackerUser')
    return null
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [token, setToken] = useState(() => localStorage.getItem('taskTrackerToken'))
  const [user, setUser] = useState(readStoredUser)
  const loading = false

  const login = useCallback(async (username, password) => {
    const response = await fetchClient('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })

    localStorage.setItem('taskTrackerToken', response.token)
    localStorage.setItem('taskTrackerUser', JSON.stringify(response.user))
    setToken(response.token)
    setUser(response.user)
    return response
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('taskTrackerToken')
    localStorage.removeItem('taskTrackerUser')
    setToken(null)
    setUser(null)
    navigate('/login', { replace: true })
  }, [navigate])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(token),
    }),
    [loading, login, logout, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
