import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import UpperNavbar from './UpperNavbar';
import BottomNavbar from './BottomNavbar';
import { Clock, Calendar, Ruler, User } from 'lucide-react';

export default function History() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }

      const { data, error } = await supabase
        .from('macro_targets')
        .select('id, calorie_target, protein_g, carbs_g, fat_g, fiber_g, sugar_max_g, created_at, profiles (height_cm, age)')
        .eq('profile_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!error) setResults(data || []);
      setLoading(false);
    }
    fetchHistory();
  }, [navigate]);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

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
        <h1 className="text-xl font-bold text-gray-900 mb-5">Riwayat Asesmen</h1>
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <Clock className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Riwayat Asesmen</h2>
            <p className="text-sm text-gray-500 max-w-xs">Riwayat asesmen kesehatan akan muncul di sini.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  navigate('/result', {
                    state: {
                      hasil: {
                        kalori: item.calorie_target,
                        protein: item.protein_g,
                        karbo: item.carbs_g,
                        lemak: item.fat_g,
                        gula: item.sugar_max_g,
                        serat: item.fiber_g,
                      },
                    },
                  })
                }
                className="w-full text-left bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="font-bold text-sm text-gray-900">
                    {formatDate(item.created_at)}
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  {item.profiles && (
                    <>
                      <span className="flex items-center gap-1">
                        <Ruler className="w-3.5 h-3.5" />
                        {item.profiles.height_cm} cm
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {item.profiles.age} tahun
                      </span>
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <BottomNavbar />
    </div>
  );
}
