import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import UpperNavbar from './UpperNavbar';
import BottomNavbar from './BottomNavbar';

export default function Asesmen() {
  const navigate = useNavigate();

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseFloat(age);
    if (!h || !w || !a || !gender || !goal) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }

      const { data, error } = await supabase.functions.invoke('rule-engine', {
        body: {
          gender: gender === 'male' ? 'laki-laki' : 'perempuan',
          weight_kg: w,
          height_cm: h,
          age: a,
          goal: goal,
        },
      });

      if (error || data?.error) {
        console.error(error || data?.error);
        return;
      }

      const mt = data.macro_target;
      navigate('/result', {
        state: {
          result: {
            calories: mt.calorie_target,
            protein: mt.protein_g,
            carbs: mt.carbs_g,
            fat: mt.fat_g,
            sugar: mt.sugar_max_g,
            fiber: mt.fiber_g,
          },
          macro_target_id: mt.id,
          isNew: true,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-[#eff6ff] dark:bg-[#05070d] transition-colors">
      <UpperNavbar />

      <div className="flex-1 p-5 overflow-y-auto pb-24">
        <div className="navbar-enter-down flex items-center gap-2 mb-5">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-blue-800 dark:text-cyan-300">Nutrition Calculator</h1>
        </div>
        {/* Card 1: Physical Data */}
        <div className="page-enter-up bg-white dark:bg-[#0b0f17] rounded-2xl p-5 mb-5 shadow-sm border border-gray-100 dark:border-white/10 transition-colors" style={{ animationDelay: '80ms' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 bg-blue-500 dark:bg-gradient-to-br dark:from-cyan-400 dark:to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">1</div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Physical Data</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-gray-200 mb-2">Gender</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setGender('male')}
                  className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                    gender === 'male' ? 'border-blue-600 dark:border-cyan-400 text-blue-700 dark:text-cyan-300 bg-blue-50 dark:bg-cyan-400/10' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 bg-[#F4F7F9] dark:bg-white/5'
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => setGender('female')}
                  className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                    gender === 'female' ? 'border-blue-600 dark:border-cyan-400 text-blue-700 dark:text-cyan-300 bg-blue-50 dark:bg-cyan-400/10' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 bg-[#F4F7F9] dark:bg-white/5'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-gray-200 mb-2">Age (years)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 25"
                className="w-full px-4 py-3 bg-[#F4F7F9] dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-cyan-400/50 focus:border-blue-500 dark:focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-gray-200 mb-2">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 160"
                className="w-full px-4 py-3 bg-[#F4F7F9] dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-cyan-400/50 focus:border-blue-500 dark:focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-gray-200 mb-2">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 60"
                className="w-full px-4 py-3 bg-[#F4F7F9] dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-cyan-400/50 focus:border-blue-500 dark:focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Goal */}
        <div className="page-enter-up bg-white dark:bg-[#0b0f17] rounded-2xl p-5 mb-5 shadow-sm border border-gray-100 dark:border-white/10 transition-colors" style={{ animationDelay: '160ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 bg-blue-500 dark:bg-gradient-to-br dark:from-cyan-400 dark:to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">2</div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Goal</h2>
          </div>
          <div className="space-y-3">
            {[
              { value: 'cutting', label: 'Cutting', desc: 'Lose weight' },
              { value: 'maintain', label: 'Maintain', desc: 'Keep your weight at its ideal level' },
              { value: 'bulking', label: 'Bulking', desc: 'Gain weight' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setGoal(item.value)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  goal === item.value
                    ? 'border-blue-600 dark:border-cyan-400 bg-blue-50 dark:bg-cyan-400/10'
                    : 'border-gray-200 dark:border-white/10 bg-[#F4F7F9] dark:bg-white/5'
                }`}
              >
                <span className={`text-sm font-bold ${goal === item.value ? 'text-blue-700 dark:text-cyan-300' : 'text-gray-800 dark:text-gray-300'}`}>
                  {item.label}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculate}
          disabled={!height || !weight || !age || !gender || !goal || loading}
          style={{ animationDelay: '240ms' }}
          className={`page-enter-up w-full text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all ${
            height && weight && age && gender && goal
              ? 'bg-[#2563EB] hover:bg-blue-800 dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-500 dark:hover:opacity-90 active:scale-[0.98] cursor-pointer'
              : 'bg-gray-300 dark:bg-white/10 cursor-not-allowed'
          } ${loading ? 'opacity-80 cursor-wait' : ''}`}
        >
          {loading ? (
            <>
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Calculating...
            </>
          ) : (
            'Calculate Nutrition Needs'
          )}
        </button>
      </div>

      <BottomNavbar />
    </div>
  );
}
