import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import UpperNavbar from './UpperNavbar';
import BottomNavbar from './BottomNavbar';
import { List, Search } from 'lucide-react';

export default function FoodList() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchFoods() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }

      const { data, error } = await supabase
        .from('food_catalog')
        .select('*')
        .order('category', { ascending: true })
        .order('food_name', { ascending: true });

      if (!error) setFoods(data || []);
      setLoading(false);
    }
    fetchFoods();
  }, [navigate]);

  const filtered = foods.filter((f) =>
    f.food_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-[#F8FAFC]">
        <UpperNavbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Memuat...</p>
        </div>
        <BottomNavbar />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">
      <UpperNavbar />
      <div className="flex-1 p-5 overflow-y-auto pb-8">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Daftar Makanan</h1>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari makanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16 text-center">
            <List className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Daftar Makanan</h2>
            <p className="text-sm text-gray-500 max-w-xs">
              {search ? 'Makanan tidak ditemukan.' : 'Daftar makanan akan muncul di sini.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-gray-900">{item.food_name}</span>
                  <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span>Kalori: <strong className="text-gray-800">{item.kalori}</strong></span>
                  <span>Protein: <strong className="text-gray-800">{item.protein_g}g</strong></span>
                  <span>Karbo: <strong className="text-gray-800">{item.carbs_g}g</strong></span>
                  <span>Lemak: <strong className="text-gray-800">{item.lemak_g}g</strong></span>
                  <span>Serat: <strong className="text-gray-800">{item.serat_g}g</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNavbar />
    </div>
  );
}
