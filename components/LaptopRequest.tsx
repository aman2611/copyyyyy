
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FileText, CheckCircle, AlertCircle, Clock, MapPin, BadgeCheck, Monitor, Activity, Lock, Eye, PlusCircle, ChevronRight, Laptop } from 'lucide-react';
import Button from './Button';
import RouteModal from './RouteModal';
import Stepper, { Step } from './Stepper';
import Badge from './Badge';
import { Approver, UserData } from '../utils/types';
import { LAPTOP_CONDITIONS } from '../utils/constants';

interface LaptopRequestProps {
  user: UserData;
}

type WorkflowStage = 'DRAFT' | 'PENDING' | 'APPROVED_SELECTION' | 'ISSUED';

const DetailItem = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
  <div className="flex flex-col p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-md group">
      <span className="text-slate-500 dark:text-gray-400 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1.5 font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {icon} {label}
      </span>
      <span className="font-semibold text-slate-900 dark:text-white text-xs truncate" title={value}>
          {value}
      </span>
  </div>
);

// --- DASHBOARD VIEW (EXPORTED) ---
export const LaptopHome: React.FC<{ onNavigate: (menu: string, sub: string) => void }> = ({ onNavigate }) => {
    return (
      <div className="space-y-6 animate-fade-in-up">
          <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest">Active Fleet Requisitions</h3>
              <button onClick={() => onNavigate('laptop-request', 'laptop-new-request')} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/30 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                  <PlusCircle size={18} /> New Request
              </button>
          </div>
          
          <div 
              className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/10 hover:border-blue-500 transition-all flex items-center justify-between cursor-pointer group shadow-sm"
              onClick={() => onNavigate('laptop-request', 'laptop-inbox')} 
          >
              <div className="flex items-center gap-8">
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-3xl text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-110">
                      <Laptop size={40} />
                  </div>
                  <div>
                  <div className="font-black text-2xl text-slate-900 dark:text-white mb-2 tracking-tight">REQ-1044: Computational Asset Requisition</div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Command Segment: 04-A / Fleet Intel</div>
                  </div>
              </div>
              <div className="flex items-center gap-6">
                  <Badge variant="success">AUTHORIZED</Badge>
                  <ChevronRight size={24} className="text-slate-300 group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
              </div>
          </div>
      </div>
    );
};

