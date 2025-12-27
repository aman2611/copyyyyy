import React from 'react';
import { Activity, Server, Shield, AlertTriangle, Database, Wifi, Lock, Users, Cpu, HardDrive, Globe } from 'lucide-react';
import DataTable, { ColumnDef } from './DataTable';
import Badge from './Badge';
import { MOCK_AUDIT_LOGS } from '../utils/constants';

const AdminOverview: React.FC = () => {
  // Mock Real-time Logs - Imported
  const auditLogs = MOCK_AUDIT_LOGS;

  const columns: ColumnDef<typeof auditLogs[0]>[] = [
      {
          key: 'time',
          header: 'Timestamp',
          sortable: true,
          render: (row) => <span className="font-mono text-xs text-slate-500">{row.time}</span>
      },
      {
          key: 'action',
          header: 'Action',
          sortable: true,
          render: (row) => <span className="font-medium text-slate-900 dark:text-white">{row.action}</span>
      },
      {
          key: 'actor',
          header: 'Actor',
          sortable: true,
          render: (row) => <span className="text-slate-600 dark:text-gray-300">{row.actor}</span>
      },
      {
          key: 'target',
          header: 'Target',
          sortable: true,
          render: (row) => <span className="text-slate-600 dark:text-gray-300">{row.target}</span>
      },
      {
          key: 'status',
          header: 'Status',
          sortable: true,
          render: (row) => {
              const variant = row.status === 'Success' ? 'success' : 'warning';
              return <Badge variant={variant}>{row.status.toUpperCase()}</Badge>;
          }
      }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Header Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">System Health</p>
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">98.4%</h3>
              <p className="text-xs text-slate-400">All systems nominal</p>
           </div>
           <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-xl text-green-600 dark:text-green-400">
              <Activity size={24} />
           </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Sessions</p>
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,240</h3>
              <p className="text-xs text-slate-400">+12% from last hour</p>
           </div>
           <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
              <Users size={24} />
           </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Server Load</p>
              <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">42%</h3>
              <p className="text-xs text-slate-400">Optimal performance</p>
           </div>
           <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Server size={24} />
           </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Threat Level</p>
              <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400">BRAVO</h3>
              <p className="text-xs text-slate-400">Increased surveillance</p>
           </div>
           <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 animate-pulse">
              <Shield size={24} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Resource Monitor */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
           <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Cpu size={20} className="text-blue-500" /> Infrastructure Metrics
           </h3>
           
           <div className="space-y-6">
              <div className="space-y-2">
                 <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-600 dark:text-gray-300 flex items-center gap-2"><Server size={14} /> Main Cluster CPU</span>
                    <span className="text-slate-900 dark:text-white">45%</span>
                 </div>
                 <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[45%] rounded-full"></div>
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-600 dark:text-gray-300 flex items-center gap-2"><HardDrive size={14} /> Storage (SAN-01)</span>
                    <span className="text-slate-900 dark:text-white">78%</span>
                 </div>
                 <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[78%] rounded-full"></div>
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-600 dark:text-gray-300 flex items-center gap-2"><Wifi size={14} /> Network Bandwidth</span>
                    <span className="text-slate-900 dark:text-white">2.4 Gbps</span>
                 </div>
                 <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[60%] rounded-full"></div>
                 </div>
              </div>
              
              <div className="space-y-2">
                 <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-600 dark:text-gray-300 flex items-center gap-2"><Database size={14} /> DB Connections</span>
                    <span className="text-slate-900 dark:text-white">142 / 500</span>
                 </div>
                 <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[28%] rounded-full"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Network Status / Globe Placeholder */}
        <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-900/20"></div>
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
                  <Globe size={48} className="text-blue-400" />
               </div>
               <div>
                  <h3 className="text-xl font-bold">Global Relay</h3>
                  <p className="text-slate-400 text-sm mt-1">NIPRNET / SIPRNET Gateway</p>
               </div>
               <div className="flex gap-2 text-xs font-mono mt-4">
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">ONLINE</span>
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">SECURE</span>
               </div>
            </div>
        </div>
      </div>

      {/* Security Audit Log - Replaced with DataTable */}
      <DataTable 
          title="Security Audit Log" 
          icon={Lock}
          data={auditLogs} 
          columns={columns}
          initialPageSize={5}
      />
    </div>
  );
};

export default AdminOverview;