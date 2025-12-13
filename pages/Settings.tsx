import React, { useState } from 'react';
import { Card, Button, Input } from '../components/ui/Components';
import { Shield, Bell, Database, Save } from 'lucide-react';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <Card noPadding>
          <nav className="flex flex-col">
            {[
              { id: 'general', label: 'General Settings', icon: Database },
              { id: 'security', label: 'Security & Access', icon: Shield },
              { id: 'notifications', label: 'Notifications', icon: Bell },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium text-left border-l-4 transition-colors ${
                  activeSection === item.id 
                    ? 'border-navy-900 bg-slate-50 text-navy-900' 
                    : 'border-transparent text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <Card>
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-serif text-xl font-medium text-navy-900">
               {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Settings
             </h3>
             <Button>
               <Save className="w-4 h-4 mr-2" /> Save Changes
             </Button>
          </div>

          {activeSection === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Company Name" defaultValue="Nexus Inc." />
                <Input label="Support Email" defaultValue="support@nexus.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">System Maintenance Mode</label>
                <div className="flex items-center gap-3">
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full border border-slate-300 bg-slate-200">
                    <input type="checkbox" className="absolute opacity-0 w-full h-full cursor-pointer"/>
                    <label className="block overflow-hidden h-6 rounded-full bg-slate-200 cursor-pointer"></label>
                  </div>
                  <span className="text-sm text-slate-500">Prevents users from logging in during updates</span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
             <div className="space-y-6">
               <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                 Changing these settings may require all users to re-login.
               </div>
               <div className="space-y-4">
                 <div>
                   <h4 className="font-medium text-navy-900">Password Policy</h4>
                   <div className="mt-2 space-y-2">
                     <label className="flex items-center">
                       <input type="checkbox" checked readOnly className="mr-2 text-navy-900 focus:ring-navy-900" />
                       <span className="text-sm text-slate-600">Require special characters</span>
                     </label>
                     <label className="flex items-center">
                       <input type="checkbox" checked readOnly className="mr-2 text-navy-900 focus:ring-navy-900" />
                       <span className="text-sm text-slate-600">Minimum 12 characters</span>
                     </label>
                   </div>
                 </div>
                 <div className="pt-4 border-t border-slate-100">
                   <h4 className="font-medium text-navy-900 mb-2">Session Timeout</h4>
                   <select className="w-full md:w-64 rounded-md border border-slate-300 p-2 text-sm">
                     <option>15 minutes</option>
                     <option>30 minutes</option>
                     <option selected>1 hour</option>
                     <option>4 hours</option>
                   </select>
                 </div>
               </div>
             </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
               <h4 className="font-medium text-navy-900">Email Alerts</h4>
               <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <span className="text-sm text-slate-700">New Staff Registration</span>
                    <input type="checkbox" checked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <span className="text-sm text-slate-700">Critical System Alerts</span>
                    <input type="checkbox" checked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <span className="text-sm text-slate-700">Weekly Summary Reports</span>
                    <input type="checkbox" className="toggle" />
                  </div>
               </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Settings;