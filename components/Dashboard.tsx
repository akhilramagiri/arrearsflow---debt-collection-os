
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Account, BucketId } from '../types';
import { BUCKET_RULES } from '../constants';

interface DashboardProps {
  accounts: Account[];
}

export const Dashboard: React.FC<DashboardProps> = ({ accounts }) => {
  const bucketCounts = accounts.reduce((acc, curr) => {
    acc[curr.bucket] = (acc[curr.bucket] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const chartData = Object.keys(BUCKET_RULES).map(id => ({
    name: `Bucket ${id}`,
    count: bucketCounts[Number(id)] || 0,
    isCritical: BUCKET_RULES[Number(id) as BucketId].isCritical
  }));

  const totalArrears = accounts.reduce((sum, a) => sum + a.arrearsAmount, 0);
  const criticalArrears = accounts
    .filter(a => a.bucket >= BucketId.B4)
    .reduce((sum, a) => sum + a.arrearsAmount, 0);

  const stats = [
    { label: 'Total Accounts in Arrears', value: accounts.length, sub: 'All Buckets' },
    { label: 'Total Arrears Volume', value: `$${(totalArrears / 1000).toFixed(1)}k`, sub: 'Current exposure' },
    { label: 'Critical Risk (B4+)', value: `$${(criticalArrears / 1000).toFixed(1)}k`, sub: `${((criticalArrears / totalArrears) * 100).toFixed(1)}% of total` },
    { label: 'Average DPD', value: Math.floor(accounts.reduce((s, a) => s + a.dpd, 0) / accounts.length), sub: 'Days past due' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Portfolio Ageing (DPD Buckets)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isCritical ? '#ef4444' : '#0f172a'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Regulatory Alerts</h3>
          <div className="space-y-4">
            {accounts.filter(a => a.bucket === BucketId.B4).slice(0, 5).map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                <div>
                  <p className="text-sm font-bold text-red-900">{a.customerName}</p>
                  <p className="text-xs text-red-700">Triggered APRA Default @ {a.dpd} DPD</p>
                </div>
                <button className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                  Issue S88(6)
                </button>
              </div>
            ))}
            {accounts.filter(a => a.bucket === BucketId.B4).length === 0 && (
              <p className="text-slate-500 text-sm italic">No urgent regulatory triggers pending.</p>
            )}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            View All Critical Tasks
          </button>
        </div>
      </div>
    </div>
  );
};
