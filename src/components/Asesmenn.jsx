import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import UpperNavbar from './UpperNavbar';
import BottomNavbar from './BottomNavbar';

export default function Asesmen() {
  const navigate = useNavigate();

  const [tinggi, setTinggi] = useState('');
  const [berat, setBerat] = useState('');
  const [umur, setUmur] = useState('');
  const [gender, setGender] = useState('');
  const [tujuan, setTujuan] = useState('');

  const hitung = async () => {
    const t = parseFloat(tinggi);
    const b = parseFloat(berat);
    const u = parseFloat(umur);
    if (!t || !b || !u || !gender || !tujuan) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate('/login'); return; }

    const { data, error } = await supabase.functions.invoke('rule-engine', {
      body: {
        gender: gender === 'laki' ? 'laki-laki' : 'perempuan',
        weight_kg: b,
        height_cm: t,
        age: u,
        goal: tujuan,
      },
    });

    if (error || data?.error) {
      console.error(error || data?.error);
      return;
    }

    const mt = data.macro_target;
    navigate('/result', {
      state: {
        hasil: {
          kalori: mt.calorie_target,
          protein: mt.protein_g,
          karbo: mt.carbs_g,
          lemak: mt.fat_g,
          gula: mt.sugar_max_g,
          serat: mt.fiber_g,
        },
      },
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#eff6ff] dark:bg-[#05070d] transition-colors">
      <UpperNavbar />

      <div className="flex-1 p-5 overflow-y-auto pb-4">
        <div className="flex items-center gap-2 mb-5">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-blue-800 dark:text-cyan-300">Kalkulator Gizi</h1>
        </div>
        {/* Card 1: Data Fisik */}
        <div className="bg-white dark:bg-[#0b0f17] rounded-2xl p-5 mb-5 shadow-sm border border-gray-100 dark:border-white/10 transition-colors">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 bg-blue-500 dark:bg-gradient-to-br dark:from-cyan-400 dark:to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">1</div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Data Fisik</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-gray-200 mb-2">Jenis Kelamin</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setGender('laki')}
                  className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                    gender === 'laki' ? 'border-blue-600 dark:border-cyan-400 text-blue-700 dark:text-cyan-300 bg-blue-50 dark:bg-cyan-400/10' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 bg-[#F4F7F9] dark:bg-white/5'
                  }`}
                >
                  Laki-laki
                </button>
                <button
                  onClick={() => setGender('perempuan')}
                  className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                    gender === 'perempuan' ? 'border-blue-600 dark:border-cyan-400 text-blue-700 dark:text-cyan-300 bg-blue-50 dark:bg-cyan-400/10' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 bg-[#F4F7F9] dark:bg-white/5'
                  }`}
                >
                  Perempuan
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-gray-200 mb-2">Umur (tahun)</label>
              <input
                type="number"
                value={umur}
                onChange={(e) => setUmur(e.target.value)}
                placeholder="Contoh: 25"
                className="w-full px-4 py-3 bg-[#F4F7F9] dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-cyan-400/50 focus:border-blue-500 dark:focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-gray-200 mb-2">Tinggi Badan (cm)</label>
              <input
                type="number"
                value={tinggi}
                onChange={(e) => setTinggi(e.target.value)}
                placeholder="Contoh: 160"
                className="w-full px-4 py-3 bg-[#F4F7F9] dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-cyan-400/50 focus:border-blue-500 dark:focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-gray-200 mb-2">Berat Badan (kg)</label>
              <input
                type="number"
                value={berat}
                onChange={(e) => setBerat(e.target.value)}
                placeholder="Contoh: 60"
                className="w-full px-4 py-3 bg-[#F4F7F9] dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-cyan-400/50 focus:border-blue-500 dark:focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Tujuan */}
        <div className="bg-white dark:bg-[#0b0f17] rounded-2xl p-5 mb-5 shadow-sm border border-gray-100 dark:border-white/10 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 bg-blue-500 dark:bg-gradient-to-br dark:from-cyan-400 dark:to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">2</div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tujuan</h2>
          </div>
          <div className="space-y-3">
            {[
              { value: 'cutting', label: 'Cutting', desc: 'Menurunkan berat badan' },
              { value: 'maintain', label: 'Maintain', desc: 'Menjaga berat badan tetap ideal' },
              { value: 'bulking', label: 'Bulking', desc: 'Menaikkan berat badan' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setTujuan(item.value)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  tujuan === item.value
                    ? 'border-blue-600 dark:border-cyan-400 bg-blue-50 dark:bg-cyan-400/10'
                    : 'border-gray-200 dark:border-white/10 bg-[#F4F7F9] dark:bg-white/5'
                }`}
              >
                <span className={`text-sm font-bold ${tujuan === item.value ? 'text-blue-700 dark:text-cyan-300' : 'text-gray-800 dark:text-gray-300'}`}>
                  {item.label}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Tombol Hitung */}
        <button
          onClick={hitung}
          disabled={!tinggi || !berat || !umur || !gender || !tujuan}
          className={`w-full text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all ${
            tinggi && berat && umur && gender && tujuan
              ? 'bg-[#2563EB] hover:bg-blue-800 dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-500 dark:hover:opacity-90 active:scale-[0.98] cursor-pointer'
              : 'bg-gray-300 dark:bg-white/10 cursor-not-allowed'
          }`}
        >
          Hitung Kebutuhan Gizi
        </button>
      </div>

      <BottomNavbar />
    </div>
  );
}
