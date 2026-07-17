import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import UpperNavbar from './UpperNavbar';
import BottomNavbar from './BottomNavbar';
import { Clock, Calendar, Ruler, User, Weight, Trash2 } from 'lucide-react';

export default function History() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }

      const { data, error } = await supabase
        .from('macro_targets')
        .select('id, calorie_target, protein_g, carbs_g, fat_g, fiber_g, sugar_max_g, created_at, profiles (height_cm, age, weight_kg)')
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

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setConfirmDeleteId(null);
    await supabase.from('macro_targets').delete().eq('id', id);
    setResults((prev) => prev.filter((r) => r.id !== id));
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-[#eff6ff] dark:bg-[#05070d] transition-colors">
        <UpperNavbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Memuat...</p>
        </div>
      <BottomNavbar />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#eff6ff] dark:bg-[#05070d] transition-colors">
      <UpperNavbar />
      <div className="flex-1 p-5 overflow-y-auto pb-8">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Riwayat Asesmen</h1>
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <Clock className="w-16 h-16 text-gray-300 dark:text-white/20 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Riwayat Asesmen</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">Riwayat asesmen kesehatan akan muncul di sini.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((item) => (
              <div
                key={item.id}
                className="relative bg-white dark:bg-[#0b0f17] rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow"
              >
                <button
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
                        macro_target_id: item.id,
                      },
                    })
                  }
                  className="w-full text-left p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-cyan-300" />
                      <span className="font-bold text-sm text-gray-900 dark:text-white">
                        {formatDate(item.created_at)}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {formatTime(item.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                    {item.profiles && (
                      <>
                        <span className="flex items-center gap-1">
                          <Ruler className="w-3.5 h-3.5" />
                          {item.profiles.height_cm} cm
                        </span>
                        <span className="flex items-center gap-1">
                          <Weight className="w-3.5 h-3.5" />
                          {item.profiles.weight_kg} kg
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {item.profiles.age} tahun
                        </span>
                      </>
                    )}
                  </div>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(item.id); }}
                  disabled={deletingId === item.id}
                  className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-40"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Hapus */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDeleteId(null)}>
          <div
            className="bg-white dark:bg-[#0e1522] rounded-3xl p-6 w-full max-w-xs border border-gray-100 dark:border-cyan-400/20 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">Hapus Riwayat</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">Riwayat yang dihapus tidak dapat dikembalikan.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                Tidak
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deletingId === confirmDeleteId}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deletingId === confirmDeleteId ? '...' : 'Iya'}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavbar />
    </div>
  );
}