const LaptopRequest: React.FC<LaptopRequestProps> = ({ user }) => {
  const [stage, setStage] = useState<WorkflowStage>('DRAFT');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // DRAFT FORM STATE
  const [agreed, setAgreed] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [routeConfigured, setRouteConfigured] = useState(false);
  
  // Steps State
  const [steps, setSteps] = useState<Step[]>([
      { 
          label: 'Initiator', 
          subLabel: user.username,
          status: 'current', 
          tooltip: (
              <div>
                  <div className="font-bold text-sm mb-1">{user.username}</div>
                  <div className="text-slate-300">Request Initiator</div>
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2 text-blue-300">
                      <Clock size={12} /> Started: Just now
                  </div>
              </div>
          )
      },
      { 
          label: 'Route Pending', 
          status: 'pending', 
          tooltip: 'Configure the approval route to continue.' 
      },
      { 
          label: 'Issuance', 
          status: 'pending', 
          tooltip: 'Final stage: Asset handover by Logistics.'
      }
  ]);

  const conditions = LAPTOP_CONDITIONS;

  // Merge Route from Modal
  const handleRouteConfirm = (approvers: Approver[]) => {
      // 1. Initiator (User)
      const startStep: Step = { 
          label: 'Initiator', 
          subLabel: user.username,
          status: 'completed', 
          tooltip: (
              <div>
                  <div className="font-bold text-sm mb-1">{user.username}</div>
                  <div className="text-slate-300">Request Initiator</div>
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2 text-green-400">
                      <CheckCircle size={12} /> Completed
                  </div>
              </div>
          )
      };

      // 2. Dynamic & Fixed Approvers
      const middleSteps: Step[] = approvers.map(a => ({
          label: a.designation,
          subLabel: a.name,
          status: 'pending',
          tooltip: (
              <div>
                  <div className="font-bold text-sm mb-1">{a.name}</div>
                  <div className="text-slate-300 mb-1">{a.designation}</div>
                  <div className="text-[10px] bg-slate-900/50 px-2 py-1 rounded inline-block">{a.unit}</div>
                  {a.type === 'FIXED' && <div className="mt-2 text-[10px] text-yellow-400 flex items-center gap-1"><Lock size={10}/> Mandatory Approval</div>}
              </div>
          )
      }));

      // 3. Final Step
      const endStep: Step = { 
          label: 'Issuance', 
          status: 'pending', 
          tooltip: (
              <div>
                  <div className="font-bold text-sm mb-1">Logistics Dept</div>
                  <div className="text-slate-300">Asset Handover</div>
              </div>
          )
      };

      setSteps([startStep, ...middleSteps, endStep]);
      setRouteConfigured(true);
      toast.success('Route Configured');
  };

  const handleSubmit = () => {
    setStage('PENDING');
    
    const updated = steps.map((s, idx) => {
        if (idx === 0) return s; 
        if (idx === 1) return { ...s, status: 'current' as const };
        return s;
    });
    setSteps(updated);
    toast.success('Laptop Request Submitted');
  };

  const toggleApproved = () => {
      setStage('ISSUED');
      const allCompleted = steps.map(s => ({ ...s, status: 'completed' as const }));
      setSteps(allCompleted);
      toast.success('Asset Issued & Signed');
  };

  const handlePreviewUI = () => {
      if (!routeConfigured) {
          // Auto-configure route if missing
          handleRouteConfirm([
              { id: 'mock-1', name: 'Capt. Janeway', designation: 'Commanding Officer', unit: 'Command', type: 'DYNAMIC' }
          ]);
      }
      if (!remarks) setRemarks('Requesting standard issue MacBook Pro for development purposes.');
      setAgreed(true);
      setStage('PENDING');
      
      // Update steps to reflect pending state
      setSteps(prev => prev.map((s, idx) => {
          if (idx === 0) return { ...s, status: 'completed' };
          if (idx === 1) return { ...s, status: 'current' };
          return s;
      }));
      toast.success('Request Submitted');
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-12">
      <RouteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onConfirmRoute={handleRouteConfirm}
      />

      {/* Header with Preview Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Laptop Requisition</h2>
              <p className="text-slate-500 dark:text-gray-400 mt-1">Official channel for IT asset procurement.</p>
          </div>
          
          <button 
              onClick={handlePreviewUI}
              className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
          >
              <Eye size={14} /> Dev: Preview Submitted UI
          </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Personal Profile Card */}
        <div className="xl:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-white font-bold text-2xl shadow-inner">
                        {user.username.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{user.username}</h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400">{user.rank}</p>
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-2 rounded bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase border border-green-200 dark:border-green-500/30">
                            <BadgeCheck size={10} /> Eligible
                        </div>
                    </div>
                </div>
                
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Personnel Details</h4>
                <div className="grid grid-cols-1 gap-2">
                    <DetailItem label="Unit / Dept" value={user.unit} icon={<MapPin size={12} />} />
                    <DetailItem label="Designation" value={user.designation || 'N/A'} icon={<CheckCircle size={12} />} />
                    <DetailItem label="Service ID" value={user.serviceNumber || 'N/A'} icon={<FileText size={12} />} />
                    <DetailItem label="Email" value={user.email} icon={<Monitor size={12} />} />
                    <DetailItem label="Phone" value={user.phone || 'N/A'} icon={<Monitor size={12} />} />
                    <div className="h-px bg-slate-100 dark:bg-white/10 my-1"></div>
                    <DetailItem label="Join Date" value={user.dateOfJoining || 'N/A'} icon={<Clock size={12} />} />
                    <DetailItem label="Seniority Date" value={user.dateOfSeniority || 'N/A'} icon={<Activity size={12} />} />
                    <DetailItem label="Retirement Date" value={user.dateOfRetirement || 'N/A'} icon={<Clock size={12} />} />
                </div>

                {stage === 'PENDING' && (
                     <div className="mt-6">
                        <button onClick={toggleApproved} className="w-full py-2 text-xs font-bold bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10">
                            Dev: Simulate Approval
                        </button>
                     </div>
                )}
            </div>
        </div>

        {/* Right Column: Workflow Area */}
        <div className="xl:col-span-2 space-y-6">
            
            {/* 1. Route Visualization (Stepper) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <MapPin size={20} className="text-blue-500" /> Approval Route
                    </h3>
                    {!routeConfigured && stage === 'DRAFT' && (
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-500/20 px-2 py-1 rounded border border-amber-200 dark:border-amber-500/30">
                           Not Configured
                        </span>
                    )}
                    {stage === 'ISSUED' && (
                        <span className="text-xs font-bold text-white bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 px-3 py-1 rounded-lg border border-white/20 flex items-center gap-1 shadow-lg shadow-green-500/30 animate-gradient-x bg-[length:200%_200%]">
                           <CheckCircle size={12} /> Approved
                        </span>
                    )}
                </div>

                {/* Reusable Stepper */}
                <Stepper steps={steps} />

                {/* Create Route Prompt */}
                {!routeConfigured && stage === 'DRAFT' && (
                    <div className="mt-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Action Required</h4>
                                <p className="text-xs text-slate-600 dark:text-gray-400">You must define an approval route before submitting.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-lg"
                        >
                            Create Route
                        </button>
                    </div>
                )}
            </div>

            {/* 2. Agreement & Submission Form (Only in DRAFT) */}
            {stage === 'DRAFT' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                        <FileText size={20} className="text-purple-500" /> Terms & Conditions
                    </h3>
                    
                    <div className="space-y-3 mb-6">
                        {conditions.map((condition, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-sm text-slate-700 dark:text-gray-300">
                                <CheckCircle size={16} className="mt-0.5 text-slate-400 shrink-0" />
                                <span>{condition}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6 border-t border-slate-100 dark:border-white/5 pt-6">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${agreed ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-black/20 border-slate-300 dark:border-slate-600 group-hover:border-blue-400'}`}>
                                {agreed && <CheckCircle size={14} />}
                            </div>
                            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="hidden" />
                            <span className="text-sm font-bold text-slate-900 dark:text-white">I agree to the terms above.</span>
                        </label>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Additional Remarks (Optional)</label>
                            <textarea 
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Enter any specific requirements or notes for the approver..."
                                className="w-full h-24 p-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
                            />
                        </div>

                        <Button 
                            fullWidth 
                            onClick={handleSubmit} 
                            disabled={!agreed || !routeConfigured}
                            className={`py-4 text-base shadow-xl ${!agreed || !routeConfigured ? 'opacity-50 cursor-not-allowed' : 'shadow-blue-500/30'}`}
                        >
                            {!routeConfigured ? 'Configure Route First' : 'Submit Laptop Request'}
                        </Button>
                    </div>
                </div>
            )}

            {/* 3. Post-Submission View (Manifest) */}
            {stage !== 'DRAFT' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm animate-fade-in-up">
                    <div className="p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                            <FileText size={20} className="text-blue-500" /> Requisition Manifest
                        </h3>
                        <div className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm flex items-center gap-1 ${
                            stage === 'ISSUED' 
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30'
                            : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
                        }`}>
                            {stage === 'ISSUED' ? <CheckCircle size={12} /> : <Clock size={12} />}
                            {stage === 'ISSUED' ? 'ASSET ISSUED' : 'PENDING APPROVAL'}
                        </div>
                    </div>
                    
                    <div className="p-8">
                        <div className="mb-8">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Request Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                                    <div className="text-slate-500 text-xs font-bold uppercase mb-1">Asset Category</div>
                                    <div className="text-slate-900 dark:text-white font-bold flex items-center gap-2">
                                        <Monitor size={18} /> Standard Laptop (High Perf)
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                                    <div className="text-slate-500 text-xs font-bold uppercase mb-1">Date Submitted</div>
                                    <div className="text-slate-900 dark:text-white font-bold flex items-center gap-2">
                                        <Clock size={18} /> {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Operational Remarks</h4>
                            <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-slate-300 italic">
                                "{remarks || 'No additional remarks provided.'}"
                            </div>
                        </div>

                        <div className="border-t border-slate-100 dark:border-white/5 pt-6">
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <CheckCircle size={14} className="text-green-500" />
                                <span>Terms & Conditions Accepted by <strong>{user.username}</strong></span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                                <CheckCircle size={14} className="text-green-500" />
                                <span>Digital Signature Verified</span>
                            </div>
                        </div>
                    </div>
                    
                    {stage === 'ISSUED' && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 text-center border-t border-green-100 dark:border-green-500/20">
                            <p className="text-green-800 dark:text-green-300 text-sm font-bold flex items-center justify-center gap-2">
                                <CheckCircle size={16} /> Asset #LPT-88321 assigned to {user.username}
                            </p>
                        </div>
                    )}
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default LaptopRequest;
