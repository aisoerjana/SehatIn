import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { User, ArrowRight } from 'lucide-react'
import UpperNavbar from './UpperNavbar'
import BottomNavbar from './BottomNavbar'

export default function Dashboard() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('Pengguna')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate('/login'); return }
      setUserName(session.user.user_metadata?.name || 'Pengguna')
    })
  }, [navigate])

  const greetingTime = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Selamat pagi'
    if (hour < 15) return 'Selamat siang'
    if (hour < 18) return 'Selamat sore'
    return 'Selamat malam'
  }

  return (
    <div className="flex flex-col h-screen bg-[#eff6ff] dark:bg-[#05070d] transition-colors">

      <UpperNavbar />

      <div className="flex-1 overflow-y-auto pb-6">

        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{greetingTime()},</p>
              <h2 className="text-2xl font-bold text-blue-800 dark:text-cyan-300">Halo, {userName}!</h2>
            </div>
            <div className="w-12 h-12 bg-gray-300 dark:bg-white/10 rounded-full flex items-center justify-center border-2 border-white dark:border-white/10 shadow-sm">
              <User className="w-6 h-6 text-gray-500 dark:text-gray-300" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white dark:from-[#0e1522] dark:to-[#0b0f17] border border-blue-100 dark:border-cyan-400/20 rounded-3xl p-5 mb-5 shadow-sm relative overflow-hidden">
            <div className="relative z-10 w-2/3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                Cek Kesehatan<br/>Harian
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Pantau kondisi tubuh Anda hari ini untuk hidup lebih sehat dan bertenaga.
              </p>
              <Link to="/asesmen">
                <button className="bg-[#2563EB] hover:bg-blue-800 dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-500 dark:hover:opacity-90 text-white text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors">
                  Mulai Asesmen Kesehatan
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-200/50 dark:bg-cyan-400/10 rounded-full blur-2xl"></div>
          </div>

        </div>
      </div>

      <BottomNavbar />

    </div>
  )
}
  