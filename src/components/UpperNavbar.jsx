import { User } from 'lucide-react'
import { Link } from 'react-router-dom'
import SehatIn from '../assets/SehatIn.png'

const UpperNavbar = () => {
  return (
    <div className="bg-white px-5 py-2.5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <img src={SehatIn} alt="SehatIn" className="w-20 h-auto" />
      <Link to="/profile" className="text-gray-500 hover:text-green-700 transition-colors">
        <User className="w-5 h-5" />
      </Link>
    </div>
  )
}

export default UpperNavbar
