import React, { useEffect, useState } from 'react'

import { ThemeContext } from '@/contexts/theme'

import type { Theme } from '@/types/theme'

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'

  const savedTheme = localStorage.getItem('ohohub-theme') as Theme
  if (savedTheme) {
    return savedTheme
  }

  const systemPrefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches
  return systemPrefersDark ? 'dark' : 'light'
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initialTheme = getInitialTheme()
    setThemeState(initialTheme)

    const root = document.documentElement
    if (initialTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (!isInitialized) return

    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    localStorage.setItem('ohohub-theme', theme)
  }, [theme, isInitialized])

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
