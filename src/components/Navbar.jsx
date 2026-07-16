import { Link, useLocation } from 'react-router-dom'
import { Home, Plus, User } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <div className="bg-white border-t border-gray-100 flex items-center justify-around py-3 px-6 pb-5">
      <Link to="/dashboard" className="flex flex-col items-center gap-1">
        <div className={`w-14 h-8 rounded-full flex items-center justify-center ${isActive('/dashboard') ? 'bg-green-300/40' : ''}`}>
          <Home className={`w-5 h-5 ${isActive('/dashboard') ? 'text-green-800' : 'text-gray-700'}`} />
        </div>
        <span className={`text-[10px] font-bold ${isActive('/dashboard') ? 'text-green-800' : 'text-gray-700'}`}>Beranda</span>
      </Link>

      <Link to="/asesmen" className="flex flex-col items-center -mt-7">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
          <Plus className="w-8 h-8 text-white" />
        </div>
      </Link>

      <Link to="/muscle-scan" className="flex flex-col items-center gap-1 hover:opacity-100 transition-opacity">
        <div className={`w-14 h-8 rounded-full flex items-center justify-center ${isActive('/muscle-scan') ? 'bg-green-300/40' : ''}`}>
          <User className={`w-5 h-5 ${isActive('/muscle-scan') ? 'text-green-800' : 'text-gray-700'}`} />
        </div>
        <span className={`text-[10px] font-bold ${isActive('/muscle-scan') ? 'text-green-800' : 'text-gray-700'}`}>Muscle Scan</span>
      </Link>
    </div>
  )
}