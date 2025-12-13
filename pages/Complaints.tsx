import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Badge, Modal, Input, TextArea } from '../components/ui/Components';
import { useAuth, useComplaints } from '../App';
import { Complaint } from '../types';
import { MessageSquare, Plus, Send, MoreVertical, ShieldAlert, CheckCircle, Clock, User, Filter } from 'lucide-react';

const Complaints = () => {
  const { user } = useAuth();
  const { complaints, createComplaint, sendMessage, updateStatus } = useComplaints();
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed' | 'escalated'>('all');

  // New Ticket Form State
  const [newTicket, setNewTicket] = useState<{subject: string; category: Complaint['category']; priority: Complaint['priority']; message: string}>({
    subject: '',
    category: 'Other',
    priority: 'medium',
    message: ''
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedId, complaints]);

  if (!user) return null;

  // --- Filtering Logic ---
  // Staff sees only their own complaints.
  // HR sees all complaints.
  // Admin sees all complaints (and specifically escalated ones might be highlighted or default).
  const visibleComplaints = complaints.filter(c => {
    const roleCheck = user.role === 'staff' ? c.createdBy === user.id : true;
    const statusCheck = statusFilter === 'all' 
      ? true 
      : statusFilter === 'closed' 
        ? c.status === 'resolved' 
        : statusFilter === 'escalated'
          ? c.status === 'escalated'
          : c.status === 'open' || c.status === 'in-progress';
    
    return roleCheck && statusCheck;
  });

  const activeComplaint = complaints.find(c => c.id === selectedId);

  // --- Handlers ---

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createComplaint(newTicket.subject, newTicket.category, newTicket.priority);
    // Find the ID of the newly created one implies we need to return it from context or just rely on sort.
    // For this demo, we'll reset and let user click. 
    // Ideally createComplaint would return the ID, but for simplicity we rely on React state update.
    
    // Hack: wait for state update then send initial message
    setTimeout(() => {
        // Find the newest one by this user
        const myComplaints = complaints.filter(c => c.createdBy === user.id);
        // Assuming newest is top or finding by timestamp, but Context update is async-ish.
        // In real app, we'd await API.
        // Here we just close modal.
    }, 100);
    
    setIsNewModalOpen(false);
    setNewTicket({ subject: '', category: 'Other', priority: 'medium', message: '' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedId) return;
    sendMessage(selectedId, messageText);
    setMessageText('');
    
    // If ticket was resolved, maybe reopen it? (Optional business logic)
    if (activeComplaint?.status === 'resolved') {
        updateStatus(selectedId, 'in-progress');
    }
  };

  const handleEscalate = () => {
    if (!selectedId) return;
    if (window.confirm("Are you sure you want to escalate this ticket to Super Admin?")) {
        updateStatus(selectedId, 'escalated');
        // Add system note
        sendMessage(selectedId, `*** TICKET ESCALATED TO SUPER ADMIN BY ${user.firstName.toUpperCase()} ***`);
    }
  };

  const handleResolve = () => {
    if (!selectedId) return;
    updateStatus(selectedId, 'resolved');
    sendMessage(selectedId, `*** Ticket marked as Resolved by ${user.firstName} ***`);
  };

  // --- Render Helpers ---

  const getPriorityColor = (p: string) => {
    switch(p) {
        case 'critical': return 'bg-red-100 text-red-700 border-red-200';
        case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
        default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (s: string) => {
    switch(s) {
        case 'open': return 'bg-emerald-100 text-emerald-700';
        case 'in-progress': return 'bg-blue-100 text-blue-700';
        case 'resolved': return 'bg-slate-100 text-slate-500';
        case 'escalated': return 'bg-red-50 text-red-600 border border-red-200 font-bold';
        default: return 'bg-slate-100';
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Sidebar List */}
      <Card noPadding className="w-full md:w-80 lg:w-96 flex flex-col h-full border-r border-slate-200">
        <div className="p-4 border-b border-slate-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-serif font-medium text-navy-900 text-lg">Help Desk</h2>
                <Button size="sm" onClick={() => setIsNewModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-1" /> New
                </Button>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
                {['all', 'open', 'escalated', 'closed'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setStatusFilter(filter as any)}
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                            statusFilter === filter 
                            ? 'bg-navy-900 text-white' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            {visibleComplaints.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No tickets found</p>
                </div>
            ) : (
                visibleComplaints.map(ticket => (
                    <div 
                        key={ticket.id}
                        onClick={() => setSelectedId(ticket.id)}
                        className={`p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50 ${
                            selectedId === ticket.id ? 'bg-blue-50/50 border-l-4 border-l-navy-900' : 'border-l-4 border-l-transparent'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                            </span>
                            <span className="text-[10px] text-slate-400">{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="font-medium text-navy-900 truncate mb-1">{ticket.subject}</h4>
                        <div className="flex justify-between items-center text-xs">
                             <span className="text-slate-500 truncate max-w-[120px]">{ticket.createdByName}</span>
                             <Badge className={`${getStatusColor(ticket.status)} border-none`}>{ticket.status}</Badge>
                        </div>
                    </div>
                ))
            )}
        </div>
      </Card>

      {/* Chat Area */}
      <Card noPadding className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/30">
        {selectedId && activeComplaint ? (
            <>
                {/* Chat Header */}
                <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="font-serif font-medium text-xl text-navy-900">{activeComplaint.subject}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activeComplaint.status)}`}>
                                {activeComplaint.status}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Created by {activeComplaint.createdByName} • {activeComplaint.category} • {activeComplaint.id}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {user.role !== 'staff' && activeComplaint.status !== 'resolved' && (
                             <>
                                {activeComplaint.status !== 'escalated' && user.role === 'hr' && (
                                    <Button size="sm" variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50" onClick={handleEscalate}>
                                        <ShieldAlert className="w-4 h-4 mr-1" /> Escalate
                                    </Button>
                                )}
                                <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={handleResolve}>
                                    <CheckCircle className="w-4 h-4 mr-1" /> Resolve
                                </Button>
                             </>
                        )}
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                    {activeComplaint.messages.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <p>No messages yet. Start the conversation.</p>
                        </div>
                    ) : (
                        activeComplaint.messages.map((msg, idx) => {
                            const isMe = msg.senderId === user.id;
                            const isSystem = msg.content.startsWith('***');
                            
                            if (isSystem) {
                                return (
                                    <div key={idx} className="flex justify-center my-4">
                                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                                            {msg.content.replace(/\*\*\*/g, '').trim()}
                                        </span>
                                    </div>
                                );
                            }

                            return (
                                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-xl p-3 shadow-sm ${
                                        isMe 
                                        ? 'bg-navy-900 text-white rounded-tr-none' 
                                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                                    }`}>
                                        <div className="flex items-baseline justify-between gap-4 mb-1 border-b border-white/10 pb-1">
                                            <span className={`text-xs font-bold ${isMe ? 'text-gold-400' : 'text-navy-900'}`}>
                                                {msg.senderName} 
                                                <span className="ml-1 opacity-70 font-normal uppercase text-[9px]">({msg.role})</span>
                                            </span>
                                            <span className={`text-[10px] ${isMe ? 'text-slate-300' : 'text-slate-400'}`}>{msg.timestamp}</span>
                                        </div>
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200">
                    {activeComplaint.status === 'resolved' ? (
                        <div className="text-center p-3 bg-slate-50 rounded-lg text-slate-500 text-sm">
                            This ticket has been marked as resolved. Sending a message will reopen it.
                        </div>
                    ) : null}
                    
                    <form onSubmit={handleSendMessage} className="flex gap-2 mt-2">
                        <input
                            className="flex-1 h-11 rounded-lg border border-slate-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 bg-slate-50 focus:bg-white transition-all"
                            placeholder="Type your message..."
                            value={messageText}
                            onChange={e => setMessageText(e.target.value)}
                        />
                        <Button type="submit" disabled={!messageText.trim()}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-navy-900">Support Center</h3>
                <p className="max-w-xs text-center mt-2">Select a ticket from the list to view the conversation or create a new complaint.</p>
                <Button className="mt-6" onClick={() => setIsNewModalOpen(true)}>
                    Create New Ticket
                </Button>
            </div>
        )}
      </Card>

      {/* New Ticket Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Create New Support Ticket"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
            <Input 
                label="Subject" 
                placeholder="Brief summary of the issue"
                value={newTicket.subject}
                onChange={e => setNewTicket({...newTicket, subject: e.target.value})}
                required
            />
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                    <select 
                        className="w-full h-10 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900"
                        value={newTicket.category}
                        onChange={e => setNewTicket({...newTicket, category: e.target.value as any})}
                    >
                        <option value="Payroll">Payroll</option>
                        <option value="Leave">Leave & Attendance</option>
                        <option value="Workplace">Workplace Issue</option>
                        <option value="IT">IT Support</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
                    <select 
                        className="w-full h-10 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900"
                        value={newTicket.priority}
                        onChange={e => setNewTicket({...newTicket, priority: e.target.value as any})}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
            </div>

            <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-lg">
                <p className="font-bold mb-1">Note:</p>
                All complaints are treated with confidentiality. High priority issues will be flagged to HR immediately.
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsNewModalOpen(false)}>Cancel</Button>
                <Button type="submit">Create Ticket</Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default Complaints;