import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import { FaFacebookF, FaTwitter, FaGoogle } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authApi.login(formData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      alert('Login successful!');
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        <div className="p-12">
          <h6 className="text-orange-500 text-sm font-semibold mb-2">Login</h6>
          <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-gray-600 mb-6">Login with your social network</p>
          
          <div className="flex gap-4 mb-8">
            <button className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition">
              <FaFacebookF />
            </button>
            <button className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition">
              <FaTwitter />
            </button>
            <button className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition">
              <FaGoogle />
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-12 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-6 py-4 border border-black bg-white rounded-lg outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-6 py-4 border border-black bg-white rounded-lg outline-none"
              required
            />
            <div className="text-right">
              <Link to="/forgot-password" className="text-orange-500 text-sm">Forgot Password?</Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login Now'}
            </button>
          </form>
          <p className="text-center mt-6 text-gray-600">
            Don't have an account? <Link to="/register" className="text-orange-500 font-semibold">Register</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
