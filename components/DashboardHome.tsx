
import React, { useState } from 'react';
import { Laptop, FileText, HardDrive, Activity, ArrowLeft, Plus, Zap, Box, Layers, RefreshCcw, Wifi, Shield, ArrowRight } from 'lucide-react';
import DataTable, { ColumnDef } from './DataTable';
import Badge from './Badge';
import { ModuleConfig } from '../utils/types';

interface DashboardHomeProps {
  currentModule: ModuleConfig;
  workflowStatus: Record<string, boolean>;
  onNavigate: (menuId: string, subItem?: string) => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ currentModule, workflowStatus, onNavigate }) => {
  const [simulateEmpty, setSimulateEmpty] = useState(false);
  const [isNewReqOpen, setIsNewReqOpen] = useState(false);

  const getResourceCards = () => {
     // If simulating empty, return zeroed out data
     if (simulateEmpty) {
         if (currentModule.id === 'logistics') {
             return [
                { id: 'laptop-request', subId: 'laptop-my-requests', label: 'Asset Fleet', value: '0', sub: 'No activity', icon: Laptop, bg: 'bg-slate-100 dark:bg-white/5', text: 'text-slate-400' },
                { id: 'dispensation', subId: 'dispensation-my-requests', label: 'Waivers', value: '0', sub: 'No activity', icon: FileText, bg: 'bg-slate-100 dark:bg-white/5', text: 'text-slate-400' },
                { id: 'nws-policy', subId: 'nws-library', label: 'Media Control', value: '0', sub: 'No activity', icon: HardDrive, bg: 'bg-slate-100 dark:bg-white/5', text: 'text-slate-400' },
             ];
         }
         return (currentModule.stats || []).map((stat, idx) => ({
             id: `stat-${idx}`,
             subId: '',
             label: stat.label,
             value: '0',
             sub: 'No Data',
             icon: stat.icon, 
             bg: 'bg-slate-100 dark:bg-white/5',
             text: 'text-slate-400'
         }));
     }

     // Normal Data
     if (currentModule.id === 'logistics') {
         const allCards = [
            { id: 'laptop-request', subId: 'laptop-my-requests', label: 'Asset Fleet', value: '124', sub: 'Active Assignments', icon: Laptop, bg: 'bg-blue-100 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
            { id: 'dispensation', subId: 'dispensation-my-requests', label: 'Waivers', value: '82', sub: '5 Urgent Actions', icon: FileText, bg: 'bg-green-100 dark:bg-green-500/10', text: 'text-green-600 dark:text-green-400' },
            { id: 'nws-policy', subId: 'nws-library', label: 'Media Control', value: '12', sub: 'Pending Review', icon: HardDrive, bg: 'bg-amber-100 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400' },
         ];
         return allCards.filter(card => workflowStatus[card.id] !== false);
     }
     return (currentModule.stats || []).map((stat, idx) => ({
         id: `stat-${idx}`,
         subId: '',
         label: stat.label,
         value: stat.value,
         sub: 'Live Metric',
         icon: stat.icon, 
         bg: `bg-${currentModule.themeColor}-100 dark:bg-${currentModule.themeColor}-500/10`,
         text: `text-${currentModule.themeColor}-600 dark:text-${currentModule.themeColor}-400`
     }));
  };

  const activityData = simulateEmpty ? [] : [
      { id: 1, action: 'Provisioned', subject: 'Asset REQ-1044', user: 'Adm. J. Doe', time: '10 mins ago', status: 'success' },
      { id: 2, action: 'Inbound Submission', subject: 'Policy Rev NWS-882', user: 'Ens. Crusher', time: '45 mins ago', status: 'info' },
      { id: 6, action: 'Access Revoked', subject: 'Dispensation D-901', user: 'Capt. Sisko', time: '6 hours ago', status: 'error' },
  ];

  const activityColumns: ColumnDef<any>[] = [
      {
          key: 'subject',
          header: 'Signal Trace',
          sortable: true,
          render: (row) => (
              <div>
                  <div className="font-black text-slate-900 dark:text-white whitespace-nowrap text-sm tracking-tight">{row.subject}</div>
                  <div className="text-[10px] text-slate-500 whitespace-nowrap font-black uppercase tracking-widest">{row.action}</div>
              </div>
          )
      },
      {
          key: 'user',
          header: 'Personnel',
          sortable: true,
          render: (row) => <span className="text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-widest">{row.user}</span>
      },
      {
          key: 'time',
          header: 'Time',
          sortable: true,
          render: (row) => <span className="text-slate-500 text-[10px] font-mono">{row.time}</span>
      },
      {
          key: 'status',
          header: 'Status',
          sortable: true,
          className: 'text-right',
          headerClassName: 'text-right',
          render: (row) => <Badge variant={row.status === 'success' ? 'success' : row.status === 'warning' ? 'warning' : 'info'}>{row.status}</Badge>
      }
  ];

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
        
        {/* Top Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
            <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers size={20} className="text-blue-500" /> 
                    System Status
                </h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">Real-time operational metrics.</p>
            </div>

            <div className="relative">
                <button 
                    onClick={() => setIsNewReqOpen(!isNewReqOpen)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all font-bold text-sm group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> 
                    Initiate Request
                </button>

                {isNewReqOpen && (
                    <div className="absolute right-0 top-14 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 p-2 animate-fade-in-up">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2">Select Protocol</div>
                        <button 
                            onClick={() => onNavigate('laptop-request', 'laptop-new-request')}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group"
                        >
                            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
                                <Laptop size={16} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">Asset Requisition</div>
                                <div className="text-[10px] text-slate-500">Hardware & Peripherals</div>
                            </div>
                        </button>
                        <button 
                            onClick={() => onNavigate('dispensation', 'dispensation-my-requests')}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group"
                        >
                            <div className="p-2 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg group-hover:scale-110 transition-transform">
                                <Wifi size={16} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">Net Dispensation</div>
                                <div className="text-[10px] text-slate-500">Connectivity Waiver</div>
                            </div>
                        </button>
                        <button 
                            onClick={() => onNavigate('nws-policy', 'nws-library')}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left group"
                        >
                            <div className="p-2 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg group-hover:scale-110 transition-transform">
                                <Shield size={16} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">Port Policy</div>
                                <div className="text-[10px] text-slate-500">Media Access</div>
                            </div>
                        </button>
                    </div>
                )}
                {isNewReqOpen && (
                    <div className="fixed inset-0 z-40" onClick={() => setIsNewReqOpen(false)}></div>
                )}
            </div>
        </div>

        {/* Stats Grid - REDESIGNED */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {getResourceCards().map((stat, i) => (
            <div 
            key={i} 
            onClick={() => stat.subId ? onNavigate(stat.id, stat.subId) : null}
            className={`p-6 rounded-[2rem] border transition-all duration-500 cursor-pointer group shadow-sm hover:shadow-xl hover:scale-[1.02] flex flex-col justify-between h-52 relative overflow-hidden ${
                simulateEmpty 
                ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5 grayscale opacity-80' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50'
            }`}
            >
                {simulateEmpty && <div className="absolute inset-0 bg-slate-100/50 dark:bg-black/50 backdrop-blur-[1px] z-0"></div>}
                
                {/* Decorative Background Watermark */}
                <div className="absolute -right-6 -bottom-6 opacity-[0.03] dark:opacity-[0.05] transform rotate-12 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 pointer-events-none text-slate-900 dark:text-white">
                    {React.createElement(stat.icon as any, { size: 160 })}
                </div>

                <div className="relative z-10 flex justify-between items-start">
                    <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.text} shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        {React.createElement(stat.icon as any, { size: 28 })}
                    </div>
                    {simulateEmpty && (
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                    )}
                    {!simulateEmpty && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                            <div className="p-2 rounded-full bg-slate-50 dark:bg-white/10 text-slate-400 hover:text-blue-500">
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="relative z-10 mt-auto">
                    <h3 className={`text-5xl font-black tracking-tighter mb-1 ${simulateEmpty ? 'text-slate-300 dark:text-slate-700' : 'text-slate-900 dark:text-white'}`}>
                        {stat.value}
                    </h3>
                    <div className="flex flex-col">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                        <p className={`text-xs font-bold mt-1 truncate ${simulateEmpty ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                            {stat.sub}
                        </p>
                    </div>
                </div>
            </div>
        ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
                {simulateEmpty ? (
                    // EMPTY STATE VISUALIZATION
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-12 text-center shadow-sm flex flex-col items-center justify-center h-full min-h-[400px] relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent dark:from-blue-900/10 opacity-50"></div>
                        
                        <div className="relative z-10 mb-6">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse">
                                <Box size={40} className="text-slate-300 dark:text-slate-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                                System Idle
                            </h3>
                            <p className="text-slate-500 dark:text-gray-400 max-w-sm mx-auto text-sm">
                                No active signal traces found. Your operational queue is currently clear. Initiate a new sequence to begin.
                            </p>
                        </div>

                        <button 
                            onClick={() => onNavigate('laptop-request', 'laptop-new-request')}
                            className="relative z-10 flex items-center gap-2 px-8 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
                        >
                            <Zap size={14} className="fill-current" /> Start First Request
                        </button>
                    </div>
                ) : (
                    // DATA TABLE STATE
                    <DataTable 
                        title="Real-Time Network Activity" 
                        icon={Activity}
                        data={activityData} 
                        columns={activityColumns}
                        initialPageSize={5}
                    />
                )}
            </div>

            <div className="space-y-8">
                <div className={`bg-slate-900 dark:bg-blue-900/40 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-all duration-500 ${simulateEmpty ? 'opacity-90 grayscale-[0.5]' : ''}`}>
                    <div className="absolute top-0 right-0 p-8 opacity-20"><Activity size={64} /></div>
                    <h3 className="font-black text-xl mb-8 flex items-center gap-3 tracking-widest uppercase">Quick Actions</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {['laptop-request', 'dispensation', 'nws-policy'].map((key) => workflowStatus[key] && (
                            <button 
                                key={key}
                                onClick={() => onNavigate(key, `${key}-my-requests`)}
                                className="p-6 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/5 transition-all text-left flex justify-between items-center group"
                            >
                                <div className="text-xs font-black uppercase tracking-[0.2em] opacity-80">{key.replace('-', ' ')}</div>
                                <ArrowLeft size={16} className="rotate-180 opacity-0 group-hover:opacity-100 transition-all translate-x--2 group-hover:translate-x-0" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Developer Simulation Toggle */}
        <div className="flex justify-center mt-12 opacity-50 hover:opacity-100 transition-opacity">
            <button 
                onClick={() => setSimulateEmpty(!simulateEmpty)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${simulateEmpty ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-slate-100 dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10'}`}
            >
                <RefreshCcw size={12} />
                {simulateEmpty ? 'Dev: Disable Empty Simulation' : 'Dev: Simulate Empty State'}
            </button>
        </div>
    </div>
  );
};

export default DashboardHome;
