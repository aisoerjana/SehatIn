import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SehatIn from '../assets/SehatIn2.png';

export default function Splash() {
  const navigate = useNavigate();

  const handleMulai = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    navigate(session ? '/dashboard' : '/login');
  };

  return (
    <div className="relative flex flex-col items-center justify-between h-screen w-full max-w-md mx-auto bg-[#eff6ff] dark:bg-[#05070d] overflow-hidden pb-10 transition-colors">

      {/* Dekorasi Background Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200/30 dark:bg-cyan-400/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-[#954A29]/10 dark:bg-blue-500/10 rounded-full blur-3xl -ml-20"></div>

      {/* Spacer Atas */}
      <div className="flex-1"></div>

      {/* Konten Tengah (Logo & Teks) */}
      <div className="flex flex-col items-center z-10 px-8 text-center mt-10">
        <div className="flex items-center gap-3 mb-6">
          <img src={SehatIn} alt="SehatIn" className="w-36 h-auto" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-[15px] font-medium max-w-[450px] leading-relaxed">
          Rencana gizi personal berbasis pangan lokal Indonesia, lengkap dengan Muscle Scan dan rekomendasi resep bertenaga AI.
        </p>
      </div>

      {/* Tombol Mulai */}
      <div className="flex-1 flex flex-col justify-end w-full px-6 z-10">
        <button
          onClick={handleMulai}
          className="w-full bg-[#954A29] hover:bg-[#7a3b1f] dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-500 dark:hover:opacity-90 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition-colors shadow-md"
        >
          Mulai
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}