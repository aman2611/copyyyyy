import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ChevronRight, ChevronDown, Plus, Trash2, Shield, Users, Edit, Save, X, Layout, FolderPlus, CheckCircle, Search, MoreHorizontal, FilePlus } from 'lucide-react';
import { MenuItem, UserRole, UserData } from '../App';

// --- Types ---
interface PageManagementProps {
  menus: MenuItem[];
  allUsers: UserData[];
  onAdd: (parentId: string | null, newItem: MenuItem) => void;
  onRemove: (itemId: string) => void;
  onUpdate: (itemId: string, updates: Partial<MenuItem>) => void;
}

// --- Menu Tree Item Component ---
interface MenuTreeItemProps {
  item: MenuItem;
  depth?: number;
  isSelected: boolean;
  onSelect: (item: MenuItem) => void;
  onToggleExpand: (itemId: string) => void;
  isExpanded: boolean;
  onInitiateAddChild: (parentId: string) => void;
  onDelete: (itemId: string) => void;
}

const MenuTreeItem: React.FC<MenuTreeItemProps> = ({ 
    item, depth = 0, isSelected, onSelect, onToggleExpand, isExpanded, onInitiateAddChild, onDelete 
}) => {
    return (
        <div className="mb-1 select-none">
            <div 
                onClick={() => onSelect(item)}
                className={`
                    group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all border
                    ${isSelected 
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-500/50' 
                        : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-white/5'}
                    ${item.active === false ? 'opacity-60' : ''}
                `}
                style={{ marginLeft: `${depth * 12}px` }}
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onToggleExpand(item.id); }}
                        className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10 transition-colors ${item.subItems?.length ? 'visible' : 'invisible'}`}
                    >
                        {isExpanded ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
                    </button>
                    
                    {/* Status Indicator */}
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.active !== false ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                    
                    <span className={`text-sm font-medium truncate ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
                        {item.label}
                    </span>
                </div>

                <div className={`flex items-center gap-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onInitiateAddChild(item.id); }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded transition-colors"
                        title="Add Submenu"
                    >
                        <Plus size={14} />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 rounded transition-colors"
                        title="Delete Menu"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Configuration Panel Component ---
interface ConfigPanelProps {
    item: MenuItem;
    allUsers: UserData[];
    onUpdate: (itemId: string, updates: Partial<MenuItem>) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ item, allUsers, onUpdate }) => {
    const [tab, setTab] = useState<'GENERAL' | 'ACCESS'>('GENERAL');
    const [userSearch, setUserSearch] = useState('');

    const toggleRole = (role: UserRole) => {
        const currentRoles = item.roleAccess || [];
        const newRoles = currentRoles.includes(role)
            ? currentRoles.filter(r => r !== role)
            : [...currentRoles, role];
        onUpdate(item.id, { roleAccess: newRoles });
        toast.success(`Role access updated`);
    };

    const toggleUser = (userId: string) => {
        const currentUsers = item.allowedUsers || [];
        const newUsers = currentUsers.includes(userId)
            ? currentUsers.filter(id => id !== userId)
            : [...currentUsers, userId];
        onUpdate(item.id, { allowedUsers: newUsers });
        toast.success('User exception updated');
    };

    const handleUpdateLabel = (val: string) => {
        onUpdate(item.id, { label: val });
    };

    const handleToggleActive = () => {
        const newState = !item.active;
        onUpdate(item.id, { active: newState });
        toast.success(`Menu ${newState ? 'activated' : 'deactivated'}`);
    };

    const filteredUsers = allUsers.filter(u => 
        u.username.toLowerCase().includes(userSearch.toLowerCase()) || 
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Edit size={18} className="text-blue-500" />
                    Edit Menu
                </h3>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 dark:border-white/5">
                <button 
                    onClick={() => setTab('GENERAL')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${tab === 'GENERAL' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                >
                    Properties
                </button>
                <button 
                    onClick={() => setTab('ACCESS')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${tab === 'ACCESS' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                >
                    Permissions
                </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                
                {tab === 'GENERAL' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Display Name</label>
                            <input 
                                value={item.label}
                                onChange={(e) => handleUpdateLabel(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-medium transition-all"
                                placeholder="Enter menu label"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Visibility</label>
                            <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                                <button 
                                    onClick={handleToggleActive}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.active !== false ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.active !== false ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                <div>
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                                        {item.active !== false ? 'Active' : 'Hidden'}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {item.active !== false ? 'Visible in navigation menus.' : 'Hidden from all users.'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/20 text-xs text-blue-700 dark:text-blue-300">
                            <strong>Note:</strong> Renaming a menu item updates it instantly for all users. Changes to visibility will affect navigation availability immediately.
                        </div>
                    </div>
                )}

                {tab === 'ACCESS' && (
                    <div className="space-y-8 animate-fade-in-up">
                        
                        {/* Roles */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <Shield size={16} className="text-indigo-500" /> Role-Based Access
                            </h4>
                            <p className="text-xs text-slate-500 mb-4">Select which roles can view this page. If none selected, page is visible to all roles.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {['NORMAL_USER', 'UNIT_ADMIN', 'PROCUREMENT_ADMIN', 'SUPER_ADMIN'].map((role) => (
                                    <label key={role} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${item.roleAccess?.includes(role as UserRole) ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-500/30' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-indigo-200'}`}>
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${item.roleAccess?.includes(role as UserRole) ? 'bg-indigo-600 border-indigo-600' : 'bg-white dark:bg-black/20 border-slate-300 dark:border-slate-600'}`}>
                                            {item.roleAccess?.includes(role as UserRole) && <CheckCircle size={14} className="text-white" />}
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={item.roleAccess?.includes(role as UserRole) || false} 
                                            onChange={() => toggleRole(role as UserRole)}
                                            className="hidden" 
                                        />
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{role.replace('_', ' ')}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* User Exceptions */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <Users size={16} className="text-emerald-500" /> User Exceptions
                            </h4>
                            <p className="text-xs text-slate-500 mb-4">Grant access to specific users regardless of their role.</p>
                            
                            <div className="mb-3 relative">
                                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                                <input 
                                    placeholder="Search users..." 
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500 dark:text-white"
                                />
                            </div>

                            <div className="max-h-60 overflow-y-auto custom-scrollbar border border-slate-200 dark:border-white/10 rounded-xl divide-y divide-slate-100 dark:divide-white/5">
                                {filteredUsers.map(u => {
                                    const isAllowed = item.allowedUsers?.includes(u.id);
                                    return (
                                        <div key={u.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                                    {u.username.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-slate-800 dark:text-white">{u.username}</div>
                                                    <div className="text-[10px] text-slate-500">{u.role}</div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => toggleUser(u.id)}
                                                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors ${isAllowed ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30' : 'bg-white dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10 hover:bg-slate-100'}`}
                                            >
                                                {isAllowed ? 'Allowed' : 'Allow'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};


