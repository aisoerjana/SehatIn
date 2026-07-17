import { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { supabase } from '../supabaseClient';
import UpperNavbar from './UpperNavbar';
import BottomNavbar from './BottomNavbar';

const categoryColors = {
  buah: { text: 'text-green-700', bg: 'bg-green-50' },
  sayuran: { text: 'text-lime-700', bg: 'bg-lime-50' },
  protein: { text: 'text-red-700', bg: 'bg-red-50' },
  karbohidrat: { text: 'text-yellow-700', bg: 'bg-yellow-50' },
  lemak: { text: 'text-orange-700', bg: 'bg-orange-50' },
  susu: { text: 'text-blue-700', bg: 'bg-blue-50' },
  minuman: { text: 'text-cyan-700', bg: 'bg-cyan-50' },
  bumbu: { text: 'text-purple-700', bg: 'bg-purple-50' },
  lain: { text: 'text-gray-700', bg: 'bg-gray-100' },
};

function getCategoryColor(category) {
  return categoryColors[category?.toLowerCase()] || { text: 'text-green-700', bg: 'bg-green-50' };
}

export default function FoodList() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const allCategories = [...new Set(foods.map((f) => f.category))];

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  useEffect(() => {
    async function fetchFoods() {
      const { data, error } = await supabase
        .from('food_catalog')
        .select('*')
        .order('category', { ascending: true })
        .order('food_name', { ascending: true });
      if (!error) setFoods(data || []);
      setLoading(false);
    }
    fetchFoods();
  }, []);

  const filtered = foods.filter((f) => {
    if (search && !f.food_name.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedCategories.length && !selectedCategories.includes(f.category)) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-screen bg-[#eff6ff] dark:bg-[#05070d] transition-colors">
      <UpperNavbar />
      <div className="flex-1 p-5 overflow-y-auto pb-8">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Daftar Makanan</h1>
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`p-2 rounded-full transition-colors ${selectedCategories.length ? 'bg-blue-100 dark:bg-cyan-400/20 text-blue-700 dark:text-cyan-300' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'}`}
            >
              <Filter className="w-5 h-5" />
            </button>
            {showFilter && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowFilter(false)} />
                <div className="absolute right-0 top-full mt-2 z-20 bg-white dark:bg-[#0b0f17] border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg p-3 w-48">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Filter Kategori</p>
                  <div className="space-y-1.5">
                    {allCategories.map((cat) => {
                      const cc = getCategoryColor(cat);
                      return (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat)}
                            onChange={() => toggleCategory(cat)}
                            className="accent-blue-600"
                          />
                          <span className={`text-xs font-medium ${cc.text} ${cc.bg} dark:opacity-90 px-2 py-0.5 rounded-full`}>{cat}</span>
                        </label>
                      );
                    })}
                  </div>
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={() => setSelectedCategories([])}
                      className="w-full mt-2 text-xs text-gray-500 dark:text-gray-400 py-1.5 hover:text-gray-700 dark:hover:text-gray-300 border-t border-gray-100 dark:border-white/10 pt-2"
                    >
                      Reset filter
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari makanan..."
            className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#0b0f17] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white dark:placeholder-gray-500"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center mt-20">
            <p className="text-gray-400 dark:text-gray-500">Memuat...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Makanan tidak ditemukan.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((food) => (
              <div key={food.id} className="bg-white dark:bg-[#0b0f17] rounded-2xl p-4 border border-gray-100 dark:border-white/10 shadow-sm transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{food.food_name}</h3>
                    <span className={`text-[10px] font-medium ${getCategoryColor(food.category).text} ${getCategoryColor(food.category).bg} dark:opacity-90 px-2 py-0.5 rounded-full`}>{food.category}</span>
                  </div>
                  <span className="text-sm font-bold text-blue-700 dark:text-cyan-300">{food.kalori} kkal</span>
                </div>
                <div className="flex gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                  <span>Protein {food.protein_g}g</span>
                  <span>KH {food.carbs_g}g</span>
                  <span>Lemak {food.lemak_g}g</span>
                  <span>Serat {food.serat_g}g</span>
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
