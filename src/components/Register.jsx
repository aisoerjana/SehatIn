import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SehatIn from '../assets/SehatIn2.png';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !value.includes('@gmail.com')) {
      setEmailError('Email must use @gmail.com');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value && value.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value && value !== password) {
      setConfirmError('Passwords do not match');
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
    <div className="page-enter flex flex-col min-h-screen w-full max-w-md mx-auto bg-[#eff6ff] dark:bg-[#05070d] px-4 py-8 overflow-y-auto transition-colors">
      {/* Card Container */}
      <div className="page-enter-up bg-white dark:bg-[#0b0f17] rounded-3xl shadow-sm border border-gray-100 dark:border-white/10 p-6 flex flex-col flex-grow transition-colors">

        {/* Header Section */}
        <div className="flex flex-col items-center mb-6 mt-2">
          <img src={SehatIn} alt="SehatIn" className="w-32 h-auto mb-4" />

          <h1 className="text-2xl font-bold text-blue-800 dark:text-cyan-300 mb-2">Create New Account</h1>

        </div>

        {error && (
          <div className="page-enter bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg p-3 mb-4">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form Section */}
        <form className="flex flex-col gap-4 flex-grow">
          {/* Full Name Input */}
          <div className="page-enter-up" style={{ animationDelay: '60ms' }}>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-3 bg-[#F4F7F9] dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-cyan-400 dark:focus:border-cyan-400 text-sm transition-colors"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Input */}
          <div className="page-enter-up" style={{ animationDelay: '120ms' }}>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-1.5">
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={handleEmailChange}
              className={`block w-full px-4 py-3 bg-[#F4F7F9] dark:bg-white/5 text-gray-900 dark:text-white border rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-cyan-400 dark:focus:border-cyan-400 text-sm transition-colors ${
                emailError ? 'border-red-500' : 'border-gray-200 dark:border-white/10'
              }`}
              placeholder="Email"
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="page-enter-up" style={{ animationDelay: '180ms' }}>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                className={`block w-full pl-4 pr-11 py-3 bg-[#F4F7F9] dark:bg-white/5 text-gray-900 dark:text-white border rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-cyan-400 dark:focus:border-cyan-400 text-sm transition-colors ${
                  passwordError ? 'border-red-500' : 'border-gray-200 dark:border-white/10'
                }`}
                placeholder="At least 8 characters"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                )}
              </div>
            </div>
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="page-enter-up" style={{ animationDelay: '240ms' }}>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleConfirmChange}
                className={`block w-full pl-4 pr-11 py-3 bg-[#F4F7F9] dark:bg-white/5 text-gray-900 dark:text-white border rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-cyan-400 dark:focus:border-cyan-400 text-sm transition-colors ${
                  confirmError ? 'border-red-500' : 'border-gray-200 dark:border-white/10'
                }`}
                placeholder="Re-enter your password"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                )}
              </div>
            </div>
            {confirmError && (
              <p className="text-red-500 text-xs mt-1">{confirmError}</p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="button"
            disabled={!isFormValid || loading}
            onClick={handleRegister}
            style={{ animationDelay: '300ms' }}
            className={`page-enter-up w-full text-white font-semibold py-3.5 rounded-xl transition-colors mt-auto flex items-center justify-center gap-2 shadow-sm ${
              isFormValid && !loading
                ? 'bg-[#FF9A70] hover:bg-[#ff8554] dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-500 dark:hover:opacity-90 cursor-pointer'
                : 'bg-gray-300 dark:bg-white/10 cursor-not-allowed'
            }`}
          >
            {loading ? 'Processing...' : 'Register'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      </div>

      {/* Footer / Login Link */}
      <div className="page-enter pt-6 pb-2 text-center" style={{ animationDelay: '350ms' }}>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-700 dark:text-cyan-300 font-bold hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}