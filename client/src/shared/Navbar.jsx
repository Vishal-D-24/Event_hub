import { AppBar, Box, Button, Chip, Container, IconButton, Stack, Toolbar, Typography } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import BrushIcon from '@mui/icons-material/Brush'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useThemeMode } from '../providers/ThemeModeProvider.jsx'
import { useAuth } from '../providers/AuthProvider.jsx'

export default function Navbar() {
  const { mode, setMode } = useThemeMode()
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()

  const toggle = () => setMode(mode === 'dark' ? 'light' : 'dark')
  const onLogout = async () => { await logout(); navigate('/') }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: 'blur(12px)',
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        color: 'text.primary'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              flexGrow: 1,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
            Smart Event Hub
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              color="inherit"
              component={NavLink}
              to="/"
              sx={{
                fontWeight: 600,
                '&.active': {
                  color: '#667eea'
                }
              }}
            >
              Home
            </Button>

            {user ? (
              <>
                <Button
                  color="inherit"
                  component={NavLink}
                  to="/admin/dashboard"
                  sx={{
                    fontWeight: 600,
                    '&.active': {
                      color: '#667eea'
                    }
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  color="inherit"
                  component={NavLink}
                  to="/designer"
                  startIcon={<BrushIcon />}
                  sx={{
                    fontWeight: 600,
                    position: 'relative',
                    '&.active': {
                      color: '#667eea'
                    }
                  }}
                >
                  Designer
                </Button>
                <Button
                  color="inherit"
                  onClick={onLogout}
                  sx={{
                    fontWeight: 600,
                    color: '#f5576c',
                    '&:hover': {
                      bgcolor: 'rgba(245, 87, 108, 0.08)'
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={NavLink}
                  to="/admin/login"
                  sx={{
                    fontWeight: 600,
                    '&.active': {
                      color: '#667eea'
                    }
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  component={NavLink}
                  to="/admin/signup"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 2.5,
                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                    }
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}

            <IconButton
              onClick={toggle}
              sx={
                {
                  ml: 1,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'rotate(180deg)'
                  }
                }
              }
              aria-label="toggle dark mode"
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
