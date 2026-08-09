import React from 'react';
import { Link } from 'react-router-dom';

const ReceivedFilesTable = ({ data, loading, error, onPageChange, page, hasNext }) => {
  if (loading) return <div className="text-[var(--color-text-muted)] p-4 text-center animate-pulse text-[14px]">Loading incoming transmissions...</div>;
  if (error) return <div className="text-red-400 p-4 text-center text-[14px]">Failed to load received files.</div>;
  if (!data || data.length === 0) return (
    <div className="text-center p-8 text-[var(--color-text-muted)] text-[14px]">
      <svg className="w-10 h-10 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
      No incoming transmissions detected.
    </div>
  );

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border-subtle)] text-[11px] uppercase tracking-wider text-[var(--color-text-secondary)]">
              <th className="p-3 font-semibold">Sender</th>
              <th className="p-3 font-semibold">Filename</th>
              <th className="p-3 font-semibold">Size</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-[13px] text-[var(--color-text-primary)]">
            {data.map((item, idx) => (
              <tr key={idx} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-base)] transition-colors">
                <td className="p-3 font-medium">@{item.sender_username}</td>
                <td className="p-3 truncate max-w-[150px]">{item.filename}</td>
                <td className="p-3 text-[var(--color-text-muted)]">{(item.file_size / 1024 / 1024).toFixed(2)} MB</td>
                <td className="p-3">
                  {item.status === 'Active' && <span className="text-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10 px-2 py-1 rounded text-[10px] font-bold tracking-widest border border-[var(--color-brand-primary)]/20">ACTIVE</span>}
                  {item.status === 'Downloaded' && <span className="text-gray-400 bg-gray-400/10 px-2 py-1 rounded text-[10px] font-bold tracking-widest border border-gray-500/20">DOWNLOADED</span>}
                  {item.status === 'Expired' && <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded text-[10px] font-bold tracking-widest border border-red-500/20">EXPIRED</span>}
                </td>
                <td className="p-3 text-right">
                  {item.status === 'Active' ? (
                    <Link to={`/download/${item.share_token}`} className="text-[12px] font-medium text-[var(--color-brand-primary)] hover:text-[var(--color-brand-hover)] border border-[var(--color-brand-primary)]/30 px-3 py-1.5 rounded hover:bg-[var(--color-brand-primary)]/10 transition-colors">
                      Decrypt
                    </Link>
                  ) : (
                    <span className="text-[11px] text-[var(--color-text-muted)] font-bold uppercase tracking-widest">Locked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 px-2">
        <button 
          onClick={() => onPageChange(page - 1)} 
          disabled={page === 1}
          className="text-[12px] font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] disabled:opacity-50 disabled:hover:text-[var(--color-text-muted)] transition-colors"
        >
          &larr; Previous
        </button>
        <span className="text-[12px] text-[var(--color-text-muted)]">Page {page}</span>
        <button 
          onClick={() => onPageChange(page + 1)} 
          disabled={!hasNext}
          className="text-[12px] font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] disabled:opacity-50 disabled:hover:text-[var(--color-text-muted)] transition-colors"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
};

export default ReceivedFilesTable;
