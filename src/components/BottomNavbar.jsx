import { Link, useLocation } from 'react-router-dom'
import { Home, Dumbbell, Plus, Clock, Lightbulb } from 'lucide-react'

export default function BottomNavbar() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <div className="navbar-enter-up bg-white dark:bg-[#0b0f17] border-t border-gray-100 dark:border-white/10 flex items-center justify-around py-2 px-2 pb-2 transition-colors">
      <Link to="/dashboard" className="flex flex-col items-center gap-1">
        <div className={`w-12 h-8 rounded-full flex items-center justify-center ${isActive('/dashboard') ? 'bg-blue-300/40 dark:bg-cyan-400/20' : ''}`}>
          <Home className={`w-5 h-5 ${isActive('/dashboard') ? 'text-blue-800 dark:text-cyan-300' : 'text-gray-700 dark:text-gray-400'}`} />
        </div>
        <span className={`text-[10px] font-bold ${isActive('/dashboard') ? 'text-blue-800 dark:text-cyan-300' : 'text-gray-700 dark:text-gray-400'}`}>Home</span>
      </Link>

      <Link to="/muscle-scan" className="flex flex-col items-center gap-1">
        <div className={`w-12 h-8 rounded-full flex items-center justify-center ${isActive('/muscle-scan') ? 'bg-blue-300/40 dark:bg-cyan-400/20' : ''}`}>
          <Dumbbell className={`w-5 h-5 ${isActive('/muscle-scan') ? 'text-blue-800 dark:text-cyan-300' : 'text-gray-700 dark:text-gray-400'}`} />
        </div>
        <span className={`text-[10px] font-bold ${isActive('/muscle-scan') ? 'text-blue-800 dark:text-cyan-300' : 'text-gray-700 dark:text-gray-400'}`}>Muscle</span>
      </Link>

      <Link to="/asesmen" className="flex flex-col items-center gap-1">
        <div className="w-12 h-8 rounded-full flex items-center justify-center shadow-lg bg-blue-600 dark:bg-gradient-to-br dark:from-cyan-400 dark:to-blue-500 text-white border-2 border-blue-600 dark:border-cyan-400">
          <Plus className="w-5 h-5" />
        </div>
      </Link>

      <Link to="/history" className="flex flex-col items-center gap-1">
        <div className={`w-12 h-8 rounded-full flex items-center justify-center ${isActive('/history') ? 'bg-blue-300/40 dark:bg-cyan-400/20' : ''}`}>
          <Clock className={`w-5 h-5 ${isActive('/history') ? 'text-blue-800 dark:text-cyan-300' : 'text-gray-700 dark:text-gray-400'}`} />
        </div>
        <span className={`text-[10px] font-bold ${isActive('/history') ? 'text-blue-800 dark:text-cyan-300' : 'text-gray-700 dark:text-gray-400'}`}>History</span>
      </Link>

      <Link to="/ask" className="flex flex-col items-center gap-1">
        <div className={`w-12 h-8 rounded-full flex items-center justify-center ${isActive('/ask') ? 'bg-blue-300/40 dark:bg-cyan-400/20' : ''}`}>
          <Lightbulb className={`w-5 h-5 ${isActive('/ask') ? 'text-blue-800 dark:text-cyan-300' : 'text-gray-700 dark:text-gray-400'}`} />
        </div>
        <span className={`text-[10px] font-bold ${isActive('/ask') ? 'text-blue-800 dark:text-cyan-300' : 'text-gray-700 dark:text-gray-400'}`}>Ask</span>
      </Link>
    </div>
  )
}
