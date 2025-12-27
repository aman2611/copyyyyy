
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumb from './Breadcrumb';
import { ArrowLeft, Menu } from 'lucide-react';
import { UserRole, MenuItem, UserData } from '../utils/types';

interface DashboardLayoutProps {
  // Layout State
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // User / Header Data
  username: string;
  role: UserRole;
  onToggleRole: () => void;
  onLogout: () => void;
  onOpenCommandPalette: () => void;

  // Navigation Data
  menuItems: MenuItem[];
  onNavigate: (menuId: string, subItem?: string, childItem?: string) => void;
  activeContext: { menuId: string; subId: string; childId: string };
  moduleName: string;
  onSwitchApp: () => void;

  // Page Specifics
  title: string;
  breadcrumbs: string[];
  showBackButton?: boolean;
  onBack?: () => void;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileMenuOpen,
  setMobileMenuOpen,
  username,
  role,
  onToggleRole,
  onLogout,
  onOpenCommandPalette,
  menuItems,
  onNavigate,
  activeContext,
  moduleName,
  onSwitchApp,
  title,
  breadcrumbs,
  showBackButton,
  onBack,
  children
}) => {
  
  const handleMenuToggle = () => {
    if (window.innerWidth < 768) setMobileMenuOpen(!mobileMenuOpen);
    else setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden font-inter transition-colors duration-300">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={onLogout}
        menuItems={menuItems}
        onNavigate={onNavigate}
        activeContext={activeContext}
        moduleName={moduleName} 
        onSwitchApp={onSwitchApp} 
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ml-0 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-72'}`}>
        <Header 
          username={username} 
          collapsed={sidebarCollapsed}
          onMenuClick={handleMenuToggle}
          role={role}
          onToggleRole={onToggleRole}
          onLogout={onLogout}
          onNavigate={onNavigate}
          onOpenCommandPalette={onOpenCommandPalette}
        />

        <main className="flex-1 pt-24 px-4 md:px-8 pb-12 overflow-y-auto custom-scrollbar">
          <div className="mb-8 animate-fade-in-up">
            <div className="mb-2 hidden md:block">
                <Breadcrumb items={breadcrumbs} />
            </div>
            <div className="flex items-center gap-4">
              {showBackButton && onBack && (
                <button 
                  onClick={onBack} 
                  className="p-2 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shadow-sm text-slate-700 dark:text-white"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight truncate uppercase tracking-[0.05em]">
                  {title}
              </h1>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
