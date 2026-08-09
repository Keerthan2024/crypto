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
    
    let sanitizedKey = privateKey;
    try {
        const parsed = JSON.parse(sanitizedKey);
        if (parsed.private_key) sanitizedKey = parsed.private_key;
    } catch(e) {}
    sanitizedKey = sanitizedKey.replace(/\\n/g, '\n').replace(/\\r/g, '');

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
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 w-full animate-fade-in-up">
      <div className="w-full max-w-lg sec-card p-8 md:p-10 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--color-brand-primary)]/20"></div>
        
        <div className="text-center mb-8">
          <svg className="w-10 h-10 mx-auto text-[var(--color-brand-primary)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Incoming Payload</h1>
          <p className="text-[var(--color-text-muted)] text-[14px] mt-2">End-to-end encryption active. Provide your key to unlock.</p>
        </div>

        {/* Status Badge */}
        <div className="mb-8 flex justify-center">
          <div className="px-4 py-2 rounded-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] inline-flex">
            {linkStatus === 'checking' && (
              <span className="text-[var(--color-text-muted)] text-[11px] font-bold tracking-widest uppercase">Initializing...</span>
            )}
            {linkStatus === 'valid' && (
              <span className="text-[var(--color-brand-primary)] text-[11px] font-bold tracking-widest uppercase flex items-center">
                <span className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)] mr-2 animate-pulse"></span>
                Secure Link Valid
              </span>
            )}
            {linkStatus === 'used' && (
              <span className="text-yellow-500 text-[11px] font-bold tracking-widest uppercase flex items-center">
                <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                Link Burned (Already Used)
              </span>
            )}
            {linkStatus === 'expired' && (
              <span className="text-red-400 text-[11px] font-bold tracking-widest uppercase flex items-center">
                 <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                Link Expired
              </span>
            )}
            {linkStatus === 'error' && (
              <span className="text-red-500 text-[11px] font-bold tracking-widest uppercase flex items-center">
                 <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                Invalid Token
              </span>
            )}
          </div>
        </div>

        {linkStatus === 'valid' && (
          <div className="space-y-6">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 flex justify-between">
                <span>RSA-2048 Private Key</span>
                <span className="text-[var(--color-brand-primary)]/70">.pem format</span>
              </label>
              <div className="relative">
                <textarea
                  rows="8"
                  className="sec-input w-full p-4 font-mono text-[13px] leading-relaxed text-[var(--color-text-primary)]"
                  placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  spellCheck="false"
                ></textarea>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={isDownloading || !privateKey}
              className="sec-btn w-full py-3.5 rounded-xl text-[15px] mt-4"
            >
              {isDownloading ? (
                <svg className="animate-spin h-5 w-5 mx-auto text-[var(--color-text-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : 'Authorize Decryption'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Download;
