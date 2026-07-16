import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { prosesAsesmen } from './components/asesmen'
import { ambilRiwayatUntukGrafik } from './components/riwayat'
import { exportHasilKePDF } from './components/exportPdf'

const GOALS = [
  { value: 'bulking', label: 'Bulking (tambah massa)' },
  { value: 'cutting', label: 'Cutting (turun lemak)' },
  { value: 'maintain', label: 'Maintain (jaga berat)' },
]

function App() {
  const [session, setSession] = useState(null)
  const [view, setView] = useState('form')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [riwayat, setRiwayat] = useState([])
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    weight_kg: '', height_cm: '', age: '', gender: '', goal: '',
  })
  const [authForm, setAuthForm] = useState({ email: '', password: '' })
  const [authMode, setAuthMode] = useState('login')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription?.unsubscribe()
  }, [])

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const handleAuth = async e => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      if (authMode === 'register') {
        const { error } = await supabase.auth.signUp({ email: authForm.email, password: authForm.password })
        if (error) throw error
        setError('Registrasi berhasil! Cek email untuk konfirmasi (atau langsung login).')
        setAuthMode('login')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: authForm.email, password: authForm.password })
        if (error) throw error
      }
    } catch (err) { setError(err.message) }
    setLoading(false)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setView('form')
    setResult(null)
  }

  const submit = async e => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const res = await prosesAsesmen({
        ...form,
        weight_kg: +form.weight_kg,
        height_cm: +form.height_cm,
        age: +form.age,
      })
      if (!res) { setError('Gagal memproses asesmen'); setLoading(false); return }
      setResult(res); setView('result')
    } catch (err) { setError(err.message) }
    setLoading(false)
  }

  const lihatRiwayat = async () => {
    setLoading(true)
    try { setRiwayat(await ambilRiwayatUntukGrafik()); setView('history') }
    catch (err) { setError(err.message) }
    setLoading(false)
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-100 p-4 flex items-center justify-center">
        <div className="max-w-sm w-full">
          <h1 className="text-xl font-bold text-blue-600 text-center">SehatIn</h1>
          <p className="text-xs text-gray-500 text-center mb-6">Asesmen Nutrisi Personal</p>

          {error &&
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          }

          <form onSubmit={handleAuth} className="bg-white rounded-xl shadow-lg p-5 space-y-4">
            <h2 className="text-base font-semibold text-gray-800">
              {authMode === 'login' ? 'Masuk' : 'Daftar Akun'}
            </h2>
            <div>
              <label className="text-xs font-medium text-gray-700">Email</label>
              <input type="email" required value={authForm.email}
                onChange={e => setAuthForm(p => ({ ...p, email: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Password</label>
              <input type="password" required value={authForm.password}
                onChange={e => setAuthForm(p => ({ ...p, password: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-medium disabled:opacity-50">
              {loading ? 'Memproses...' : authMode === 'login' ? 'Masuk' : 'Daftar'}
            </button>
          </form>

          <p className="text-xs text-center text-gray-500 mt-4">
            {authMode === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
            <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setError(null) }}
              className="text-blue-600 font-medium underline">
              {authMode === 'login' ? 'Daftar' : 'Masuk'}
            </button>
          </p>
        </div>
      </div>
    )
  }

  if (view === 'result' && result) {
    const { macro_target, rekomendasi } = result
    return (
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="max-w-sm mx-auto space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-green-700 mb-4">Target Makro Harian</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Kalori</p>
                <p className="text-lg font-bold text-green-700">{macro_target.calorie_target}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Protein</p>
                <p className="text-lg font-bold text-blue-700">{macro_target.protein_g}g</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Karbohidrat</p>
                <p className="text-lg font-bold text-yellow-700">{macro_target.carbs_g}g</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Lemak</p>
                <p className="text-lg font-bold text-red-700">{macro_target.fat_g}g</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Serat</p>
                <p className="text-lg font-bold text-purple-700">{macro_target.fiber_g}g</p>
              </div>
              <div className="bg-pink-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Gula Maks</p>
                <p className="text-lg font-bold text-pink-700">{macro_target.sugar_max_g}g</p>
              </div>
              <div className="bg-cyan-50 rounded-lg p-3 col-span-2">
                <p className="text-xs text-gray-500">Air Putih</p>
                <p className="text-lg font-bold text-cyan-700">{macro_target.water_liter}L</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">BMI</p>
                <p className="text-lg font-bold text-gray-700">{macro_target.bmi}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">TDEE</p>
                <p className="text-lg font-bold text-gray-700">{macro_target.tdee} kkal</p>
              </div>
            </div>
          </div>

          {rekomendasi && rekomendasi.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-blue-700 mb-4">Rekomendasi Makanan</h2>
              <div className="space-y-3">
                {['sarapan', 'makan_siang', 'makan_malam', 'snack'].map(meal => {
                  const items = rekomendasi.filter(r => r.meal_type === meal)
                  if (items.length === 0) return null
                  const label = { sarapan: 'Sarapan', makan_siang: 'Makan Siang', makan_malam: 'Makan Malam', snack: 'Snack' }[meal]
                  return (
                    <div key={meal}>
                      <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>
                      {items.map((r, i) => (
                        <div key={i} className="flex justify-between items-center bg-slate-50 rounded-lg p-2 mb-1">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{r.food_name}</p>
                            <p className="text-xs text-gray-500">{r.portion} — {r.kalori} kkal</p>
                          </div>
                          <div className="text-right text-xs text-gray-400">
                            <p>P{r.protein_g}g</p>
                            <p>KH{r.carbs_g}g</p>
                            <p>L{r.lemak_g}g</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <button onClick={() => exportHasilKePDF(macro_target, rekomendasi)}
            className="w-full bg-green-600 text-white py-3 rounded-lg text-sm font-medium">
            Download PDF
          </button>
          <button onClick={() => { setView('form'); setResult(null) }}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium">
            Kembali
          </button>
        </div>
      </div>
    )
  }

  if (view === 'history') {
    return (
      <div className="min-h-screen bg-slate-100 p-4">
        <div className="max-w-sm mx-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Riwayat Harian</h2>
          {riwayat.length === 0
            ? <p className="text-gray-500 text-sm text-center py-8">Belum ada riwayat.</p>
            : <div className="space-y-2">
                {riwayat.map((r, i) => (
                  <div key={i} className="bg-white rounded-lg shadow p-3">
                    <p className="text-xs text-gray-400">{new Date(r.rec_date).toLocaleDateString('id-ID')}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
                      <span className="font-semibold text-gray-800">{r.total_kalori} kkal</span>
                      <span className="text-blue-600">P{r.total_protein_g}g</span>
                      <span className="text-yellow-600">KH{r.total_carbs_g}g</span>
                      <span className="text-red-600">L{r.total_lemak_g}g</span>
                      <span className="text-purple-600">S{r.total_serat_g}g</span>
                    </div>
                    <div className="flex gap-2 mt-1 text-xs text-gray-500">
                      <span>{r.total_items} item</span>
                      {r.all_cooked && <span className="text-green-600">Sudah dimasak</span>}
                    </div>
                  </div>
                ))}
              </div>
          }
          <button onClick={() => setView('form')}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium mt-6">
            Kembali
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-blue-600">SehatIn</h1>
            <p className="text-xs text-gray-500">Asesmen Nutrisi Personal</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{session.user.email}</span>
            <button onClick={logout}
              className="text-xs text-red-500 underline">Keluar</button>
          </div>
        </div>

        {error &&
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        }

        <form onSubmit={submit} className="bg-white rounded-xl shadow-lg p-5 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-700">Tinggi (cm)</label>
              <input type="number" required value={form.height_cm}
                onChange={e => set('height_cm', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-700">Berat (kg)</label>
              <input type="number" required value={form.weight_kg}
                onChange={e => set('weight_kg', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1" />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-700">Usia</label>
              <input type="number" required value={form.age}
                onChange={e => set('age', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-700">Gender</label>
              <select required value={form.gender}
                onChange={e => set('gender', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 bg-white">
                <option value="">Pilih</option>
                <option value="laki-laki">Laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700">Tujuan</label>
            <select required value={form.goal}
              onChange={e => set('goal', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 bg-white">
              <option value="">Pilih</option>
              {GOALS.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-medium disabled:opacity-50">
            {loading ? 'Memproses...' : 'Mulai Asesmen'}
          </button>
        </form>

        <button onClick={lihatRiwayat}
          className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg text-sm font-medium mt-4">
          Lihat Riwayat
        </button>
      </div>
    </div>
  )
}

export default App
