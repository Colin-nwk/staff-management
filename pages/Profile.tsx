import React, { useState } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, Badge } from '../components/ui/Components';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, Save, X, FileText, CreditCard } from 'lucide-react';
import IDCardModal from '../components/IDCardModal';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isIDModalOpen, setIsIDModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    location: user?.location || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || ''
  });

  if (!user) return null;

  const handleSave = () => {
    setIsEditing(false);
    alert("Changes submitted for approval!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-navy-900 to-navy-800 dark:from-navy-950 dark:to-navy-900 rounded-t-xl overflow-hidden">
          <div className="absolute inset-0 opacity-20">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
        <Card className="rounded-t-none -mt-4 pt-16 px-8 pb-8 relative">
          <div className="absolute -top-16 left-8">
            <div className="relative">
              <img 
                src={user.avatarUrl} 
                alt="Profile" 
                className="w-32 h-32 rounded-xl border-4 border-white dark:border-navy-800 shadow-lg object-cover bg-white dark:bg-navy-900"
              />
              <button className="absolute bottom-2 right-2 p-1.5 bg-white dark:bg-navy-700 rounded-full shadow-md text-slate-600 dark:text-slate-200 hover:text-navy-900 dark:hover:text-white transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h2 className="text-3xl font-serif font-semibold text-navy-900 dark:text-white">{user.firstName} {user.lastName}</h2>
              <div className="flex items-center gap-2 mt-1 text-slate-500 dark:text-slate-400">
                <Briefcase className="w-4 h-4" />
                <span>{user.position}</span>
                <span className="mx-1">•</span>
                <span>{user.department}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {isEditing ? (
                <>
                  <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsIDModalOpen(true)} className="text-navy-900 dark:text-gold-500 border-navy-200 dark:border-navy-600">
                     <CreditCard className="w-4 h-4 mr-2" />
                     View ID Card
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/bio-data')}>
                     <FileText className="w-4 h-4 mr-2" />
                     Update Bio Data
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Basic Info</Button>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
             <h3 className="font-serif font-medium text-lg mb-4 text-navy-900 dark:text-white">Contact Info</h3>
             <div className="space-y-4">
               <div className="flex items-center gap-3 text-sm">
                 <div className="p-2 bg-slate-50 dark:bg-navy-700 rounded text-slate-500 dark:text-slate-400"><Mail className="w-4 h-4" /></div>
                 <div className="flex-1 overflow-hidden">
                   <p className="text-slate-400 dark:text-slate-500 text-xs">Email</p>
                   <p className="text-slate-700 dark:text-slate-200 font-medium truncate">{user.email}</p>
                 </div>
               </div>
               <div className="flex items-center gap-3 text-sm">
                 <div className="p-2 bg-slate-50 dark:bg-navy-700 rounded text-slate-500 dark:text-slate-400"><Phone className="w-4 h-4" /></div>
                 <div className="flex-1">
                   <p className="text-slate-400 dark:text-slate-500 text-xs">Phone</p>
                   {isEditing ? (
                     <input 
                        className="border-b border-slate-300 dark:border-slate-600 focus:border-navy-900 dark:focus:border-gold-500 outline-none w-full bg-transparent text-slate-900 dark:text-white"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                     />
                   ) : (
                     <p className="text-slate-700 dark:text-slate-200 font-medium">{user.phone}</p>
                   )}
                 </div>
               </div>
               <div className="flex items-center gap-3 text-sm">
                 <div className="p-2 bg-slate-50 dark:bg-navy-700 rounded text-slate-500 dark:text-slate-400"><MapPin className="w-4 h-4" /></div>
                 <div className="flex-1">
                   <p className="text-slate-400 dark:text-slate-500 text-xs">Location</p>
                   {isEditing ? (
                     <input 
                        className="border-b border-slate-300 dark:border-slate-600 focus:border-navy-900 dark:focus:border-gold-500 outline-none w-full bg-transparent text-slate-900 dark:text-white"
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                     />
                   ) : (
                     <p className="text-slate-700 dark:text-slate-200 font-medium">{user.location}</p>
                   )}
                 </div>
               </div>
             </div>
          </Card>

          <Card>
            <h3 className="font-serif font-medium text-lg mb-4 text-navy-900 dark:text-white">Employment</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Employee ID</span>
                <span className="font-mono text-slate-700 dark:text-slate-200 font-medium">{user.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Join Date</span>
                <span className="text-slate-700 dark:text-slate-200 font-medium">{user.joinDate}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Status</span>
                <Badge variant="success">{user.status}</Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Contract Type</span>
                <span className="text-slate-700 dark:text-slate-200 font-medium">Full Time</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif font-medium text-lg text-navy-900 dark:text-white">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <Input 
                  label="First Name" 
                  value={formData.firstName} 
                  disabled={!isEditing}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
               />
               <Input 
                  label="Last Name" 
                  value={formData.lastName} 
                  disabled={!isEditing}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
               />
               <Input 
                  label="Nationality" 
                  defaultValue="United States" 
                  disabled={!isEditing}
               />
               <Input 
                  label="Date of Birth" 
                  type="date"
                  defaultValue="1990-05-15"
                  disabled={!isEditing}
               />
               <div className="sm:col-span-2">
                 <Input 
                    label="Address" 
                    defaultValue="123 Innovation Dr, Suite 100" 
                    disabled={!isEditing}
                 />
               </div>
            </div>
          </Card>

          <Card>
             <h3 className="font-serif font-medium text-lg text-navy-900 dark:text-white mb-6">Bank Information</h3>
             <div className="bg-slate-50 dark:bg-navy-700/50 border border-slate-200 dark:border-navy-700 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white dark:bg-navy-900 rounded border border-slate-200 dark:border-navy-700 flex items-center justify-center">
                      <span className="font-serif font-bold text-navy-900 dark:text-gold-500 text-lg">Chase</span>
                   </div>
                   <div>
                      <p className="font-medium text-navy-900 dark:text-white">JP Morgan Chase</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">**** **** **** 4291</p>
                   </div>
                </div>
                {isEditing && <Button variant="ghost" size="sm">Edit</Button>}
             </div>
          </Card>
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