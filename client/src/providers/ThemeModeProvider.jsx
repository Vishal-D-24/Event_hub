import React from 'react'

const ThemeModeContext = React.createContext(null)

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = React.useState(() => (localStorage.getItem('seh-mode') || 'light'))

  React.useEffect(() => {
    localStorage.setItem('seh-mode', mode)
    const root = document.documentElement
    if (mode === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [mode])

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeModeContext.Provider>
  )
}

export function useThemeMode() {
  const ctx = React.useContext(ThemeModeContext)
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider')
  return ctx
}
