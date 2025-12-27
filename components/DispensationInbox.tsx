import React, { useState } from 'react';
import { LayoutList, Kanban, Grid, Wifi, Shield, FileText, MoreHorizontal, Clock, User } from 'lucide-react';
import Inbox from './Inbox';
import DispensationBoard from './DispensationBoard';
import { MOCK_GRID_DATA } from '../utils/constants';

interface DispensationInboxProps {}

const DispensationInbox: React.FC<DispensationInboxProps> = () => {
  const [viewLayout, setViewLayout] = useState<'List' | 'Board' | 'Grid'>('List');

  const getTypeIcon = (t: string) => {
      switch(t) {
          case 'INTERNET': return <Wifi size={18} />;
          case 'USB': return <FileText size={18} />;
          default: return <Shield size={18} />;
      }
  };

  const getTypeColor = (t: string) => {
      switch(t) {
          case 'INTERNET': return 'text-blue-500 bg-blue-50 dark:bg-blue-500/20';
          case 'USB': return 'text-purple-500 bg-purple-50 dark:bg-purple-500/20';
          default: return 'text-amber-500 bg-amber-50 dark:bg-amber-500/20';
      }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in-up">
      {/* Design Switcher Toolbar */}
      <div className="flex justify-between items-center mb-4">
          <div className="flex gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-1 rounded-xl shadow-sm">
              <button 
                  onClick={() => setViewLayout('List')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${viewLayout === 'List' ? 'bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}
              >
                  <LayoutList size={16} /> List
              </button>
              <button 
                  onClick={() => setViewLayout('Board')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${viewLayout === 'Board' ? 'bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}
              >
                  <Kanban size={16} /> Board
              </button>
              <button 
                  onClick={() => setViewLayout('Grid')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${viewLayout === 'Grid' ? 'bg-blue-100 dark:bg-blue-600 text-blue-700 dark:text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}
              >
                  <Grid size={16} /> Grid
              </button>
          </div>
          
          <div className="text-xs text-slate-400 font-medium">
             Viewing: <span className="font-bold text-slate-700 dark:text-slate-200">{viewLayout} Layout</span>
          </div>
      </div>

      {/* Render Selected View */}
      <div className="flex-1 overflow-hidden relative">
          {viewLayout === 'List' && <Inbox mode="Inbox" />}
          
          {viewLayout === 'Board' && <DispensationBoard />}
          
          {viewLayout === 'Grid' && (
              <div className="h-full overflow-y-auto custom-scrollbar pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {MOCK_GRID_DATA.map((item) => (
                          <div key={item.id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-5 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                              
                              {/* Top Row: Type Icon & Options */}
                              <div className="flex justify-between items-start mb-4">
                                  <div className={`p-3 rounded-xl ${getTypeColor(item.type)}`}>
                                      {getTypeIcon(item.type)}
                                  </div>
                                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                      <MoreHorizontal size={18} />
                                  </button>
                              </div>

                              {/* Content */}
                              <div className="mb-6">
                                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{item.title}</h4>
                                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                                      <span>{item.id}</span>
                                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                      <span className="flex items-center gap-1"><Clock size={10} /> {item.date}</span>
                                  </div>
                              </div>

                              {/* Requester Profile */}
                              <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-200">
                                      {item.requester.charAt(0)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{item.requester}</div>
                                      <div className="text-[10px] text-slate-500 uppercase tracking-wide truncate">{item.rank} • {item.unit}</div>
                                  </div>
                              </div>

                              {/* Footer Status */}
                              <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-white/5">
                                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</div>
                                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border animate-gradient-x bg-[length:200%_200%] shadow-sm ${
                                      item.status === 'Approved' 
                                        ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white border-green-400/30' 
                                        : item.status === 'Pending'
                                          ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white border-amber-400/30' 
                                          : 'bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white border-red-400/30'
                                  }`}>
                                      {item.status}
                                  </span>
                              </div>

                              {/* Hover Glow Effect */}
                              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                          </div>
                      ))}
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default DispensationInbox;