import { User, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import SehatIn from '../assets/SehatIn2.png'
import { useTheme } from '../context/ThemeContext'

const UpperNavbar = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="bg-white dark:bg-[#0b0f17] border-b border-transparent dark:border-white/10 px-5 py-2.5 flex items-center justify-between sticky top-0 z-10 shadow-sm transition-colors">
      <img src={SehatIn} alt="SehatIn" className="w-20 h-auto" />

      <button
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Aktifkan light mode' : 'Aktifkan dark mode'}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors
          bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100
          dark:bg-white/5 dark:border-white/10 dark:text-cyan-300 dark:hover:bg-white/10"
      >
        {theme === 'dark' ? (
          <>
            <Moon className="w-3.5 h-3.5" />
            Dark
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5" />
            Light
          </>
        )}
      </button>

      <Link to="/profile" className="text-gray-500 hover:text-blue-700 dark:text-gray-400 dark:hover:text-cyan-300 transition-colors">
        <User className="w-5 h-5" />
      </Link>
    </div>
  )
}

export default UpperNavbar
