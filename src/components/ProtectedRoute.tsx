import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-ivory/60 text-sm">Loading…</div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/auth/sign-in" replace />
  }

  return <>{children}</>
}
