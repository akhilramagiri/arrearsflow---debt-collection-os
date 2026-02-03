
import React, { useState } from 'react';
import { Account, BucketId } from '../types';
import { BUCKET_RULES } from '../constants';

interface AccountTableProps {
  accounts: Account[];
  onSelect: (account: Account) => void;
}

export const AccountTable: React.FC<AccountTableProps> = ({ accounts, onSelect }) => {
  const [filter, setFilter] = useState<string>('');
  const [bucketFilter, setBucketFilter] = useState<number | 'all'>('all');

  const filtered = accounts.filter(a => {
    const matchesName = a.customerName.toLowerCase().includes(filter.toLowerCase()) || a.id.toLowerCase().includes(filter.toLowerCase());
    const matchesBucket = bucketFilter === 'all' || a.bucket === bucketFilter;
    return matchesName && matchesBucket;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-lg font-bold">Arrears Management Queue</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search customer or ID..."
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none w-64"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <select 
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none"
            value={bucketFilter}
            onChange={(e) => setBucketFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            <option value="all">All Buckets</option>
            {Object.values(BUCKET_RULES).map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Account / Customer</th>
              <th className="px-6 py-4 text-center">DPD</th>
              <th className="px-6 py-4">Bucket</th>
              <th className="px-6 py-4">Arrears Amt</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(a => (
              <tr key={a.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => onSelect(a)}>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-bold text-slate-900">{a.customerName}</div>
                    <div className="text-xs text-slate-500">{a.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-mono font-medium">
                  <span className={`px-2 py-1 rounded ${a.dpd > 90 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                    {a.dpd}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className={`text-sm font-semibold ${a.bucket >= 4 ? 'text-red-600' : 'text-slate-700'}`}>
                      {BUCKET_RULES[a.bucket].name}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase">{BUCKET_RULES[a.bucket].meaning}</div>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700">
                  ${a.arrearsAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${
                    a.status === 'legal' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 group-hover:text-slate-900 transition-colors p-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <div className="p-12 text-center text-slate-400">
          No accounts found matching your criteria.
        </div>
      )}
    </div>
  );
};
