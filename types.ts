import React from 'react';

export type Role = 'staff' | 'hr' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  department: string;
  position: string;
  avatarUrl?: string;
  status: 'active' | 'inactive' | 'on-leave';
  joinDate: string;
  phone?: string;
  location?: string;
}

export interface BioData {
  // Personal
  dateOfBirth: string;
  nationality: string;
  maritalStatus: string;
  gender: string;
  // Contact
  address: string;
  city: string;
  state: string;
  zipCode: string;
  // Emergency
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  // Banking
  bankName: string;
  accountNumber: string;
}

export interface DocumentVersion {
  id: string;
  dateUploaded: string;
  status: 'approved' | 'pending' | 'rejected';
  size: string;
  uploadedBy: string;
  version: number;
  notes?: string;
}

export interface Document {
  id: string;
  userId: string; // Added to track ownership
  title: string;
  category: 'ID' | 'Certificate' | 'Contract' | 'Other';
  status: 'approved' | 'pending' | 'rejected';
  dateUploaded: string;
  size: string;
  type: string;
  uploadedBy: string;
  version: number;
  history?: DocumentVersion[];
  notes?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  targetRole?: Role | 'all'; 
  targetUserId?: string;
}

export interface ApprovalItem {
  id: string;
  type: 'Profile Update' | 'Document' | 'Leave Request' | 'Bio Data';
  user: string;
  detail: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'partially_approved';
  data?: any; // Payload for bio data review or linked document ID
  fieldStatuses?: Record<string, 'approved' | 'rejected'>; // For HR review state
}

export interface Stat {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
}

// --- Complaint System Types ---

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  role: Role;
  content: string;
  timestamp: string;
  isInternal?: boolean; // For HR/Admin notes invisible to staff (optional feature)
}

export interface Complaint {
  id: string;
  subject: string;
  category: 'Payroll' | 'Leave' | 'Workplace' | 'IT' | 'Other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'escalated';
  createdBy: string; // UserId
  createdByName: string; // Display name
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}