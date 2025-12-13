import { User, Document, Notification } from './types';
import { Users, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    email: 'staff@nexus.com',
    firstName: 'Sarah',
    lastName: 'Chen',
    role: 'staff',
    department: 'Engineering',
    position: 'Frontend Developer',
    status: 'active',
    joinDate: '2023-01-15',
    avatarUrl: 'https://picsum.photos/200/200',
    phone: '+1 (555) 0123-4567',
    location: 'San Francisco, CA'
  },
  {
    id: 'u2',
    email: 'hr@nexus.com',
    firstName: 'Marcus',
    lastName: 'Reynolds',
    role: 'hr',
    department: 'Human Resources',
    position: 'Senior HR Manager',
    status: 'active',
    joinDate: '2020-03-10',
    avatarUrl: 'https://picsum.photos/201/201',
    phone: '+1 (555) 9876-5432',
    location: 'New York, NY'
  },
  {
    id: 'u3',
    email: 'admin@nexus.com',
    firstName: 'Evelyn',
    lastName: 'Vance',
    role: 'admin',
    department: 'Operations',
    position: 'Director of Ops',
    status: 'active',
    joinDate: '2018-06-22',
    avatarUrl: 'https://picsum.photos/202/202',
    phone: '+1 (555) 1111-2222',
    location: 'London, UK'
  },
  {
    id: 'u4',
    email: 'john@nexus.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'staff',
    department: 'Marketing',
    position: 'Marketing Specialist',
    status: 'on-leave',
    joinDate: '2022-11-01',
    avatarUrl: 'https://picsum.photos/203/203',
    location: 'Austin, TX'
  }
];

export const MOCK_DOCUMENTS: Document[] = [
  { 
    id: 'd1', 
    title: 'Employment Contract', 
    category: 'Contract', 
    status: 'approved', 
    dateUploaded: '2023-01-15', 
    size: '2.4 MB', 
    type: 'PDF', 
    uploadedBy: 'Sarah Chen',
    version: 1,
    history: [],
    notes: 'Initial contract signing'
  },
  { 
    id: 'd2', 
    title: 'Driver\'s License', 
    category: 'ID', 
    status: 'pending', 
    dateUploaded: '2024-03-20', 
    size: '1.1 MB', 
    type: 'JPG', 
    uploadedBy: 'Sarah Chen',
    version: 2,
    notes: 'Updated expiry date',
    history: [
      {
        id: 'd2_v1',
        dateUploaded: '2021-03-15',
        status: 'approved',
        size: '1.0 MB',
        uploadedBy: 'Sarah Chen',
        version: 1,
        notes: 'Initial upload of ID'
      }
    ]
  },
  { 
    id: 'd3', 
    title: 'AWS Certification', 
    category: 'Certificate', 
    status: 'approved', 
    dateUploaded: '2023-06-10', 
    size: '3.5 MB', 
    type: 'PDF', 
    uploadedBy: 'Sarah Chen',
    version: 1,
    history: [],
    notes: 'Professional Architect Cert'
  },
  { 
    id: 'd4', 
    title: 'Tax Form W-2', 
    category: 'Other', 
    status: 'rejected', 
    dateUploaded: '2023-12-31', 
    size: '0.5 MB', 
    type: 'PDF', 
    uploadedBy: 'John Doe',
    version: 1,
    history: [],
    notes: '2023 Tax Return'
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Document Approved', message: 'Your employment contract has been approved by HR.', date: '2 hours ago', type: 'success', read: false },
  { id: 'n2', title: 'New Policy Update', message: 'Please review the updated remote work policy.', date: '1 day ago', type: 'info', read: true },
  { id: 'n3', title: 'Leave Request Pending', message: 'Your leave request for July 15th is pending approval.', date: '3 days ago', type: 'warning', read: true },
];

export const STATS_ICONS = {
  staff: Users,
  docs: FileText,
  approve: CheckCircle,
  alert: AlertCircle
};