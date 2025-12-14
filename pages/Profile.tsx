import React, { useState } from 'react';
import { useAuth, useToast } from '../App';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, Badge, Select } from '../components/ui/Components';
import { 
  User, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, Save, X, 
  FileText, CreditCard, Clock, Shield, Award, Building2, Wallet, 
  CheckCircle, AlertCircle, Camera, Hash, Globe
} from 'lucide-react';
import IDCardModal from '../components/IDCardModal';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'personal' | 'employment' | 'banking'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isIDModalOpen, setIsIDModalOpen] = useState(false);
  
  // Form Data
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    location: user?.location || '',
    address: '123 Innovation Dr, Suite 100', // Mock data
    city: 'Abuja',
    state: 'FCT',
    nationality: 'Nigerian',
    dob: '1990-05-15',
    bankName: 'First Bank of Nigeria',
    accountNumber: '3049218842',
    accountName: `${user?.firstName} ${user?.lastName}`.toUpperCase()
  });

  if (!user) return null;

  const handleSave = () => {
    setIsEditing(false);
    toast('success', "Profile changes submitted for approval.", "Update Request Sent");
  };

  const getServiceDuration = (dateString: string) => {
    const start = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    
    if (years > 0) return `${years} Years, ${months} Months`;
    return `${months} Months`;
  };

  // --- Components ---

  const InfoRow = ({ icon: Icon, label, value, editable = false, field = '', type="text" }: any) => (
    <div className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-navy-800 last:border-0">
      <div className="p-2 bg-slate-50 dark:bg-navy-900 rounded-lg text-slate-500 dark:text-slate-400">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
        {editable && isEditing ? (
          <input 
            type={type}
            className="w-full mt-1 bg-white dark:bg-navy-950 border border-slate-300 dark:border-navy-600 rounded px-2 py-1 text-sm text-navy-900 dark:text-white focus:ring-2 focus:ring-gold-500 outline-none"
            value={formData[field as keyof typeof formData]}
            onChange={(e) => setFormData({...formData, [field]: e.target.value})}
          />
        ) : (
          <p className="text-base font-medium text-navy-900 dark:text-white mt-0.5">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-8">
      
      {/* --- Hero Section --- */}
      <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-navy-900 shadow-sm border border-slate-200 dark:border-navy-800">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-navy-900 via-navy-800 to-emerald-900 dark:from-navy-950 dark:to-navy-900 relative">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            <div className="absolute bottom-4 right-4 flex gap-2">
                <Button 
                    variant="secondary" 
                    size="sm" 
                    className="backdrop-blur-md bg-white/10 hover:bg-white/20 text-white border-white/20"
                    onClick={() => setIsIDModalOpen(true)}
                >
                    <CreditCard className="w-4 h-4 mr-2" /> View ID Card
                </Button>
            </div>
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8 flex flex-col md:flex-row gap-6 items-start">
            <div className="relative -mt-16">
                <div className="w-32 h-32 rounded-2xl border-4 border-white dark:border-navy-900 shadow-xl bg-white dark:bg-navy-800 overflow-hidden relative group">
                    <img 
                        src={user.avatarUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <Camera className="w-8 h-8 text-white" />
                    </div>
                </div>
                <div className={`absolute bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white dark:border-navy-900 ${user.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            </div>

            <div className="flex-1 mt-4 md:mt-0 pt-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-navy-900 dark:text-white flex items-center gap-3">
                            {user.firstName} {user.lastName}
                            <Badge variant={user.status === 'active' ? 'success' : 'warning'} className="text-xs align-middle">
                                {user.status}
                            </Badge>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 mt-1">
                            <Briefcase className="w-4 h-4" /> {user.position} 
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                            {user.department}
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                                <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- Main Content Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-6">
              <nav className="flex flex-col space-y-1">
                 {[
                   { id: 'overview', label: 'Overview', icon: User },
                   { id: 'personal', label: 'Personal Info', icon: FileText },
                   { id: 'employment', label: 'Employment', icon: Briefcase },
                   { id: 'banking', label: 'Banking & Tax', icon: Wallet },
                 ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                            ${activeTab === item.id 
                                ? 'bg-navy-900 text-white shadow-md dark:bg-gold-500 dark:text-navy-900' 
                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800'
                            }
                        `}
                    >
                        <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-gold-500 dark:text-navy-900' : 'text-slate-400'}`} />
                        {item.label}
                    </button>
                 ))}
              </nav>

              {/* Quick Contact Card */}
              <Card className="bg-gradient-to-br from-slate-50 to-white dark:from-navy-900 dark:to-navy-800">
                  <h3 className="font-medium text-navy-900 dark:text-white mb-4">Contact</h3>
                  <div className="space-y-4">
                      <div className="flex items-start gap-3">
                          <Mail className="w-4 h-4 text-slate-400 mt-1" />
                          <div>
                              <p className="text-xs text-slate-500 uppercase font-bold">Work Email</p>
                              <p className="text-sm font-medium text-navy-900 dark:text-white break-all">{user.email}</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-3">
                          <Phone className="w-4 h-4 text-slate-400 mt-1" />
                          <div>
                              <p className="text-xs text-slate-500 uppercase font-bold">Mobile</p>
                              <p className="text-sm font-medium text-navy-900 dark:text-white">{user.phone || 'Not set'}</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                          <div>
                              <p className="text-xs text-slate-500 uppercase font-bold">Location</p>
                              <p className="text-sm font-medium text-navy-900 dark:text-white">{user.location || 'HQ, Abuja'}</p>
                          </div>
                      </div>
                  </div>
              </Card>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-9 space-y-6">
              
              {/* --- OVERVIEW TAB --- */}
              {activeTab === 'overview' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      {/* Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30">
                              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                  <Clock className="w-6 h-6" />
                              </div>
                              <div>
                                  <p className="text-xs font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase">Service Time</p>
                                  <p className="text-lg font-bold text-navy-900 dark:text-white">{getServiceDuration(user.joinDate)}</p>
                              </div>
                          </Card>
                          <Card className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
                              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                                  <Calendar className="w-6 h-6" />
                              </div>
                              <div>
                                  <p className="text-xs font-bold text-blue-600/70 dark:text-blue-400/70 uppercase">Leave Balance</p>
                                  <p className="text-lg font-bold text-navy-900 dark:text-white">12 Days</p>
                              </div>
                          </Card>
                          <Card className="flex items-center gap-4 bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30">
                              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
                                  <Award className="w-6 h-6" />
                              </div>
                              <div>
                                  <p className="text-xs font-bold text-amber-600/70 dark:text-amber-400/70 uppercase">Rating</p>
                                  <p className="text-lg font-bold text-navy-900 dark:text-white">Excellent</p>
                              </div>
                          </Card>
                      </div>

                      <Card>
                          <h3 className="font-medium text-lg text-navy-900 dark:text-white mb-4">About Me</h3>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                              Dedicated and results-oriented professional with over {getServiceDuration(user.joinDate).split(',')[0]} of experience in the {user.department} department. 
                              Committed to maintaining high standards of service and operational efficiency within the Nigerian Correctional Service. 
                              Skilled in team leadership, strategic planning, and crisis management.
                          </p>
                      </Card>

                      <Card>
                          <h3 className="font-medium text-lg text-navy-900 dark:text-white mb-4">Recent Activity</h3>
                          <div className="space-y-6 relative pl-2">
                              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-navy-800"></div>
                              {[
                                { title: 'Updated Bio-Data', date: '2 days ago', icon: User, color: 'bg-blue-500' },
                                { title: 'Annual Leave Approved', date: '1 week ago', icon: CheckCircle, color: 'bg-emerald-500' },
                                { title: 'Submitted Q3 Report', date: '2 weeks ago', icon: FileText, color: 'bg-navy-500' },
                              ].map((activity, i) => (
                                  <div key={i} className="flex items-start gap-4 relative z-10">
                                      <div className={`w-4 h-4 rounded-full mt-1 border-2 border-white dark:border-navy-900 ${activity.color}`}></div>
                                      <div className="flex-1 bg-slate-50 dark:bg-navy-800/50 p-3 rounded-lg border border-slate-100 dark:border-navy-800">
                                          <p className="text-sm font-medium text-navy-900 dark:text-white">{activity.title}</p>
                                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                                              <Clock className="w-3 h-3" /> {activity.date}
                                          </p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </Card>
                  </div>
              )}

              {/* --- PERSONAL INFO TAB --- */}
              {activeTab === 'personal' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <Card>
                          <div className="flex justify-between items-center mb-6">
                             <h3 className="font-medium text-lg text-navy-900 dark:text-white">Personal Information</h3>
                             {!isEditing && (
                                 <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                                     <Edit2 className="w-4 h-4 mr-2" /> Edit
                                 </Button>
                             )}
                          </div>
                          <div className="space-y-1">
                              <InfoRow icon={User} label="Full Name" value={`${user.firstName} ${user.lastName}`} />
                              <InfoRow icon={Globe} label="Nationality" value={formData.nationality} editable field="nationality" />
                              <InfoRow icon={Calendar} label="Date of Birth" value={formData.dob} editable field="dob" type="date" />
                              <InfoRow icon={Hash} label="Marital Status" value="Married" editable field="maritalStatus" />
                          </div>
                      </Card>

                      <Card>
                          <h3 className="font-medium text-lg text-navy-900 dark:text-white mb-6">Address Details</h3>
                          <div className="space-y-1">
                              <InfoRow icon={MapPin} label="Street Address" value={formData.address} editable field="address" />
                              <InfoRow icon={Building2} label="City" value={formData.city} editable field="city" />
                              <InfoRow icon={MapPin} label="State / Province" value={formData.state} editable field="state" />
                          </div>
                      </Card>
                  </div>
              )}
              
              {/* --- EMPLOYMENT TAB --- */}
              {activeTab === 'employment' && (
                   <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <Card>
                          <h3 className="font-medium text-lg text-navy-900 dark:text-white mb-6">Job Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="p-4 bg-slate-50 dark:bg-navy-900 rounded-lg border border-slate-100 dark:border-navy-800">
                                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Staff ID</p>
                                  <p className="text-lg font-mono font-medium text-navy-900 dark:text-white">{user.id.toUpperCase()}</p>
                              </div>
                              <div className="p-4 bg-slate-50 dark:bg-navy-900 rounded-lg border border-slate-100 dark:border-navy-800">
                                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Department</p>
                                  <p className="text-lg font-medium text-navy-900 dark:text-white">{user.department}</p>
                              </div>
                              <div className="p-4 bg-slate-50 dark:bg-navy-900 rounded-lg border border-slate-100 dark:border-navy-800">
                                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Date Joined</p>
                                  <p className="text-lg font-medium text-navy-900 dark:text-white">{user.joinDate}</p>
                              </div>
                              <div className="p-4 bg-slate-50 dark:bg-navy-900 rounded-lg border border-slate-100 dark:border-navy-800">
                                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Contract Type</p>
                                  <p className="text-lg font-medium text-navy-900 dark:text-white">Permanent / Full-Time</p>
                              </div>
                          </div>
                      </Card>
                      
                      <Card>
                          <h3 className="font-medium text-lg text-navy-900 dark:text-white mb-6">Reporting Line</h3>
                          <div className="flex items-center gap-4 p-4 border border-slate-200 dark:border-navy-700 rounded-lg">
                              <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-navy-800 flex items-center justify-center font-bold text-slate-500">
                                  EV
                              </div>
                              <div>
                                  <p className="font-medium text-navy-900 dark:text-white">Evelyn Vance</p>
                                  <p className="text-sm text-slate-500">Director of Operations</p>
                              </div>
                              <div className="ml-auto">
                                  <Button size="sm" variant="outline">Contact</Button>
                              </div>
                          </div>
                      </Card>
                   </div>
              )}

              {/* --- BANKING TAB --- */}
              {activeTab === 'banking' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Visual Bank Card */}
                          <div className="h-56 rounded-2xl bg-gradient-to-br from-slate-800 to-black p-6 text-white shadow-2xl relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500/20 rounded-full blur-3xl -ml-10 -mb-10"></div>
                              
                              <div className="relative z-10 h-full flex flex-col justify-between">
                                  <div className="flex justify-between items-start">
                                      <img src="/chip.png" alt="" className="w-12 h-10 opacity-80 bg-gold-300/20 rounded-md" />
                                      <span className="font-medium italic text-xl tracking-wider opacity-90">{formData.bankName}</span>
                                  </div>
                                  
                                  <div className="font-mono text-2xl tracking-widest mt-4 shadow-black drop-shadow-md">
                                      **** **** **** {formData.accountNumber.slice(-4)}
                                  </div>
                                  
                                  <div className="flex justify-between items-end mt-auto">
                                      <div>
                                          <p className="text-[10px] text-slate-300 uppercase tracking-widest mb-1">Card Holder</p>
                                          <p className="font-medium uppercase tracking-wide text-sm">{formData.accountName}</p>
                                      </div>
                                      <div className="text-right">
                                           <p className="text-[10px] text-slate-300 uppercase tracking-widest mb-1">Expires</p>
                                           <p className="font-medium">12/28</p>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          <Card>
                               <div className="flex justify-between items-center mb-4">
                                  <h3 className="font-medium text-lg text-navy-900 dark:text-white">Bank Details</h3>
                                  <Button size="sm" variant="ghost" onClick={() => setIsEditing(!isEditing)}>
                                      {isEditing ? 'Cancel' : 'Edit'}
                                  </Button>
                               </div>
                               <div className="space-y-4">
                                   <div>
                                       <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Bank Name</label>
                                       {isEditing ? (
                                           <Input value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} />
                                       ) : (
                                           <p className="text-navy-900 dark:text-white font-medium">{formData.bankName}</p>
                                       )}
                                   </div>
                                   <div>
                                       <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Account Number</label>
                                       {isEditing ? (
                                           <Input value={formData.accountNumber} onChange={e => setFormData({...formData, accountNumber: e.target.value})} />
                                       ) : (
                                           <p className="text-navy-900 dark:text-white font-mono font-medium">{formData.accountNumber}</p>
                                       )}
                                   </div>
                                   <div>
                                       <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Tax ID (TIN)</label>
                                       <p className="text-navy-900 dark:text-white font-mono font-medium">2948-2991-9922</p>
                                   </div>
                               </div>
                               {isEditing && (
                                   <Button className="w-full mt-6" onClick={handleSave}>Request Update</Button>
                               )}
                          </Card>
                      </div>

                      <Card>
                          <h3 className="font-medium text-lg text-navy-900 dark:text-white mb-6">Pension & Tax</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <InfoRow icon={Hash} label="Pension Fund Administrator" value="Premium Pension Ltd" />
                              <InfoRow icon={Hash} label="RSA Number" value="PEN100293844" />
                          </div>
                      </Card>
                  </div>
              )}

          </div>
      </div>

      <IDCardModal 
        isOpen={isIDModalOpen}
        onClose={() => setIsIDModalOpen(false)}
        user={user}
      />
    </div>
  );
};

export default Profile;