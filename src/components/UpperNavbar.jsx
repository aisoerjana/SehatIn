import { User } from 'lucide-react'
import { Link } from 'react-router-dom'
import SehatIn from '../assets/SehatIn2.png'

const UpperNavbar = () => {
  return (
    <div className="bg-white dark:bg-[#0b0f17] border-b border-transparent dark:border-white/10 px-5 py-0 flex items-center justify-between sticky top-0 z-10 shadow-sm transition-colors">
      <Link to="/">
        <img src={SehatIn} alt="SehatIn" className="w-20 h-auto" />
      </Link>

      <Link to="/profile" className="text-gray-500 hover:text-blue-700 dark:text-gray-400 dark:hover:text-cyan-300 transition-colors">
        <User className="w-5 h-5" />
      </Link>
    </div>
  )
}

export default UpperNavbar
