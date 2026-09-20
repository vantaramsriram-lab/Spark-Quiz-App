import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/logo.png"
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return false;
    }

    if (!isLogin) {
      if (!formData.name) {
        setError('Name is required');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const user = await login(formData.email, formData.password);
        navigate(user.role === 'admin' ? '/admin' : '/quiz');
      } else {
        await register(formData.name, formData.email, formData.password);
        setSuccess('Registration successful! Please log in.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#030910]">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00aeef] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#21b9ef] opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-slideUp flex flex-col">
        {/* Logo/Header */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="" className='w-50 h-50'/>
          <p className="text-[#8295a1] tracking-widest">Feel the SPARK</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#08131d] border border-[#172936] rounded-2xl p-8 shadow-xl">
          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-6 bg-[#050e17] p-1 rounded-lg">
            <button
              onClick={() => isLogin || switchMode()}
              className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all ${
                isLogin
                  ? 'bg-[#00aeef] text-[#031018]'
                  : 'text-[#8295a1] hover:text-[#f1f7fa]'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => !isLogin || switchMode()}
              className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all ${
                !isLogin
                  ? 'bg-[#00aeef] text-[#031018]'
                  : 'text-[#8295a1] hover:text-[#f1f7fa]'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm animate-fadeIn">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm animate-fadeIn">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-medium text-[#f1f7fa] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#050e17] border border-[#172936] rounded-lg text-[#f1f7fa] placeholder-[#8295a1] focus:outline-none focus:border-[#00aeef] focus:bg-[#071521] transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#f1f7fa] mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#050e17] border border-[#172936] rounded-lg text-[#f1f7fa] placeholder-[#8295a1] focus:outline-none focus:border-[#00aeef] focus:bg-[#071521] transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#f1f7fa] mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#050e17] border border-[#172936] rounded-lg text-[#f1f7fa] placeholder-[#8295a1] focus:outline-none focus:border-[#00aeef] focus:bg-[#071521] transition-all"
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-medium text-[#f1f7fa] mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#050e17] border border-[#172936] rounded-lg text-[#f1f7fa] placeholder-[#8295a1] focus:outline-none focus:border-[#00aeef] focus:bg-[#071521] transition-all"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#00aeef] hover:bg-[#21b9ef] text-[#031018] font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#00aeef]/20 hover:shadow-[#00aeef]/30"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#031018]"></div>
                  {isLogin ? 'Logging in...' : 'Registering...'}
                </span>
              ) : (
                isLogin ? 'Login' : 'Register'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
