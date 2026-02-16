import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await authApi.forgotPassword(email);
      setMessage(response.message || 'If the email exists, a reset link has been sent.');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold mb-2">Forgot Password</h2>
        <p className="text-sm text-gray-600 mb-6">Enter your email to receive a reset link.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {message && <div className="bg-green-100 text-green-700 p-3 rounded text-sm">{message}</div>}
          {error && <div className="bg-red-100 text-red-600 p-3 rounded text-sm">{error}</div>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-gray-600">
          Remembered your password? <Link to="/login" className="text-orange-500 font-semibold">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
