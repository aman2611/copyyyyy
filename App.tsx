
import React, { useState, createContext, useContext, useEffect, useMemo, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import Launchpad from './components/Launchpad';
import CommandPalette from './components/CommandPalette';
import RequestDetails from './components/RequestDetails';
import { getDashboardRoutes, FallbackRouteElement } from './utils/routes';
import { UserRole, MenuItem, UserData } from './utils/types';
import { INITIAL_USERS, MENUS_LOGISTICS, MENUS_PERSONNEL, MENUS_FACILITIES, MENUS_CYBER, MENUS_FLEET, MODULE_CONFIGS } from './utils/constants';

// Theme Context Definition
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

// Re-export types
export type { UserRole, MenuItem, UserData }; 

export type WorkflowStatus = Record<string, boolean>;

const AUTH_TOKEN_KEY = 'horizon_auth_token';
const AUTH_USER_KEY = 'horizon_username';

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('NORMAL_USER');
  const [userId, setUserId] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [allUsers, setAllUsers] = useState<UserData[]>(INITIAL_USERS);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  const [logisticsMenus, setLogisticsMenus] = useState<MenuItem[]>(MENUS_LOGISTICS);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  
  // Central Navigation State
  const [navContext, setNavContext] = useState<{ workflow: string; subMenu?: string; childId?: string }>({
      workflow: 'home',
      subMenu: '',
      childId: ''
  });
  
  const [isCmdPaletteOpen, setIsCmdPaletteOpen] = useState(false);

  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>({
    'laptop-request': true,
    'dispensation': true,
    'nws-policy': true
  });

  // --- NAVIGATION HANDLERS ---

  // 1. Core Navigation Function - Updates State & URL
  const handleNavigate = useCallback((menuId: string, subItem?: string, childItem?: string) => {
    if (!activeModuleId) return;

    setNavContext({
        workflow: menuId,
        subMenu: subItem || '',
        childId: childItem || ''
    });

    // Update Browser URL: /moduleId/workflow/subMenu/childId
    const urlParts = [activeModuleId, menuId, subItem, childItem].filter(Boolean);
    const url = `/${urlParts.join('/')}`;
    window.history.pushState({}, '', url);
  }, [activeModuleId]);

  // 2. Module Switcher
  const handleSelectModule = useCallback((moduleId: string, context?: { workflow: string; subMenu?: string }) => {
    if (!moduleId) {
      setActiveModuleId(null);
      setNavContext({ workflow: 'home', subMenu: '', childId: '' });
      window.history.pushState({}, '', '/');
      return;
    }
    
    setActiveModuleId(moduleId);
    const newContext = context ? { ...context, childId: '' } : { workflow: 'home', subMenu: '', childId: '' };
    setNavContext(newContext);

    const url = `/${moduleId}/${newContext.workflow}${newContext.subMenu ? `/${newContext.subMenu}` : ''}`;
    window.history.pushState({}, '', url);
  }, []);

  // 3. Browser Back/Forward Listener
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const parts = path.split('/').filter(Boolean);
      
      if (parts.length > 0) {
        const moduleId = parts[0];
        // Check if valid module
        if (MODULE_CONFIGS.some(m => m.id === moduleId)) {
            setActiveModuleId(moduleId);
            setNavContext({
                workflow: parts[1] || 'home',
                subMenu: parts[2] || '',
                childId: parts[3] || ''
            });
        } else {
            // Invalid module, reset to launchpad
            setActiveModuleId(null);
        }
      } else {
        // Root path
        setActiveModuleId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState(); // Initial check
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // --- DATA HELPERS ---

  const handleUpdateUserRole = useCallback((userId: string, newRole: UserRole) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  }, []);

  const handleAddUser = useCallback((userData: Partial<UserData>) => {
      const newUser: UserData = {
          id: `usr-${Date.now()}`,
          username: userData.username || 'New User',
          email: userData.email || 'user@navy.mil',
          role: userData.role || 'NORMAL_USER',
          unit: userData.unit || 'HQ',
          rank: userData.rank || 'Ensign',
          status: 'Active',
          serviceYears: 0,
          designation: userData.designation || 'Staff',
          serviceNumber: userData.serviceNumber || `USN-${Math.floor(Math.random()*1000)}`,
          phone: userData.phone || '',
          clearanceLevel: userData.clearanceLevel || 'SECRET',
          dateOfJoining: userData.dateOfJoining || new Date().toISOString().split('T')[0],
          dateOfSeniority: userData.dateOfSeniority || new Date().toISOString().split('T')[0],
          dateOfRetirement: userData.dateOfRetirement || new Date(new Date().setFullYear(new Date().getFullYear() + 20)).toISOString().split('T')[0]
      };
      setAllUsers(prev => [...prev, newUser]);
  }, []);

  const handleDeleteUser = useCallback((userId: string) => {
      setAllUsers(prev => prev.filter(u => u.id !== userId));
  }, []);

  const handleUpdateUserDetails = useCallback((userId: string, updates: Partial<UserData>) => {
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
  }, []);

  const handleUpdateMenu = useCallback((itemId: string, updates: Partial<MenuItem>) => {
      const updateRecursive = (items: MenuItem[]): MenuItem[] => {
          return items.map(item => {
              if (item.id === itemId) return { ...item, ...updates };
              if (item.subItems) return { ...item, subItems: updateRecursive(item.subItems) };
              return item;
          });
      };
      setLogisticsMenus(prev => updateRecursive(prev));
  }, []);

  const handleAddMenu = useCallback((parentId: string | null, newItem: MenuItem) => {
      const itemToAdd = { ...newItem, active: true }; 
      if (parentId === null) {
          setLogisticsMenus(prev => [...prev, itemToAdd]);
          return;
      }
      const addRecursive = (items: MenuItem[]): MenuItem[] => {
          return items.map(item => {
              if (item.id === parentId) return { ...item, subItems: [...(item.subItems || []), itemToAdd] };
              if (item.subItems) return { ...item, subItems: addRecursive(item.subItems) };
              return item;
          });
      };
      setLogisticsMenus(prev => addRecursive(prev));
  }, []);

  const handleRemoveMenu = useCallback((itemId: string) => {
      const removeRecursive = (items: MenuItem[]): MenuItem[] => {
          return items
            .filter(item => item.id !== itemId)
            .map(item => ({
                ...item,
                subItems: item.subItems ? removeRecursive(item.subItems) : []
            }));
      };
      setLogisticsMenus(prev => removeRecursive(prev));
  }, []);

  const toggleWorkflow = useCallback((id: string) => {
    setWorkflowStatus(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // --- THEME & AUTH ---

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => setIsDarkMode(prev => !prev), []);

  const processUserLogin = useCallback((username: string) => {
    const foundUser = allUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (foundUser) {
        setUser(foundUser.username);
        setUserRole(foundUser.role);
        setUserId(foundUser.id);
    } else {
        setUser(username);
        setUserId('999');
        if(username.toLowerCase().includes('super')) setUserRole('SUPER_ADMIN');
        else if(username.toLowerCase().includes('proc')) setUserRole('PROCUREMENT_ADMIN');
        else if(username.toLowerCase().includes('unit')) setUserRole('UNIT_ADMIN');
        else setUserRole('NORMAL_USER');
    }
  }, [allUsers]);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUsername = localStorage.getItem(AUTH_USER_KEY);
    if (token && storedUsername) {
      processUserLogin(storedUsername);
    }
    setIsAuthChecking(false);
  }, [processUserLogin]);

  const handleLogin = useCallback((username: string) => {
    processUserLogin(username);
    const mockToken = btoa(`${Math.random().toString(36).substring(7)}:${username}:${Date.now()}`);
    localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
    localStorage.setItem(AUTH_USER_KEY, username);
  }, [processUserLogin]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
    setUserRole('NORMAL_USER');
    setUserId('');
    setActiveModuleId(null);
    setNavContext({ workflow: 'home', subMenu: '', childId: '' });
    window.history.pushState({}, '', '/');
  }, []);

  const cycleRole = useCallback(() => {
    const roles: UserRole[] = ['NORMAL_USER', 'UNIT_ADMIN', 'PROCUREMENT_ADMIN', 'SUPER_ADMIN'];
    const currentIndex = roles.indexOf(userRole);
    const nextRole = roles[(currentIndex + 1) % roles.length];
    setUserRole(nextRole);
    const mockUser = allUsers.find(u => u.role === nextRole);
    if (mockUser) {
        setUser(mockUser.username);
        setUserId(mockUser.id);
    }
  }, [userRole, allUsers]);

  // --- MENU CALCULATION ---
  const getMenuForModule = (moduleId: string): MenuItem[] => {
    switch(moduleId) {
      case 'logistics': return logisticsMenus;
      case 'personnel': return MENUS_PERSONNEL;
      case 'facilities': return MENUS_FACILITIES;
      case 'cyber': return MENUS_CYBER;
      case 'fleet': return MENUS_FLEET;
      default: return logisticsMenus;
    }
  };

  const currentMenus = useMemo(() => {
    if (!activeModuleId) return [];
    const rawMenus = getMenuForModule(activeModuleId);
    
    const filter = (menus: MenuItem[]): MenuItem[] => {
        return menus
          .filter(item => {
            if (workflowStatus.hasOwnProperty(item.id) && !workflowStatus[item.id]) return false;
            if (item.active === false) return false;
            if (item.allowedUsers && item.allowedUsers.includes(userId)) return true;
            if (!item.roleAccess || item.roleAccess.length === 0) return true;
            return item.roleAccess.includes(userRole);
          })
          .map(item => ({
            ...item,
            subItems: item.subItems ? filter(item.subItems) : []
          }));
    };
    return filter(rawMenus);
  }, [activeModuleId, userRole, userId, workflowStatus, logisticsMenus]);

  // --- ROUTE RESOLUTION ---
  const currentUserData = allUsers.find(u => u.id === userId) || INITIAL_USERS[0];
  const activeModuleConfig = MODULE_CONFIGS.find(m => m.id === activeModuleId);

  const resolveContent = () => {
      // 1. If viewing specific request (childId), render details
      if (navContext.childId) {
          return (
            <RequestDetails 
                requestId={navContext.childId} 
                onBack={() => handleNavigate(navContext.workflow, navContext.subMenu, '')} 
            />
          );
      }

      // 2. Use Route Config to find component
      const dashboardProps = {
          currentModule: activeModuleConfig,
          currentUser: currentUserData,
          allUsers,
          allMenuTree: logisticsMenus,
          workflowStatus,
          onNavigate: handleNavigate,
          onViewRequest: (reqId: string) => handleNavigate(navContext.workflow, navContext.subMenu, reqId),
          onToggleWorkflow: toggleWorkflow,
          onUpdateUserRole: handleUpdateUserRole,
          onAddUser: handleAddUser,
          onDeleteUser: handleDeleteUser,
          onUpdateUserDetails: handleUpdateUserDetails,
          onAddMenu: handleAddMenu,
          onRemoveMenu: handleRemoveMenu,
          onUpdateMenu: handleUpdateMenu,
      };

      const routes = getDashboardRoutes(dashboardProps);
      const parentRoute = routes.find(r => r.path === navContext.workflow);

      if (parentRoute) {
          if (navContext.subMenu && parentRoute.children) {
              const childRoute = parentRoute.children.find(c => c.path === navContext.subMenu);
              if (childRoute) return childRoute.element;
          }
          return parentRoute.element;
      }

      // 3. Fallback
      return FallbackRouteElement('Unknown Module', (path) => handleNavigate(path));
  };

  if (isAuthChecking) return null;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <Toaster position="top-center" toastOptions={{ duration: 4000, className: 'dark:bg-slate-800 dark:text-white dark:border dark:border-white/10 shadow-xl' }} />

        {user && (
          <CommandPalette 
            isOpen={isCmdPaletteOpen}
            onClose={() => setIsCmdPaletteOpen(false)}
            onNavigate={(mod, ctx) => handleSelectModule(mod, ctx)} 
            toggleTheme={toggleTheme} 
            onLogout={handleLogout} 
            isDarkMode={isDarkMode}
          />
        )}

        {!user ? (
           <SignupPage onLogin={handleLogin} />
        ) : !activeModuleId ? (
          <Launchpad 
            user={currentUserData} 
            modules={MODULE_CONFIGS} 
            onSelectModule={handleSelectModule}
            onLogout={handleLogout}
            onOpenCommandPalette={() => setIsCmdPaletteOpen(true)}
          />
        ) : (
          <Dashboard 
            currentModule={activeModuleConfig!} 
            onExitModule={() => handleSelectModule('')}
            activeContext={navContext}
            onNavigate={handleNavigate}
            username={user} 
            role={userRole}
            setRole={setUserRole}
            onCycleRole={cycleRole}
            onLogout={handleLogout}
            menuItems={currentMenus} 
            onOpenCommandPalette={() => setIsCmdPaletteOpen(true)}
          >
              {resolveContent()}
          </Dashboard>
        )}
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
