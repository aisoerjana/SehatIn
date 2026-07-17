import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Sprout, Leaf, Egg } from 'lucide-react';
import UpperNavbar from './UpperNavbar';
import BottomNavbar from './BottomNavbar';

export default function Hasil() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasil = location.state?.hasil;

  useEffect(() => {
    if (!hasil) {
      navigate('/asesmen', { replace: true });
    }
  }, [hasil, navigate]);

  if (!hasil) return null;

  return (
    <div className="flex flex-col h-screen bg-[#eff6ff] dark:bg-[#05070d] transition-colors">
      <UpperNavbar />

      <div className="flex-1 p-5 overflow-y-auto pb-8">
        <div className="flex items-center gap-2 mb-5">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Riwayat</h1>
        </div>

        {/* Hasil Kebutuhan Harian */}
        <div className="bg-white dark:bg-[#0b0f17] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-white/10 transition-colors">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Hasil Kebutuhan Harian</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-cyan-400/10 rounded-xl">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Kalori</span>
              <span className="text-sm font-bold text-green-700 dark:text-cyan-300">{hasil.kalori} kkal</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Protein</span>
              <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{hasil.protein} g</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-500/10 rounded-xl">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Karbohidrat</span>
              <span className="text-sm font-bold text-orange-700 dark:text-orange-300">{hasil.karbo} g</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Lemak</span>
              <span className="text-sm font-bold text-yellow-700 dark:text-yellow-300">{hasil.lemak} g</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-500/10 rounded-xl">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Gula</span>
              <span className="text-sm font-bold text-red-700 dark:text-red-300">{hasil.gula} g</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-500/10 rounded-xl">
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Serat</span>
              <span className="text-sm font-bold text-purple-700 dark:text-purple-300">{hasil.serat} g</span>
            </div>
          </div>
        </div>

        {/* Rekomendasi Bahan Terjangkau */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Rekomendasi Bahan</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { nama: "Tempe", harga: "Rp 5.000", desc: "Tinggi protein nabati, murah & mudah diolah.", icon: Sprout },
              { nama: "Bayam", harga: "Rp 3.000", desc: "Sumber zat besi & vitamin, baik untuk darah.", icon: Leaf },
              { nama: "Telur", harga: "Rp 2.000/btr", desc: "Protein hewani paling ekonomis & lengkap.", icon: Egg }
            ].map((item, index) => (
              <div key={index} className="bg-white dark:bg-[#0b0f17] p-3 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm transition-colors">
                <item.icon className="w-10 h-10 text-blue-600 dark:text-cyan-300 mb-2" />
                <h4 className="font-bold text-gray-900 dark:text-white">{item.nama}</h4>
                <p className="text-xs text-blue-700 dark:text-cyan-300 font-bold mb-1">{item.harga}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Inspirasi Menu Hari Ini */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Inspirasi Menu</h3>
          <div className="bg-white dark:bg-[#0b0f17] rounded-[24px] overflow-hidden shadow-sm border border-gray-100 dark:border-white/10 transition-colors">
            <img
              src="https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80"
              alt="Menu Sehat"
              className="w-full h-40 object-cover"
            />
            <div className="p-5">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Tumis Bayam Tempe Telur</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Kombinasi protein dari tempe dan telur yang dipadukan dengan serat dari bayam.
                Menu ini menyediakan nutrisi lengkap dengan biaya sangat rendah namun tetap lezat.
              </p>
              <div className="flex items-center justify-between border-t dark:border-white/10 pt-4">
                <span className="text-sm font-bold text-gray-400">Estimasi Harga:</span>
                <span className="text-lg font-black text-blue-700 dark:text-cyan-300">Rp 10.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
}
