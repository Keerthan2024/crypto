import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-3 md:p-4 md:pt-6">
      <nav className="glass-panel rounded-2xl md:rounded-full px-4 md:px-8 py-3 w-full max-w-5xl flex flex-col md:flex-row md:justify-between md:items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        
        <div className="flex justify-between items-center w-full md:w-auto">
          <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter text-white flex items-center group">
            <svg className="w-5 h-5 md:w-6 md:h-6 mr-2 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>
            </svg>
            SECURE<span className="text-cyan-400">SHARE</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gray-300 hover:text-cyan-400 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>
        </div>
        
        {/* Nav Links */}
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mt-4 md:mt-0 w-full md:w-auto`}>
          {isAuthenticated ? (
            <>
              <span className="inline-block text-sm font-medium text-gray-400 mb-2 md:mb-0">
                Agent <span className="text-cyan-300">[{user?.username}]</span>
              </span>
              <div className="h-4 w-px bg-white/20 hidden md:block"></div>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-sm font-semibold text-gray-300 hover:text-cyan-400 transition-colors">Dashboard</Link>
              <Link to="/upload" onClick={() => setIsMenuOpen(false)} className="text-sm font-semibold text-gray-300 hover:text-cyan-400 transition-colors">Upload</Link>
              <Link to="/scan" onClick={() => setIsMenuOpen(false)} className="text-sm font-semibold text-gray-300 hover:text-cyan-400 transition-colors">Scan</Link>
              <button 
                onClick={handleLogout} 
                className="w-full md:w-auto text-center text-sm font-semibold bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-full hover:bg-red-500/20 hover:text-red-300 transition-all mt-2 md:mt-0"
              >
                Disconnect
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full md:w-auto text-center text-sm font-semibold text-gray-300 hover:text-cyan-400 transition-colors py-2 md:py-0">Login</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full md:w-auto text-center glass-button px-5 py-2 rounded-full text-sm font-bold tracking-wide">
                Initialize
              </Link>
            </>
          )}
        </div>

      </nav>
    </div>
  );
};

export default Navbar;
