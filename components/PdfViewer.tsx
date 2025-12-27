import React from 'react';
import { FileText, Download, Printer, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

const PdfViewer: React.FC = () => {
  return (
    <div className="flex flex-col h-[600px] bg-slate-700 rounded-xl overflow-hidden border border-slate-600 shadow-2xl">
      {/* Toolbar */}
      <div className="h-12 bg-slate-800 border-b border-slate-600 flex items-center justify-between px-4 text-gray-300">
        <div className="flex items-center gap-4">
          <FileText size={18} className="text-blue-400" />
          <span className="text-sm font-medium">Laptop_Request_Form_1044.pdf</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-white/10 rounded"><ZoomOut size={16} /></button>
          <span className="text-xs bg-black/30 px-2 py-0.5 rounded">100%</span>
          <button className="p-1.5 hover:bg-white/10 rounded"><ZoomIn size={16} /></button>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-white/10 rounded"><Printer size={18} /></button>
          <button className="p-1.5 hover:bg-white/10 rounded"><Download size={18} /></button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-slate-500/50 p-8 flex justify-center relative">
        {/* Paper Simulation */}
        <div className="w-[595px] h-[842px] bg-white shadow-xl p-12 text-slate-900 text-[10px] leading-relaxed select-none relative">
          <div className="flex justify-between border-b-2 border-slate-900 pb-4 mb-8">
             <div className="font-bold text-xl uppercase tracking-widest">Department of Navy</div>
             <div className="text-right">
                <div>Form 1044-B</div>
                <div>Rev. 2024</div>
             </div>
          </div>
          
          <div className="text-center font-bold text-lg mb-8 uppercase underline">Material Request: IT Equipment</div>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
             <div className="border-b border-dotted border-slate-400 pb-1"><span className="font-bold mr-2">APPLICANT:</span> ADM. J. DOE</div>
             <div className="border-b border-dotted border-slate-400 pb-1"><span className="font-bold mr-2">DATE:</span> {new Date().toLocaleDateString()}</div>
             <div className="border-b border-dotted border-slate-400 pb-1"><span className="font-bold mr-2">UNIT:</span> PACIFIC FLEET COMMAND</div>
             <div className="border-b border-dotted border-slate-400 pb-1"><span className="font-bold mr-2">CLEARANCE:</span> TS // SCI</div>
          </div>

          <div className="mb-6">
             <div className="font-bold mb-2 uppercase">Justification:</div>
             <p className="text-justify">
                Request issuance of mobile computing assets to support remote command and control capabilities. 
                Equipment is required for secure communication and operational planning during upcoming deployment cycles. 
                All usage will adhere to NAVCYBER instructions 5500.2 and 3000.1 regarding information assurance.
             </p>
          </div>

          <div className="mt-auto pt-12 border-t border-slate-300">
             <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                   <div className="h-12 border-b border-slate-900 mb-2"></div>
                   <div>APPLICANT SIGNATURE</div>
                </div>
                <div>
                   <div className="h-12 border-b border-slate-900 mb-2"></div>
                   <div>CO / OIC APPROVAL</div>
                </div>
                <div>
                   <div className="h-12 border-b border-slate-900 mb-2"></div>
                   <div>ISSUING OFFICER</div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Footer / Page Nav */}
      <div className="h-10 bg-slate-800 border-t border-slate-600 flex items-center justify-center gap-4 text-gray-400">
         <button className="hover:text-white"><ChevronLeft size={16} /></button>
         <span className="text-xs">Page 1 of 1</span>
         <button className="hover:text-white"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
};

export default PdfViewer;