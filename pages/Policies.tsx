import React, { useState } from 'react';
import { Card, Input, Button } from '../components/ui/Components';
import { usePolicies } from '../App';
import { BookOpen, Search, Shield, HardDrive, Download, Calendar, User } from 'lucide-react';

const Policies = () => {
  const { policies } = usePolicies();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Filter and sort policies
  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          policy.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || policy.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime());

  const getCategoryIcon = (category: string) => {
    switch(category) {
        case 'IT': return <HardDrive className="w-5 h-5 text-blue-500" />;
        case 'HR': return <User className="w-5 h-5 text-purple-500" />;
        case 'Safety': return <Shield className="w-5 h-5 text-red-500" />;
        default: return <BookOpen className="w-5 h-5 text-gold-500" />;
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h2 className="text-3xl font-serif font-medium text-navy-900 dark:text-white">Company Policies</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Access the latest guidelines and handbooks</p>
         </div>
         
         <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <div className="relative">
                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Search policies..." 
                   className="pl-9 h-10 w-full sm:w-64 rounded-md border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 dark:focus:ring-gold-500"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
             </div>
             <select 
                className="h-10 rounded-md border border-slate-300 dark:border-navy-600 bg-white dark:bg-navy-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 dark:focus:ring-gold-500"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
             >
                <option value="All">All Categories</option>
                <option value="General">General</option>
                <option value="HR">Human Resources</option>
                <option value="IT">IT & Security</option>
                <option value="Safety">Safety</option>
             </select>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolicies.map(policy => (
              <Card key={policy.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-navy-900 dark:border-t-gold-500">
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-slate-50 dark:bg-navy-700 rounded-lg">
                          {getCategoryIcon(policy.category)}
                      </div>
                      <span className="px-2 py-1 text-xs font-bold bg-slate-100 dark:bg-navy-700 text-slate-600 dark:text-slate-300 rounded uppercase tracking-wider">
                          v{policy.version}
                      </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2 line-clamp-2">{policy.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-1 line-clamp-3">
                      {policy.content}
                  </p>

                  <div className="pt-4 border-t border-slate-100 dark:border-navy-700 flex items-center justify-between">
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {policy.dateUpdated}
                      </div>
                      <Button variant="ghost" size="sm" className="text-navy-900 dark:text-gold-400 hover:text-navy-700 dark:hover:text-gold-300 px-2">
                          <Download className="w-4 h-4 mr-1" /> PDF
                      </Button>
                  </div>
              </Card>
          ))}
       </div>
       
       {filteredPolicies.length === 0 && (
           <div className="text-center py-12 bg-slate-50 dark:bg-navy-800/50 rounded-xl border border-dashed border-slate-300 dark:border-navy-700">
               <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
               <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">No policies found</h3>
               <p className="text-slate-400">Try adjusting your search or category filter.</p>
           </div>
       )}
    </div>
  );
};

export default Policies;