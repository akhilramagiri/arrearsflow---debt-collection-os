
import React, { useState } from 'react';
import { Account, BucketId } from '../types';
import { BUCKET_RULES } from '../constants';
import { generateCommunicationDraft } from '../services/geminiService';

interface AccountModalProps {
  account: Account | null;
  onClose: () => void;
  onUpdateBucket: (accountId: string, newBucket: BucketId) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ account, onClose, onUpdateBucket }) => {
  const [draft, setDraft] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isEditingBucket, setIsEditingBucket] = useState(false);

  if (!account) return null;

  const handleGenerateDraft = async () => {
    setLoading(true);
    const content = await generateCommunicationDraft(account);
    setDraft(content || '');
    setLoading(false);
  };

  const handleBucketChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBucket = Number(e.target.value) as BucketId;
    onUpdateBucket(account.id, newBucket);
    setIsEditingBucket(false);
  };

  const bucket = BUCKET_RULES[account.bucket];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{account.customerName}</h2>
            <p className="text-sm text-slate-500">ID: {account.id} • Loan: ${account.loanAmount.toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Arrears Snapshot</h3>
                <button 
                  onClick={() => setIsEditingBucket(!isEditingBucket)}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-tighter"
                >
                  {isEditingBucket ? 'Cancel' : 'Edit Bucket'}
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative">
                  <p className="text-xs text-slate-500">DPD Ageing</p>
                  <p className="text-3xl font-bold text-slate-900">{account.dpd} Days</p>
                  
                  {isEditingBucket ? (
                    <div className="mt-2">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Override Bucket</label>
                      <select 
                        className="w-full text-xs p-2 border border-indigo-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={account.bucket}
                        onChange={handleBucketChange}
                      >
                        {Object.values(BUCKET_RULES).map(b => (
                          <option key={b.id} value={b.id}>{b.name}: {b.meaning}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className={`mt-2 text-xs font-semibold px-2 py-1 rounded inline-block ${bucket.isCritical ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'}`}>
                      {bucket.name}: {bucket.meaning}
                    </div>
                  )}
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500">Total Due</p>
                  <p className="text-2xl font-bold text-slate-900">${account.arrearsAmount.toLocaleString()}</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Compliant Actions</h3>
              <ul className="space-y-2">
                {bucket.actions.map((act, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700 bg-blue-50/50 p-2 rounded border border-blue-100/50">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    {act}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="md:col-span-2 space-y-6">
            <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2 text-slate-800">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Gemini AI Co-Pilot
                </h3>
                <button 
                  onClick={handleGenerateDraft}
                  disabled={loading}
                  className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Drafting...' : 'Generate Compliant Notice'}
                </button>
              </div>
              <div className="p-6 flex-1 bg-slate-50/50">
                {draft ? (
                  <div className="space-y-4">
                    <pre className="text-sm font-sans whitespace-pre-wrap bg-white p-4 rounded-lg border border-slate-200 shadow-inner max-h-[300px] overflow-y-auto">
                      {draft}
                    </pre>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-slate-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                        Send via Email
                      </button>
                      <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold hover:bg-white transition-colors">
                        Copy to Clipboard
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                    <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                    <p className="text-sm italic">Generate a context-aware notice using AI to ensure regulatory compliance based on the current ageing bucket.</p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Audit Trail (Recent)</h3>
              <div className="space-y-2">
                {[1, 2].map(i => (
                  <div key={i} className="flex gap-3 p-3 bg-white border border-slate-100 rounded-lg text-sm">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">JD</div>
                    <div>
                      <p className="font-semibold text-slate-900">Attempted Call - No Answer</p>
                      <p className="text-xs text-slate-500">John Doe • 2 days ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-between bg-slate-50">
           <button className="text-sm font-bold text-red-600 hover:text-red-700">Flag for Supervisor</button>
           <div className="flex gap-3">
             <button className="px-6 py-2 border border-slate-300 rounded-lg text-sm font-bold hover:bg-white transition-colors" onClick={onClose}>Close</button>
             <button className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">Mark as PTP</button>
           </div>
        </div>
      </div>
    </div>
  );
};
