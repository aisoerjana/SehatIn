import { useState } from 'react';
import { User, Lock, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SehatIn from '../assets/SehatIn2.png';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !value.includes('@gmail.com')) {
      setEmailError('Email must use @gmail.com');
    } else {
      setEmailError('');
    }
  };

  const handleLogin = async () => {
    if (!email.includes('@gmail.com')) {
      setEmailError('Email must use @gmail.com');
      return;
    }
    setLoading(true); setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setLoginError('Incorrect email or password'); return }
    navigate('/dashboard')
  };

  return (
    <div className="page-enter flex flex-col h-dvh w-full max-w-md mx-auto px-6 pt-6 pb-2 transition-colors relative overflow-hidden">
      {/* Dark/Light Mode Toggle */}
      <button
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Enable light mode' : 'Enable dark mode'}
        className="navbar-enter-down absolute top-4 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors
          bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100
          dark:bg-white/5 dark:border-white/10 dark:text-cyan-300 dark:hover:bg-white/10"
      >
        {theme === 'dark' ? (
          <>
            <Moon className="w-3.5 h-3.5" />
            Dark
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5" />
            Light
          </>
        )}
      </button>

      <div className="flex-1 overflow-y-auto pt-8">
        {/* Logo & Header Section */}
        <div className="page-enter-up flex flex-col items-center mb-8">
          <img src={SehatIn} alt="SehatIn" className="w-16 h-16 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome</h1>
        </div>

        {/* Form Section */}
        <form className="flex flex-col gap-5">
          <div className="page-enter-up" style={{ animationDelay: '80ms' }}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
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
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-cyan-400 dark:focus:border-cyan-400 text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white ${
                  emailError ? 'border-red-500' : 'border-gray-300 dark:border-white/10'
                }`}
                placeholder="Enter your email"
              />
            </div>
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>

          <div className="page-enter-up" style={{ animationDelay: '150ms' }}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-white/10 rounded-xl focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-cyan-400 dark:focus:border-cyan-400 text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white"
                placeholder="Enter your password"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </div>
            </div>
          </div>

          {loginError && (
            <p className="page-enter text-red-500 text-sm text-center">{loginError}</p>
          )}

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="page-enter-up w-full bg-blue-700 hover:bg-blue-800 dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-500 dark:hover:opacity-90 text-white font-semibold py-3.5 rounded-full transition-colors mt-4 shadow-sm disabled:opacity-50"
            style={{ animationDelay: '220ms' }}
          >
            {loading ? 'Processing...' : 'Log In'}
          </button>
        </form>
      </div>

      <div className="page-enter pt-4 pb-4 text-center shrink-0" style={{ animationDelay: '300ms' }}>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 dark:text-cyan-300 font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}