import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, LogIn, Eye, EyeOff } from 'lucide-react';
import { Context } from '../../common/helper/Context';
import { apiService } from '../../service/ApiService';
import { POST_url } from '../../connection/connection';

function Login() {
  const navigate = useNavigate();
  const { setUser, setLoadingView } = useContext(Context);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingView(true);

    try {
      const response = await apiService({
        url: POST_url.login,
        method: 'POST',
        data: {
          email: formData.email,
          password: formData.password
        }
      });

      if (response.status === 'success') {
        // Store user data and token
        const userData = {
          full_name: response.data.full_name,
          role: response.data.role,
          username: response.data.username,
          token: response.data.token
        };

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token);
        setUser(userData);

        // Navigate based on role
        if (userData.role === 'super_admin') {
          navigate('/');
        } else if (userData.role === 'admin') {
          navigate('/upload');
        } else if (userData.role === 'expert') {
          navigate('/expert');
        }
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoadingView(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
              <Database className="w-16 h-16 sm:w-20 sm:h-20 text-blue-400 relative drop-shadow-lg" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Data Analysis Tool
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">Sign in to access your dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-700/50">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 sm:py-3.5 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 sm:py-3.5 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition duration-200 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm animate-shake">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-lg hover:shadow-blue-500/50 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-slate-700/50 text-center text-xs sm:text-sm text-slate-400">
            <p className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Secure access for authorized users only
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>© 2026 Data Analysis Tool. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
