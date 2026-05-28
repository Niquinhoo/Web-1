import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/forms/LoginForm'
import { Spinner } from '../components/ui/Spinner'
import { useAuth } from '../hooks/useAuth'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, loading } = useAuth()
  const from = location.state?.from?.pathname || '/'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <LoginForm onSuccess={() => navigate(from, { replace: true })} />
    </main>
  )
}
