import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fileApi } from '../api/fileApi';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [expiryHours, setExpiryHours] = useState(24);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !recipient) {
      toast.error('Payload missing. Select a file and recipient.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('recipient_username', recipient);
    formData.append('expiry_hours', expiryHours);

    try {
      const response = await fileApi.uploadFile(formData);
      toast.success('Transmission encrypted and uploaded.');
      navigate(`/share/${response.share_token}/qr`);
    } catch (err) {
      const detail = err.response?.data?.detail || 'Upload failed.';
      toast.error(typeof detail === 'string' ? detail : 'Unknown cryptographic error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 w-full animate-fade-in-up">
      <div className="w-full max-w-lg sec-card p-8 md:p-10 relative overflow-hidden">
        
        {/* Subtle decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--color-brand-primary)]/20"></div>

        <div className="mb-10 text-center">
          <svg className="w-10 h-10 mx-auto text-[var(--color-brand-primary)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Secure Upload</h1>
          <p className="text-[var(--color-text-muted)] text-[14px] mt-2">Files are AES-256 encrypted prior to transmission.</p>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          {/* File Input */}
          <div className="border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-[var(--color-brand-primary)]/50 transition-colors cursor-pointer relative group">
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              required
            />
            <div className="text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-primary)] transition-colors mb-3">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            {file ? (
              <div className="relative z-10">
                <p className="text-[14px] font-semibold text-[var(--color-brand-primary)] truncate max-w-xs">{file.name}</p>
                <p className="text-[12px] text-[var(--color-text-muted)] mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB payload</p>
              </div>
            ) : (
              <div className="relative z-10">
                <p className="text-[14px] text-[var(--color-text-secondary)] font-medium">Click or drag file to attach</p>
                <p className="text-[12px] text-[var(--color-text-muted)] mt-1">Max 100MB</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Recipient Identifier</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="agent_name"
              className="sec-input w-full px-4 py-3 text-[14px]"
              required
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Self-Destruct Timer (Hours)</label>
            <input
              type="number"
              min="1"
              max="168"
              value={expiryHours}
              onChange={(e) => setExpiryHours(e.target.value)}
              className="sec-input w-full px-4 py-3 text-[14px]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="sec-btn w-full py-3.5 rounded-xl text-[15px] mt-4"
          >
            {isUploading ? (
              <svg className="animate-spin h-5 w-5 mx-auto text-[var(--color-text-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : 'Commence Secure Upload'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
