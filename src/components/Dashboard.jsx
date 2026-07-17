import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { User, ArrowRight, Lightbulb, Calendar } from 'lucide-react'
import UpperNavbar from './UpperNavbar'
import BottomNavbar from './BottomNavbar'

export default function Dashboard() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('Pengguna')
  const [avatarUrl, setAvatarUrl] = useState(null) // state foto profil — di-fetch dari tabel profiles; default null = icon default
  const [latestResult, setLatestResult] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { navigate('/login'); return }
      setUserName(session.user.user_metadata?.name || 'Pengguna')

      // Ambil foto profil dari tabel profiles — field avatar_url diisi saat user upload lewat halaman Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', session.user.id)
        .maybeSingle()

      if (profile?.avatar_url) setAvatarUrl(profile.avatar_url) // kalau ada foto, simpan ke state; kalau null, nanti render icon default

      const { data } = await supabase
        .from('macro_targets')
        .select('calorie_target, protein_g, carbs_g, fat_g, fiber_g, sugar_max_g, created_at')
        .eq('profile_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (data) setLatestResult(data)
    })
  }, [navigate])

  const greetingTime = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Selamat pagi'
    if (hour < 15) return 'Selamat siang'
    if (hour < 18) return 'Selamat sore'
    return 'Selamat malam'
  }

  const fmt = (val) => {
    if (val == null) return '0'
    const num = Number(val)
    if (Number.isInteger(num)) return num.toLocaleString('id-ID')
    return num.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  }

  const tipsHarian = [
    { judul: 'Minum Air yang Cukup', isi: 'Minumlah minimal 8 gelas air setiap hari agar tubuh tetap terhidrasi.' },
    { judul: 'Jangan Lewatkan Sarapan', isi: 'Sarapan bergizi membantu memberikan energi untuk memulai aktivitas.' },
    { judul: 'Tidur yang Berkualitas', isi: 'Usahakan tidur selama 7–9 jam setiap malam untuk menjaga kesehatan tubuh.' },
    { judul: 'Perbanyak Konsumsi Buah', isi: 'Buah mengandung vitamin dan antioksidan yang baik untuk daya tahan tubuh.' },
    { judul: 'Makan Sayur Setiap Hari', isi: 'Lengkapi setiap waktu makan dengan sayuran agar kebutuhan serat terpenuhi.' },
    { judul: 'Kurangi Konsumsi Gula', isi: 'Batasi makanan dan minuman manis untuk membantu menjaga kadar gula darah.' },
    { judul: 'Batasi Garam Berlebih', isi: 'Mengurangi asupan garam dapat membantu menjaga tekanan darah tetap normal.' },
    { judul: 'Lakukan Aktivitas Fisik', isi: 'Bergerak atau berolahraga selama 30 menit setiap hari membantu menjaga kebugaran.' },
    { judul: 'Istirahatkan Mata', isi: 'Alihkan pandangan dari layar setiap 20 menit untuk mengurangi kelelahan mata.' },
    { judul: 'Jaga Kebersihan Tangan', isi: 'Biasakan mencuci tangan dengan sabun sebelum makan dan setelah beraktivitas.' },
    { judul: 'Konsumsi Protein yang Cukup', isi: 'Protein membantu memperbaiki jaringan tubuh dan menjaga massa otot.' },
    { judul: 'Kurangi Makanan Cepat Saji', isi: 'Pilih makanan segar dan bergizi dibandingkan makanan olahan.' },
    { judul: 'Makan Secara Teratur', isi: 'Jangan menunda waktu makan agar tubuh tetap memiliki energi yang cukup.' },
    { judul: 'Pilih Lemak Sehat', isi: 'Konsumsi lemak sehat dari ikan, alpukat, atau kacang-kacangan.' },
    { judul: 'Kelola Stres dengan Baik', isi: 'Luangkan waktu untuk relaksasi agar pikiran tetap tenang dan sehat.' },
    { judul: 'Jaga Postur Tubuh', isi: 'Duduk dan berdiri dengan posisi yang benar dapat mengurangi risiko nyeri punggung.' },
    { judul: 'Batasi Minuman Bersoda', isi: 'Gantilah minuman bersoda dengan air putih atau minuman tanpa gula.' },
    { judul: 'Lakukan Pemeriksaan Kesehatan Berkala', isi: 'Pemeriksaan rutin membantu mendeteksi masalah kesehatan sejak dini.' },
    { judul: 'Jaga Kebersihan Lingkungan', isi: 'Lingkungan yang bersih dapat membantu mencegah penyebaran penyakit.' },
    { judul: 'Mulai dari Kebiasaan Kecil', isi: 'Perubahan kecil yang dilakukan secara konsisten akan memberikan manfaat besar bagi kesehatan.' },
  ]

  const tipHariIni = () => {
    const start = new Date('2025-01-01')
    const today = new Date()
    const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24))
    return tipsHarian[diff % tipsHarian.length]
  }

  const kebutuhanHarian = latestResult ? [
    { label: 'Kalori', value: `${fmt(latestResult.calorie_target)} kkal`, bg: 'bg-green-50', text: 'text-green-700' },
    { label: 'Protein', value: `${fmt(latestResult.protein_g)} g`, bg: 'bg-blue-50', text: 'text-blue-700' },
    { label: 'Karbohidrat', value: `${fmt(latestResult.carbs_g)} g`, bg: 'bg-orange-50', text: 'text-orange-700' },
    { label: 'Lemak', value: `${fmt(latestResult.fat_g)} g`, bg: 'bg-yellow-50', text: 'text-yellow-700' },
    { label: 'Gula', value: `${fmt(latestResult.sugar_max_g)} g`, bg: 'bg-red-50', text: 'text-red-700' },
    { label: 'Serat', value: `${fmt(latestResult.fiber_g)} g`, bg: 'bg-purple-50', text: 'text-purple-700' },
  ] : []

  return (
    <div className="flex flex-col h-screen bg-[#F6F9FF] dark:bg-[#05070d] transition-colors">

      <UpperNavbar />

      <div className="flex-1 overflow-y-auto pb-24">

        <div className="px-5 py-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-[#6B7280] dark:text-gray-400 font-medium">{greetingTime()},</p>
              <h2 className="text-2xl font-bold text-[#1F2937] dark:text-cyan-300">Halo, {userName}!</h2>
            </div>
            {/* Foto profil (pojok kanan atas). Dibungkus Link ke /profile biar bisa diklik.
                - Kalau avatarUrl terisi → tampilkan <img> dengan object-cover biar proporsional.
                - Kalau null (belum upload) → tampilkan icon User di lingkaran abu-abu (default). */}
            <Link to="/profile">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Foto profil" className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-white/10 shadow-sm" />
              ) : (
                <div className="w-12 h-12 bg-gray-300 dark:bg-white/10 rounded-full flex items-center justify-center border-2 border-white dark:border-white/10 shadow-sm">
                  <User className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                </div>
              )}
            </Link>
          </div>

          <div className="bg-gradient-to-br from-[#EAF2FF] to-white dark:from-[#0e1522] dark:to-[#0b0f17] border border-[#E5E7EB] dark:border-cyan-400/20 rounded-3xl p-5 mb-5 shadow-sm relative overflow-hidden">
            <div className="relative z-10 w-2/3">
              <h3 className="text-lg font-bold text-[#1F2937] dark:text-white mb-2 leading-tight">
                Cek Kesehatan<br/>Harian
              </h3>
              <p className="text-xs text-[#6B7280] dark:text-gray-400 mb-4 leading-relaxed">
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

          {/* Tips Hari Ini */}
          <div className="mb-5 bg-white dark:bg-[#0b0f17] border border-[#E5E7EB] dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#EAF2FF] dark:bg-cyan-400/10 rounded-xl flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 text-[#2563EB] dark:text-cyan-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[#1F2937] dark:text-white mb-1">Tips Hari Ini</h3>
                <p className="text-xs font-medium text-[#2563EB] dark:text-cyan-300 mb-1">{tipHariIni().judul}</p>
                <p className="text-xs text-[#6B7280] dark:text-gray-400 leading-relaxed">
                  {tipHariIni().isi}
                </p>
              </div>
            </div>
          </div>

          {/* Riwayat Terakhir */}
          {latestResult && (
            <div className="mb-5 bg-white dark:bg-[#0b0f17] border border-[#E5E7EB] dark:border-white/10 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#1F2937] dark:text-white">Riwayat Terakhir</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-[#6B7280] dark:text-gray-400 font-medium">
                  <Calendar className="w-3 h-3" />
                  {new Date(latestResult.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div className="space-y-3">
                {kebutuhanHarian.map((item, index) => (
                  <div
                    key={index}
                    className={`${item.bg} dark:bg-white/5 rounded-xl px-4 py-3 flex items-center justify-between hover:scale-[1.02] transition-all duration-300`}
                  >
                    <span className="text-sm font-semibold text-[#1F2937] dark:text-gray-200">{item.label}</span>
                    <span className={`text-sm font-bold ${item.text} dark:text-white/80`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <BottomNavbar />

    </div>
  )
}
  