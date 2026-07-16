import { Link, useLocation } from 'react-router-dom'
import { Home, Dumbbell, Plus, Clock, List } from 'lucide-react'

export default function BottomNavbar() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <div className="bg-white border-t border-gray-100 flex items-center justify-around py-3 px-2 pb-5">
      <Link to="/dashboard" className="flex flex-col items-center gap-1">
        <div className={`w-12 h-8 rounded-full flex items-center justify-center ${isActive('/dashboard') ? 'bg-green-300/40' : ''}`}>
          <Home className={`w-5 h-5 ${isActive('/dashboard') ? 'text-green-800' : 'text-gray-700'}`} />
        </div>
        <span className={`text-[10px] font-bold ${isActive('/dashboard') ? 'text-green-800' : 'text-gray-700'}`}>Home</span>
      </Link>

      <Link to="/muscle-scan" className="flex flex-col items-center gap-1">
        <div className={`w-12 h-8 rounded-full flex items-center justify-center ${isActive('/muscle-scan') ? 'bg-green-300/40' : ''}`}>
          <Dumbbell className={`w-5 h-5 ${isActive('/muscle-scan') ? 'text-green-800' : 'text-gray-700'}`} />
        </div>
        <span className={`text-[10px] font-bold ${isActive('/muscle-scan') ? 'text-green-800' : 'text-gray-700'}`}>Muscle</span>
      </Link>

      <Link to="/asesmen" className="flex flex-col items-center -mt-7">
        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg bg-green-600 text-white border-2 border-green-600">
          <Plus className="w-7 h-7" />
        </div>
      </Link>

      <Link to="/history" className="flex flex-col items-center gap-1">
        <div className={`w-12 h-8 rounded-full flex items-center justify-center ${isActive('/history') ? 'bg-green-300/40' : ''}`}>
          <Clock className={`w-5 h-5 ${isActive('/history') ? 'text-green-800' : 'text-gray-700'}`} />
        </div>
        <span className={`text-[10px] font-bold ${isActive('/history') ? 'text-green-800' : 'text-gray-700'}`}>History</span>
      </Link>

      <Link to="/food-list" className="flex flex-col items-center gap-1">
        <div className={`w-12 h-8 rounded-full flex items-center justify-center ${isActive('/food-list') ? 'bg-green-300/40' : ''}`}>
          <List className={`w-5 h-5 ${isActive('/food-list') ? 'text-green-800' : 'text-gray-700'}`} />
        </div>
        <span className={`text-[10px] font-bold ${isActive('/food-list') ? 'text-green-800' : 'text-gray-700'}`}>Food </span>
      </Link>
    </div>
  )
}
