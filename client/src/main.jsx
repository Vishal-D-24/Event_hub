import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import App from './App.jsx'
import './index.css'
import { ThemeModeProvider, useThemeMode } from './providers/ThemeModeProvider.jsx'
import { AuthProvider } from './providers/AuthProvider.jsx'

function MUIThemeBridge({ children }) {
  const { mode } = useThemeMode()
  const theme = React.useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: mode === 'dark' ? '#60a5fa' : '#1e3a8a' },
      background: { default: mode === 'dark' ? '#0b1220' : '#f8fafc', paper: mode === 'dark' ? '#0f172a' : '#ffffff' },
    },
    typography: { fontFamily: 'Inter, var(--mui-font-family)' },
  }), [mode])
  return <ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider>
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <MUIThemeBridge>
        <AuthProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <App />
          </BrowserRouter>
        </AuthProvider>
      </MUIThemeBridge>
    </ThemeModeProvider>
  </React.StrictMode>
)
