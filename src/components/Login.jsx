import { useState } from 'react';
import { User, Lock, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SehatIn from '../assets/SehatIn.png';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !value.includes('@gmail.com')) {
      setEmailError('Email harus menggunakan @gmail.com');
    } else {
      setEmailError('');
    }
  };

  const handleLogin = async () => {
    if (!email.includes('@gmail.com')) {
      setEmailError('Email harus menggunakan @gmail.com');
      return;
    }
    setLoading(true); setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setLoginError('Email atau kata sandi salah'); return }
    navigate('/dashboard')
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-12">
      {/* Logo & Header Section */}
      <div className="flex flex-col items-center mt-10 mb-12">
        <img src={SehatIn} alt="SehatIn" className="w-16 h-16 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang</h1>
      </div>

      {/* Form Section */}
      <form className="flex flex-col gap-5 flex-grow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={email}
              onChange={handleEmailChange}
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-green-500 focus:border-green-500 text-sm ${
                emailError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan email"
            />
          </div>
          {emailError && (
            <p className="text-red-500 text-xs mt-1">{emailError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 text-sm"
              placeholder="Masukkan kata sandi"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </div>
          </div>
        </div>

        {loginError && (
          <p className="text-red-500 text-sm text-center">{loginError}</p>
        )}

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3.5 rounded-full transition-colors mt-4 shadow-sm disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <div className="mt-auto pt-8 pb-4 text-center">
        <p className="text-sm text-gray-600">
          Belum punya akun?{' '}
          <Link to="/register" className="text-green-600 font-bold hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}