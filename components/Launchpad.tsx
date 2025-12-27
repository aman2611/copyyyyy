
import React, { useState, useRef, useEffect } from 'react';
import { 
  Anchor, Search, Bell, LogOut, ChevronRight, 
  Activity, User, Filter, List, Sun, Moon, MoreVertical,
  Shield, MapPin, Briefcase, FileText, CheckCircle, ArrowRight,
  Pin, Command, Calendar, Clock
} from 'lucide-react';
import { UserData, useTheme } from '../App';
import { ModuleConfig } from '../utils/types';
import { NOTIFICATIONS } from '../utils/constants';

interface LaunchpadProps {
  user: UserData;
  modules: ModuleConfig[];
  onSelectModule: (moduleId: string, context?: { workflow: string; subMenu?: string }) => void;
  onLogout: () => void;
  onOpenCommandPalette?: () => void;
}

const Launchpad: React.FC<LaunchpadProps> = ({ user, modules, onSelectModule, onLogout, onOpenCommandPalette }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [pinnedModules, setPinnedModules] = useState<string[]>(['logistics']);
  const profileRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handlePinToggle = (e: React.MouseEvent, moduleId: string) => {
    e.stopPropagation();
    setPinnedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };
  
  // Sort: Pinned items first
  const sortedModules = [...modules].sort((a, b) => {
    const isAPinned = pinnedModules.includes(a.id);
    const isBPinned = pinnedModules.includes(b.id);
    if (isAPinned === isBPinned) return 0;
    return isAPinned ? -1 : 1;
  });

  const handleAppClick = (appName: string) => {
     let moduleId = 'logistics';
     let context = { workflow: 'home', subMenu: '' };

     if (appName === 'eAnumodan') {
        moduleId = 'logistics';
        context = { workflow: 'laptop-request', subMenu: 'laptop-inbox' };
     } else if (appName === 'eVigam') {
        moduleId = 'cyber';
        context = { workflow: 'nws-policy', subMenu: 'nws-inbox' };
     } else if (appName === 'eSamman') {
        moduleId = 'personnel';
        context = { workflow: 'admin-console', subMenu: 'personnel-records' };
     } else {
        const map: Record<string, string> = { 'FVSCS': 'fleet', 'NIC Mail': 'facilities' };
        moduleId = map[appName] || 'logistics';
     }

     onSelectModule(moduleId, context);
  };

  // Aggregate Notifications by App for Sidebar Cards
  const appStats = NOTIFICATIONS.reduce((acc, curr) => {
      const app = curr.app;
      if (!acc[app]) {
          acc[app] = { 
              count: 0, 
              urgentCount: 0, 
              latestActivity: curr.title, 
              latestTime: curr.time 
          };
      }
      acc[app].count += 1;
      if (curr.urgency === 'high') acc[app].urgentCount += 1;
      return acc;
  }, {} as Record<string, { count: number, urgentCount: number, latestActivity: string, latestTime: string }>);

  return (
    <div className={`min-h-screen font-inter relative overflow-hidden flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Background Ambience - Updated for Deep Space Blue */}
      {isDarkMode ? (
        <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 pointer-events-none"></div>
      )}

      {/* Top Navigation Bar */}
      <header className={`relative z-20 h-16 border-b flex items-center justify-between px-6 transition-colors ${isDarkMode ? 'bg-slate-950/90 border-slate-800 backdrop-blur-md' : 'bg-white/80 border-slate-200 backdrop-blur-md'}`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Anchor className="text-white w-6 h-6" />
            </div>
            <div className="hidden md:block">
              <h1 className={`text-xl font-bold tracking-widest leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>HORIZON</h1>
              <p className="text-xs text-slate-400 uppercase tracking-widest leading-none mt-1">Workspace</p>
            </div>
          </div>
          
          {/* Main Dashboard Search Bar (Command Palette Trigger) */}
          <button 
            onClick={onOpenCommandPalette}
            className={`hidden md:flex items-center gap-3 px-4 py-2.5 border rounded-2xl w-96 transition-all group ${isDarkMode ? 'bg-slate-900 border-slate-700 hover:border-slate-600' : 'bg-slate-100 border-slate-200 hover:border-blue-300'}`}
          >
            <Search className={`w-5 h-5 ${isDarkMode ? 'text-slate-500 group-hover:text-blue-400' : 'text-slate-500 group-hover:text-blue-500'} transition-colors`} />
            <span className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Search apps or type command...</span>
            <div className={`ml-auto flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${isDarkMode ? 'bg-white/10 border-white/5 text-slate-400' : 'bg-white border-slate-200 text-slate-400'}`}>
                <Command size={10} /> K
            </div>
          </button>
        </div>

        <div className="flex items-center gap-4">
          
          <button 
            onClick={toggleTheme}
            className={`p-2.5 rounded-full transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>

          <button className={`p-2.5 rounded-full transition-colors relative ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>
          </button>
          
          <div className={`h-8 w-px mx-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
          
          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-xl transition-colors group ${isProfileOpen ? (isDarkMode ? 'bg-slate-800' : 'bg-slate-100') : (isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100')}`}
            >
                <div className="text-right hidden sm:block">
                    <div className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'}`}>{user.username}</div>
                    <div className="text-xs text-slate-400">{user.rank}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg text-lg">
                    {user.username.charAt(0)}
                </div>
            </button>

            {isProfileOpen && (
                <div className={`absolute right-0 top-16 w-72 border rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up z-50 ring-1 ${isDarkMode ? 'bg-slate-900 border-slate-700 ring-white/10' : 'bg-white border-slate-200 ring-slate-900/5'}`}>
                    <div className={`p-5 border-b ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                        <p className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.username}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                    <div className="p-2">
                        <button 
                            onClick={() => onSelectModule('personnel', { workflow: 'admin-console', subMenu: 'personnel-records' })}
                            className={`w-full text-left flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-colors ${isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                        >
                            <User size={18} className="text-blue-500" /> My Profile
                        </button>
                        <div className={`h-px my-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                        <button 
                            onClick={onLogout}
                            className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
                        >
                            <LogOut size={18} /> Sign Out
                        </button>
                    </div>
                </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          
          <div className="mb-10 animate-fade-in-up">
            <h2 className={`text-4xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {getGreeting()}, {user.rank} {user.username.split(' ').pop()}.
            </h2>
            <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Your operational dashboard is ready.
            </p>
          </div>

          {/* USER DETAILS HEADER BLOCK */}
          <div className={`mb-12 p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200 shadow-sm'} animate-fade-in-up`}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-wider">Full Name</label>
                    <div className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                        <User size={16} className="text-blue-500" /> {user.username}
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-wider">Service No.</label>
                    <div className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                        <FileText size={16} className="text-blue-500" /> {user.serviceNumber}
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-wider">Rank</label>
                    <div className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                        <Shield size={16} className="text-blue-500" /> {user.rank}
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-wider">Designation</label>
                    <div className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                        <Briefcase size={16} className="text-blue-500" /> {user.designation}
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-wider">Unit</label>
                    <div className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                        <MapPin size={16} className="text-blue-500" /> {user.unit}
                    </div>
                 </div>
                 
                 {/* New Date Fields */}
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-wider">Date of Joining</label>
                    <div className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                        <Calendar size={16} className="text-emerald-500" /> {user.dateOfJoining || 'N/A'}
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-wider">Date of Seniority</label>
                    <div className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                        <Activity size={16} className="text-amber-500" /> {user.dateOfSeniority || 'N/A'}
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-wider">Date of Retirement</label>
                    <div className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                        <Clock size={16} className="text-red-500" /> {user.dateOfRetirement || 'N/A'}
                    </div>
                 </div>
                 
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-wider">Command</label>
                    <div className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                        <Anchor size={16} className="text-blue-500" /> Pacific Fleet
                    </div>
                 </div>
              </div>
          </div>

          {/* DYNAMIC BENTO GRID - Based on Pinned Items */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 auto-rows-[300px]`}>
                {sortedModules.map((module, idx) => {
                    const isPinned = pinnedModules.includes(module.id);
                    
                    let spanClass = "";
                    let isHero = false;

                    if (isPinned) {
                         if (idx === 0) {
                             spanClass = "md:col-span-2 md:row-span-1";
                             isHero = true;
                         }
                    }

                    return (
                        <div 
                            key={module.id}
                            onClick={() => onSelectModule(module.id)}
                            className={`group relative border rounded-[2rem] transition-all duration-500 cursor-pointer overflow-hidden flex flex-col animate-fade-in-up ${spanClass}
                                ${isDarkMode 
                                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/20' 
                                    : 'bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50 border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100'
                                }`}
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            {/* Decorative Background Elements */}
                            {isHero && (
                                <div className={`absolute inset-0 bg-gradient-to-br from-${module.themeColor}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                            )}
                            <div className={`absolute -right-16 -top-16 w-64 h-64 rounded-full bg-${module.themeColor}-500/5 group-hover:bg-${module.themeColor}-500/10 blur-3xl transition-all duration-700`}></div>

                            {/* Pin Button */}
                            <button 
                                onClick={(e) => handlePinToggle(e, module.id)}
                                className={`absolute top-6 right-6 z-20 p-2.5 rounded-full transition-all duration-300 ${
                                    isPinned 
                                    ? `bg-${module.themeColor}-500 text-white opacity-100 shadow-lg` 
                                    : `bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-600`
                                }`}
                                title={isPinned ? "Unpin Module" : "Pin Module"}
                            >
                                <Pin size={18} className={isPinned ? "fill-current" : ""} />
                            </button>

                            <div className="p-8 flex-1 flex flex-col relative z-10">
                                <div className="flex justify-between items-start mb-6 pr-10">
                                    <div className={`p-5 rounded-2xl transition-all duration-500 group-hover:scale-110 shadow-sm ${
                                        isHero 
                                          ? `bg-${module.themeColor}-600 text-white shadow-lg shadow-${module.themeColor}-500/30` 
                                          : (isDarkMode ? `bg-${module.themeColor}-500/20 text-${module.themeColor}-400 group-hover:bg-${module.themeColor}-500/30` : `bg-${module.themeColor}-50 text-${module.themeColor}-600 group-hover:bg-${module.themeColor}-100`)
                                    }`}>
                                        <module.icon size={isHero ? 48 : 32} />
                                    </div>
                                    {!isHero && (
                                        <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-sm ${isDarkMode ? 'border-slate-700 text-slate-400 bg-slate-800' : 'border-slate-200 text-slate-500 bg-white/50'}`}>
                                            {module.category}
                                        </div>
                                    )}
                                </div>
                                
                                <div>
                                    <h4 className={`font-bold group-hover:translate-x-1 transition-transform ${isHero ? 'text-4xl mb-4' : 'text-2xl mb-3'} ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{module.title}</h4>
                                    <p className={`line-clamp-2 ${isHero ? 'text-lg opacity-90' : 'text-base'} ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {module.description}
                                    </p>
                                </div>

                                {/* NEW: Quick Actions Deck (No Numbers!) */}
                                <div className="mt-auto pt-6">
                                    <div className="flex flex-wrap gap-2">
                                        {module.quickActions?.map((action, actionIdx) => (
                                            <button 
                                                key={actionIdx}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectModule(module.id, action.context);
                                                }}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                                                    isDarkMode 
                                                    ? `bg-slate-900/50 border-slate-700 text-${module.themeColor}-400 hover:bg-${module.themeColor}-500/20 hover:border-${module.themeColor}-500/50` 
                                                    : `bg-white/50 border-slate-200 text-${module.themeColor}-600 hover:bg-${module.themeColor}-50 hover:border-${module.themeColor}-200`
                                                }`}
                                            >
                                                {React.createElement(action.icon, { size: 14 })}
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
          </div>
        </main>

        {/* Action Center Sidebar */}
        <aside className={`w-96 border-l hidden xl:flex flex-col backdrop-blur-sm transition-colors ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/60 border-slate-200'}`}>
           <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                 <CheckCircle size={20} className="text-green-500" /> Action Center
              </h3>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {Object.entries(appStats).map(([appName, stats]) => {
                  const module = modules.find(m => m.title === appName);
                  const Icon = module?.icon || Activity;
                  const themeColor = module?.themeColor || 'blue';
                  const hasUrgent = stats.urgentCount > 0;

                  return (
                     <div 
                        key={appName}
                        onClick={() => handleAppClick(appName)}
                        className={`group cursor-pointer rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                            isDarkMode 
                            ? 'bg-slate-900 border-slate-700 hover:bg-slate-800 hover:border-slate-600' 
                            : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5'
                        }`}
                     >
                         {/* Status Indicator Bar */}
                         <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${hasUrgent ? 'bg-red-500' : `bg-${themeColor}-500`}`}></div>
                         
                         <div className="p-5 pl-6">
                             <div className="flex justify-between items-start mb-4">
                                 <div className="flex items-center gap-3">
                                     <div className={`p-2.5 rounded-xl ${isDarkMode ? `bg-${themeColor}-500/20 text-${themeColor}-400` : `bg-${themeColor}-50 text-${themeColor}-600`}`}>
                                         <Icon size={22} />
                                     </div>
                                     <div>
                                         <h4 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{appName}</h4>
                                         <p className="text-[10px] text-slate-500 uppercase tracking-wider">{module?.category || 'System'}</p>
                                     </div>
                                 </div>
                                 {hasUrgent && (
                                     <span className="flex h-2.5 w-2.5 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                                     </span>
                                 )}
                             </div>

                             <div className="flex items-end justify-between">
                                 <div>
                                     <div className={`text-3xl font-bold leading-none mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                         {stats.count}
                                     </div>
                                     <div className="text-xs text-slate-500 font-medium">Pending Requests</div>
                                 </div>
                                 
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                                     <ArrowRight size={20} />
                                 </div>
                             </div>

                             {/* Latest Activity Snippet */}
                             <div className={`mt-4 pt-3 border-t text-xs truncate ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-500'}`}>
                                 <span className="font-medium opacity-70">Latest:</span> {stats.latestActivity}
                             </div>
                         </div>
                     </div>
                  );
              })}
              
              {Object.keys(appStats).length === 0 && (
                  <div className="text-center py-10 text-slate-400">
                      <CheckCircle size={40} className="mx-auto mb-3 opacity-50" />
                      <p>All caught up!</p>
                  </div>
              )}
           </div>
        </aside>

      </div>
    </div>
  );
};

export default Launchpad;
