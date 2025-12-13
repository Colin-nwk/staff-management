import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MOCK_USERS } from '../constants';
import { Card, Input, Button, Badge, Modal } from '../components/ui/Components';
import { Search, Filter, Phone, MapPin, UserPlus, Edit2, Trash2, ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight, Settings2, Download, Trash, Check } from 'lucide-react';
import { useAuth } from '../App';
import { User, Role } from '../types';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  VisibilityState,
  RowSelectionState,
} from '@tanstack/react-table';

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & React.HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  );
}

const StaffList = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  
  // Filtering State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Table State
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // UI State
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowColumnDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Helpers ---
  const uniqueDepartments = useMemo(() => {
    return Array.from(new Set(users.map(u => u.department))).sort();
  }, [users]);

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
      setRowSelection({}); // Clear selection if any
    }
  };

  const handleBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection);
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} users?`)) {
       // In a real app, you would filter by ID, but here rowSelection keys are indices if not configured otherwise.
       // However, react-table default row id is index. We need to map them to user IDs.
       const selectedIndices = Object.keys(rowSelection).map(Number);
       // We need to act on the *filtered* data that the table is currently displaying to map indices correctly,
       // OR typically standard practice is to use getRowId option in table to use user.id.
       // Let's rely on the table instance row model.
    }
  };
  
  // Actually, we need to access the table instance to get the real rows for bulk delete.
  // We'll implement the logic inside the render where `table` is available or move `table` up.
  // For simplicity, I'll define `table` first then use it.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
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

  // --- Table Configuration ---
  const columnHelper = createColumnHelper<User>();

  const columns = useMemo(() => [
    {
        id: 'select',
        header: ({ table }: any) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
                className: "w-4 h-4 rounded border-slate-300 dark:border-navy-600 text-navy-900 focus:ring-navy-900 focus:ring-offset-0 dark:bg-navy-900"
              }}
            />
          </div>
        ),
        cell: ({ row }: any) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected ? row.getIsSomeSelected() : false,
                onChange: row.getToggleSelectedHandler(),
                className: "w-4 h-4 rounded border-slate-300 dark:border-navy-600 text-navy-900 focus:ring-navy-900 focus:ring-offset-0 dark:bg-navy-900"
              }}
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
      id: 'employee',
      header: 'Employee',
      cell: info => {
        const user = info.row.original;
        return (
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
        );
      },
      sortingFn: 'alphanumeric', 
    }),
    columnHelper.accessor('role', {
      header: 'Role & Dept',
      cell: info => {
        const user = info.row.original;
        return (
          <div>
            <div className="text-slate-900 dark:text-slate-200">{user.position}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              {user.department}
              <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-navy-700 text-slate-600 dark:text-slate-300 uppercase text-[10px] font-bold tracking-wide border border-slate-200 dark:border-navy-600">
                {user.role}
              </span>
            </div>
          </div>
        );
      }
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <Badge variant={
          info.getValue() === 'active' ? 'success' : 
          info.getValue() === 'on-leave' ? 'warning' : 'default'
        }>
          {info.getValue()}
        </Badge>
      )
    }),
    columnHelper.accessor('joinDate', {
        header: 'Join Date',
        cell: info => <span className="text-slate-600 dark:text-slate-300">{info.getValue()}</span>
    }),
    columnHelper.accessor('phone', {
      header: 'Contact',
      cell: info => {
        const user = info.row.original;
        return (
          <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {user.phone || 'N/A'}</div>
            <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {user.location || 'N/A'}</div>
          </div>
        );
      }
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: info => {
        const user = info.row.original;
        return canEditUser(user) ? (
          <div className="flex items-center justify-end gap-2">
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
        ) : null;
      }
    })
  ], [users, currentUser]);

  // Filter Data before passing to table
  const filteredData = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesDept = filterDepartment === 'all' || user.department === filterDepartment;
      
      return matchesSearch && matchesRole && matchesStatus && matchesDept;
    });
  }, [users, searchTerm, filterRole, filterStatus, filterDepartment]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      pagination,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    getRowId: row => row.id, // Use real user ID for selection keys
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const performBulkDelete = () => {
      const selectedIds = Object.keys(rowSelection);
      if (selectedIds.length === 0) return;
      
      if (window.confirm(`Permanently delete ${selectedIds.length} users?`)) {
          setUsers(prev => prev.filter(u => !rowSelection[u.id]));
          setRowSelection({});
      }
  };

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-medium text-navy-900 dark:text-white">Staff Directory</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and view all employee records</p>
        </div>
        <div className="flex gap-2">
            {currentUser?.role === 'admin' && (
                 <Button variant="outline" className="hidden sm:flex">
                    <Download className="w-4 h-4 mr-2" /> Export
                 </Button>
            )}
            <Button onClick={handleOpenCreate}>
                <UserPlus className="w-4 h-4 mr-2" />
                {currentUser?.role === 'hr' ? 'Add Staff' : 'Add User'}
            </Button>
        </div>
      </div>

      <Card noPadding className="overflow-hidden flex flex-col">
        {/* Advanced Filter Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-navy-700 bg-slate-50/50 dark:bg-navy-800 flex flex-col gap-4">
           {/* Top Row: Search and Bulk Actions */}
           <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                    placeholder="Search name, email..." 
                    className="pl-9 bg-white dark:bg-navy-900"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                 {/* Columns Dropdown */}
                 <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-600 rounded-md text-sm font-medium hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors"
                    >
                        <Settings2 className="w-4 h-4 text-slate-500" />
                        <span className="hidden sm:inline">Columns</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>
                    
                    {showColumnDropdown && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-navy-800 rounded-lg shadow-xl border border-slate-200 dark:border-navy-700 z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
                             <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase px-2 py-1 mb-1">Toggle Columns</div>
                             {table.getAllLeafColumns().map(column => {
                                 if (column.id === 'select' || column.id === 'actions') return null;
                                 return (
                                     <label key={column.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-navy-700 rounded cursor-pointer">
                                         <input
                                            type="checkbox"
                                            checked={column.getIsVisible()}
                                            onChange={column.getToggleVisibilityHandler()}
                                            className="rounded border-slate-300 dark:border-navy-600 text-navy-900 focus:ring-navy-900"
                                         />
                                         <span className="text-sm text-slate-700 dark:text-slate-200 capitalize">
                                             {column.id === 'joinDate' ? 'Join Date' : column.id}
                                         </span>
                                     </label>
                                 );
                             })}
                        </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Bottom Row: Filters */}
           <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 uppercase tracking-wider mr-1">
                 <Filter className="w-3 h-3" /> Filters:
              </div>
              
              <select 
                className="h-9 rounded-md border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 dark:focus:ring-gold-500"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="staff">Staff</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
              </select>

              <select 
                className="h-9 rounded-md border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 dark:focus:ring-gold-500"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select 
                className="h-9 rounded-md border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 dark:focus:ring-gold-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>

              {(filterRole !== 'all' || filterDepartment !== 'all' || filterStatus !== 'all' || searchTerm) && (
                  <button 
                    onClick={() => {
                        setFilterRole('all');
                        setFilterDepartment('all');
                        setFilterStatus('all');
                        setSearchTerm('');
                    }}
                    className="text-xs text-red-500 hover:text-red-700 font-medium ml-auto sm:ml-2"
                  >
                      Reset Filters
                  </button>
              )}
           </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedCount > 0 && currentUser?.role === 'admin' && (
            <div className="bg-navy-50 dark:bg-navy-900 border-b border-navy-100 dark:border-navy-700 px-4 py-2 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
                 <div className="text-sm font-medium text-navy-900 dark:text-white flex items-center gap-2">
                     <span className="bg-navy-900 text-white dark:bg-gold-500 dark:text-navy-900 text-xs px-2 py-0.5 rounded-full">{selectedCount}</span>
                     selected
                 </div>
                 <div className="flex gap-2">
                     <Button size="sm" variant="danger" onClick={performBulkDelete}>
                         <Trash className="w-3.5 h-3.5 mr-2" /> Delete Selected
                     </Button>
                 </div>
            </div>
        )}

        {/* TanStack Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-slate-50 dark:bg-navy-900/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-navy-700">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 cursor-pointer select-none group first:px-4" onClick={header.column.getToggleSortingHandler()}>
                      <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                            <span className="text-slate-400">
                                {{
                                asc: <ChevronUp className="w-4 h-4 text-navy-900 dark:text-white" />,
                                desc: <ChevronDown className="w-4 h-4 text-navy-900 dark:text-white" />,
                                }[header.column.getIsSorted() as string] ?? <ChevronsUpDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                            </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-700">
              {table.getRowModel().rows.length === 0 ? (
                  <tr>
                      <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                          <div className="flex flex-col items-center justify-center">
                              <Search className="w-10 h-10 mb-3 opacity-20" />
                              <p className="text-base font-medium text-slate-600 dark:text-slate-300">No users found</p>
                              <p className="text-sm mt-1">Try adjusting your filters or search terms.</p>
                          </div>
                      </td>
                  </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                    <tr 
                        key={row.id} 
                        className={`transition-colors ${row.getIsSelected() ? 'bg-blue-50 dark:bg-navy-800/80' : 'hover:bg-slate-50 dark:hover:bg-navy-800'}`}
                    >
                    {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-6 py-4 first:px-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    ))}
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-200 dark:border-navy-700 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 dark:bg-navy-800 gap-4">
           <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
               <span>
                   Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
               </span>
               <span className="hidden sm:inline">•</span>
               <span className="hidden sm:inline">
                   {table.getFilteredRowModel().rows.length} Total Rows
               </span>
           </div>
           
           <div className="flex items-center gap-2">
                <select 
                  className="h-8 rounded-md border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-900 px-2 text-xs focus:outline-none"
                  value={table.getState().pagination.pageSize}
                  onChange={e => {
                    table.setPageSize(Number(e.target.value))
                  }}
                >
                  {[5, 10, 20, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>

                <div className="flex gap-1">
                    <button
                        className="p-1.5 rounded border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 hover:bg-slate-50 dark:hover:bg-navy-800 disabled:opacity-50 disabled:hover:bg-white dark:disabled:hover:bg-navy-900"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        className="p-1.5 rounded border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 hover:bg-slate-50 dark:hover:bg-navy-800 disabled:opacity-50 disabled:hover:bg-white dark:disabled:hover:bg-navy-900"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
           </div>
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