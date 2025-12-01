import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Users, ShieldCheck, AlertTriangle } from 'lucide-react';
import { VerificationStatus } from '../types';

const data = [
  { name: 'Mon', verifications: 140, rejected: 24 },
  { name: 'Tue', verifications: 230, rejected: 19 },
  { name: 'Wed', verifications: 180, rejected: 35 },
  { name: 'Thu', verifications: 278, rejected: 20 },
  { name: 'Fri', verifications: 189, rejected: 48 },
  { name: 'Sat', verifications: 239, rejected: 38 },
  { name: 'Sun', verifications: 349, rejected: 43 },
];

const StatCard = ({ title, value, change, icon: Icon, trend }: { title: string, value: string, change: string, icon: any, trend: 'up' | 'down' }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${trend === 'up' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
        <Icon size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
        {change}
      </span>
      <span className="text-slate-500 ml-2">vs last week</span>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Verifications" value="2,405" change="+12.5%" icon={Activity} trend="up" />
        <StatCard title="Active Users" value="892" change="+3.2%" icon={Users} trend="up" />
        <StatCard title="Verified Identity" value="94.2%" change="+1.1%" icon={ShieldCheck} trend="up" />
        <StatCard title="Flagged Risky" value="142" change="-2.4%" icon={AlertTriangle} trend="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Verification Trends</h3>
            <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-2 outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="verifications" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorVer)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Recent Alerts</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Suspicious ID Document</p>
                  <p className="text-xs text-slate-500 mt-1">Detected mismatch in font weight for User #{10230 + i}</p>
                  <p className="text-xs text-slate-400 mt-2">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-sm text-blue-600 font-medium hover:text-blue-700">
            View All Alerts
          </button>
        </div>
      </div>
    </div>
  );
};
