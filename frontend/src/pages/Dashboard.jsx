import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../api/dashboardApi';
import SentFilesTable from '../components/SentFilesTable';
import ReceivedFilesTable from '../components/ReceivedFilesTable';

const Dashboard = () => {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('received');
  
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
      <div className="sec-card p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
        
        <div className="flex items-center space-x-5 relative z-10 w-full md:w-auto mb-6 md:mb-0">
          <div className="w-16 h-16 rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] flex items-center justify-center text-2xl font-bold relative overflow-hidden">
            <span className="text-[var(--color-brand-primary)] z-10">{user?.username?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-[var(--color-text-muted)] text-[11px] font-bold uppercase tracking-widest mb-1">Authenticated Agent</p>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">{user?.username}</h1>
          </div>
        </div>
        
        <div className="flex space-x-3 relative z-10 w-full md:w-auto">
          <Link to="/upload" className="flex-1 md:flex-none sec-btn px-6 py-3 rounded-lg text-[14px]">
            New Uplink
          </Link>
          <Link to="/scan" className="flex-1 md:flex-none bg-transparent hover:bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-active)] px-6 py-3 rounded-lg text-[14px] font-semibold text-[var(--color-text-primary)] transition-colors text-center">
            Scan
          </Link>
        </div>
      </div>

      {/* Tabs and Data Tables */}
      <div className="sec-card p-4 md:p-8">
        <div className="flex space-x-2 md:space-x-4 mb-6 border-b border-[var(--color-border-subtle)] pb-4">
          <button 
            onClick={() => setActiveTab('received')}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              activeTab === 'received' 
                ? 'sec-btn text-[var(--color-text-primary)]' 
                : 'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]'
            }`}
          >
            Received Transmissions
          </button>
          <button 
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              activeTab === 'sent' 
                ? 'sec-btn text-[var(--color-text-primary)]' 
                : 'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]'
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