// --- Main PageManagement Component ---
const PageManagement: React.FC<PageManagementProps> = ({ menus, allUsers, onAdd, onRemove, onUpdate }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'ROOT' | 'CHILD'>('ROOT');
  const [addParentId, setAddParentId] = useState<string | null>(null);
  const [newMenuLabel, setNewMenuLabel] = useState('');

  // Initial Expand
  useState(() => {
      const initial: Record<string, boolean> = {};
      menus.forEach(m => initial[m.id] = true);
      setExpandedIds(initial);
  });

  const handleToggleExpand = (id: string) => {
      setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openAddModal = (mode: 'ROOT' | 'CHILD', parentId: string | null = null) => {
      setModalMode(mode);
      setAddParentId(parentId);
      setNewMenuLabel('');
      setIsModalOpen(true);
  };

  const handleConfirmAdd = () => {
      if (!newMenuLabel.trim()) return;
      
      const newId = `menu-${Date.now()}`;
      onAdd(addParentId, { id: newId, label: newMenuLabel, subItems: [], active: true });
      
      if (addParentId && !expandedIds[addParentId]) {
          handleToggleExpand(addParentId);
      }
      
      setSelectedId(newId);
      setIsModalOpen(false);
      toast.success(`${newMenuLabel} menu created`);
  };

  const handleDeleteMenu = (id: string) => {
      onRemove(id);
      if(selectedId === id) setSelectedId(null);
      toast.success('Menu item deleted');
  };

  // Find Selected Item recursively
  const findItem = (items: MenuItem[], id: string): MenuItem | undefined => {
      for (const item of items) {
          if (item.id === id) return item;
          if (item.subItems) {
              const found = findItem(item.subItems, id);
              if (found) return found;
          }
      }
      return undefined;
  };

  const selectedItem = selectedId ? findItem(menus, selectedId) : null;

  // Recursive Renderer helper
  const renderTree = (items: MenuItem[], depth = 0) => {
      return items.map(item => (
          <React.Fragment key={item.id}>
              <MenuTreeItem 
                  item={item}
                  depth={depth}
                  isSelected={selectedId === item.id}
                  onSelect={(i) => setSelectedId(i.id)}
                  onToggleExpand={handleToggleExpand}
                  isExpanded={!!expandedIds[item.id]}
                  onInitiateAddChild={() => openAddModal('CHILD', item.id)}
                  onDelete={handleDeleteMenu}
              />
              {expandedIds[item.id] && item.subItems && (
                  renderTree(item.subItems, depth + 1)
              )}
          </React.Fragment>
      ));
  };

  return (
    <div className="space-y-6 animate-fade-in-up h-[calc(100vh-140px)] flex flex-col relative">
       
       {/* ADD MENU MODAL */}
       {isModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
               <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-white/10 animate-fade-in-up">
                   <div className="p-6 border-b border-slate-100 dark:border-white/10">
                       <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                           {modalMode === 'ROOT' ? 'Add Top-Level Menu' : 'Add Submenu Item'}
                       </h3>
                       <p className="text-xs text-slate-500 mt-1">
                           Create a new navigation entry. You can configure access permissions later.
                       </p>
                   </div>
                   <div className="p-6">
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Menu Name</label>
                       <input 
                           autoFocus
                           className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-medium"
                           placeholder="e.g. System Reports"
                           value={newMenuLabel}
                           onChange={e => setNewMenuLabel(e.target.value)}
                           onKeyDown={e => e.key === 'Enter' && handleConfirmAdd()}
                       />
                   </div>
                   <div className="p-6 pt-0 flex justify-end gap-3">
                       <button 
                           onClick={() => setIsModalOpen(false)}
                           className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 font-bold text-sm"
                       >
                           Cancel
                       </button>
                       <button 
                           onClick={handleConfirmAdd}
                           disabled={!newMenuLabel.trim()}
                           className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                           Create Menu
                       </button>
                   </div>
               </div>
           </div>
       )}

       {/* Header Card */}
       <div className="flex-shrink-0 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
           <div>
               <h3 className="text-xl font-bold flex items-center gap-3 mb-1">
                  <Layout className="text-blue-400" /> Menu & Access Control
               </h3>
               <p className="text-slate-400 text-sm">
                  Customize the application navigation structure and manage granular permissions.
               </p>
           </div>
       </div>

       <div className="flex-1 flex gap-6 overflow-hidden">
           
           {/* Left Column: Tree View */}
           <div className="w-1/3 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
               <div className="p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex justify-between items-center">
                   <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Navigation Tree</h4>
                   <span className="text-[10px] text-slate-400 font-bold bg-white dark:bg-white/10 px-2 py-0.5 rounded-full border border-slate-200 dark:border-white/5">{menus.length} Roots</span>
               </div>
               
               <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                   {menus.length === 0 ? (
                       <div className="text-center text-slate-400 text-sm py-12 flex flex-col items-center">
                           <Layout size={32} className="mb-3 opacity-20" />
                           <p>No menus defined.</p>
                       </div>
                   ) : (
                       renderTree(menus)
                   )}
                   
                   {/* Add Root Button */}
                   <button 
                       onClick={() => openAddModal('ROOT')}
                       className="mt-4 w-full py-3 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 hover:border-blue-300 dark:hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-sm font-bold group"
                   >
                       <Plus size={16} className="group-hover:scale-110 transition-transform" /> Add Top-Level Menu
                   </button>
               </div>
           </div>

           {/* Right Column: Configuration Panel */}
           <div className="flex-1">
               {selectedItem ? (
                   <ConfigPanel 
                       key={selectedItem.id} 
                       item={selectedItem} 
                       allUsers={allUsers}
                       onUpdate={onUpdate}
                   />
               ) : (
                   <div className="h-full flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl border-dashed text-slate-400">
                       <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                           <FolderPlus size={40} className="text-slate-300 dark:text-slate-600" />
                       </div>
                       <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">No Selection</h3>
                       <p className="text-sm max-w-xs text-center">Select an item from the navigation tree to edit properties or configure access permissions.</p>
                   </div>
               )}
           </div>

       </div>
    </div>
  );
};

export default PageManagement;