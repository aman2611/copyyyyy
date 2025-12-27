
import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { UserRole, MenuItem, UserData, ModuleConfig } from '../utils/types';

interface DashboardProps {
  currentModule: ModuleConfig;
  onExitModule: () => void;
  // Navigation context is now passed for highlighting, but routing is done by parent
  activeContext: { workflow: string; subMenu?: string; childId?: string };
  onNavigate: (menuId: string, subItem?: string, childItem?: string) => void;
  
  username: string;
  role: UserRole;
  setRole: (role: UserRole) => void;
  onCycleRole: () => void;
  onLogout: () => void;
  onOpenCommandPalette: () => void;
  
  menuItems: MenuItem[];
  // Children will be the resolved route content from App.tsx
  children: React.ReactNode; 
  
  // Breadcrumbs/Title are calculated here or passed? 
  // Let's calculate common UI stuff here to keep App.tsx clean, 
  // but strictly speaking, the title changes with the route.
  // For simplicity, let's keep title generation here based on activeContext.
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { 
    currentModule, activeContext, menuItems, children, onNavigate
  } = props;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- Title & Breadcrumbs Logic ---
  const getBreadcrumbs = () => {
    const crumbs = [currentModule.title]; 
    if (activeContext.workflow !== 'home') {
       if (activeContext.workflow === 'global-settings') crumbs.push('Settings');
       else {
           const menu = menuItems.find(m => m.id === activeContext.workflow);
           if (menu) crumbs.push(menu.label);
       }
      if (activeContext.subMenu) {
        const menu = menuItems.find(m => m.id === activeContext.workflow);
        const sub = menu?.subItems?.find(s => s.id === activeContext.subMenu);
        if (sub) crumbs.push(sub.label);
      }
      if (activeContext.childId) {
        crumbs.push(`Request #${activeContext.childId}`);
      }
    }
    return crumbs;
  };

  const getPageTitle = () => {
      if (activeContext.workflow === 'home') return 'Strategic Overview';
      if (activeContext.workflow === 'global-settings') return 'System Configuration';
      if (activeContext.childId) return 'Request Details';
      const menu = menuItems.find(m => m.id === activeContext.workflow);
      if (menu) {
          if (activeContext.subMenu) {
              const sub = menu.subItems?.find(s => s.id === activeContext.subMenu);
              return sub?.label || menu.label;
          }
          return menu.label;
      }
      return 'Tactical Module';
  };

  return (
    <DashboardLayout
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        username={props.username}
        role={props.role}
        onToggleRole={props.onCycleRole}
        onLogout={props.onLogout}
        onOpenCommandPalette={props.onOpenCommandPalette}
        menuItems={menuItems}
        onNavigate={onNavigate}
        activeContext={{ 
            menuId: activeContext.workflow, 
            subId: activeContext.subMenu || '', 
            childId: activeContext.childId 
        }}
        moduleName={currentModule.title}
        onSwitchApp={props.onExitModule}
        title={getPageTitle()}
        breadcrumbs={getBreadcrumbs()}
        showBackButton={!!activeContext.childId || activeContext.workflow !== 'home'}
        onBack={activeContext.childId 
            ? () => onNavigate(activeContext.workflow, activeContext.subMenu, '') 
            : () => onNavigate('home')
        }
    >
        {children}
    </DashboardLayout>
  );
};

export default Dashboard;
