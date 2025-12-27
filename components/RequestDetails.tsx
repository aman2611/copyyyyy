
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, Clock, Laptop, Shield, FileText, Paperclip, 
  User, CheckCircle, Fingerprint, QrCode, XCircle, RefreshCw, Maximize2,
  MapPin, Briefcase, Calendar, Activity, Mail, Phone, Lock
} from 'lucide-react';
import { RequestItem } from '../utils/types';
import { INITIAL_MOCK_REQUESTS, INITIAL_USERS } from '../utils/constants';
import Badge from './Badge';
import Stepper from './Stepper';
import PdfViewer from './PdfViewer';
import SignatureModal from './SignatureModal';

interface RequestDetailsProps {
  requestId: string;
  onBack: () => void;
}

const DEMO_WORKFLOW_STEPS = [
    { id: '1', label: 'Initiated', subLabel: 'User', role: 'Applicant' },
    { id: '2', label: 'Unit Review', subLabel: 'HOD', role: 'Head of Dept' },
    { id: '3', label: 'Security', subLabel: 'CSO', role: 'Security Officer' },
    { id: '4', label: 'Logistics', subLabel: 'QM', role: 'Quartermaster' },
    { id: '5', label: 'Issued', subLabel: 'System', role: 'Final' }
];

const RequestDetails: React.FC<RequestDetailsProps> = ({ requestId, onBack }) => {
  const [request, setRequest] = useState<RequestItem | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(1);
  const [approvalLogs, setApprovalLogs] = useState<any[]>([]);
  
  // Signature Modal State
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'Approve' | 'Reject' | null>(null);

  useEffect(() => {
    // Simulate fetching the specific request
    const found = INITIAL_MOCK_REQUESTS.find(r => r.id === requestId);
    if (found) {
        setRequest(found);
        setApprovalLogs([
            { 
                step: 'Initiated', 
                actor: found.requester.name, 
                role: 'Applicant', 
                approvedAt: found.submittedDate,
                signedAt: found.submittedDate, 
                hash: '0x8F...A2' 
            }
        ]);
        setCurrentStepIndex(1);
    }
  }, [requestId]);

  const handleSimulateNextStep = () => {
      if (currentStepIndex < DEMO_WORKFLOW_STEPS.length - 1) {
          const nextStep = DEMO_WORKFLOW_STEPS[currentStepIndex];
          const now = new Date();
          const signedTime = new Date(now.getTime() + 45000);

          const newLog = {
              step: nextStep.label,
              actor: nextStep.subLabel === 'HOD' ? 'Cmdr. Riker' : nextStep.subLabel === 'CSO' ? 'Lt. Tuvok' : 'Lt. Torres',
              role: nextStep.role,
              approvedAt: now.toISOString(),
              signedAt: signedTime.toISOString(),
              hash: `0x${Math.floor(Math.random()*16777215).toString(16).toUpperCase()}...`
          };
          
          setApprovalLogs(prev => [...prev, newLog]);
          setCurrentStepIndex(prev => prev + 1);
          toast.success(`Step '${nextStep.label}' completed.`);
      }
  };

  const getStepsForStepper = () => {
      return DEMO_WORKFLOW_STEPS.map((s, idx) => ({
          label: s.label,
          subLabel: s.subLabel,
          status: idx < currentStepIndex ? 'completed' as const : idx === currentStepIndex ? 'current' as const : 'pending' as const,
          tooltip: idx < currentStepIndex ? 'Approved & Signed' : idx === currentStepIndex ? 'Pending Action' : 'Awaiting Previous Step'
      }));
  };

  const initiateAction = (action: 'Approve' | 'Reject') => {
      setPendingAction(action);
      setIsSignModalOpen(true);
  };

  const confirmAction = (remarks: string) => {
      if (!pendingAction || !request) return;
      
      const newStatus = pendingAction === 'Approve' ? 'Approved' : 'Rejected';
      setRequest(prev => prev ? ({ 
          ...prev, 
          status: newStatus,
          summary: prev.summary + (remarks ? `\n\n[${pendingAction} Remarks]: ${remarks}` : '')
      }) : null);

      toast.success(`Request ${requestId} ${newStatus}.`);
      setPendingAction(null);
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
  };

  const getRequesterDetails = (req: RequestItem) => {
    // Try to find the user in our constants
    const user = INITIAL_USERS.find(u => 
        u.username.includes(req.requester.name.split(' ').pop() || 'Unknown') || 
        req.requester.name.includes(u.username)
    );

    if (user) return user;

    // Fallback Mock Data if user not in main list
    return {
        username: req.requester.name,
        rank: req.requester.rank,
        unit: req.requester.unit,
        designation: 'Service Officer',
        serviceNumber: `USN-${Math.floor(Math.random()*10000)}-REQ`,
        dateOfJoining: '2019-04-12',
        dateOfSeniority: '2022-06-01',
        dateOfRetirement: '2039-04-12',
        email: `${req.requester.name.toLowerCase().replace(/[\s.]/g, '')}@navy.mil`,
        phone: '312-555-0882'
    };
  };

  if (!request) return <div className="p-8 text-center text-slate-500">Loading Request Information...</div>;

  const requesterProfile = getRequesterDetails(request);

  return (
    <div className="flex flex-col animate-fade-in-up pb-8">
        {/* Signature Modal */}
        <SignatureModal 
            isOpen={isSignModalOpen}
            onClose={() => setIsSignModalOpen(false)}
            onConfirm={confirmAction}
            requestId={requestId}
            action={pendingAction || 'Approve'}
        />

        {/* Header Navigation */}
        <div className="flex items-center gap-4 mb-6">
            <button 
                onClick={onBack}
                className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
                <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
            </button>
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Request Details</h2>
                <div className="text-sm text-slate-500 dark:text-slate-400 font-mono">ID: {requestId}</div>
            </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-white/10 flex flex-col relative overflow-hidden">
            
            {/* Action Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl ${request.type === 'Laptop' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                        {request.type === 'Laptop' ? <Laptop size={28} /> : <Shield size={28} />}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{request.title}</h3>
                            <Badge variant={request.status === 'Approved' ? 'success' : request.status === 'Rejected' ? 'error' : 'warning'}>
                                {request.status}
                            </Badge>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-3 mt-1 font-medium">
                            <span className="flex items-center gap-1.5"><Clock size={14} /> Submitted: {formatDateTime(request.submittedDate)}</span>
                        </div>
                    </div>
                </div>
                
                {currentStepIndex < DEMO_WORKFLOW_STEPS.length - 1 && (
                    <button 
                        onClick={handleSimulateNextStep}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors border border-indigo-100 dark:border-indigo-500/20"
                    >
                        <RefreshCw size={14} /> Demo: Advance Workflow
                    </button>
                )}
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8">
                
                {/* 1. Requesting Personnel Detail Grid (Full Width) */}
                <div className="mb-10 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 p-6 animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-200 dark:border-white/5">
                        <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <User size={18} /> 
                        </div>
                        <h4 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">
                            Requester Profile
                        </h4>
                        <div className="ml-auto flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-white dark:bg-white/5 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 shadow-sm">
                            <CheckCircle size={14} /> Identity Verified
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-6 gap-x-8">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block tracking-wider">Full Name</label>
                            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                                {requesterProfile.username}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block tracking-wider">Service No.</label>
                            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                                <FileText size={14} className="text-blue-500" /> {requesterProfile.serviceNumber || 'N/A'}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block tracking-wider">Rank</label>
                            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                                <Shield size={14} className="text-blue-500" /> {requesterProfile.rank}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block tracking-wider">Designation</label>
                            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                                <Briefcase size={14} className="text-blue-500" /> {requesterProfile.designation || 'N/A'}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block tracking-wider">Unit</label>
                            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                                <MapPin size={14} className="text-blue-500" /> {requesterProfile.unit}
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block tracking-wider">Date of Joining</label>
                            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                                <Calendar size={14} className="text-emerald-500" /> {requesterProfile.dateOfJoining || 'N/A'}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block tracking-wider">Date of Seniority</label>
                            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                                <Activity size={14} className="text-amber-500" /> {requesterProfile.dateOfSeniority || 'N/A'}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block tracking-wider">Date of Retirement</label>
                            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                                <Clock size={14} className="text-red-500" /> {requesterProfile.dateOfRetirement || 'N/A'}
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block tracking-wider">Contact Email</label>
                            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                                <Mail size={14} className="text-slate-400" /> {requesterProfile.email}
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block tracking-wider">Secure Phone</label>
                            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                                <Phone size={14} className="text-slate-400" /> {requesterProfile.phone || 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Grid Layout for Workflow & Artifacts */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    
                    {/* LEFT: Workflow & Content (Col Span 2) */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Workflow Stepper */}
                        <div className="bg-white dark:bg-slate-950 rounded-[2rem] p-8 border border-slate-200 dark:border-white/10 shadow-sm">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                <Maximize2 size={16} /> Transaction Workflow
                            </h4>
                            <Stepper steps={getStepsForStepper()} />
                        </div>

                        {/* Justification Text */}
                        <div className="bg-white dark:bg-slate-950 rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 shadow-sm">
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <FileText size={20} className="text-blue-500" /> Executive Justification
                            </h4>
                            <div className="p-6 bg-slate-50 dark:bg-black/20 rounded-2xl text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap border border-slate-100 dark:border-white/5">
                                {request.summary}
                            </div>
                        </div>

                        {/* Document Viewer */}
                        <div className="bg-white dark:bg-slate-950 rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 shadow-sm flex flex-col h-[700px]">
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Paperclip size={20} className="text-red-500" /> Digital Artifacts
                            </h4>
                            <div className="flex-1 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner">
                                <PdfViewer />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Actions & Logs */}
                    <div className="space-y-8">
                        
                        {/* Actions Deck */}
                        {request.status === 'Pending' && (
                          <div className="bg-white dark:bg-slate-950 rounded-[2rem] border border-slate-200 dark:border-white/10 p-6 shadow-xl space-y-3 sticky top-6 z-10">
                              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <Lock size={14} /> Command Action
                              </h4>
                              <button 
                                  onClick={() => initiateAction('Approve')}
                                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                              >
                                  <CheckCircle size={18} /> Approve
                              </button>
                              <button 
                                  onClick={() => initiateAction('Reject')}
                                  className="w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 font-black uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-2"
                              >
                                  <XCircle size={18} /> Deny
                              </button>
                          </div>
                        )}

                        {/* Approval Logs */}
                        <div className="bg-white dark:bg-slate-950 rounded-[2rem] border border-slate-200 dark:border-white/10 p-8 shadow-sm relative overflow-hidden">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                <Fingerprint size={16} className="text-emerald-500" /> Chain of Custody
                            </h4>
                            <div className="space-y-8 relative pl-2">
                                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-white/5"></div>
                                {approvalLogs.map((log, idx) => (
                                    <div key={idx} className="relative flex gap-4 animate-fade-in-up">
                                        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-green-500 flex items-center justify-center shrink-0 border-4 border-slate-50 dark:border-slate-900 shadow-sm z-10">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div className="flex-1 bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{log.step}</div>
                                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{log.actor}</div>
                                                </div>
                                                <QrCode size={28} className="text-slate-900 dark:text-white opacity-20" />
                                            </div>
                                            <div className="space-y-1 text-[10px] pt-3 border-t border-slate-200 dark:border-white/10 font-mono text-slate-500 dark:text-slate-400">
                                                <div className="flex justify-between"><span>TIMESTAMP:</span><span>{new Date(log.approvedAt).toLocaleTimeString()}</span></div>
                                                <div className="flex justify-between"><span>HASH:</span><span className="truncate max-w-[80px]">{log.hash}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default RequestDetails;
