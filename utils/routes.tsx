
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import DashboardHome from '../components/DashboardHome';
import LaptopRequest, { LaptopHome } from '../components/LaptopRequest';
import DispensationRequest from '../components/DispensationRequest';
import PolicyRequest from '../components/PolicyRequest';
import UserManagement from '../components/UserManagement';
import PageManagement from '../components/PageManagement';
import SettingsPage from '../components/SettingsPage';
import PersonnelRecords from '../components/PersonnelRecords';
import Inbox from '../components/Inbox';
import NotFoundPage from '../components/NotFoundPage';

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
}

export const getDashboardRoutes = (props: any): RouteConfig[] => [
  {
    path: 'home',
    element: <DashboardHome 
        currentModule={props.currentModule}
        workflowStatus={props.workflowStatus}
        onNavigate={props.onNavigate}
    />
  },
  {
    path: 'global-settings',
    element: <SettingsPage 
        workflowStatus={props.workflowStatus} 
        onToggleWorkflow={props.onToggleWorkflow} 
    />
  },
  {
    path: 'admin-console',
    element: <UserManagement 
        users={props.allUsers} 
        onUpdateRole={props.onUpdateUserRole} 
        onAddUser={props.onAddUser} 
        onDeleteUser={props.onDeleteUser} 
        onUpdateUserDetails={props.onUpdateUserDetails} 
    />,
    children: [
        {
            path: 'menu-visibility',
            element: <PageManagement 
                menus={props.allMenuTree} 
                allUsers={props.allUsers} 
                onAdd={props.onAddMenu} 
                onRemove={props.onRemoveMenu} 
                onUpdate={props.onUpdateMenu} 
            />
        },
        {
            path: 'user-management',
            element: <UserManagement 
                users={props.allUsers} 
                onUpdateRole={props.onUpdateUserRole} 
                onAddUser={props.onAddUser} 
                onDeleteUser={props.onDeleteUser} 
                onUpdateUserDetails={props.onUpdateUserDetails} 
            />
        }
    ]
  },
  {
    path: 'personnel-records',
    element: <PersonnelRecords users={props.allUsers} />
  },
  {
    path: 'evaluations',
    element: <PersonnelRecords users={props.allUsers} />
  },
  {
    path: 'laptop-request',
    element: <LaptopHome onNavigate={props.onNavigate} />,
    children: [
        {
            path: 'laptop-inbox',
            element: <Inbox mode="Inbox" filterType="Laptop" onViewRequest={props.onViewRequest} />
        },
        {
            path: 'laptop-outbox',
            element: <Inbox mode="Outbox" filterType="Laptop" onViewRequest={props.onViewRequest} />
        },
        {
            path: 'laptop-new-request',
            element: <LaptopRequest user={props.currentUser} />
        }
    ]
  },
  {
    path: 'dispensation',
    element: <DispensationRequest user={props.currentUser} />,
    children: [
        {
            path: 'dispensation-inbox',
            element: <Inbox mode="Inbox" filterType="Dispensation" onViewRequest={props.onViewRequest} />
        },
        {
            path: 'dispensation-outbox',
            element: <Inbox mode="Outbox" filterType="Dispensation" onViewRequest={props.onViewRequest} />
        },
        {
            path: 'dispensation-my-requests',
            element: <DispensationRequest user={props.currentUser} />
        }
    ]
  },
  {
    path: 'nws-policy',
    element: <PolicyRequest user={props.currentUser} />,
    children: [
        {
            path: 'nws-inbox',
            element: <Inbox mode="Inbox" filterType="Policy" onViewRequest={props.onViewRequest} />
        },
        {
            path: 'nws-library', // Port Opening Req
            element: <PolicyRequest user={props.currentUser} />
        }
    ]
  },
  {
    path: 'not-found',
    element: (
        <div className="flex flex-col min-h-screen items-center justify-center -mt-24">
            <NotFoundPage onGoHome={() => props.onNavigate('home')} onBack={() => props.onNavigate('home')} />
        </div>
    )
  }
];

export const FallbackRouteElement = (label: string = 'Unknown Module', onNavigate: (path: string) => void) => (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-white/10 p-20 text-center text-slate-500 animate-fade-in-up flex flex-col items-center">
        <div className="w-28 h-28 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
            <AlertTriangle size={48} className="text-amber-500" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-[0.2em]">
            {label}
        </h3>
        <p className="max-w-md mx-auto mb-10 font-bold leading-relaxed text-sm">
            Strategic simulation for this command module is currently restricted or undergoing authorized maintenance cycles.
        </p>
        <button onClick={() => onNavigate('home')} className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20">
            Return to Strategic Center
        </button>
    </div>
);
