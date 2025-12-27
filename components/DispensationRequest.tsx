
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  Wifi, WifiOff, FileText, CheckCircle, AlertCircle, Plus, 
  Trash2, Upload, Calendar, Server, Monitor, Laptop, HelpCircle, 
  Shield, Clock, MapPin, Lock, RefreshCw, Eye, ArrowLeft, Building2, Anchor, Printer
} from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Card from './Card';
import Stepper, { Step } from './Stepper';
import { INTERNET_QUESTIONS, NON_INTERNET_QUESTIONS } from '../utils/constants';
import { UserData } from '../utils/types';

interface DispensationRequestProps {
  user: UserData;
}

type RequestType = 'INTERNET' | 'NON_INTERNET';
type CaseType = 'FRESH' | 'RENEWAL';
type PCType = 'LAPTOP' | 'COMPUTER' | 'SERVER' | 'OTHER';

interface DispensationItem {
  id: string;
  requestType: RequestType;
  pcType: PCType;
  caseType: CaseType;
  quantity: number;
  duration: string;
  lastValidDate?: string;
  attachmentName?: string;
  justification: string;
  remarks?: string;
  location: string;
}

const DispensationRequest: React.FC<DispensationRequestProps> = ({ user }) => {
  const [submitted, setSubmitted] = useState(false);
  const [items, setItems] = useState<DispensationItem[]>([]);
  
  // --- DEV STATE FOR DEMO ---
  const [mockCommand, setMockCommand] = useState<string>(user.unit?.includes('HQ') ? 'Naval Headquarters' : 'Pacific Fleet Command');
  
  // Approval Logic State
  const [approvalAuthority, setApprovalAuthority] = useState<string>('');
  
  // Form State
  const [requestType, setRequestType] = useState<RequestType>('INTERNET');
  const [pcType, setPcType] = useState<PCType>('COMPUTER');
  const [caseType, setCaseType] = useState<CaseType>('FRESH');
  const [quantity, setQuantity] = useState<number>(1);
  const [duration, setDuration] = useState<string>('1 Year');
  
  // Renewal State
  const [lastValidDate, setLastValidDate] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachmentName, setAttachmentName] = useState('');

  // Item Details State
  const [justification, setJustification] = useState('');
  const [remarks, setRemarks] = useState('');
  const [location, setLocation] = useState('');

  // Questionnaire State (Global for the request)
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Initialize Default Answers when Request Type changes
  useEffect(() => {
      const initialAnswers: Record<string, string> = {};
      const config = requestType === 'INTERNET' ? INTERNET_QUESTIONS : NON_INTERNET_QUESTIONS;
      config.forEach(q => {
          initialAnswers[q.id] = '';
      });
      setAnswers(initialAnswers);
  }, [requestType]);

  const updateAnswer = (id: string, value: string) => {
      setAnswers(prev => ({ ...prev, [id]: value }));
  };

  // --- EFFECT: Handle Command Change & Defaults ---
  useEffect(() => {
      if (mockCommand === 'Naval Headquarters') {
          setApprovalAuthority('VCNS');
      } else {
          setApprovalAuthority(''); // Reset for manual selection
      }
  }, [mockCommand]);

  const toggleCommand = () => {
      setMockCommand(prev => prev === 'Naval Headquarters' ? 'Pacific Fleet Command' : 'Naval Headquarters');
  };

  const handlePreviewUI = () => {
      if (items.length === 0) {
          // Populate with mock data if list is empty so the preview isn't blank
          const mockItem: DispensationItem = {
              id: `mock-${Date.now()}`,
              requestType: 'INTERNET',
              pcType: 'LAPTOP',
              caseType: 'FRESH',
              quantity: 2,
              duration: '1 Year',
              justification: 'Assets required for cloud infrastructure management.',
              remarks: 'Urgent requirement.',
              location: 'Building 4, Room 202'
          };
          setItems([mockItem]);
          setApprovalAuthority('VCNS');
      }
      setSubmitted(true);
      toast.success('Request Submitted Successfully');
  };

  // --- ROUTE GENERATION ---
  const getRouteSteps = (): Step[] => {
      if (approvalAuthority === 'VCNS') {
          return [
              { label: 'Initiator', subLabel: user.rank, status: 'current', tooltip: 'Request Initiation' },
              { label: 'Review', subLabel: 'Section Head', status: 'pending', tooltip: 'Tech & Policy Review' },
              { label: 'Vetting', subLabel: 'Director IT', status: 'pending', tooltip: 'Security Vetting' },
              { label: 'Approval', subLabel: 'VCNS', status: 'pending', tooltip: 'Final Authorization' }
          ];
      } else if (approvalAuthority === 'CO') {
          return [
              { label: 'Initiator', subLabel: user.rank, status: 'current', tooltip: 'Request Initiation' },
              { label: 'Rec. Auth', subLabel: 'HOD', status: 'pending', tooltip: 'Departmental Recommendation' },
              { label: 'Control', subLabel: 'XO', status: 'pending', tooltip: 'Executive Review' },
              { label: 'Approval', subLabel: 'CO', status: 'pending', tooltip: 'Command Approval' }
          ];
      } else if (approvalAuthority === 'ADMIN') {
           return [
              { label: 'Initiator', subLabel: user.rank, status: 'current', tooltip: 'Request Initiation' },
              { label: 'Review', subLabel: 'Admin Officer', status: 'pending', tooltip: 'Administrative Review' },
              { label: 'Approval', subLabel: 'Stn Cdr', status: 'pending', tooltip: 'Station Commander' }
          ];
      }
      return [];
  };

  const routeSteps = getRouteSteps();
  const isRouteAvailable = routeSteps.length > 0;

  // --- HANDLERS ---

  const handleAddItem = () => {
    if (!justification || !location) {
        toast.error("Please fill in Justification and Location");
        return; 
    }

    const newItem: DispensationItem = {
      id: `item-${Date.now()}`,
      requestType,
      pcType,
      caseType,
      quantity,
      duration,
      lastValidDate: caseType === 'RENEWAL' ? lastValidDate : undefined,
      attachmentName: caseType === 'RENEWAL' ? attachmentName : undefined,
      justification,
      remarks,
      location
    };

    setItems([...items, newItem]);
    toast.success(`${pcType} added to queue`);
    
    // Reset Form Fields
    setJustification('');
    setRemarks('');
    setLocation('');
    setQuantity(1);
    setAttachmentName('');
    setLastValidDate('');
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    toast.success("Item removed from queue");
  };

  const handleSubmit = () => {
    setSubmitted(true);
    toast.success("Dispensation Request Submitted");
  };

  const handleReset = () => {
    setItems([]);
    setJustification('');
    setRemarks('');
    setLocation('');
    setQuantity(1);
    setAttachmentName('');
    setLastValidDate('');
    
    // Reset Answers
    const initialAnswers: Record<string, string> = {};
    const config = requestType === 'INTERNET' ? INTERNET_QUESTIONS : NON_INTERNET_QUESTIONS;
    config.forEach(q => { initialAnswers[q.id] = ''; });
    setAnswers(initialAnswers);
    
    toast.success("Form Reset");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachmentName(e.target.files[0].name);
    }
  };

  const activeQuestions = requestType === 'INTERNET' ? INTERNET_QUESTIONS : NON_INTERNET_QUESTIONS;

  if (submitted) {
      return (
          <div className="space-y-8 animate-fade-in-up pb-12 print:max-w-full print:p-0">
              {/* Success Banner */}
              <div className="bg-white dark:bg-slate-900 border border-green-200 dark:border-green-500/20 rounded-3xl p-8 text-center relative overflow-hidden shadow-sm print:border-none print:shadow-none">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 print:hidden"></div>
                  <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400 shadow-lg shadow-green-500/10 print:hidden">
                      <CheckCircle size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 print:text-black">Application Submitted Successfully</h2>
                  <p className="text-slate-500 dark:text-gray-400 max-w-lg mx-auto mb-6 print:hidden">
                      Your request has been forwarded to <strong>{approvalAuthority}</strong>. You will receive a notification once the review process begins.
                  </p>
                  <div className="flex justify-center gap-4 text-sm font-mono text-slate-600 dark:text-slate-300 print:text-black">
                      <div className="bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 print:border-black">
                          ID: <span className="font-bold">#DSP-{Date.now().toString().slice(-5)}</span>
                      </div>
                      <div className="bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 print:border-black">
                          Date: <span className="font-bold">{new Date().toLocaleDateString()}</span>
                      </div>
                  </div>
              </div>
              
              <div className="flex justify-center pt-4 print:hidden">
                  <button 
                    onClick={() => { setSubmitted(false); setItems([]); }} 
                    className="flex items-center gap-2 px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all font-bold text-sm"
                  >
                      <ArrowLeft size={16} /> Submit Another Request
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all font-bold text-sm ml-4"
                  >
                      <Printer size={16} /> Print Receipt
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="animate-fade-in-up max-w-6xl mx-auto pb-12 print:max-w-full">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 print:hidden">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">New Dispensation Request</h2>
                <p className="text-slate-500 dark:text-gray-400 mt-1">Request authorization for specific computing assets.</p>
            </div>
            
            <div className="flex gap-2">
                {/* PREVIEW BUTTON */}
                <button 
                    onClick={handlePreviewUI}
                    className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                >
                    <Eye size={14} /> Dev: Preview Submitted UI
                </button>

                {/* DEV TOOL: TOGGLE COMMAND */}
                <button 
                    onClick={toggleCommand}
                    className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg text-xs font-bold border border-slate-700 flex items-center gap-2 hover:bg-slate-700 transition-colors"
                >
                    <RefreshCw size={12} /> Dev: Switch Command
                </button>
            </div>
        </div>

        {/* 1. ROUTE & AUTHORITY VISUALIZATION (TOP) */}
        <Card className="mb-6 overflow-hidden print:hidden">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Authority Selector */}
                <div className="md:w-1/3 border-r border-slate-100 dark:border-white/5 pr-6">
                     <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Shield size={14} /> Approval Authority
                    </h3>
                    
                    {mockCommand === 'Naval Headquarters' ? (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/20 rounded-xl flex items-center gap-3">
                            <Lock size={20} className="text-blue-600 dark:text-blue-400" />
                            <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">VCNS (Vice Chief)</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Fixed for HQ Units</div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <Select 
                                value={approvalAuthority}
                                onChange={(e) => setApprovalAuthority(e.target.value)}
                                options={[
                                    { label: 'Select Approval Type...', value: '' },
                                    { label: 'Commanding Officer (CO)', value: 'CO' },
                                    { label: 'Administrative Authority', value: 'ADMIN' }
                                ]}
                            />
                            <p className="text-[10px] text-slate-400 mt-2 ml-1">Select the appropriate authority for your unit.</p>
                        </div>
                    )}
                </div>

                {/* Stepper Display */}
                <div className="flex-1">
                     <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                        <MapPin size={16} className="text-blue-500" /> Approval Route Preview
                    </h3>
                    
                    {isRouteAvailable ? (
                        <Stepper steps={routeSteps} />
                    ) : (
                        <div className="h-16 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-black/20">
                            <p className="text-sm flex items-center gap-2"><AlertCircle size={16} /> Select Authority to generate route.</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>

        {/* 2. MAIN FORM CARD */}
        <Card className="relative overflow-hidden mb-8">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
            
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Asset Configuration</h3>

            {/* A. Request Type Toggle */}
            <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Request Type</label>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setRequestType('INTERNET')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${requestType === 'INTERNET' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500'}`}
                    >
                        <Wifi size={24} />
                        <span className="font-bold text-sm">Internet PC</span>
                    </button>
                    <button 
                        onClick={() => setRequestType('NON_INTERNET')}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${requestType === 'NON_INTERNET' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500'}`}
                    >
                        <WifiOff size={24} />
                        <span className="font-bold text-sm">Non-Internet PC</span>
                    </button>
                </div>
            </div>

            {/* B. Disabled Command/Unit & Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Disabled Context Fields */}
                <Input 
                    label="Command"
                    value={mockCommand}
                    disabled
                    icon={Anchor}
                    className="opacity-70 bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                />
                 <Input 
                    label="Unit / Department"
                    value={user.unit}
                    disabled
                    icon={Building2}
                    className="opacity-70 bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                />

                {/* Active Fields */}
                <Select 
                    label="Case Type"
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value as CaseType)}
                    options={[
                        { label: 'Fresh Request', value: 'FRESH' },
                        { label: 'Renewal', value: 'RENEWAL' }
                    ]}
                />

                <Select 
                    label="PC Type"
                    icon={pcType === 'LAPTOP' ? Laptop : pcType === 'SERVER' ? Server : Monitor}
                    value={pcType}
                    onChange={(e) => setPcType(e.target.value as PCType)}
                    options={[
                        { label: 'Desktop Computer', value: 'COMPUTER' },
                        { label: 'Laptop', value: 'LAPTOP' },
                        { label: 'Server / Workstation', value: 'SERVER' },
                        { label: 'Other / Peripheral', value: 'OTHER' }
                    ]}
                />

                <Input 
                    label="Quantity"
                    type="number" 
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                />

                <Select 
                    label="Duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    options={['3 Months', '6 Months', '1 Year', 'Permanent']}
                />
            </div>

            {/* C. Renewal Specific Fields */}
            {caseType === 'RENEWAL' && (
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-500/20 p-4 rounded-xl mb-8 animate-fade-in-down">
                    <h4 className="text-sm font-bold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                        <Clock size={16} /> Renewal Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-amber-700 dark:text-amber-400 uppercase mb-2">Last Valid Upto</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-3 text-amber-600/50" />
                                <input 
                                    type="date"
                                    value={lastValidDate}
                                    onChange={(e) => setLastValidDate(e.target.value)}
                                    className="w-full pl-10 p-3 bg-white dark:bg-black/20 border border-amber-200 dark:border-amber-500/30 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-amber-700 dark:text-amber-400 uppercase mb-2">Last Dispensation Cert</label>
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                className="hidden" 
                                onChange={handleFileChange}
                            />
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full p-3 bg-white dark:bg-black/20 border border-dashed border-amber-300 dark:border-amber-500/30 rounded-xl text-amber-700 dark:text-amber-300 text-sm hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors flex items-center justify-center gap-2"
                            >
                                <Upload size={16} /> {attachmentName || "Attach PDF"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* D. LOCATION */}
            <div className="mb-6">
                 <Input 
                     label="Physical Location"
                     value={location}
                     onChange={(e) => setLocation(e.target.value)}
                     placeholder="Building, Floor, Room No."
                     icon={MapPin}
                 />
            </div>

            {/* E. JUSTIFICATION & REMARKS (Moved back inside item creation) */}
            <div className="space-y-6 mb-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Operational Justification</label>
                    <textarea 
                        value={justification}
                        onChange={(e) => setJustification(e.target.value)}
                        placeholder="Explain the operational necessity for this request..."
                        className="w-full h-24 p-3 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-sm resize-none"
                    />
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Remarks (If Any)</label>
                    <textarea 
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Additional notes..."
                        className="w-full h-20 p-3 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-sm resize-none"
                    />
                </div>
            </div>

            <Button 
                onClick={handleAddItem}
                disabled={!justification || !location || (caseType === 'RENEWAL' && !lastValidDate)}
                fullWidth
                className="py-3 text-sm shadow-xl shadow-blue-500/20"
            >
                <Plus size={18} className="mr-2" /> Add Asset to Queue
            </Button>
        </Card>
        
        {/* 3. ADDED ITEMS TABLE (Full Width) */}
        {items.length > 0 && (
            <Card className="mb-8 overflow-hidden" noPadding>
                <div className="p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText size={18} /> Request Items Queue
                    </h3>
                    <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-lg">
                        {items.length} Ready
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                            <tr>
                                <th className="p-4">Type</th>
                                <th className="p-4">Item Details</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">Justification</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${
                                            item.requestType === 'INTERNET' 
                                            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/20' 
                                            : 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/20'
                                        }`}>
                                            {item.requestType === 'INTERNET' ? 'NET' : 'NON-NET'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-900 dark:text-white">{item.pcType}</div>
                                        <div className="text-xs text-slate-500">Qty: {item.quantity} • {item.duration}</div>
                                        {item.caseType === 'RENEWAL' && (
                                            <div className="text-[10px] text-amber-600 mt-1 flex items-center gap-1 font-bold">
                                                <RefreshCw size={10} /> Renewal
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 text-slate-700 dark:text-slate-300">
                                        {item.location}
                                    </td>
                                    <td className="p-4">
                                        <div className="max-w-xs truncate text-slate-700 dark:text-slate-300 font-medium">
                                            "{item.justification}"
                                        </div>
                                        {item.remarks && <div className="text-xs text-slate-500 mt-1 truncate max-w-xs">Note: {item.remarks}</div>}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        )}

        {/* 4. QUESTIONNAIRE SECTION */}
        <div className="border-t border-b border-slate-100 dark:border-white/10 py-8 mb-8">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <HelpCircle size={20} className="text-slate-400" /> 
                Technical Compliance Check
                <span className="text-xs font-normal text-slate-500 ml-2">({requestType === 'INTERNET' ? 'Internet' : 'Standalone'} Standards)</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-100 dark:border-white/5">
                {activeQuestions.map((q) => (
                    <div key={q.id}>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">
                            {q.label}
                        </label>
                        <textarea
                            value={answers[q.id]}
                            onChange={(e) => updateAnswer(q.id, e.target.value)}
                            placeholder={q.placeholder}
                            className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 transition-all duration-200 ease-in-out outline-none resize-none h-20"
                        />
                    </div>
                ))}
            </div>
        </div>

        {/* 6. FINAL ACTION FOOTER */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 print:hidden">
            <Button onClick={handleReset} variant="outline" className="text-slate-600 dark:text-slate-300 border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">
                <RefreshCw size={18} className="mr-2" /> Reset Form
            </Button>
            <Button onClick={handlePrint} variant="outline" className="text-slate-600 dark:text-slate-300 border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">
                <Printer size={18} className="mr-2" /> Print
            </Button>
            <Button onClick={handleSubmit} disabled={items.length === 0 || !isRouteAvailable} className="bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/30 px-8">
                {!isRouteAvailable ? 'Route Unavailable' : 'Submit Dispensation Request'}
            </Button>
        </div>

    </div>
  );
};

export default DispensationRequest;
