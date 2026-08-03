import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fileApi } from '../api/fileApi';
import { toast } from 'react-toastify';

const Download = () => {
  const { shareToken } = useParams();
  const [privateKey, setPrivateKey] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [linkStatus, setLinkStatus] = useState('checking'); 

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await fileApi.getShareStatus(shareToken);
        if (data.is_used) {
          setLinkStatus('used');
        } else if (new Date(data.expires_at) < new Date()) {
          setLinkStatus('expired');
        } else {
          setLinkStatus('valid');
        }
      } catch (err) {
        setLinkStatus('error');
      }
    };
    checkStatus();
  }, [shareToken]);

  const handleDownload = async () => {
    if (!privateKey) {
      toast.error('Private key required for decryption.');
      return;
    }

    setIsDownloading(true);
    
    // Sanitize key in case user pasted the raw JSON string or literal \n characters
    let sanitizedKey = privateKey;
    try {
        const parsed = JSON.parse(sanitizedKey);
        if (parsed.private_key) sanitizedKey = parsed.private_key;
    } catch(e) {}
    sanitizedKey = sanitizedKey.replace(/\\n/g, '\n');
    sanitizedKey = sanitizedKey.replace(/\\r/g, '');

    try {
      const response = await fileApi.downloadFile(shareToken, sanitizedKey);
      
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'decrypted_payload.bin';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Decryption successful. Integrity verified.');
      setLinkStatus('used'); 
    } catch (err) {
      let detail = 'Decryption failed. Invalid key or tampered payload.';
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          detail = json.detail || detail;
        } catch (e) {}
      } else {
        detail = err.response?.data?.detail || detail;
      }
      toast.error(`ERROR: ${detail}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full mt-8 animate-fade-in-up">
      <div className="glass-panel p-8 md:p-12 rounded-3xl max-w-xl w-full relative overflow-hidden">
        {/* Glow behind form */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-[60px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2 text-white tracking-tight">Incoming Payload</h1>
          <p className="text-gray-400 text-sm mb-8 font-medium">End-to-end encryption active. Provide your key to unlock.</p>

          {/* Status Badge */}
          <div className="mb-8 p-1 rounded-full bg-black/40 border border-white/5 inline-flex">
            {linkStatus === 'checking' && (
              <span className="text-gray-400 px-4 py-1.5 text-xs font-bold tracking-widest uppercase">Initializing...</span>
            )}
            {linkStatus === 'valid' && (
              <span className="text-green-400 px-4 py-1.5 text-xs font-bold tracking-widest uppercase flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                Secure Link Valid
              </span>
            )}
            {linkStatus === 'used' && (
              <span className="text-yellow-500 px-4 py-1.5 text-xs font-bold tracking-widest uppercase flex items-center">
                <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                Link Burned (Already Used)
              </span>
            )}
            {linkStatus === 'expired' && (
              <span className="text-red-400 px-4 py-1.5 text-xs font-bold tracking-widest uppercase flex items-center">
                 <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                Link Expired
              </span>
            )}
            {linkStatus === 'error' && (
              <span className="text-red-500 px-4 py-1.5 text-xs font-bold tracking-widest uppercase flex items-center">
                 <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                Invalid Token
              </span>
            )}
          </div>

          {linkStatus === 'valid' && (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 font-bold mb-2 text-xs uppercase tracking-wider flex justify-between">
                  <span>RSA-2048 Private Key</span>
                  <span className="text-cyan-500">.pem format</span>
                </label>
                <div className="relative">
                  <textarea
                    rows="8"
                    className="w-full glass-input rounded-xl p-4 font-mono text-xs leading-relaxed text-cyan-100"
                    placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    spellCheck="false"
                  ></textarea>
                  <div className="absolute top-2 right-2 flex space-x-1 pointer-events-none">
                     {/* Decorative lock icon */}
                     <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={isDownloading || !privateKey}
                className={`w-full font-bold py-3.5 px-4 rounded-xl transition duration-300 flex items-center justify-center tracking-wide ${
                  isDownloading || !privateKey ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'glass-button hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] from-cyan-600 to-green-500'
                }`}
              >
                {isDownloading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Decrypting & Verifying Integrity...
                  </>
                ) : 'Authorize Decryption & Download'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Download;
