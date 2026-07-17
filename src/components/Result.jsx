import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ChefHat, Sparkles, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../supabaseClient';
import UpperNavbar from './UpperNavbar';
import BottomNavbar from './BottomNavbar';
import foodData, { kategoriWarna } from '../data/foodData';

export default function Hasil() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasil = location.state?.hasil;
  const macro_target_id = location.state?.macro_target_id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [rekomendasi, setRekomendasi] = useState(null);

  useEffect(() => {
    if (!hasil) {
      navigate('/asesmen', { replace: true });
      return;
    }

    async function loadFromAi() {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        let previous_recommendations = []
        if (session) {
          try {
            const { data: riwayat } = await supabase
              .from('hasil_rekomendasi')
              .select('rekomendasi_bahan, macro_targets!inner(profile_id, created_at)')
              .eq('macro_targets.profile_id', session.user.id)
              .order('macro_targets(created_at)', { ascending: false })
              .limit(3)
            previous_recommendations = (riwayat || [])
              .flatMap((r) => (r.rekomendasi_bahan || []).map((b) => b.nama))
              .filter(Boolean)
          } catch {
            // riwayat gagal dimuat, lanjut tanpa daftar bahan yang perlu dihindari
          }
        }

        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-proxy`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              mode: 'result',
              macro_target: hasil,
              food_catalog: foodData,
              previous_recommendations,
            }),
          }
        )
        const body = await res.json()
        if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`)
        setRekomendasi(body)
        if (macro_target_id) {
          setSaving(true)
          await supabase.from('hasil_rekomendasi').upsert({
            macro_target_id,
            rekomendasi_bahan: body.rekomendasi_bahan || [],
            inspirasi_menu: body.inspirasi_menu || null,
          }, { onConflict: 'macro_target_id' })
          setSaving(false)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (!macro_target_id) {
      loadFromAi();
      return;
    }

    supabase
      .from('hasil_rekomendasi')
      .select('rekomendasi_bahan, inspirasi_menu')
      .eq('macro_target_id', macro_target_id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setRekomendasi({
            rekomendasi_bahan: data.rekomendasi_bahan,
            inspirasi_menu: data.inspirasi_menu,
          });
          setLoading(false);
        } else {
          loadFromAi();
        }
      })
      .catch(() => loadFromAi());
  }, [hasil, navigate, macro_target_id]);

  if (!hasil) return null;

  return (
    <div className="page-enter flex flex-col h-screen w-full max-w-md mx-auto bg-[#eff6ff] dark:bg-[#05070d] transition-colors">
      <UpperNavbar />

      <div className="flex-1 p-5 overflow-y-auto pb-24">
        <div className="navbar-enter-down flex items-center gap-2 mb-5">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Riwayat</h1>
        </div>

        {/* Hasil Kebutuhan Harian */}
        <div className="page-enter-up bg-white dark:bg-[#0b0f17] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-white/10 transition-colors" style={{ animationDelay: '80ms' }}>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Hasil Kebutuhan Harian</h3>
          <div className="space-y-3">
            <div className="stagger-item flex justify-between items-center p-4 bg-green-50 dark:bg-cyan-400/10 rounded-xl" style={{ animationDelay: '150ms' }}>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Kalori</span>
              <span className="text-sm font-bold text-green-700 dark:text-cyan-300">{hasil.kalori} kkal</span>
            </div>
            <div className="stagger-item flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl" style={{ animationDelay: '210ms' }}>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Protein</span>
              <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{hasil.protein} g</span>
            </div>
            <div className="stagger-item flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-500/10 rounded-xl" style={{ animationDelay: '270ms' }}>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Karbohidrat</span>
              <span className="text-sm font-bold text-orange-700 dark:text-orange-300">{hasil.karbo} g</span>
            </div>
            <div className="stagger-item flex justify-between items-center p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl" style={{ animationDelay: '330ms' }}>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Lemak</span>
              <span className="text-sm font-bold text-yellow-700 dark:text-yellow-300">{hasil.lemak} g</span>
            </div>
            <div className="stagger-item flex justify-between items-center p-4 bg-red-50 dark:bg-red-500/10 rounded-xl" style={{ animationDelay: '390ms' }}>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Gula</span>
              <span className="text-sm font-bold text-red-700 dark:text-red-300">{hasil.gula} g</span>
            </div>
            <div className="stagger-item flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-500/10 rounded-xl" style={{ animationDelay: '450ms' }}>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Serat</span>
              <span className="text-sm font-bold text-purple-700 dark:text-purple-300">{hasil.serat} g</span>
            </div>
          </div>
        </div>

        {/* Rekomendasi Bahan + Inspirasi Menu */}
        {loading && (
          <div className="page-enter mt-8 flex flex-col items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-600 dark:text-cyan-300 animate-spin mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {macro_target_id ? 'Memuat rekomendasi...' : 'AI sedang merekomendasikan bahan untukmu...'}
            </p>
          </div>
        )}

        {saving && (
          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <Loader className="w-3 h-3 animate-spin" />
            Menyimpan hasil...
          </div>
        )}

        {error && (
          <div className="page-enter mt-8 flex items-start gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-2xl px-5 py-4">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-0.5">Gagal memuat rekomendasi</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {rekomendasi && !loading && (
          <>
            {/* Rekomendasi Bahan */}
            {rekomendasi.rekomendasi_bahan?.length > 0 && (
              <div className="page-enter-up mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-cyan-300" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Rekomendasi Bahan</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {rekomendasi.rekomendasi_bahan.map((item, index) => {
                    const kw = kategoriWarna[item.kategori] || { bg: 'bg-gray-50', text: 'text-gray-700', label: item.kategori };
                    return (
                      <div key={index} className="stagger-item bg-white dark:bg-[#0b0f17] p-4 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm transition-colors" style={{ animationDelay: `${index * 60}ms` }}>
                        <span className={`text-[10px] font-medium ${kw.text} ${kw.bg} px-2 py-0.5 rounded-full`}>
                          {kw.label}
                        </span>
                        <h4 className="font-bold text-gray-900 dark:text-white mt-2 mb-1">{item.nama}</h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{item.alasan}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Inspirasi Menu */}
            {rekomendasi.inspirasi_menu && (
              <div className="page-enter-up mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <ChefHat className="w-5 h-5 text-blue-600 dark:text-cyan-300" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Inspirasi Menu</h3>
                </div>
                <div className="bg-white dark:bg-[#0b0f17] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-white/10 transition-colors">
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-3">
                    {rekomendasi.inspirasi_menu.judul}
                  </h4>

                  <div className="flex flex-wrap gap-3 mb-4">
                    {rekomendasi.inspirasi_menu.kalori && (
                      <div className="flex items-center gap-1 text-xs font-bold text-green-700 dark:text-cyan-300">
                        {rekomendasi.inspirasi_menu.kalori} kkal
                      </div>
                    )}
                    {rekomendasi.inspirasi_menu.estimasi_harga && (
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-500 dark:text-gray-400">
                        {rekomendasi.inspirasi_menu.estimasi_harga}
                      </div>
                    )}
                  </div>

                  {rekomendasi.inspirasi_menu.bahan?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Bahan-bahan:</p>
                      <ul className="space-y-1.5">
                        {rekomendasi.inspirasi_menu.bahan.map((b, i) => (
                          <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                            <span className="text-blue-500 dark:text-cyan-400 mt-0.5">•</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {rekomendasi.inspirasi_menu.langkah?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Cara masak:</p>
                      <ol className="space-y-1.5">
                        {rekomendasi.inspirasi_menu.langkah.map((l, i) => (
                          <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                            <span className="font-bold text-blue-600 dark:text-cyan-300 min-w-[18px]">{i + 1}.</span>
                            {l}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Nutrisi */}
                  {(rekomendasi.inspirasi_menu.protein_g || rekomendasi.inspirasi_menu.carbs_g || rekomendasi.inspirasi_menu.lemak_g) && (
                    <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-white/10">
                      {rekomendasi.inspirasi_menu.protein_g && (
                        <span className="text-xs font-medium text-red-600 dark:text-red-400">
                          Protein {rekomendasi.inspirasi_menu.protein_g}g
                        </span>
                      )}
                      {rekomendasi.inspirasi_menu.carbs_g && (
                        <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                          KH {rekomendasi.inspirasi_menu.carbs_g}g
                        </span>
                      )}
                      {rekomendasi.inspirasi_menu.lemak_g && (
                        <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                          Lemak {rekomendasi.inspirasi_menu.lemak_g}g
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNavbar />
    </div>
  );
}
