import { useTheme } from '@/hooks/useTheme'
import { Link } from 'react-router-dom'

function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="bg-primary-gradient sticky top-0 z-50 flex w-full items-center justify-center p-3.5 text-white">
      <div className="flex w-full max-w-lg items-center justify-between">
        <Link to={'/'}>
          <h1 className="text-2xl font-bold text-white">Ohohub</h1>
        </Link>
        <div>
          <button
            onClick={toggleTheme}
            className="relative rounded-lg border border-white/20 bg-white/10 p-2 transition-colors hover:border-white/30 hover:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none"
            aria-label={
              theme === 'light'
                ? 'ダークモードに切り替え'
                : 'ライトモードに切り替え'
            }
          >
            {theme === 'light' ? (
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
