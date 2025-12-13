import React, { useState } from 'react';
import { useAuth, useApprovals, useNotifications } from '../App';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Modal, Input, TextArea } from '../components/ui/Components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Clock, Calendar, FileText, CheckCircle, ArrowUpRight, ArrowRight, UploadCloud, UserCircle, Users } from 'lucide-react';

const StatCard = ({ title, value, sub, icon: Icon, color = 'navy' }: any) => (
  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
      <Icon className="w-24 h-24 transform rotate-12 -mr-4 -mt-4 text-navy-900 dark:text-white" />
    </div>
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${color === 'gold' ? 'bg-gold-100 text-gold-600 dark:bg-gold-500/20 dark:text-gold-400' : 'bg-navy-50 text-navy-900 dark:bg-navy-700 dark:text-navy-200'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-serif font-semibold text-navy-900 dark:text-white">{value}</span>
        {sub && <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center">{sub} <ArrowUpRight className="w-3 h-3 ml-0.5" /></span>}
      </div>
    </div>
  </Card>
);

const StaffDashboard = () => {
  const { user } = useAuth();
  const { addApproval } = useApprovals();
  const { notifications, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaveData, setLeaveData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      addApproval({
        type: 'Leave Request',
        user: user ? `${user.firstName} ${user.lastName}` : 'Staff Member',
        detail: `${leaveData.reason} (${leaveData.startDate} to ${leaveData.endDate})`
      });

      setIsSubmitting(false);
      setIsLeaveModalOpen(false);
      setLeaveData({ startDate: '', endDate: '', reason: '' });
      alert("Leave request submitted successfully! HR will review it shortly.");
    }, 1500);
  };

  const recentNotifications = notifications.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Leave Balance" value="12 Days" sub="Annual" icon={Calendar} color="navy" />
        <StatCard title="Pending Docs" value="1" sub="Action Required" icon={FileText} color="gold" />
        <StatCard title="Next Review" value="Nov 15" sub="In 2 months" icon={Clock} color="navy" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-serif text-xl font-medium text-navy-900 dark:text-white mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {[
                { title: 'Leave Request Approved', date: 'Today', icon: CheckCircle, color: 'text-emerald-500' },
                { title: 'Uploaded ID Document', date: 'Yesterday', icon: FileText, color: 'text-blue-500 dark:text-blue-400' },
                { title: 'Profile Updated', date: '3 days ago', icon: Clock, color: 'text-slate-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`mt-1 ${item.color}`}><item.icon className="w-5 h-5" /></div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{item.title}</p>
                    <p className="text-sm text-slate-400">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-navy-900 dark:text-slate-200">View All Activity</Button>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-medium text-navy-900 dark:text-white">Notifications</h3>
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>Mark all read</Button>
            </div>
            <div className="space-y-4">
              {recentNotifications.length > 0 ? (
                recentNotifications.map(notif => (
                  <div key={notif.id} className={`p-4 rounded-lg border ${notif.read ? 'bg-white dark:bg-navy-900 border-slate-100 dark:border-navy-700' : 'bg-blue-50/50 dark:bg-navy-800 border-blue-100 dark:border-navy-600'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-semibold ${notif.read ? 'text-slate-700 dark:text-slate-300' : 'text-navy-900 dark:text-white'}`}>{notif.title}</span>
                      <span className="text-xs text-slate-400">{notif.date}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{notif.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 py-4">No new notifications</div>
              )}
            </div>
          </Card>
        </div>

        <div>
           <Card>
              <h3 className="font-serif text-xl font-medium text-navy-900 dark:text-white mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Button onClick={() => setIsLeaveModalOpen(true)} className="w-full justify-between group">
                  <span>Request Leave</span>
                  <Calendar className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" onClick={() => navigate('/documents')} className="w-full justify-between group">
                  <span>Upload Document</span>
                  <UploadCloud className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" onClick={() => navigate('/profile')} className="w-full justify-between group">
                  <span>Edit Profile</span>
                  <UserCircle className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
           </Card>
        </div>
      </div>

      <Modal 
        isOpen={isLeaveModalOpen} 
        onClose={() => setIsLeaveModalOpen(false)} 
        title="Submit Leave Request"
      >
        <form onSubmit={handleLeaveSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Start Date" 
              type="date" 
              required 
              value={leaveData.startDate}
              onChange={e => setLeaveData({...leaveData, startDate: e.target.value})}
            />
            <Input 
              label="End Date" 
              type="date" 
              required 
              value={leaveData.endDate}
              onChange={e => setLeaveData({...leaveData, endDate: e.target.value})}
            />
          </div>
          <TextArea 
            label="Reason" 
            placeholder="Please describe the reason for your leave..."
            rows={4}
            required
            value={leaveData.reason}
            onChange={e => setLeaveData({...leaveData, reason: e.target.value})}
          />
          <div className="flex justify-end gap-3 pt-2">
             <Button type="button" variant="ghost" onClick={() => setIsLeaveModalOpen(false)}>Cancel</Button>
             <Button type="submit" isLoading={isSubmitting}>Submit Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const HRDashboard = () => {
  const { approvals } = useApprovals();
  const pendingCount = approvals.filter(a => a.status === 'pending').length;

  const data = [
    { name: 'Mon', active: 40, leave: 2 },
    { name: 'Tue', active: 38, leave: 4 },
    { name: 'Wed', active: 41, leave: 1 },
    { name: 'Thu', active: 39, leave: 3 },
    { name: 'Fri', active: 35, leave: 7 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Staff" value="142" sub="+12% this month" icon={Users} color="navy" />
        <StatCard title="On Leave" value="8" sub="Today" icon={Calendar} color="gold" />
        <StatCard title="Pending Approvals" value={pendingCount} sub="Urgent" icon={CheckCircle} color="navy" />
        <StatCard title="Open Roles" value="3" sub="Hiring" icon={FileText} color="navy" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="font-serif text-xl font-medium text-navy-900 dark:text-white mb-6">Staff Attendance Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" strokeOpacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="active" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={40} className="dark:fill-slate-200" />
                <Bar dataKey="leave" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-serif text-xl font-medium text-navy-900 dark:text-white mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="primary" className="w-full justify-between group">
              <span>Approve Leave Requests</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" className="w-full justify-between group">
              <span>Add New Staff</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" className="w-full justify-between group">
              <span>Generate Report</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" className="w-full justify-between group">
              <span>Update Policies</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const AdminDashboard = () => (
  <div className="space-y-6">
     <div className="bg-navy-900 dark:bg-navy-800 rounded-xl p-6 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h2 className="font-serif text-2xl font-medium mb-2">System Status: Healthy</h2>
            <p className="text-slate-400">All services operational. Last backup: 2 hours ago.</p>
          </div>
          <Button variant="secondary" size="sm">Run Diagnostics</Button>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
           <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 100 Q 75 50, 150 100 T 300 100" stroke="white" strokeWidth="20" fill="none" />
           </svg>
        </div>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Active Users" value="156" sub="Total" icon={Users} color="navy" />
        <StatCard title="System Load" value="24%" sub="Low" icon={Clock} color="gold" />
        <StatCard title="Audit Logs" value="2.4k" sub="+120 today" icon={FileText} color="navy" />
     </div>

     <Card>
       <h3 className="font-serif text-xl font-medium text-navy-900 dark:text-white mb-6">User Access Logs</h3>
       <div className="overflow-x-auto">
         <table className="w-full text-left text-sm">
           <thead>
             <tr className="border-b border-slate-200 dark:border-navy-700 text-slate-500 dark:text-slate-400">
               <th className="pb-3 font-medium">User</th>
               <th className="pb-3 font-medium">Action</th>
               <th className="pb-3 font-medium">IP Address</th>
               <th className="pb-3 font-medium">Time</th>
               <th className="pb-3 font-medium">Status</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100 dark:divide-navy-700">
             {[
               { u: 'Sarah Chen', a: 'Login', ip: '192.168.1.1', t: '2 mins ago', s: 'Success' },
               { u: 'Marcus Reynolds', a: 'Update Profile', ip: '192.168.1.4', t: '15 mins ago', s: 'Success' },
               { u: 'System', a: 'Backup', ip: 'localhost', t: '2 hours ago', s: 'Success' },
               { u: 'John Doe', a: 'Failed Login', ip: '10.0.0.5', t: '3 hours ago', s: 'Failed' },
             ].map((log, i) => (
               <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors">
                 <td className="py-3 font-medium text-navy-900 dark:text-slate-200">{log.u}</td>
                 <td className="py-3 text-slate-600 dark:text-slate-400">{log.a}</td>
                 <td className="py-3 text-slate-500 font-mono text-xs">{log.ip}</td>
                 <td className="py-3 text-slate-500">{log.t}</td>
                 <td className="py-3">
                   <Badge variant={log.s === 'Success' ? 'success' : 'error'}>{log.s}</Badge>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     </Card>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-medium text-navy-900 dark:text-white">Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user.firstName}. Here's what's happening today.</p>
      </div>
      
      {user.role === 'staff' && <StaffDashboard />}
      {user.role === 'hr' && <HRDashboard />}
      {user.role === 'admin' && <AdminDashboard />}
    </div>
  );
};

export default Dashboard;