import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { User, ArrowRight, LogOut } from 'lucide-react'
import Navbar from './Navbar'
import logo1 from '../assets/logo1.png'

export default function Dashboard() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('Pengguna')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate('/login'); return }
      setUserName(session.user.user_metadata?.name || 'Pengguna')
    })
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const greetingTime = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Selamat pagi'
    if (hour < 15) return 'Selamat siang'
    if (hour < 18) return 'Selamat sore'
    return 'Selamat malam'
  }

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">

      <div className="flex-1 overflow-y-auto pb-6">

        <div className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <img src={logo1} alt="SehatIn" className="w-28 h-auto" />
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-600 font-medium">{greetingTime()},</p>
              <h2 className="text-2xl font-bold text-green-800">Halo, {userName}!</h2>
            </div>
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <User className="w-6 h-6 text-gray-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-3xl p-5 mb-5 shadow-sm relative overflow-hidden">
            <div className="relative z-10 w-2/3">
              <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                Cek Kesehatan<br/>Harian
              </h3>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Pantau kondisi tubuh Anda hari ini untuk hidup lebih sehat dan bertenaga.
              </p>
              <Link to="/asesmen">
                <button className="bg-[#FF9A70] hover:bg-[#ff8554] text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors">
                  Mulai Asesmen Kesehatan
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-green-200/50 rounded-full blur-2xl"></div>
          </div>

        </div>
      </div>

      <Navbar />

    </div>
  )
}
  