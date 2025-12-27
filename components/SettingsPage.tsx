import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Save, Bell, Shield, Globe, Lock, Mail, Server, RefreshCw, Moon, Sun, Monitor, AlertTriangle, ToggleLeft, ToggleRight, Laptop, FileText, PhoneCall, HelpCircle, Users, Calendar } from 'lucide-react';
import { useTheme } from '../App';

interface SettingsPageProps {
  workflowStatus: Record<string, boolean>;
  onToggleWorkflow: (id: string) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ workflowStatus, onToggleWorkflow }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [delegationEnabled, setDelegationEnabled] = useState(false);
  const [delegate, setDelegate] = useState('');

  const handleToggle = (id: string) => {
      onToggleWorkflow(id);
      const newState = !workflowStatus[id];
      toast.success(`${id.replace('-', ' ')} workflow ${newState ? 'enabled' : 'disabled'}`);
  };

  const handleDelegationToggle = () => {
      const newState = !delegationEnabled;
      setDelegationEnabled(newState);
      if (newState) {
          toast('Delegation setup required', { icon: '⚠️' });
      } else {
          toast.success('Delegation disabled');
      }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-12">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Global Preferences</h1>
        <p className="text-slate-500 dark:text-gray-400">Configure application behavior, active workflows, and interface settings.</p>
      </div>

      {/* SECTION: DELEGATION OF AUTHORITY (Real Life Feature) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Users size={24} /> Delegation of Authority
            </h2>
            <p className="text-orange-50 text-sm mt-1">Ensure Continuity of Operations (COOP) during deployment or leave by delegating your approval authority.</p>
        </div>
        
        <div className="p-6">
            <div className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-500/20 rounded-xl mb-6">
                <AlertTriangle className="text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-orange-800 dark:text-orange-200">
                    <p className="font-bold mb-1">Important:</p>
                    <p>Actions taken by your delegate are logged under your authority but attributed to their account. You remain responsible for all approvals.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-bold text-slate-900 dark:text-white">Enable Delegation</div>
                        <div className="text-sm text-slate-500">Redirect incoming approval requests to another user.</div>
                    </div>
                    <button 
                        onClick={handleDelegationToggle}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${delegationEnabled ? 'bg-orange-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${delegationEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                </div>

                {delegationEnabled && (
                    <div className="pt-4 border-t border-slate-100 dark:border-white/5 animate-fade-in-down">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Delegate</label>
                                <select 
                                    value={delegate}
                                    onChange={(e) => setDelegate(e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                                >
                                    <option value="">Choose a user...</option>
                                    <option value="riker">Cmdr. Riker (XO)</option>
                                    <option value="data">Lt. Cmdr. Data (Ops)</option>
                                    <option value="troi">Counselor Troi</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Duration (Until)</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                                    <input 
                                        type="date" 
                                        className="w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* SECTION 1: FLOW CONTROL CENTER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Server size={24} /> Flow Control Center
            </h2>
            <p className="text-blue-100 text-sm mt-1">Enable or disable specific workflow modules globally. Disabled flows will be hidden from navigation.</p>
        </div>
        
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400">
                        <Laptop size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Laptop Request Flow</h4>
                        <p className="text-sm text-slate-500 dark:text-gray-400">Manage device issuance, approvals, and inventory assignment.</p>
                    </div>
                </div>
                <button 
                    onClick={() => handleToggle('laptop-request')}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${workflowStatus['laptop-request'] ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${workflowStatus['laptop-request'] ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-500/20 rounded-xl text-green-600 dark:text-green-400">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">Dispensation Flow</h4>
                        <p className="text-sm text-slate-500 dark:text-gray-400">Handle exceptional requests and special permission grants.</p>
                    </div>
                </div>
                <button 
                    onClick={() => handleToggle('dispensation')}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${workflowStatus['dispensation'] ? 'bg-green-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${workflowStatus['dispensation'] ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-100 dark:bg-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">NWS Policy Flow</h4>
                        <p className="text-sm text-slate-500 dark:text-gray-400">Access, review, and acknowledge operational policies.</p>
                    </div>
                </div>
                <button 
                    onClick={() => handleToggle('nws-policy')}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${workflowStatus['nws-policy'] ? 'bg-amber-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${workflowStatus['nws-policy'] ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
            </div>
        </div>
      </div>

      {/* SECTION 2: INTERFACE PREFERENCES */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-white/5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <Monitor size={24} className="text-purple-500" /> Interface Preferences
              </h2>
              <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">Customize your visual experience.</p>
          </div>
          <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <button 
                    onClick={() => isDarkMode && toggleTheme()}
                    className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all ${!isDarkMode ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500'}`}
                 >
                    <Sun size={32} className="mb-3" />
                    <span className="font-bold">Light Mode</span>
                 </button>
                 
                 <button 
                    onClick={() => !isDarkMode && toggleTheme()}
                    className={`flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all ${isDarkMode ? 'border-blue-500 bg-slate-800 text-blue-400' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500'}`}
                 >
                    <Moon size={32} className="mb-3" />
                    <span className="font-bold">Dark Mode</span>
                 </button>
                 
                 <button className="flex flex-col items-center justify-center p-6 border-2 border-slate-200 dark:border-white/10 rounded-2xl text-slate-400 cursor-not-allowed opacity-60">
                    <Monitor size={32} className="mb-3" />
                    <span className="font-bold">System Default</span>
                 </button>
              </div>
          </div>
      </div>

      {/* SECTION 3: COMMAND SUPPORT */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-white/5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <HelpCircle size={24} className="text-red-500" /> Command Support
              </h2>
              <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">Need assistance? Contact the IT Service Desk.</p>
          </div>
          <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 animate-pulse">
                      <PhoneCall size={32} />
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">IT Helpline</h3>
                      <p className="text-slate-500 dark:text-gray-400">Available 24/7 for critical issues</p>
                  </div>
              </div>
              <div className="text-right">
                  <div className="text-3xl font-black text-slate-900 dark:text-white tracking-widest font-mono">DSN: 312-555-0911</div>
                  <div className="text-lg font-bold text-slate-500 dark:text-gray-400 font-mono">COMM: +1 (757) 555-0911</div>
              </div>
          </div>
      </div>

    </div>
  );
};

export default SettingsPage;