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
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full mt-8 animate-fade-in-up">
      <div className="glass-panel p-8 md:p-12 rounded-3xl max-w-lg w-full relative overflow-hidden">
        {/* Glow behind form */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2 text-white tracking-tight">Secure Upload</h1>
          <p className="text-gray-400 text-sm mb-8 font-medium">Files are 256-bit AES encrypted client-side before transmission.</p>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* File Input */}
            <div className="border-2 border-dashed border-gray-600/50 bg-black/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-cyan-500/50 hover:bg-cyan-900/10 transition-colors cursor-pointer relative group">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                required
              />
              <div className="text-gray-500 group-hover:text-cyan-400 transition-colors mb-3">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              {file ? (
                <div className="relative z-10">
                  <p className="text-sm font-bold text-cyan-300 truncate max-w-xs">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB payload</p>
                </div>
              ) : (
                <div className="relative z-10">
                  <p className="text-sm text-gray-400 font-medium">Click or drag file to attach</p>
                  <p className="text-xs text-gray-500 mt-1">Max 100MB</p>
                </div>
              )}
            </div>

            {/* Recipient */}
            <div>
              <label className="block text-gray-300 font-bold mb-2 text-xs uppercase tracking-wider">Recipient Agent ID</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Username"
                className="w-full glass-input rounded-lg p-3"
                required
              />
            </div>

            {/* Expiry */}
            <div>
              <label className="block text-gray-300 font-bold mb-2 text-xs uppercase tracking-wider">Self-Destruct Timer (Hours)</label>
              <input
                type="number"
                min="1"
                max="168"
                value={expiryHours}
                onChange={(e) => setExpiryHours(e.target.value)}
                className="w-full glass-input rounded-lg p-3"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className={`w-full font-bold py-3.5 px-4 rounded-xl transition duration-300 flex items-center justify-center tracking-wide ${
                isUploading ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'glass-button'
              }`}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Encrypting Payload...
                </>
              ) : 'Commence Secure Upload'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
