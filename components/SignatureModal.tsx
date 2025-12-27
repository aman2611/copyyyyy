import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';
import Loader from './Loader';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remarks: string) => void;
  requestId: string;
  action: 'Approve' | 'Reject';
}

const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, onConfirm, requestId, action }) => {
  const [remarks, setRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRemarks('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setIsProcessing(true);
    // Simulate API delay
    setTimeout(() => {
        setIsProcessing(false);
        onConfirm(remarks);
        onClose();
    }, 1200);
  };

  const isReject = action === 'Reject';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 animate-fade-in-up">
        
        {/* Header */}
        <div className={`p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center ${isReject ? 'bg-red-50 dark:bg-red-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
          <div>
             <h3 className={`text-lg font-bold flex items-center gap-2 ${isReject ? 'text-red-700 dark:text-red-400' : 'text-blue-700 dark:text-blue-400'}`}>
                {isReject ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                {isReject ? 'Reject Request' : 'Approve Request'}
             </h3>
             <p className="text-xs opacity-70 mt-1">Ref: {requestId}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <X size={20} className={isReject ? 'text-red-500' : 'text-slate-500'} />
          </button>
        </div>

        <div className="p-6 space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
                Are you sure you want to <strong>{isReject ? 'reject' : 'approve'}</strong> this request? This action will be logged in the audit trail.
            </p>
            
            {/* Remarks Field */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    {isReject ? 'Reason for Rejection (Required)' : 'Remarks (Optional)'}
                </label>
                <textarea 
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm resize-none h-24"
                    placeholder={isReject ? "Please specify why this request is being denied..." : "Add any notes..."}
                />
            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
            <button 
                onClick={onClose}
                className="flex-1 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-slate-200 dark:hover:border-white/10 rounded-xl transition-all"
                disabled={isProcessing}
            >
                Cancel
            </button>
            <button 
                onClick={handleSubmit}
                disabled={(isReject && !remarks) || isProcessing}
                className={`flex-1 py-3 text-sm font-bold text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isReject 
                    ? 'bg-red-600 hover:bg-red-500 shadow-red-500/30' 
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/30'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {isProcessing ? (
                    <Loader size="sm" variant="spinner" className="text-white" />
                ) : (
                    <>
                        {isReject ? 'Confirm Rejection' : 'Confirm Approval'}
                    </>
                )}
            </button>
        </div>

      </div>
    </div>
  );
};

export default SignatureModal;