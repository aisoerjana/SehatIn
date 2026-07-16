import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sprout, Leaf, Egg } from 'lucide-react';
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
    <div className="flex flex-col h-screen bg-gray-50">
      <UpperNavbar />

      <div className="flex-1 p-5 overflow-y-auto pb-8">
        {/* Hasil Kebutuhan Harian */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Hasil Kebutuhan Harian</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
              <span className="text-sm font-bold text-gray-800">Kalori</span>
              <span className="text-sm font-bold text-green-700">{hasil.kalori} kkal</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
              <span className="text-sm font-bold text-gray-800">Protein</span>
              <span className="text-sm font-bold text-blue-700">{hasil.protein} g</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl">
              <span className="text-sm font-bold text-gray-800">Karbohidrat</span>
              <span className="text-sm font-bold text-orange-700">{hasil.karbo} g</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-xl">
              <span className="text-sm font-bold text-gray-800">Lemak</span>
              <span className="text-sm font-bold text-yellow-700">{hasil.lemak} g</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl">
              <span className="text-sm font-bold text-gray-800">Gula</span>
              <span className="text-sm font-bold text-red-700">{hasil.gula} g</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
              <span className="text-sm font-bold text-gray-800">Serat</span>
              <span className="text-sm font-bold text-purple-700">{hasil.serat} g</span>
            </div>
          </div>
        </div>

        {/* Rekomendasi Bahan Terjangkau */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Rekomendasi Bahan</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { nama: "Tempe", harga: "Rp 5.000", desc: "Tinggi protein nabati, murah & mudah diolah.", icon: Sprout },
              { nama: "Bayam", harga: "Rp 3.000", desc: "Sumber zat besi & vitamin, baik untuk darah.", icon: Leaf },
              { nama: "Telur", harga: "Rp 2.000/btr", desc: "Protein hewani paling ekonomis & lengkap.", icon: Egg }
            ].map((item, index) => (
              <div key={index} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                <item.icon className="w-10 h-10 text-green-600 mb-2" />
                <h4 className="font-bold text-gray-900">{item.nama}</h4>
                <p className="text-xs text-green-700 font-bold mb-1">{item.harga}</p>
                <p className="text-[10px] text-gray-500 leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Inspirasi Menu Hari Ini */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Inspirasi Menu</h3>
          <div className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80" 
              alt="Menu Sehat" 
              className="w-full h-40 object-cover"
            />
            <div className="p-5">
              <h4 className="font-bold text-gray-900 mb-2">Tumis Bayam Tempe Telur</h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Kombinasi protein dari tempe dan telur yang dipadukan dengan serat dari bayam. 
                Menu ini menyediakan nutrisi lengkap dengan biaya sangat rendah namun tetap lezat.
              </p>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-sm font-bold text-gray-400">Estimasi Harga:</span>
                <span className="text-lg font-black text-green-700">Rp 10.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
}