import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo1 from '../assets/logo1.png';

export default function Splash() {
  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen bg-white overflow-hidden pb-10">
      
      {/* Dekorasi Background Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-green-200/30 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-[#954A29]/10 rounded-full blur-3xl -ml-20"></div>

      {/* Spacer Atas */}
      <div className="flex-1"></div>

      {/* Konten Tengah (Logo & Teks) */}
      <div className="flex flex-col items-center z-10 px-8 text-center mt-10">
        <div className="flex items-center gap-3 mb-6">
          <img src={logo1} alt="SehatIn" className="w-36 h-auto" />
        </div>
        <p className="text-gray-600 text-[15px] font-medium max-w-[240px] leading-relaxed">
          Panduan gizi preventif berbasis pangan lokal
        </p>
      </div>

      {/* Tombol Mulai */}
      <div className="flex-1 flex flex-col justify-end w-full px-6 z-10">
        <Link to="/login" className="w-full">
          <button className="w-full bg-[#954A29] hover:bg-[#7a3b1f] text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition-colors shadow-md">
            Mulai
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </div>
      
    </div>
  );
}