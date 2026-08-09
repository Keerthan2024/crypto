import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await login({ username, password });
      if (success) {
        toast.success('Authentication successful');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 w-full animate-fade-in-up">
      <div className="w-full max-w-md sec-card p-8 md:p-10 relative overflow-hidden">
        
        {/* Subtle decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--color-brand-primary)]/20"></div>

        <div className="text-center mb-10">
          <svg className="w-10 h-10 mx-auto text-[var(--color-brand-primary)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Agent Authentication</h2>
          <p className="text-[var(--color-text-muted)] text-[14px] mt-2">Enter your credentials to access the uplink.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[12px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Identifier</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="sec-input w-full px-4 py-3 text-[14px]"
              placeholder="agent_name"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Passphrase</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="sec-input w-full px-4 py-3 text-[14px]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="sec-btn w-full py-3.5 rounded-xl text-[15px] mt-4"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mx-auto text-[var(--color-text-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : 'Authenticate'}
          </button>
        </form>

        <p className="mt-8 text-center text-[14px] text-[var(--color-text-muted)]">
          Unregistered agent? <Link to="/register" className="text-[var(--color-brand-primary)] hover:text-[var(--color-brand-hover)] font-medium transition-colors">Request Access</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
