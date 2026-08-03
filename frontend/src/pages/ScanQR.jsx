import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Html5QrcodeScanner } from 'html5-qrcode';

const ScanQR = () => {
  const [scannedUrl, setScannedUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let html5QrcodeScanner = null;

    if (isScanning) {
      // Configuration for the scanner
      html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      html5QrcodeScanner.render(
        (decodedText) => {
          // Success callback
          toast.success("QR Code detected!");
          html5QrcodeScanner.clear(); // Stop scanning
          setIsScanning(false);
          
          try {
             // The payload in the QR code from the backend is a JSON string:
             // {"share_token": "...", "encrypted_key": "..."}
             // Let's check if it's JSON first
             let parsed = null;
             try {
                parsed = JSON.parse(decodedText);
             } catch(e) {}
             
             if (parsed && parsed.share_token) {
                 navigate(`/download/${parsed.share_token}`);
                 return;
             }

             // If it's a URL (like our manual direct uplink)
             const url = new URL(decodedText);
             const pathParts = url.pathname.split('/');
             const tokenIndex = pathParts.indexOf('download') + 1;
             
             if (tokenIndex > 0 && tokenIndex < pathParts.length) {
               navigate(`/download/${pathParts[tokenIndex]}`);
             } else {
               toast.error('Invalid SecureShare link format.');
             }
          } catch (err) {
            // Not a URL or JSON, maybe just raw text
            toast.error('Unrecognized QR format.');
          }
        },
        (error) => {
          // Failure callback - happens constantly while waiting for QR, ignore
        }
      );
    }

    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(e => console.error("Failed to clear scanner", e));
      }
    };
  }, [isScanning, navigate]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!scannedUrl) {
      toast.error('Provide a valid uplink address');
      return;
    }

    try {
      const url = new URL(scannedUrl);
      const pathParts = url.pathname.split('/');
      const tokenIndex = pathParts.indexOf('download') + 1;
      
      if (tokenIndex > 0 && tokenIndex < pathParts.length) {
        const shareToken = pathParts[tokenIndex];
        navigate(`/download/${shareToken}`);
      } else {
        toast.error('Invalid SecureShare link format.');
      }
    } catch (err) {
      toast.error('Invalid URL format.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full mt-8 animate-fade-in-up">
      <div className="glass-panel p-8 md:p-12 rounded-3xl max-w-xl w-full relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-green-500/10 rounded-full blur-[70px] pointer-events-none"></div>

        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-green-900/30 border border-green-500/30 flex items-center justify-center text-green-400 mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl font-black mb-2 text-white tracking-tight">Scanner Module</h1>
          <p className="text-gray-400 text-sm mb-8 text-center leading-relaxed">
            Initialize payload reception. Scan the SecureShare QR code or enter the direct uplink address.
          </p>

          {isScanning ? (
            <div className="w-full mb-8">
               {/* html5-qrcode injects UI here */}
               <div id="reader" className="w-full bg-white text-gray-900 rounded-xl overflow-hidden border-4 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] [&_a]:text-blue-600 [&_a]:font-bold [&_a]:underline [&_button]:text-gray-900 [&_button]:bg-gray-200 [&_button]:px-3 [&_button]:py-1 [&_button]:rounded-lg [&_button]:mt-2"></div>
               <button 
                 onClick={() => setIsScanning(false)}
                 className="w-full mt-4 text-red-400 font-bold py-2 hover:text-red-300 transition-colors"
               >
                 Cancel Scanning
               </button>
            </div>
          ) : (
            <div className="w-full mb-8 flex justify-center">
              <button 
                onClick={() => setIsScanning(true)}
                className="w-full font-bold py-4 px-6 rounded-xl transition duration-300 flex items-center justify-center tracking-wide glass-button hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] from-green-600 to-emerald-500 border-green-500/50"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Launch Camera Scanner
              </button>
            </div>
          )}

          <div className="w-full relative flex items-center justify-center mb-8">
            <div className="border-t border-gray-700 w-full absolute"></div>
            <span className="bg-gray-900 px-4 text-xs font-bold text-gray-500 relative z-10 uppercase tracking-widest">Or enter manually</span>
          </div>

          <form onSubmit={handleManualSubmit} className="w-full space-y-4">
            <div>
              <label className="block text-gray-300 font-bold mb-2 text-xs uppercase tracking-wider">Direct Uplink Address</label>
              <input 
                type="url" 
                value={scannedUrl}
                onChange={(e) => setScannedUrl(e.target.value)}
                placeholder="https://..."
                className="w-full glass-input rounded-xl p-3 font-mono text-sm"
              />
            </div>
            <button 
              type="submit" 
              className="w-full font-bold py-3.5 px-4 rounded-xl transition duration-300 flex items-center justify-center tracking-wide glass-button hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] from-cyan-600 to-blue-500"
            >
              Establish Manual Connection
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScanQR;
