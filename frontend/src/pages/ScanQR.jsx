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
      html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      html5QrcodeScanner.render(
        (decodedText) => {
          toast.success("QR Code detected!");
          html5QrcodeScanner.clear();
          setIsScanning(false);
          
          try {
             let parsed = null;
             try {
                parsed = JSON.parse(decodedText);
             } catch(e) {}
             
             if (parsed && parsed.share_token) {
                 navigate(`/download/${parsed.share_token}`);
                 return;
             }

             const url = new URL(decodedText);
             const pathParts = url.pathname.split('/');
             const tokenIndex = pathParts.indexOf('download') + 1;
             
             if (tokenIndex > 0 && tokenIndex < pathParts.length) {
               navigate(`/download/${pathParts[tokenIndex]}`);
             } else {
               toast.error('Invalid SecureShare link format.');
             }
          } catch (err) {
            toast.error('Unrecognized QR format.');
          }
        },
        (error) => {}
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
      <div className="w-full max-w-xl flex flex-col items-center px-4">
        
        <div className="w-16 h-16 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-active)] flex items-center justify-center text-[var(--color-brand-primary)] mb-8">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
          </svg>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--color-text-primary)] tracking-tight text-center">Scanner Module</h1>
        <p className="text-[var(--color-text-muted)] text-[15px] mb-10 text-center leading-relaxed max-w-md">
          Initialize payload reception. Scan the SecureShare QR code or enter the direct uplink address.
        </p>

        {isScanning ? (
          <div className="w-full mb-10">
             <div id="reader" className="w-full bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] rounded-xl overflow-hidden border border-[var(--color-border-active)] shadow-[0_0_20px_rgba(0,208,132,0.1)] [&_a]:text-[var(--color-brand-primary)] [&_a]:underline [&_button]:sec-btn [&_button]:px-4 [&_button]:py-2 [&_button]:rounded-lg [&_button]:mt-3"></div>
             <button 
               onClick={() => setIsScanning(false)}
               className="w-full mt-4 text-[14px] text-[var(--color-text-muted)] hover:text-white transition-colors"
             >
               Cancel Scanning
             </button>
          </div>
        ) : (
          <div className="w-full mb-10 flex justify-center">
            <button 
              onClick={() => setIsScanning(true)}
              className="sec-btn w-full py-4 rounded-xl text-[15px]"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Launch Camera Scanner
            </button>
          </div>
        )}

        <div className="w-full relative flex items-center justify-center mb-10">
          <div className="border-t border-[var(--color-border-subtle)] w-full absolute"></div>
          <span className="bg-[var(--color-bg-base)] px-4 text-[11px] font-semibold text-[var(--color-text-muted)] relative z-10 uppercase tracking-widest">Or enter manually</span>
        </div>

        <form onSubmit={handleManualSubmit} className="w-full space-y-6">
          <div>
            <label className="block text-[var(--color-text-primary)] font-semibold mb-3 text-[11px] uppercase tracking-wider">Direct Uplink Address</label>
            <input 
              type="url" 
              value={scannedUrl}
              onChange={(e) => setScannedUrl(e.target.value)}
              placeholder="https://..."
              className="sec-input w-full p-4 font-mono text-[14px]"
            />
          </div>
          <button 
            type="submit" 
            className="sec-btn w-full py-4 rounded-xl text-[15px]"
          >
            Establish Manual Connection
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScanQR;
