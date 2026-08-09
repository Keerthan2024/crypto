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
        <div className="min-h-screen flex flex-col selection:bg-[var(--color-brand-primary)]/30">
          <Navbar />

          <main className="flex-grow pt-24 md:pt-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full relative z-10 overflow-x-hidden">
            <Routes>
              <Route path="/" element={
                <div className="flex flex-col items-center justify-start pt-10 md:pt-20 pb-24 text-center animate-fade-in-up">
                  {/* Hero Section */}
                  <div className="mb-8">
                    <svg className="w-12 h-12 md:w-16 md:h-16 text-[var(--color-brand-primary)] mx-auto opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                    Military-Grade <br className="hidden sm:block" /> File Sharing
                  </h1>
                  <p className="text-[var(--color-text-secondary)] text-base md:text-lg max-w-2xl mb-12 leading-relaxed px-2">
                    Zero-knowledge encryption. Self-destructing links. Absolute privacy. 
                    Share your most sensitive files with total cryptographic confidence.
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto px-4 sm:px-0">
                    <Link to="/register" className="sec-btn w-full sm:w-auto px-8 py-4 rounded-xl text-[15px]">
                      Initialize Uplink
                    </Link>
                    <Link to="/scan" className="w-full sm:w-auto px-8 py-4 rounded-xl text-[15px] font-semibold text-[var(--color-text-primary)] bg-transparent border border-[var(--color-border-subtle)] hover:border-[var(--color-border-active)] hover:bg-[var(--color-bg-elevated)] transition-all flex items-center justify-center">
                      Receive Transmission
                    </Link>
                  </div>

                  {/* Informational Section */}
                  <div className="mt-32 w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 text-left">
                    
                    <div className="sec-card sec-card-interactive p-6 md:p-8">
                      <div className="w-10 h-10 rounded bg-[var(--color-bg-elevated)] flex items-center justify-center text-[var(--color-brand-primary)] mb-6 border border-[var(--color-border-subtle)]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                      </div>
                      <h3 className="text-[17px] font-semibold mb-3">Hybrid RSA/AES</h3>
                      <p className="text-[var(--color-text-muted)] text-[14px] leading-relaxed">
                        Every file is symmetrically encrypted with a robust AES-256 key, which is then asymmetrically encrypted using the recipient's RSA-2048 public key.
                      </p>
                    </div>

                    <div className="sec-card sec-card-interactive p-6 md:p-8">
                      <div className="w-10 h-10 rounded bg-[var(--color-bg-elevated)] flex items-center justify-center text-[var(--color-brand-primary)] mb-6 border border-[var(--color-border-subtle)]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                      <h3 className="text-[17px] font-semibold mb-3">Self-Destructing</h3>
                      <p className="text-[var(--color-text-muted)] text-[14px] leading-relaxed">
                        Uploaded payloads are strictly single-use. Once the recipient downloads and decrypts the file, the server irreversibly destroys the encrypted cipher.
                      </p>
                    </div>

                    <div className="sec-card sec-card-interactive p-6 md:p-8">
                      <div className="w-10 h-10 rounded bg-[var(--color-bg-elevated)] flex items-center justify-center text-[var(--color-brand-primary)] mb-6 border border-[var(--color-border-subtle)]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                      </div>
                      <h3 className="text-[17px] font-semibold mb-3">Zero-Knowledge</h3>
                      <p className="text-[var(--color-text-muted)] text-[14px] leading-relaxed">
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
            toastClassName="!bg-[var(--color-bg-surface)] !border !border-[var(--color-border-subtle)] !text-[var(--color-text-primary)] rounded-xl"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
