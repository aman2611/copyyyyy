
import React, { useState } from 'react';
import { Search, Filter, User, Phone, Mail, MapPin, Shield, Calendar, FileText, CheckCircle, XCircle, AlertTriangle, Activity, Clock } from 'lucide-react';
import { UserData } from '../utils/types';

interface PersonnelRecordsProps {
  users?: UserData[]; // Optional prop if we pass data down, or we use mock data internally
}

// Mock extra details generator since our base user model is simple
const getMockDetails = (id: string) => ({
    lastEvaluation: '2023-11-01',
    nextReview: '2024-11-01',
    deployments: Math.floor(Math.random() * 5),
    specializations: ['Cyber Security', 'Logistics', 'Command']
});

const PersonnelRecords: React.FC<PersonnelRecordsProps> = ({ users = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // If no users passed, use a fallback empty array to prevent crash, though App usually passes it.
  // In a real app this would fetch from API.
  
  const filteredUsers = users.filter(u => 
     u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (u.serviceNumber && u.serviceNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeProfile = selectedUser ? users.find(u => u.id === selectedUser) : null;
  const activeDetails = activeProfile ? getMockDetails(activeProfile.id) : null;

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)] animate-fade-in-up">
       
       {/* Left Side: Searchable List */}
       <div className={`flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm transition-all duration-300 ${activeProfile ? 'w-1/3 hidden lg:flex' : 'w-full'}`}>
          <div className="p-4 border-b border-slate-200 dark:border-white/10">
             <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Personnel Database</h2>
             <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                   type="text" 
                   placeholder="Search service members..." 
                   className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex gap-2 mt-3">
                 <button className="flex-1 py-1.5 text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg border border-blue-100 dark:border-blue-500/20">All Active</button>
                 <button className="flex-1 py-1.5 text-xs font-bold bg-slate-50 dark:bg-white/5 text-slate-500 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100">Officers</button>
                 <button className="flex-1 py-1.5 text-xs font-bold bg-slate-50 dark:bg-white/5 text-slate-500 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100">Enlisted</button>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
             {filteredUsers.map(user => (
                <div 
                   key={user.id} 
                   onClick={() => setSelectedUser(user.id)}
                   className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedUser === user.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30 shadow-md' : 'bg-white dark:bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-white/5'}`}
                >
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                         {user.username.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="font-bold text-slate-900 dark:text-white truncate">{user.username}</h4>
                         <p className="text-xs text-slate-500 truncate">{user.rank || 'N/A'} • {user.unit}</p>
                      </div>
                      {user.status === 'Active' ? <div className="w-2 h-2 rounded-full bg-green-500"></div> : <div className="w-2 h-2 rounded-full bg-amber-500"></div>}
                   </div>
                </div>
             ))}
             {filteredUsers.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">No records found.</div>
             )}
          </div>
       </div>

       {/* Right Side: Detailed Profile View */}
       {activeProfile ? (
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden flex flex-col animate-fade-in-up">
             {/* Header Banner */}
             <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                 <button 
                   onClick={() => setSelectedUser(null)} 
                   className="lg:hidden absolute top-4 right-4 bg-black/20 text-white p-2 rounded-full backdrop-blur-sm"
                 >
                    Close
                 </button>
             </div>
             
             <div className="px-8 pb-8 flex-1 overflow-y-auto custom-scrollbar">
                 <div className="flex flex-col md:flex-row gap-6 -mt-12 mb-8">
                    <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-1 relative z-10">
                        <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center text-3xl font-bold text-slate-500">
                           {activeProfile.username.charAt(0)}
                        </div>
                    </div>
                    <div className="pt-14 flex-1">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{activeProfile.username}</h1>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm">
                           <span className="flex items-center gap-1.5 text-slate-600 dark:text-gray-300"><Shield size={16} className="text-blue-500" /> {activeProfile.rank || 'Rank Unknown'}</span>
                           <span className="flex items-center gap-1.5 text-slate-600 dark:text-gray-300"><MapPin size={16} className="text-red-500" /> {activeProfile.unit}</span>
                           <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${activeProfile.status === 'Active' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                              {activeProfile.status.toUpperCase()}
                           </span>
                        </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                     <div className="space-y-4">
                        <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2 mb-4">Official Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <div className="text-xs text-slate-400 uppercase font-bold mb-1">Service Number</div>
                              <div className="text-sm font-medium text-slate-800 dark:text-white">{activeProfile.serviceNumber || 'N/A'}</div>
                           </div>
                           <div>
                              <div className="text-xs text-slate-400 uppercase font-bold mb-1">Clearance</div>
                              <div className="text-sm font-bold text-purple-600">{activeProfile.clearanceLevel || 'N/A'}</div>
                           </div>
                           <div>
                              <div className="text-xs text-slate-400 uppercase font-bold mb-1">Designation</div>
                              <div className="text-sm font-medium text-slate-800 dark:text-white">{activeProfile.designation || 'N/A'}</div>
                           </div>
                           <div>
                              <div className="text-xs text-slate-400 uppercase font-bold mb-1">Join Date</div>
                              <div className="text-sm font-medium text-slate-800 dark:text-white">{activeProfile.dateOfJoining || 'N/A'}</div>
                           </div>
                           <div>
                              <div className="text-xs text-slate-400 uppercase font-bold mb-1">Seniority Date</div>
                              <div className="text-sm font-medium text-slate-800 dark:text-white">{activeProfile.dateOfSeniority || 'N/A'}</div>
                           </div>
                           <div>
                              <div className="text-xs text-slate-400 uppercase font-bold mb-1">Retirement Date</div>
                              <div className="text-sm font-medium text-slate-800 dark:text-white">{activeProfile.dateOfRetirement || 'N/A'}</div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2 mb-4">Contact Details</h3>
                        <div className="space-y-3">
                           <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                              <Mail size={18} className="text-slate-400" />
                              <span className="text-sm font-medium text-slate-800 dark:text-white">{activeProfile.email}</span>
                           </div>
                           <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                              <Phone size={18} className="text-slate-400" />
                              <span className="text-sm font-medium text-slate-800 dark:text-white">{activeProfile.phone || 'No phone listed'}</span>
                           </div>
                        </div>
                     </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                     <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-500/20">
                        <div className="text-blue-600 font-bold text-2xl mb-1">{activeProfile.serviceYears} Yrs</div>
                        <div className="text-blue-600/70 text-xs font-bold uppercase">Time in Service</div>
                     </div>
                     <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-500/20">
                        <div className="text-purple-600 font-bold text-2xl mb-1">{activeDetails?.deployments}</div>
                        <div className="text-purple-600/70 text-xs font-bold uppercase">Total Deployments</div>
                     </div>
                     <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                        <div className="text-emerald-600 font-bold text-2xl mb-1">Good</div>
                        <div className="text-emerald-600/70 text-xs font-bold uppercase">Medical Status</div>
                     </div>
                 </div>
                 
                 <div>
                    <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2 mb-4">Service History</h3>
                    <div className="space-y-4">
                       <div className="flex gap-4">
                          <div className="w-24 text-xs font-bold text-slate-400 pt-1">NOV 2023</div>
                          <div className="flex-1 pb-4 border-b border-slate-100 dark:border-white/5">
                             <div className="font-bold text-slate-800 dark:text-white text-sm">Performance Evaluation</div>
                             <div className="text-slate-500 text-xs mt-1">Rated 'Early Promote' by Cmdr. Riker. Noted excellence in cyber defense operations.</div>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <div className="w-24 text-xs font-bold text-slate-400 pt-1">AUG 2021</div>
                          <div className="flex-1 pb-4 border-b border-slate-100 dark:border-white/5">
                             <div className="font-bold text-slate-800 dark:text-white text-sm">Unit Transfer</div>
                             <div className="text-slate-500 text-xs mt-1">Transferred from Naval Station Norfolk to Pacific Fleet Command.</div>
                          </div>
                       </div>
                    </div>
                 </div>

             </div>
          </div>
       ) : (
          <div className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl border-dashed flex flex-col items-center justify-center text-slate-400">
             <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Search size={24} />
             </div>
             <p className="font-medium">Select a user to view full service record</p>
          </div>
       )}

    </div>
  );
};

export default PersonnelRecords;
