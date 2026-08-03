import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import ShareQR from './pages/ShareQR';
import ScanQR from './pages/ScanQR';
import Upload from './pages/Upload';
import Download from './pages/Download';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-sans selection:bg-cyan-500/30">
          <Navbar />

          <main className="flex-grow pt-20 md:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 overflow-x-hidden">
            {/* Background glowing orbs */}
            <div className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-blue-600/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-cyan-600/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none"></div>

            <Routes>
              <Route path="/" element={
                <div className="flex flex-col items-center justify-start pt-10 md:pt-20 pb-20 text-center animate-fade-in-up">
                  {/* Hero Section */}
                  <div className="animate-float mb-6 md:mb-8">
                    <svg className="w-16 h-16 md:w-20 md:h-20 text-cyan-400 mx-auto drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 leading-tight">
                    Military-Grade <br className="hidden sm:block" /> <span className="text-gradient">File Sharing</span>
                  </h1>
                  <p className="text-gray-400 text-base md:text-xl max-w-2xl mb-8 md:mb-10 leading-relaxed px-2">
                    Zero-knowledge encryption. Self-destructing links. Absolute privacy. 
                    Share your most sensitive files with total cryptographic confidence.
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto px-4 sm:px-0">
                    <Link to="/register" className="glass-button w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg tracking-wide text-center">
                      Initialize Uplink
                    </Link>
                    <Link to="/scan" className="glass-panel w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg tracking-wide hover:bg-white/10 transition-colors text-center">
                      Receive Transmission
                    </Link>
                  </div>

                  {/* Informational Section (Stuffs about SecureShare) */}
                  <div className="mt-24 md:mt-32 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 text-left">
                    
                    <div className="glass-panel p-6 md:p-8 rounded-2xl glass-card-hover">
                      <div className="w-12 h-12 bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-400 mb-6 shadow-inner border border-blue-500/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">Hybrid RSA/AES</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Every file is symmetrically encrypted with a robust AES-256 key, which is then asymmetrically encrypted using the recipient's RSA-2048 public key.
                      </p>
                    </div>

                    <div className="glass-panel p-6 md:p-8 rounded-2xl glass-card-hover">
                      <div className="w-12 h-12 bg-cyan-900/50 rounded-xl flex items-center justify-center text-cyan-400 mb-6 shadow-inner border border-cyan-500/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">Self-Destructing</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Uploaded payloads are strictly single-use. Once the recipient downloads and decrypts the file, the server irreversibly destroys the encrypted cipher.
                      </p>
                    </div>

                    <div className="glass-panel p-6 md:p-8 rounded-2xl glass-card-hover">
                      <div className="w-12 h-12 bg-green-900/50 rounded-xl flex items-center justify-center text-green-400 mb-6 shadow-inner border border-green-500/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">Zero-Knowledge</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        The server administrators can never view your files. Your private RSA key never leaves your physical browser memory during decryption.
                      </p>
                    </div>

                  </div>
                </div>
              } />
              
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
              <Route path="/scan" element={<ProtectedRoute><ScanQR /></ProtectedRoute>} />
              <Route path="/share/:shareToken/qr" element={<ProtectedRoute><ShareQR /></ProtectedRoute>} />
              <Route path="/download/:shareToken" element={<ProtectedRoute><Download /></ProtectedRoute>} />
              
            </Routes>
          </main>

          <ToastContainer 
            position="bottom-right" 
            theme="dark"
            toastClassName="bg-gray-900 border border-gray-800 text-white"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
