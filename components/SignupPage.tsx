
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Input from './Input';
import Button from './Button';
import Loader from './Loader';
import Footer from './Footer';
import { CheckCircle, Anchor, ArrowRight, Lock, Sun, Moon, Shield, Fingerprint } from 'lucide-react';
import { useTheme } from '../App';

interface SignupPageProps {
  onLogin: (username: string) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onLogin }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
        toast.error('Authentication check failed.');
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast.success('Identity Verified.');
      setTimeout(() => {
        onLogin(formData.username);
      }, 1200);
    }, 2200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-inter transition-all duration-700">
      
      {/* Background Image Container */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1517420704952-d9f39717c6fe?q=80&w=2800&auto=format&fit=crop')`,
        }}
      >
        {/* Overlays for readability */}
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-slate-950/80' : 'bg-slate-900/60'} backdrop-blur-sm transition-colors duration-700`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
      </div>
      
      {isLoading && (
        <Loader fullScreen text="AUTHENTICATING" subtext="Verifying Command Credentials..." />
      )}

      {/* Persistent Brand Header at the Top */}
      <div className="absolute top-0 left-0 right-0 p-8 md:p-12 z-20 flex justify-between items-start animate-fade-in-down">
        <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 backdrop-blur-xl transition-all hover:scale-110 active:scale-95 border border-white/20">
                <Anchor className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-[0.2em] text-white drop-shadow-2xl">
                HORIZON
              </h1>
              <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-blue-400 mt-1">Secure Command Interface</p>
            </div>
        </div>
        
        <button 
          onClick={toggleTheme}
          className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all shadow-xl group"
        >
          {isDarkMode ? <Sun size={24} className="group-hover:rotate-45 transition-transform" /> : <Moon size={24} className="group-hover:-rotate-12 transition-transform" />}
        </button>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[480px] px-6 mt-12 animate-fade-in-up">
        <div className="
          relative group
          backdrop-blur-xl 
          bg-white/10 dark:bg-slate-900/40
          border border-white/20
          shadow-[0_40px_100px_-15px_rgba(0,0,0,0.5)]
          rounded-[3rem] 
          overflow-hidden 
          transition-all duration-500 
          hover:scale-[1.01]
        ">
          {/* Top Decorative Light Leak */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/80 to-transparent"></div>

          {isSuccess ? (
            <div className="p-16 flex flex-col items-center text-center min-h-[400px] justify-center">
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 text-emerald-400 animate-bounce shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-emerald-500/30">
                <CheckCircle size={56} />
              </div>
              <h2 className="text-3xl font-black text-white mb-3">Identity Verified</h2>
              <p className="text-blue-100/70 font-medium">Establishing secure connection...</p>
            </div>
          ) : (
            <div className="p-10 md:p-12">
              <div className="mb-12 text-center md:text-left">
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Login</h2>
                <p className="text-blue-200/60 font-bold uppercase tracking-widest text-[10px]">Command Level Authorization Required</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                    <Input
                        label="Service ID"
                        name="username"
                        placeholder="e.g. ADM.DOE"
                        value={formData.username}
                        onChange={handleChange}
                        error={errors.username}
                        className="!bg-black/20 !border-white/10 !text-white !placeholder-white/30 !py-4 rounded-2xl focus:!ring-blue-500/50"
                        icon={Shield}
                    />

                    <Input
                        label="Security Passcode"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        className="!bg-black/20 !border-white/10 !text-white !placeholder-white/30 !py-4 rounded-2xl focus:!ring-blue-500/50"
                        icon={Lock}
                    />
                </div>

                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.1em]">
                    <label className="flex items-center gap-3 cursor-pointer text-blue-200/60 hover:text-blue-400 transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded-lg border-white/20 bg-transparent text-blue-500 focus:ring-blue-500" />
                        Remember Device
                    </label>
                    <a href="#" className="text-blue-400 hover:text-white hover:underline transition-colors">Forgot Access?</a>
                </div>

                <Button 
                    type="submit" 
                    variant="primary" 
                    fullWidth 
                    loading={isLoading}
                    className="bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-500/40 py-5 font-black uppercase tracking-widest rounded-2xl group overflow-hidden relative border-none"
                >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        Authenticate <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_100%] animate-gradient-x opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Diagnostic Status Pill */}
        <div className="mt-12 flex justify-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
             <div className="flex items-center gap-6 px-10 py-5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl group cursor-default">
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
                    <span className="text-[11px] font-black text-blue-100 uppercase tracking-widest">Network Secure</span>
                 </div>
                 <div className="w-px h-5 bg-white/10"></div>
                 <p className="text-[10px] font-bold text-blue-200/50 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                    <Fingerprint size={16} /> BIOMETRICS ACTIVE
                 </p>
             </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SignupPage;
