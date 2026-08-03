import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const success = await login(data);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full mt-8 animate-fade-in-up px-4">
      <div className="glass-panel p-8 md:p-12 rounded-3xl max-w-md w-full relative overflow-hidden">
        {/* Glow behind form */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[60px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-cyan-900/30 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
          </div>
          
          <h2 className="text-3xl font-black text-center text-white mb-2 tracking-tight">Agent Authentication</h2>
          <p className="text-center text-gray-400 mb-8 text-sm">Enter credentials to access the secure uplink.</p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-gray-300 font-bold mb-2 text-xs uppercase tracking-wider">Agent ID</label>
              <input 
                {...register('username', { required: "Username is required" })}
                type="text" 
                placeholder="Username or Email"
                className={`w-full glass-input rounded-xl p-3 ${errors.username ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
              />
              {errors.username && <p className="text-red-400 text-xs mt-2 font-medium">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-2 text-xs uppercase tracking-wider">Passphrase</label>
              <input 
                {...register('password', { required: "Password is required" })}
                type="password" 
                placeholder="••••••••"
                className={`w-full glass-input rounded-xl p-3 ${errors.password ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
              />
              {errors.password && <p className="text-red-400 text-xs mt-2 font-medium">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full font-bold py-3.5 px-4 rounded-xl transition duration-300 flex items-center justify-center tracking-wide ${
                isSubmitting ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'glass-button'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 text-cyan-400" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </>
              ) : "Initialize Connection"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-8 font-medium tracking-wide">
            UNAUTHORIZED ACCESS IS PROHIBITED. <br/>
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors mt-2 inline-block">Register new agent</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
