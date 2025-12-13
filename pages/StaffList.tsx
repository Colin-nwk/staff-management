import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { Card, Input, Button, Badge, Modal } from '../components/ui/Components';
import { Search, Filter, Mail, Phone, MapPin, Plus, Edit2, Trash2, UserCog, UserPlus } from 'lucide-react';
import { useAuth } from '../App';
import { User, Role } from '../types';

const StaffList = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'staff' as Role,
    department: '',
    position: '',
    location: '',
    status: 'active' as 'active' | 'inactive' | 'on-leave'
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- Permissions Helpers ---
  
  const canManageRole = (targetRole: Role) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true; 
    if (currentUser.role === 'hr') return targetRole === 'staff';
    return false;
  };

  const canEditUser = (targetUser: User) => {
    if (currentUser?.id === targetUser.id) return false; 
    return canManageRole(targetUser.role);
  };

  const getAvailableRoles = (): Role[] => {
    if (currentUser?.role === 'admin') return ['hr', 'staff', 'admin'];
    if (currentUser?.role === 'hr') return ['staff'];
    return [];
  };

  // --- Handlers ---

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      ...initialFormState,
      role: currentUser?.role === 'hr' ? 'staff' : 'hr'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      department: user.department,
      position: user.position,
      location: user.location || '',
      status: user.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? {
        ...u,
        ...formData
      } : u));
    } else {
      const newUser: User = {
        id: `u${Date.now()}`,
        joinDate: new Date().toISOString().split('T')[0],
        avatarUrl: `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random`,
        ...formData
      };
      setUsers([newUser, ...users]);
    }
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-medium text-navy-900 dark:text-white">Staff Directory</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and view all employee records</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <UserPlus className="w-4 h-4 mr-2" />
          {currentUser?.role === 'hr' ? 'Add New Staff' : 'Add New User'}
        </Button>
      </div>

      <Card noPadding className="overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-navy-700 bg-slate-50/50 dark:bg-navy-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-slate-400" />
            <select 
              className="h-10 rounded-md border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-900 dark:focus:ring-gold-500"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="staff">Staff</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-navy-900/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-navy-700">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Role & Dept</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.avatarUrl} 
                        alt="" 
                        className="w-10 h-10 rounded-full border border-slate-200 dark:border-navy-600 object-cover"
                      />
                      <div>
                        <div className="font-medium text-navy-900 dark:text-white">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900 dark:text-slate-200">{user.position}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      {user.department}
                      <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-navy-700 text-slate-600 dark:text-slate-300 uppercase text-[10px] font-bold tracking-wide border border-slate-200 dark:border-navy-600">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      user.status === 'active' ? 'success' : 
                      user.status === 'on-leave' ? 'warning' : 'default'
                    }>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {user.phone || 'N/A'}</div>
                      <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {user.location || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {canEditUser(user) && (
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEdit(user)}
                          className="p-2 text-slate-400 hover:text-navy-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-navy-700 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {currentUser?.role === 'admin' && (
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User' : (currentUser?.role === 'hr' ? 'Add New Staff' : 'Add New User')}
        className="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="First Name" 
              required 
              value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
            />
            <Input 
              label="Last Name" 
              required
              value={formData.lastName}
              onChange={e => setFormData({...formData, lastName: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <Input 
              label="Email" 
              type="email" 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
            <Input 
              label="Phone" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Role</label>
              <select 
                className="flex h-10 w-full rounded-md border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-900 dark:focus:ring-gold-500"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as Role})}
                disabled={currentUser?.role === 'hr'} 
              >
                {getAvailableRoles().map(role => (
                   <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
              <select 
                className="flex h-10 w-full rounded-md border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-navy-900 dark:focus:ring-gold-500"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Input 
              label="Department" 
              required
              value={formData.department}
              onChange={e => setFormData({...formData, department: e.target.value})}
            />
            <Input 
              label="Position" 
              required
              value={formData.position}
              onChange={e => setFormData({...formData, position: e.target.value})}
            />
          </div>
          
          <Input 
              label="Location" 
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-navy-700 mt-4">
             <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
             <Button type="submit">{editingUser ? 'Save Changes' : 'Create User'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StaffList;