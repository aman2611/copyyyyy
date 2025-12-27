import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { User, Search, MoreVertical, Shield, UserCog, CheckCircle, XCircle, Trash2, Edit, Plus, Mail, MapPin, Hash, Briefcase, X } from 'lucide-react';
import { UserData, UserRole } from '../utils/types';
import Input from './Input';
import Select from './Select';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import DataTable, { ColumnDef } from './DataTable';

interface UserManagementProps {
  users: UserData[];
  onUpdateRole: (userId: string, newRole: UserRole) => void;
  onAddUser: (userData: Partial<UserData>) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateUserDetails: (userId: string, updates: Partial<UserData>) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onUpdateRole, onAddUser, onDeleteUser, onUpdateUserDetails }) => {
  // roleFilter determines the dataset passed to DataTable
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<UserData>>({
      username: '',
      email: '',
      role: 'NORMAL_USER',
      unit: '',
      rank: '',
      designation: '',
      serviceNumber: '',
      dateOfJoining: '',
      dateOfSeniority: '',
      dateOfRetirement: ''
  });

  // Action Menu State (for the dropdown)
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // Filter users by Role only (DataTable handles search/sort/pagination)
  const filteredUsers = users.filter(user => {
    return roleFilter === 'ALL' || user.role === roleFilter;
  });

  const handleSaveUser = () => {
      onAddUser(newUser);
      setIsModalOpen(false);
      setNewUser({ 
          username: '', email: '', role: 'NORMAL_USER', unit: '', rank: '', 
          designation: '', serviceNumber: '', dateOfJoining: '', dateOfSeniority: '', dateOfRetirement: '' 
      });
      toast.success('User created successfully');
  };

  const handleRoleUpdate = (userId: string, newRole: UserRole) => {
      onUpdateRole(userId, newRole);
      toast.success(`User role updated to ${newRole.replace('_', ' ')}`);
  };

  const handleDeleteUserAction = (userId: string) => {
      onDeleteUser(userId);
      setOpenActionId(null);
      toast.success('User deleted successfully');
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
      setNewUser(prev => ({ ...prev, [field]: value }));
  };

  // Define Columns for DataTable
  const columns: ColumnDef<UserData>[] = [
      {
          key: 'username',
          header: 'User Details',
          sortable: true,
          accessor: (row) => row.username,
          render: (user) => (
              <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-white/10 dark:to-white/5 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-white">
                    {user.username.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{user.username}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
              </div>
          )
      },
      {
          key: 'unit',
          header: 'Unit / Dept',
          sortable: true,
          render: (user) => (
              <span className="text-slate-600 dark:text-gray-300 font-medium">{user.unit}</span>
          )
      },
      {
          key: 'role',
          header: 'Current Role',
          sortable: true,
          render: (user) => (
              <select 
                  value={user.role}
                  onChange={(e) => handleRoleUpdate(user.id, e.target.value as UserRole)}
                  className="bg-transparent border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 dark:text-gray-300 cursor-pointer hover:border-blue-500 focus:border-blue-500 outline-none dark:bg-black/20"
              >
                  <option value="NORMAL_USER">User</option>
                  <option value="UNIT_ADMIN">Unit Admin</option>
                  <option value="PROCUREMENT_ADMIN">Procurement</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
              </select>
          )
      },
      {
          key: 'status',
          header: 'Status',
          sortable: true,
          render: (user) => (
              <>
                {user.status === 'Active' && <Badge variant="success" icon={CheckCircle}>Active</Badge>}
                {user.status === 'Pending' && <Badge variant="warning" icon={UserCog}>Pending</Badge>}
              </>
          )
      },
      {
          key: 'actions',
          header: 'Actions',
          className: 'text-right relative',
          render: (user) => (
              <>
                  <button 
                      onClick={(e) => {
                          e.stopPropagation();
                          setOpenActionId(openActionId === user.id ? null : user.id);
                      }}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-lg transition-colors"
                  >
                      <MoreVertical size={16} />
                  </button>
                  
                  {/* Action Dropdown */}
                  {openActionId === user.id && (
                      <div className="absolute right-8 top-8 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in-up">
                          <div className="p-1">
                              <button 
                                  onClick={() => { toast.success('Edit functionality coming soon'); setOpenActionId(null); }}
                                  className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg flex items-center gap-2"
                              >
                                  <Edit size={14} /> Edit Details
                              </button>
                              <div className="h-px bg-slate-100 dark:bg-white/10 my-1"></div>
                              <button 
                                  onClick={() => handleDeleteUserAction(user.id)}
                                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg flex items-center gap-2"
                              >
                                  <Trash2 size={14} /> Delete User
                              </button>
                          </div>
                      </div>
                  )}
              </>
          )
      }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up relative">
      
      {/* ADD USER MODAL */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <Card className="w-full max-w-lg shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto custom-scrollbar" noPadding>
                  <div className="p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New User</h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                        <X size={20} />
                      </button>
                  </div>
                  <div className="p-6 space-y-4">
                      <Input 
                        label="Username" 
                        value={newUser.username} 
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        placeholder="e.g. Lt. Cmdr. Data"
                      />
                      <Input 
                        label="Email" 
                        type="email"
                        value={newUser.email} 
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="email@navy.mil"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Select 
                            label="Role"
                            value={newUser.role}
                            onChange={(e) => handleInputChange('role', e.target.value)}
                            options={[
                                { label: 'Normal User', value: 'NORMAL_USER' },
                                { label: 'Unit Admin', value: 'UNIT_ADMIN' },
                                { label: 'Procurement', value: 'PROCUREMENT_ADMIN' },
                                { label: 'Super Admin', value: 'SUPER_ADMIN' }
                            ]}
                        />
                        <Input 
                            label="Service Number" 
                            value={newUser.serviceNumber} 
                            onChange={(e) => handleInputChange('serviceNumber', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                            label="Rank" 
                            value={newUser.rank} 
                            onChange={(e) => handleInputChange('rank', e.target.value)}
                        />
                        <Input 
                            label="Unit" 
                            value={newUser.unit} 
                            onChange={(e) => handleInputChange('unit', e.target.value)}
                        />
                      </div>
                      
                      <div className="h-px bg-slate-100 dark:bg-white/10 my-2"></div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase">Service Dates</h4>
                      
                      <div className="grid grid-cols-3 gap-3">
                          <Input 
                              type="date"
                              label="Date of Joining"
                              value={newUser.dateOfJoining}
                              onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                          />
                          <Input 
                              type="date"
                              label="Date of Seniority"
                              value={newUser.dateOfSeniority}
                              onChange={(e) => handleInputChange('dateOfSeniority', e.target.value)}
                          />
                          <Input 
                              type="date"
                              label="Retirement Date"
                              value={newUser.dateOfRetirement}
                              onChange={(e) => handleInputChange('dateOfRetirement', e.target.value)}
                          />
                      </div>
                  </div>
                  <div className="p-6 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 sticky bottom-0 z-10">
                      <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                      <Button onClick={handleSaveUser} disabled={!newUser.username || !newUser.email}>Create User</Button>
                  </div>
              </Card>
          </div>
      )}

      {/* Main Content */}
      <DataTable 
        title="User Directory" 
        icon={User}
        data={filteredUsers} 
        columns={columns}
        initialPageSize={10}
        actions={
            <div className="flex gap-2">
                 <select 
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                 >
                    <option value="ALL">All Roles</option>
                    <option value="NORMAL_USER">Users</option>
                    <option value="UNIT_ADMIN">Admins</option>
                    <option value="PROCUREMENT_ADMIN">Procurement</option>
                    <option value="SUPER_ADMIN">Super Admins</option>
                 </select>
                 <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Plus size={16} /> Add User
                 </Button>
            </div>
        }
      />
    </div>
  );
};

export default UserManagement;