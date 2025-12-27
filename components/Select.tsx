
import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ElementType;
  options?: (SelectOption | string)[]; // Supports objects or simple strings
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ 
  label, 
  error, 
  icon: Icon, 
  options = [], 
  className = '', 
  children, 
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon size={16} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
        )}
        <select
          ref={ref}
          className={`
            w-full bg-slate-50 dark:bg-black/20 border text-slate-900 dark:text-white text-sm rounded-xl 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 appearance-none cursor-pointer
            transition-all duration-200 ease-in-out outline-none
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'}
            ${className}
          `}
          {...props}
        >
          {options.length > 0 ? (
            options.map((opt, idx) => {
              const isString = typeof opt === 'string';
              const value = isString ? opt : opt.value;
              const label = isString ? opt : opt.label;
              return <option key={idx} value={value}>{label}</option>;
            })
          ) : (
            children
          )}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
          <ChevronDown size={16} />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 ml-1 flex items-center gap-1 animate-pulse">
           {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default React.memo(Select);
