
import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Clock, ChevronRight, Inbox as InboxIcon, Send, User 
} from 'lucide-react';
import Loader from './Loader';
import Badge from './Badge';
import { RequestItem } from '../utils/types';
import { INITIAL_MOCK_REQUESTS } from '../utils/constants';

interface InboxProps {
  mode?: 'Inbox' | 'Outbox';
  filterType?: 'Laptop' | 'Dispensation' | 'Policy' | 'All'; // New Prop for strict filtering
  onViewRequest?: (requestId: string) => void; // Callback to parent for navigation
}

const Inbox: React.FC<InboxProps> = ({ mode = 'Inbox', filterType = 'All', onViewRequest }) => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      // Filter initial requests based on the Module Prop (filterType)
      const moduleSpecificRequests = INITIAL_MOCK_REQUESTS.filter(req => {
          if (filterType === 'All') return true;
          return req.type === filterType;
      });
      setRequests(moduleSpecificRequests);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [mode, filterType]);

  const filteredRequests = requests
    .filter(req => {
      // 1. Inbox/Outbox Logic
      const isPending = req.status === 'Pending';
      const matchesView = mode === 'Inbox' ? isPending : !isPending;
      
      // 2. Search Logic
      const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) || req.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) || req.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 3. Status Filter (Local)
      const matchesStatus = statusFilter === 'All' || req.status === statusFilter;

      return matchesView && matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
  };

  if (isLoading) {
    return <Loader size="lg" text={`SYNCING ${filterType.toUpperCase()} DATA`} subtext="Retrieving Secure Messages..." />;
  }

  return (
    <div className="flex flex-col h-full animate-fade-in-up">
      {/* LIST VIEW HEADER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-4 mb-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center z-20">
        <div className="flex items-center gap-3 px-2">
            <div className={`p-2.5 rounded-xl ${mode === 'Inbox' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                {mode === 'Inbox' ? <InboxIcon size={20} /> : <Send size={20} />}
            </div>
            <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white leading-none uppercase tracking-widest">{mode}</h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mt-1">
                    {mode === 'Inbox' ? `${filteredRequests.length} Pending Actions` : 'Processed History'}
                </p>
            </div>
        </div>

        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search ID, title or personnel..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white placeholder-slate-400"
          />
        </div>

        <div className="flex gap-2 relative w-full md:w-auto">
             <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
             >
                 <Filter size={16} /> Filter
             </button>
             {isFilterOpen && (
                 <div className="absolute top-12 right-0 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-30 p-2">
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 py-1">Status</div>
                     {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                         <button 
                            key={status}
                            onClick={() => { setStatusFilter(status); setIsFilterOpen(false); }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${statusFilter === status ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'hover:bg-slate-50 dark:hover:bg-white/5 dark:text-slate-300'}`}
                         >
                             {status}
                         </button>
                     ))}
                 </div>
             )}
        </div>
      </div>

      {/* LIST CONTENT */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredRequests.map(req => (
              <div 
                key={req.id}
                onClick={() => onViewRequest && onViewRequest(req.id)}
                className="p-5 border-b border-slate-100 dark:border-white/5 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-white/5 group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold shadow-sm border border-slate-200 dark:border-white/10 group-hover:scale-105 transition-transform">
                        {req.requester.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {req.title}
                        </h4>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">{req.id}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">
                            <User size={12} /> {req.requester.name}
                        </span>
                        <span className="flex items-center gap-1.5 opacity-80 font-medium">
                            <Clock size={12} /> {formatDateTime(req.submittedDate)}
                        </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                      <Badge variant={req.status === 'Approved' ? 'success' : req.status === 'Pending' ? 'warning' : 'error'}>
                        {req.status}
                      </Badge>
                      <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
            {filteredRequests.length === 0 && (
                <div className="p-20 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-700 mb-4">
                        <InboxIcon size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Zero Active Items</h3>
                    <p className="text-sm text-slate-500">The current message queue for {filterType} is empty.</p>
                </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default Inbox;
