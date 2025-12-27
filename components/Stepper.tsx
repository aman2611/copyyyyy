import React from 'react';
import { CheckCircle, Lock, Circle } from 'lucide-react';

export interface Step {
  id?: string;
  label: string;      // Main bold text (e.g. Role)
  subLabel?: string;  // Secondary text (e.g. Name)
  status: 'completed' | 'current' | 'pending' | 'locked';
  icon?: React.ReactNode; 
  tooltip?: React.ReactNode; // Hover content
}

interface StepperProps {
  steps: Step[];
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({ steps, className = '' }) => {
  return (
    <div className={`relative pb-6 pt-2 overflow-x-auto custom-scrollbar ${className}`}>
      <div className="flex items-start min-w-max px-4">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center group relative min-w-[140px]">
              
              {/* Connector Line (Left) */}
              {index > 0 && (
                <div className={`absolute top-4 -left-[70px] w-[140px] h-0.5 -z-10 transition-colors duration-500 ${
                  step.status === 'completed' || (step.status === 'current' && steps[index-1].status === 'completed') 
                  ? 'bg-green-500' 
                  : 'bg-slate-200 dark:bg-slate-700'
                }`}></div>
              )}

              {/* Circle Node */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-all duration-300 relative cursor-help
                ${step.status === 'completed' ? 'bg-green-500 border-green-500 text-white' : 
                  step.status === 'current' ? 'bg-white dark:bg-slate-800 border-blue-500 text-blue-500 shadow-lg shadow-blue-500/20 scale-110' : 
                  step.status === 'locked' ? 'bg-slate-700 border-slate-700 text-slate-300' :
                  'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600'}
              `}>
                {step.icon ? step.icon : (
                   step.status === 'completed' ? <CheckCircle size={16} /> : 
                   step.status === 'current' ? <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div> :
                   step.status === 'locked' ? <Lock size={12} /> :
                   <span className="text-xs font-bold">{index + 1}</span>
                )}

                {/* Tooltip - Absolute positioned relative to the circle (Below) */}
                {step.tooltip && (
                    <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-56 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[100] border border-slate-600/50 transform scale-95 group-hover:scale-100 origin-top">
                        {step.tooltip}
                        {/* Arrow pointing up */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-800 dark:border-b-slate-700"></div>
                    </div>
                )}
              </div>

              {/* Labels */}
              <div className="text-center mt-3 w-full px-2">
                <p className={`text-xs font-bold truncate transition-colors ${
                    step.status === 'current' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {step.label}
                </p>
                {step.subLabel && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                        {step.subLabel}
                    </p>
                )}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;