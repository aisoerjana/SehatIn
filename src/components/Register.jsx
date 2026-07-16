import { useState } from 'react';
import { EyeOff, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SehatIn from '../assets/SehatIn.png';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !value.includes('@gmail.com')) {
      setEmailError('Email harus menggunakan @gmail.com');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value && value.length < 8) {
      setPasswordError('Kata sandi minimal 8 karakter');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value && value !== password) {
      setConfirmError('Kata sandi tidak sama');
    } else {
      setConfirmError('');
    }
  };

  const handleRegister = async () => {
    setLoading(true); setError('')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    if (data?.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, name }, { onConflict: 'id' })
    }
    navigate('/dashboard')
  };

  const isFormValid =
    name.trim() !== '' &&
    email.includes('@gmail.com') &&
    password.length >= 8 &&
    confirmPassword === password &&
    !emailError &&
    !passwordError &&
    !confirmError;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 px-4 py-8 overflow-y-auto">
      {/* Card Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col flex-grow">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-6 mt-2">
          <img src={SehatIn} alt="SehatIn" className="w-32 h-auto mb-4" />
          
          <h1 className="text-2xl font-bold text-green-800 mb-2">Buat Akun Baru</h1>
          
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Form Section */}
        <form className="flex flex-col gap-4 flex-grow">
          {/* Input Nama Lengkap */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-3 bg-[#F4F7F9] border border-gray-200 rounded-xl focus:ring-green-500 focus:border-green-500 text-sm transition-colors"
              placeholder="Masukkan nama Anda"
            />
          </div>

          {/* Input Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={handleEmailChange}
              className={`block w-full px-4 py-3 bg-[#F4F7F9] border rounded-xl focus:ring-green-500 focus:border-green-500 text-sm transition-colors ${
                emailError ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Email"
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>

          {/* Input Kata Sandi */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className={`block w-full pl-4 pr-11 py-3 bg-[#F4F7F9] border rounded-xl focus:ring-green-500 focus:border-green-500 text-sm transition-colors ${
                  passwordError ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Minimal 8 karakter"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </div>
            </div>
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          {/* Input Konfirmasi Kata Sandi */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Konfirmasi Kata Sandi
            </label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmChange}
                className={`block w-full pl-4 pr-11 py-3 bg-[#F4F7F9] border rounded-xl focus:ring-green-500 focus:border-green-500 text-sm transition-colors ${
                  confirmError ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Ulangi kata sandi"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </div>
            </div>
            {confirmError && (
              <p className="text-red-500 text-xs mt-1">{confirmError}</p>
            )}
          </div>

          {/* Tombol Daftar */}
          <button
            type="button"
            disabled={!isFormValid || loading}
            onClick={handleRegister}
            className={`w-full text-white font-semibold py-3.5 rounded-xl transition-colors mt-auto flex items-center justify-center gap-2 shadow-sm ${
              isFormValid && !loading
                ? 'bg-[#FF9A70] hover:bg-[#ff8554] cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {loading ? 'Memproses...' : 'Daftar'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      </div>

      {/* Footer / Login Link */}
      <div className="pt-6 pb-2 text-center">
        <p className="text-sm text-gray-600">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-green-700 font-bold hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}