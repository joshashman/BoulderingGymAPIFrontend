import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

// Redirects authenticated user to the dashboard, otherwise to the login page
// Prevents regular usesr from accessing admin routes
function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
