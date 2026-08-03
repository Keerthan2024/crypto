import React from 'react';

const SentFilesTable = ({ data, loading, error, onPageChange, page, hasNext, onDelete }) => {
  if (loading) return <div className="text-gray-400 p-4 text-center animate-pulse">Loading sent transmissions...</div>;
  if (error) return <div className="text-red-400 p-4 text-center">Failed to load sent files.</div>;
  if (!data || data.length === 0) return (
    <div className="text-center p-8 text-gray-500">
      <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
      No outbound transmissions logged.
    </div>
  );

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-xs uppercase tracking-wider text-gray-500">
              <th className="p-3 font-semibold">Filename</th>
              <th className="p-3 font-semibold">Recipient</th>
              <th className="p-3 font-semibold">Size</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Timestamp</th>
              <th className="p-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-300">
            {data.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                <td className="p-3 font-medium truncate max-w-[150px]">{item.filename}</td>
                <td className="p-3 text-cyan-400">@{item.recipient_username}</td>
                <td className="p-3 text-gray-400">{(item.file_size / 1024 / 1024).toFixed(2)} MB</td>
                <td className="p-3">
                  {item.status === 'Active' && <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs font-bold tracking-widest border border-green-500/20">ACTIVE</span>}
                  {item.status === 'Downloaded' && <span className="text-blue-400 bg-blue-400/10 px-2 py-1 rounded text-xs font-bold tracking-widest border border-blue-500/20">DOWNLOADED</span>}
                  {item.status === 'Expired' && <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs font-bold tracking-widest border border-red-500/20">EXPIRED</span>}
                </td>
                <td className="p-3 text-gray-500 text-xs">{new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString()}</td>
                <td className="p-3 text-right">
                  <button 
                    onClick={() => onDelete(item.file_id)}
                    className="text-xs font-bold text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    Delete
                  </button>
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
          className="text-xs font-bold text-gray-400 hover:text-cyan-400 disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
        >
          &larr; Previous
        </button>
        <span className="text-xs text-gray-500">Page {page}</span>
        <button 
          onClick={() => onPageChange(page + 1)} 
          disabled={!hasNext}
          className="text-xs font-bold text-gray-400 hover:text-cyan-400 disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
};

export default SentFilesTable;
