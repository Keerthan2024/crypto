import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { toast } from 'react-toastify';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      await authApi.register({
        username: data.username,
        email: data.email,
        password: data.password
      });

      const loginData = await authApi.login({ username: data.username, password: data.password });
      localStorage.setItem('token', loginData.access_token);
      
      toast.info('Generating your 2048-bit RSA keypair...', { autoClose: 2000, theme: "dark" });
      
      const blob = await authApi.generateKeys();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.username}_private_key.pem`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Agent registered! Private key downloaded.', { autoClose: false, theme: "dark" });
      
      localStorage.removeItem('token');
      navigate('/login');

    } catch (err) {
      toast.error(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full mt-8 animate-fade-in-up px-4 py-8">
      <div className="glass-panel p-8 md:p-12 rounded-3xl max-w-lg w-full relative overflow-hidden">
        {/* Glow behind form */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[70px] pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-black text-center text-white mb-2 tracking-tight">Agent Registration</h2>
          <p className="text-center text-gray-400 mb-8 text-sm">Join the SecureShare encrypted network.</p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-gray-300 font-bold mb-2 text-xs uppercase tracking-wider">Agent ID (Username)</label>
              <input 
                {...register('username', { 
                  required: "Username is required",
                  minLength: { value: 3, message: "Must be at least 3 characters" } 
                })}
                type="text" 
                className={`w-full glass-input rounded-xl p-3 ${errors.username ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
              />
              {errors.username && <p className="text-red-400 text-xs mt-1 font-medium">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-2 text-xs uppercase tracking-wider">Secure Email</label>
              <input 
                {...register('email', { 
                  required: "Email is required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" }
                })}
                type="email" 
                className={`w-full glass-input rounded-xl p-3 ${errors.email ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-2 text-xs uppercase tracking-wider">Passphrase</label>
              <input 
                {...register('password', { 
                  required: "Password is required",
                  minLength: { value: 8, message: "Must be at least 8 characters" }
                })}
                type="password" 
                className={`w-full glass-input rounded-xl p-3 ${errors.password ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1 font-medium">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-2 text-xs uppercase tracking-wider">Confirm Passphrase</label>
              <input 
                {...register('confirmPassword', { 
                  validate: value => value === password || "Passwords do not match"
                })}
                type="password" 
                className={`w-full glass-input rounded-xl p-3 ${errors.confirmPassword ? 'border-red-500/50 focus:ring-red-500/50' : ''}`}
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>}
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mt-6">
              <p className="text-xs text-yellow-500/90 leading-relaxed font-medium">
                <span className="font-bold text-yellow-400">CRITICAL:</span> Your RSA-2048 Private Key will automatically download upon registration. 
                Do not lose this file. It cannot be recovered by the server.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full font-bold py-3.5 px-4 rounded-xl transition duration-300 flex items-center justify-center tracking-wide mt-6 ${
                isSubmitting ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'glass-button'
              }`}
            >
              {isSubmitting ? 'Generating Keys...' : 'Register Agent'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-8 font-medium tracking-wide">
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">Return to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
