
import React, { useState } from 'react';
import { 
  MoreHorizontal, Clock, Wifi, Shield, FileText, Filter, Search
} from 'lucide-react';
import { KanbanItem } from '../utils/types';
import { MOCK_KANBAN_DATA } from '../utils/constants';

const DispensationBoard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Group items by time logic
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  const columns = {
    'today': MOCK_KANBAN_DATA.filter(i => (now - i.timestamp) < oneDay),
    'yesterday': MOCK_KANBAN_DATA.filter(i => (now - i.timestamp) >= oneDay && (now - i.timestamp) < 2 * oneDay),
    'older': MOCK_KANBAN_DATA.filter(i => (now - i.timestamp) >= 2 * oneDay)
  };

  const getTypeIcon = (t: string) => {
      switch(t) {
          case 'INTERNET': return <Wifi size={14} />;
          case 'USB': return <FileText size={14} />;
          default: return <Shield size={14} />;
      }
  };

  const getStandardTitle = (type: string) => {
      switch(type) {
          case 'INTERNET': return 'Internet Connectivity Request';
          case 'USB': return 'Removable Media Access';
          case 'ACCESS': return 'Physical Access Control';
          default: return 'Dispensation Request';
      }
  };

  const renderColumn = (id: string, title: string, items: KanbanItem[], colorClass: string) => (
    <div className="flex-shrink-0 w-80 flex flex-col h-full">
        {/* Column Header */}
        <div className="flex items-center justify-between p-4 rounded-t-2xl border-t border-x bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide">{title}</h3>
                <span className="ml-2 bg-white dark:bg-white/10 px-2 py-0.5 rounded-md text-xs font-bold text-slate-500">{items.length}</span>
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><MoreHorizontal size={16} /></button>
        </div>

        {/* Droppable Area */}
        <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar border-x border-b rounded-b-2xl bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5">
            {items.filter(i => i.id.toLowerCase().includes(searchTerm.toLowerCase()) || i.requester.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
                <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md cursor-pointer group transition-all hover:scale-[1.02]">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400">{item.id}</span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded">
                            <Clock size={10} /> {item.date}
                        </div>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3 leading-tight">{getStandardTitle(item.type)}</h4>
                    
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-200">
                            {item.requester.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{item.requester}</div>
                            <div className="text-[10px] text-slate-500 truncate">{item.unit}</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                             {getTypeIcon(item.type)}
                             <span className="capitalize text-[10px]">{item.type.toLowerCase()}</span>
                        </div>
                    </div>
                </div>
            ))}
            {items.length === 0 && (
                <div className="h-24 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                    No items
                </div>
            )}
        </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full animate-fade-in-up">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Board View</h2>
                <p className="text-sm text-slate-500 dark:text-gray-400">Pending requests grouped by arrival time.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search by ID or Requester..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50">
                    <Filter size={16} /> Filter
                </button>
            </div>
        </div>

        {/* Board Area */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
            <div className="flex h-full gap-6 min-w-max px-1">
                {renderColumn('today', 'Received Today', columns['today'], 'bg-green-500')}
                {renderColumn('yesterday', 'Yesterday', columns['yesterday'], 'bg-blue-500')}
                {renderColumn('older', 'Older', columns['older'], 'bg-slate-500')}
            </div>
        </div>
    </div>
  );
};

export default DispensationBoard;
