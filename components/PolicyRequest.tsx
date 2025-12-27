
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  ShieldCheck, Printer, RefreshCw, Save, CheckCircle, 
  User, Briefcase, Hash, Shield, Calendar, 
  Globe, Disc, Usb, AlertTriangle, Lock, Network, MapPin
} from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Card from './Card';
import Stepper, { Step } from './Stepper';
import { UserData } from '../utils/types';

interface PolicyRequestProps {
  user: UserData;
}

const PolicyRequest: React.FC<PolicyRequestProps> = ({ user }) => {
  // Form State
  const [networkName, setNetworkName] = useState('');
  const [vcnsDate, setVcnsDate] = useState('');
  const [existingPorts, setExistingPorts] = useState<number>(0);
  
  // Checkboxes
  const [openCD, setOpenCD] = useState(false);
  const [openUSB, setOpenUSB] = useState(false);
  
  const [duration, setDuration] = useState('');
  const [justification, setJustification] = useState('');
  const [sanitizationMedia, setSanitizationMedia] = useState('');
  const [osPatchDate, setOsPatchDate] = useState('');
  const [avUpdateDate, setAvUpdateDate] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Stepper Config
  const steps: Step[] = [
    { label: 'Initiator', subLabel: user.username, status: 'current', tooltip: 'Request Initiation' },
    { label: 'Security', subLabel: 'ISO/CSO', status: 'pending', tooltip: 'Information Security Officer' },
    { label: 'Review', subLabel: 'HOD', status: 'pending', tooltip: 'Head of Department' },
    { label: 'Approval', subLabel: 'CO', status: 'pending', tooltip: 'Commanding Officer' },
    { label: 'Action', subLabel: 'Signal Officer', status: 'pending', tooltip: 'Port Configuration' }
  ];

  const handleReset = () => {
    setNetworkName('');
    setVcnsDate('');
    setExistingPorts(0);
    setOpenCD(false);
    setOpenUSB(false);
    setDuration('');
    setJustification('');
    setSanitizationMedia('');
    setOsPatchDate('');
    setAvUpdateDate('');
    setIsSubmitted(false);
    toast.success('Form Reset');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = () => {
    // Validation
    if (
        !networkName.trim() || 
        !vcnsDate || 
        !duration || 
        !justification.trim() || 
        !sanitizationMedia.trim() || 
        !osPatchDate || 
        !avUpdateDate
    ) {
        toast.error('All fields are required.');
        return;
    }

    if (!openCD && !openUSB) {
        toast.error('Please select at least one port type to open (CD or USB).');
        return;
    }

    setIsSubmitted(true);
    toast.success('NWS Policy Request Submitted');
  };

  if (isSubmitted) {
      return (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-12 print:max-w-full print:p-0">
              <div className="bg-white dark:bg-slate-900 border border-green-200 dark:border-green-500/20 rounded-3xl p-12 text-center relative overflow-hidden shadow-sm print:border-none print:shadow-none">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 print:hidden"></div>
                  <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400 shadow-lg shadow-green-500/10 print:hidden">
                      <CheckCircle size={48} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 print:text-black">Request Submitted Successfully</h2>
                  <p className="text-slate-500 dark:text-gray-400 max-w-lg mx-auto mb-8 print:hidden">
                      Your request for port opening has been forwarded for security vetting. 
                      <br/>Reference <strong>#NWS-{Date.now().toString().slice(-5)}</strong>
                  </p>
                  
                  {/* Print Preview Summary */}
                  <div className="text-left bg-slate-50 dark:bg-white/5 p-8 rounded-2xl border border-slate-200 dark:border-white/10 mt-6 print:bg-white print:border-black">
                      <h3 className="font-bold text-xl mb-6 border-b border-slate-200 pb-4 text-slate-900 dark:text-white print:text-black">Request Summary</h3>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                          <div>
                              <span className="block text-xs font-bold text-slate-400 uppercase">Applicant</span>
                              <span className="font-medium text-slate-900 dark:text-white print:text-black">{user.username}</span>
                          </div>
                          <div>
                              <span className="block text-xs font-bold text-slate-400 uppercase">Network</span>
                              <span className="font-medium text-slate-900 dark:text-white print:text-black">{networkName}</span>
                          </div>
                          <div>
                              <span className="block text-xs font-bold text-slate-400 uppercase">Ports Requested</span>
                              <span className="font-medium text-slate-900 dark:text-white print:text-black">{[openCD && 'CD/DVD', openUSB && 'USB'].filter(Boolean).join(', ')}</span>
                          </div>
                          <div>
                              <span className="block text-xs font-bold text-slate-400 uppercase">Duration</span>
                              <span className="font-medium text-slate-900 dark:text-white print:text-black">{duration} Days</span>
                          </div>
                          <div className="col-span-2">
                              <span className="block text-xs font-bold text-slate-400 uppercase">Justification</span>
                              <span className="font-medium text-slate-900 dark:text-white print:text-black">{justification}</span>
                          </div>
                      </div>
                  </div>

                  <div className="flex justify-center gap-4 mt-10 print:hidden">
                      <Button onClick={() => setIsSubmitted(false)} variant="outline" className="text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10">
                          Submit Another
                      </Button>
                      <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-500 text-white">
                          <Printer size={18} className="mr-2" /> Print Request
                      </Button>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="animate-fade-in-up max-w-5xl mx-auto pb-12 print:max-w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 print:hidden">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">NWS Policy Access</h2>
                <p className="text-slate-500 dark:text-gray-400 mt-1">Application for Port Opening & Media Authorization</p>
            </div>
        </div>

        {/* 1. ROUTE VISUALIZATION */}
        <Card className="mb-8 overflow-hidden print:hidden">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                <MapPin size={16} className="text-blue-500" /> Approval Route
            </h3>
            <div className="px-2">
               <Stepper steps={steps} />
            </div>
        </Card>

        {/* 2. USER DETAILS (READ ONLY PROFILE) */}
        <Card className="mb-8 bg-slate-50/80 dark:bg-slate-900/50 border-slate-200 dark:border-white/10 print:bg-white print:border-black">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200 dark:border-white/10">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                    <User size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Applicant Information</h3>
                    <p className="text-xs text-slate-500">Official Service Record Details</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Input 
                    label="Name" 
                    value={user.username} 
                    disabled 
                    icon={User}
                    className="bg-slate-100 dark:bg-black/20 opacity-75 font-semibold text-slate-700 dark:text-slate-200"
                />
                <Input 
                    label="Service No (P.No)" 
                    value={user.serviceNumber || 'N/A'} 
                    disabled 
                    icon={Hash}
                    className="bg-slate-100 dark:bg-black/20 opacity-75 font-semibold text-slate-700 dark:text-slate-200"
                />
                <Input 
                    label="Designation" 
                    value={user.designation || 'N/A'} 
                    disabled 
                    icon={Briefcase}
                    className="bg-slate-100 dark:bg-black/20 opacity-75 font-semibold text-slate-700 dark:text-slate-200"
                />
                <Input 
                    label="Command / Unit" 
                    value={user.unit} 
                    disabled 
                    icon={Shield}
                    className="bg-slate-100 dark:bg-black/20 opacity-75 font-semibold text-slate-700 dark:text-slate-200"
                />
            </div>
        </Card>

        {/* 3. REQUEST FORM */}
        <Card className="shadow-lg border-t-4 border-t-blue-500">
            <div className="flex items-center gap-2 mb-8">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Technical Requirements</h3>
                    <p className="text-xs text-slate-500">Network Security & Port Configuration</p>
                </div>
            </div>

            <div className="space-y-8">
                
                {/* A. Network Details */}
                <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                        <Network size={16} /> System & Network Configuration
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                        <Input 
                            label="Name of Applicant"
                            value={user.username}
                            readOnly 
                            className="bg-white dark:bg-black/40 cursor-not-allowed"
                        />
                        <Input 
                            label="Name of SM Network"
                            placeholder="e.g. NIPRNET, SIPRNET, Standalone"
                            value={networkName}
                            onChange={(e) => setNetworkName(e.target.value)}
                            icon={Globe}
                            className="bg-white dark:bg-black/40"
                        />
                        <Input 
                            type="date"
                            label="Date of VCNS Dispensation"
                            sublabel="(for SM/Standalone Network)"
                            value={vcnsDate}
                            onChange={(e) => setVcnsDate(e.target.value)}
                            className="bg-white dark:bg-black/40"
                        />
                        <Input 
                            type="number"
                            label="No. of Ports Already Opened"
                            min={0}
                            value={existingPorts}
                            onChange={(e) => setExistingPorts(parseInt(e.target.value) || 0)}
                            icon={Hash}
                            className="bg-white dark:bg-black/40"
                        />
                    </div>
                </div>

                {/* B. Security Compliance */}
                <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                        <Lock size={16} /> Security Compliance
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-3">
                            <Input 
                                label="Sanitisation Media Used"
                                placeholder="e.g. Kiosk, Dedicated Scanning Station"
                                value={sanitizationMedia}
                                onChange={(e) => setSanitizationMedia(e.target.value)}
                                icon={Shield}
                            />
                        </div>
                        <Input 
                            type="date"
                            label="OS Patch Updated On"
                            value={osPatchDate}
                            onChange={(e) => setOsPatchDate(e.target.value)}
                        />
                        <Input 
                            type="date"
                            label="Antivirus Updated On"
                            value={avUpdateDate}
                            onChange={(e) => setAvUpdateDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* C. Port Configuration (Redesigned) */}
                <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                        <ShieldCheck size={16} /> Port Access Request
                    </h4>
                    
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            {/* CD Toggle */}
                            <div 
                                onClick={() => setOpenCD(!openCD)}
                                className={`cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all ${openCD ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-500/50' : 'bg-white border-slate-200 dark:bg-white/5 dark:border-white/10 hover:border-slate-300'}`}
                            >
                                <div className={`p-2 rounded-full ${openCD ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-400'}`}>
                                    <Disc size={20} />
                                </div>
                                <span className={`text-sm font-bold ${openCD ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>CD / DVD</span>
                            </div>

                            {/* USB Toggle */}
                            <div 
                                onClick={() => setOpenUSB(!openUSB)}
                                className={`cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all ${openUSB ? 'bg-purple-50 border-purple-500 dark:bg-purple-900/20 dark:border-purple-500/50' : 'bg-white border-slate-200 dark:bg-white/5 dark:border-white/10 hover:border-slate-300'}`}
                            >
                                <div className={`p-2 rounded-full ${openUSB ? 'bg-purple-500 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-400'}`}>
                                    <Usb size={20} />
                                </div>
                                <span className={`text-sm font-bold ${openUSB ? 'text-purple-700 dark:text-purple-300' : 'text-slate-600 dark:text-slate-400'}`}>USB Port</span>
                            </div>
                        </div>

                        {/* Duration Input */}
                        <div className="w-full lg:w-1/3">
                            <Input 
                                label="Required Duration (Days)"
                                type="number"
                                min={1}
                                placeholder="e.g. 30"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                icon={Calendar}
                                className="h-[76px]" // Matches height of the toggle cards (approx)
                            />
                        </div>
                    </div>
                </div>

                {/* D. Warning Box */}
                <div className="flex items-start gap-4 p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl text-amber-800 dark:text-amber-200 text-sm">
                    <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg shrink-0">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <h5 className="font-bold mb-1">Security Warning</h5>
                        <p className="opacity-90 leading-relaxed">
                            Unauthorized data transfer is a punishable offense. Ensure all media is scanned before connection. By submitting, you certify that the device is compliant with latest security policies.
                        </p>
                    </div>
                </div>

                {/* E. Justification (Moved to Bottom) */}
                <div className="pt-6 border-t border-slate-100 dark:border-white/10">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Operational Justification</label>
                    <textarea 
                        value={justification}
                        onChange={(e) => setJustification(e.target.value)}
                        placeholder="Detailed explanation of why these ports are required for mission critical tasks..."
                        className="w-full h-32 p-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-sm resize-none transition-all focus:bg-white dark:focus:bg-black/40"
                    />
                </div>

            </div>
        </Card>

        {/* 4. ACTION FOOTER */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 print:hidden">
            <Button onClick={handleReset} variant="outline" className="text-slate-600 dark:text-slate-300 border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">
                <RefreshCw size={18} className="mr-2" /> Reset Form
            </Button>
            <Button onClick={handlePrint} variant="outline" className="text-slate-600 dark:text-slate-300 border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">
                <Printer size={18} className="mr-2" /> Print
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/30 px-8">
                <Save size={18} className="mr-2" /> Submit Request
            </Button>
        </div>

    </div>
  );
};

export default PolicyRequest;
