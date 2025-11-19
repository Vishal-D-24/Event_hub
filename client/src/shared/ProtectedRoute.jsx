import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider.jsx'
import { LinearProgress, Box } from '@mui/material'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  // Still checking session → show loader
  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    )
  }

  // Not logged in → redirect to correct login
  if (!user) {
    return <Navigate to="/organization/login" replace />
  }

  // Allow both organization & event managers
  if (user.role === 'organization' || user.role === 'eventManager') {
    return <Outlet />
  }

  // Anything else → fallback
  return <Navigate to="/organization/login" replace />
}
