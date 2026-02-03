
import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { AccountTable } from './components/AccountTable';
import { AccountModal } from './components/AccountModal';
import { MOCK_ACCOUNTS } from './mockData';
import { Account, BucketId } from './types';
import { BUCKET_RULES } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts'>('dashboard');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);

  const selectedAccount = accounts.find(a => a.id === selectedAccountId) || null;

  const handleUpdateAccount = (accountId: string, newBucket: BucketId) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === accountId) {
        // When overriding a bucket, we set the DPD to the start of that bucket's range
        const newDpd = BUCKET_RULES[newBucket].monthlyRange[0];
        return { 
          ...acc, 
          bucket: newBucket, 
          dpd: newDpd,
          status: newBucket >= BucketId.B4 ? 'legal' : 'active'
        };
      }
      return acc;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden lg:flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold">AF</div>
            <h1 className="text-xl font-bold tracking-tight">ArrearsFlow</h1>
          </div>
          
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              Executive Insights
            </button>
            <button 
              onClick={() => setActiveTab('accounts')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'accounts' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              Collections Queue
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
             <div className="flex justify-between items-center mb-2">
               <span className="text-xs font-bold text-slate-400 uppercase">System Status</span>
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed">Early Detection Engine is scanning for missed payments...</p>
          </div>
          <div className="flex items-center gap-3">
             <img src="https://picsum.photos/40/40" className="w-10 h-10 rounded-full border-2 border-slate-700" alt="Avatar" />
             <div>
               <p className="text-sm font-bold">Admin User</p>
               <p className="text-xs text-slate-500">Chief Risk Officer</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 flex-1 p-4 lg:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {activeTab === 'dashboard' ? 'Portfolio Performance Reporting' : 'Delinquency Detection Queue'}
            </h2>
            <p className="text-slate-500 text-sm">Real-time visibility into arrears, roll rates, and risk exposure.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Export Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Bulk Actions
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          <Dashboard accounts={accounts} />
        ) : (
          <AccountTable accounts={accounts} onSelect={(a) => setSelectedAccountId(a.id)} />
        )}

        {/* Global Modal */}
        {selectedAccount && (
          <AccountModal 
            account={selectedAccount} 
            onClose={() => setSelectedAccountId(null)} 
            onUpdateBucket={handleUpdateAccount}
          />
        )}
      </main>

      {/* Mobile Nav Overlay */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-3 rounded-full shadow-2xl z-50 flex items-center gap-6 border border-slate-700">
        <button onClick={() => setActiveTab('dashboard')} className={`p-2 rounded-full ${activeTab === 'dashboard' ? 'bg-indigo-600' : 'text-slate-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
        </button>
        <div className="w-px h-6 bg-slate-700"></div>
        <button onClick={() => setActiveTab('accounts')} className={`p-2 rounded-full ${activeTab === 'accounts' ? 'bg-indigo-600' : 'text-slate-400'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default App;
