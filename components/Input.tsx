
import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  sublabel?: string;
  error?: string;
  icon?: React.ElementType;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  sublabel, 
  error, 
  type = 'text', 
  icon: Icon, 
  className = '', 
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-1.5 ml-1">
        {label && (
            <label className="block text-xs font-bold text-slate-500 uppercase">
            {label}
            </label>
        )}
        {sublabel && (
            <span className="text-[10px] text-slate-400 italic opacity-80">{sublabel}</span>
        )}
      </div>
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon size={16} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={`
            w-full bg-slate-50 dark:bg-black/20 border text-slate-900 dark:text-white placeholder-slate-400 text-sm rounded-xl 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3
            transition-all duration-200 ease-in-out outline-none
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'}
            
            /* Date Picker Styling */
            [color-scheme:light] dark:[color-scheme:dark]
            [&::-webkit-calendar-picker-indicator]:cursor-pointer
            [&::-webkit-calendar-picker-indicator]:opacity-50
            hover:[&::-webkit-calendar-picker-indicator]:opacity-100
            dark:[&::-webkit-calendar-picker-indicator]:invert
            
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            tabIndex={-1} // Prevent tabbing to this button before input
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 ml-1 flex items-center gap-1 animate-pulse">
           {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default React.memo(Input);
