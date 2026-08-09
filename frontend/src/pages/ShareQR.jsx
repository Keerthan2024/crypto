import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fileApi } from '../api/fileApi';
import { toast } from 'react-toastify';

const ShareQR = () => {
  const { shareToken } = useParams();
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const downloadUrl = `${window.location.origin}/download/${shareToken}`;

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const blob = await fileApi.getQRData(shareToken);
        const url = URL.createObjectURL(blob);
        setQrUrl(url);
      } catch (err) {
        toast.error('Failed to load QR code');
      } finally {
        setLoading(false);
      }
    };
    if (shareToken) fetchQR();
    
    return () => {
        if (qrUrl) URL.revokeObjectURL(qrUrl);
    };
  }, [shareToken]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(downloadUrl);
    toast.success('Secure link copied to clipboard!');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 w-full animate-fade-in-up">
      <div className="w-full max-w-md sec-card p-8 md:p-10 relative overflow-hidden flex flex-col items-center">
        
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--color-brand-primary)]/20"></div>

        <div className="w-12 h-12 rounded-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-brand-primary)] mb-6">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2 text-center">Transmission Ready</h1>
        <p className="text-[var(--color-text-muted)] text-[14px] mb-8 text-center">Scan via SecureShare terminal to receive payload.</p>
        
        <div className="bg-white p-3 rounded-2xl mb-8 border border-gray-200">
          {loading ? (
            <div className="animate-pulse w-48 h-48 bg-gray-100 rounded-xl"></div>
          ) : qrUrl ? (
            <img 
              src={qrUrl} 
              alt="Secure Share QR Code" 
              className="w-48 h-48 rounded-xl object-contain"
            />
          ) : (
            <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center text-red-500 font-bold text-sm">Error Loading QR</div>
          )}
        </div>

        <div className="w-full">
          <label className="block text-[12px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 text-center">Direct Uplink Address</label>
          <div className="flex space-x-2">
            <input 
              type="text" 
              readOnly 
              value={downloadUrl}
              className="sec-input flex-grow px-4 py-3 text-[13px] font-mono text-[var(--color-text-primary)]"
            />
            <button 
              onClick={copyToClipboard}
              className="sec-btn px-4 rounded-xl flex items-center justify-center"
              title="Copy link"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareQR;
