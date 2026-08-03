import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../api/dashboardApi';
import SentFilesTable from '../components/SentFilesTable';
import ReceivedFilesTable from '../components/ReceivedFilesTable';

const Dashboard = () => {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  
  const [receivedData, setReceivedData] = useState([]);
  const [receivedLoading, setReceivedLoading] = useState(true);
  const [receivedError, setReceivedError] = useState(false);
  const [receivedPage, setReceivedPage] = useState(1);
  const [receivedTotal, setReceivedTotal] = useState(0);

  const [sentData, setSentData] = useState([]);
  const [sentLoading, setSentLoading] = useState(true);
  const [sentError, setSentError] = useState(false);
  const [sentPage, setSentPage] = useState(1);
  const [sentTotal, setSentTotal] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    fetchReceived(receivedPage);
  }, [receivedPage]);

  useEffect(() => {
    fetchSent(sentPage);
  }, [sentPage]);

  const fetchReceived = async (page) => {
    setReceivedLoading(true);
    try {
      const data = await dashboardApi.getReceivedFiles(page, pageSize);
      setReceivedData(data.items);
      setReceivedTotal(data.total);
      setReceivedError(false);
    } catch (err) {
      console.error(err);
      setReceivedError(true);
    } finally {
      setReceivedLoading(false);
    }
  };

  const fetchSent = async (page) => {
    setSentLoading(true);
    try {
      const data = await dashboardApi.getSentFiles(page, pageSize);
      setSentData(data.items);
      setSentTotal(data.total);
      setSentError(false);
    } catch (err) {
      console.error(err);
      setSentError(true);
    } finally {
      setSentLoading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file and revoke all associated shares?")) {
      try {
        await dashboardApi.deleteFile(fileId);
        // Refresh the list after deletion
        fetchSent(sentPage);
      } catch (err) {
        console.error("Failed to delete file", err);
        alert("Failed to delete file.");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-4 md:mt-8 p-4 animate-fade-in-up w-full">
      {/* Header Info */}
      <div className="glass-panel p-6 md:p-10 rounded-3xl mb-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="flex items-center space-x-6 relative z-10 w-full md:w-auto mb-6 md:mb-0">
          <div className="w-20 h-20 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center text-3xl font-black shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/0"></div>
            <span className="text-cyan-400 z-10">{user?.username?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Authenticated Agent</p>
            <h1 className="text-3xl md:text-4xl font-black text-white">{user?.username}</h1>
          </div>
        </div>
        
        <div className="flex space-x-4 relative z-10 w-full md:w-auto">
          <Link to="/upload" className="flex-1 md:flex-none glass-button px-6 py-3 rounded-xl font-bold tracking-wide text-center">
            Upload
          </Link>
          <Link to="/scan" className="flex-1 md:flex-none bg-gray-800 hover:bg-gray-700 border border-gray-700 px-6 py-3 rounded-xl font-bold text-white transition duration-300 text-center">
            Scan
          </Link>
        </div>
      </div>

      {/* Tabs and Data Tables */}
      <div className="glass-panel rounded-3xl p-4 md:p-8 relative">
        <div className="flex space-x-2 md:space-x-4 mb-6 border-b border-gray-800 pb-4">
          <button 
            onClick={() => setActiveTab('received')}
            className={`px-4 md:px-6 py-2 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'received' 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            Received Transmissions
          </button>
          <button 
            onClick={() => setActiveTab('sent')}
            className={`px-4 md:px-6 py-2 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'sent' 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            Outbound Transmissions
          </button>
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'received' ? (
            <ReceivedFilesTable 
              data={receivedData} 
              loading={receivedLoading} 
              error={receivedError}
              page={receivedPage}
              onPageChange={setReceivedPage}
              hasNext={receivedPage * pageSize < receivedTotal}
            />
          ) : (
            <SentFilesTable 
              data={sentData} 
              loading={sentLoading} 
              error={sentError}
              page={sentPage}
              onPageChange={setSentPage}
              hasNext={sentPage * pageSize < sentTotal}
              onDelete={handleDeleteFile}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
