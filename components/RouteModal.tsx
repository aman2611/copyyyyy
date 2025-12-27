import React, { useState } from 'react';
import { X, UserPlus, Shield, Briefcase, MapPin, Trash2, Check, Lock, User } from 'lucide-react';
import Stepper, { Step } from './Stepper';
import { Approver } from '../utils/types';
import { FIXED_APPROVERS, ROLES_OPTIONS, UNITS_OPTIONS, AUTHORITIES_OPTIONS } from '../utils/constants';

// Re-export type for usage in other files if needed
export type { Approver };

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmRoute: (approvers: Approver[]) => void;
}

const RouteModal: React.FC<RouteModalProps> = ({ isOpen, onClose, onConfirmRoute }) => {
  // 1. Fixed Authorities (System Defined) - Now imported
  const fixedApprovers = FIXED_APPROVERS;

  // 2. Dynamic Approvers (User Added)
  const [dynamicApprovers, setDynamicApprovers] = useState<Approver[]>([]);

  // Form State
  const [role, setRole] = useState('');
  const [unit, setUnit] = useState('');
  const [authorityName, setAuthorityName] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (role && unit && authorityName) {
      const newApprover: Approver = {
        id: `dyn-${Date.now()}`,
        name: authorityName,
        designation: role,
        unit: unit,
        type: 'DYNAMIC'
      };
      setDynamicApprovers([...dynamicApprovers, newApprover]);
      // Reset form
      setRole('');
      setUnit('');
      setAuthorityName('');
    }
  };

  const handleRemove = (id: string) => {
    setDynamicApprovers(prev => prev.filter(a => a.id !== id));
  };

  const handleConfirm = () => {
    // Combine: Dynamic first (HODs/COs), then Fixed (Security/Logistics)
    const finalRoute = [...dynamicApprovers, ...fixedApprovers];
    onConfirmRoute(finalRoute);
    onClose();
  };

  // Mock Data for Dropdowns - Now imported
  const roles = ROLES_OPTIONS;
  const units = UNITS_OPTIONS;
  const authorities = AUTHORITIES_OPTIONS;

  // GENERATE PREVIEW STEPS FOR STEPPER
  const previewSteps: Step[] = [
      { 
          label: 'Initiator', 
          status: 'completed', 
          tooltip: (
              <div>
                  <div className="font-bold text-sm">You</div>
                  <div className="text-slate-300">Request Originator</div>
              </div>
          )
      },
      ...dynamicApprovers.map((da) => ({
          label: da.designation,
          subLabel: da.name,
          status: 'current' as const, // Visualize as "added"
          tooltip: (
              <div>
                  <div className="font-bold text-sm">{da.name}</div>
                  <div className="text-slate-300">{da.designation}</div>
                  <div className="text-[10px] opacity-75 mt-1">{da.unit}</div>
              </div>
          )
      })),
      ...fixedApprovers.map((fa) => ({
          label: fa.designation,
          status: 'locked' as const,
          tooltip: (
              <div>
                  <div className="font-bold text-sm">{fa.name}</div>
                  <div className="text-slate-300">{fa.designation}</div>
                  <div className="text-[10px] text-yellow-400 mt-1 flex items-center gap-1"><Lock size={10}/> Fixed System Route</div>
              </div>
          )
      })),
      { 
          label: 'Issuance', 
          status: 'pending', 
          tooltip: 'Final Asset Handover'
      }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Configure Approval Route</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400">Define your chain of command for asset issuance.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* 1. Visual Stepper Preview */}
          <div className="bg-slate-50 dark:bg-black/20 p-6 rounded-xl border border-slate-200 dark:border-white/5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Projected Route Flow</h4>
              <Stepper steps={previewSteps} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             
             {/* LEFT COL: Configuration Form */}
             <div className="space-y-6">
                 <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                        <UserPlus size={16} className="text-blue-500" /> Add Authority
                    </h4>
                    <div className="bg-white dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Role / Designation</label>
                            <div className="relative">
                                <Briefcase size={14} className="absolute left-3 top-3 text-slate-400" />
                                <select 
                                    value={role} 
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                >
                                    <option value="">Select Role (e.g. HOD, CO)</option>
                                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Unit / Department</label>
                            <div className="relative">
                                <MapPin size={14} className="absolute left-3 top-3 text-slate-400" />
                                <select 
                                    value={unit} 
                                    onChange={(e) => setUnit(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                >
                                    <option value="">Select Unit</option>
                                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase Authority Name">Authority Name</label>
                            <div className="relative">
                                <Shield size={14} className="absolute left-3 top-3 text-slate-400" />
                                <select 
                                    value={authorityName} 
                                    onChange={(e) => setAuthorityName(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                >
                                    <option value="">Select Official</option>
                                    {authorities.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                        </div>

                        <button 
                            onClick={handleAdd}
                            disabled={!role || !unit || !authorityName}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                        >
                            <UserPlus size={16} /> Add to Route
                        </button>
                    </div>
                 </div>

                 {/* Fixed Route Table Display */}
                 <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                        <Lock size={16} className="text-slate-400" /> System Fixed Route (Mandatory)
                    </h4>
                    <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden max-h-64 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left text-sm relative">
                            <thead className="bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 uppercase border-b border-slate-200 dark:border-white/10 sticky top-0 z-10">
                                <tr>
                                    <th className="p-3 bg-slate-100 dark:bg-slate-800">Official</th>
                                    <th className="p-3 bg-slate-100 dark:bg-slate-800">Role</th>
                                    <th className="p-3 text-right bg-slate-100 dark:bg-slate-800">Type</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {fixedApprovers.map(fa => (
                                    <tr key={fa.id} className="bg-slate-50/50 dark:bg-white/[0.02]">
                                        <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{fa.name}</td>
                                        <td className="p-3 text-slate-500">{fa.designation}</td>
                                        <td className="p-3 text-right">
                                            <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded">LOCKED</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </div>
             </div>

             {/* RIGHT COL: Dynamic List */}
             <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Briefcase size={16} className="text-indigo-500" /> Added Approvers (Dynamic)
                </h4>
                
                {dynamicApprovers.length > 0 ? (
                    <div className="border border-indigo-100 dark:border-indigo-500/20 rounded-xl overflow-hidden shadow-sm max-h-[400px] overflow-y-auto custom-scrollbar flex flex-col">
                        <table className="w-full text-left text-sm relative">
                            <thead className="bg-indigo-50 dark:bg-indigo-900/30 text-xs text-indigo-800 dark:text-indigo-300 uppercase border-b border-indigo-100 dark:border-indigo-500/20 sticky top-0 z-10">
                                <tr>
                                    <th className="p-3 bg-indigo-50 dark:bg-slate-900">Official</th>
                                    <th className="p-3 bg-indigo-50 dark:bg-slate-900">Role</th>
                                    <th className="p-3 bg-indigo-50 dark:bg-slate-900">Unit</th>
                                    <th className="p-3 text-right bg-indigo-50 dark:bg-slate-900">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {dynamicApprovers.map((da, index) => (
                                    <tr key={da.id} className="bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/5">
                                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold">{index + 1}</span>
                                                {da.name}
                                            </div>
                                        </td>
                                        <td className="p-3 text-slate-600 dark:text-gray-300">{da.designation}</td>
                                        <td className="p-3 text-slate-500">{da.unit}</td>
                                        <td className="p-3 text-right">
                                            <button onClick={() => handleRemove(da.id)} className="p-1 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="p-3 bg-indigo-50/50 dark:bg-indigo-900/10 text-xs text-center text-indigo-600 dark:text-indigo-300 font-medium mt-auto border-t border-indigo-100 dark:border-white/5">
                            These approvers will process the request before the fixed route.
                        </div>
                    </div>
                ) : (
                    <div className="h-48 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                        <UserPlus size={32} className="mb-2 opacity-50" />
                        <p className="font-bold text-sm">No Approvers Added</p>
                        <p className="text-xs">Use the form on the left to add your HOD or Commanding Officer.</p>
                    </div>
                )}
             </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
           <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors font-medium">
              Cancel
           </button>
           <button 
                onClick={handleConfirm}
                disabled={dynamicApprovers.length === 0}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-lg shadow-green-500/30 font-bold flex items-center gap-2"
            >
              <Check size={18} /> Confirm Route
           </button>
        </div>
      </div>
    </div>
  );
};

export default RouteModal;