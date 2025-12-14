import React, { useState } from 'react';
import { Card, Button, Input, Select, Badge } from '../components/ui/Components';
import { usePolicies } from '../App';
import { BookOpen, Search, Shield, HardDrive, Download, Calendar, User, Eye, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Policies = () => {
  const { policies } = usePolicies();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const navigate = useNavigate();

  // Filter and sort policies
  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          policy.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || policy.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime());

  const getCategoryIcon = (category: string) => {
    switch(category) {
        case 'IT': return <HardDrive className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
        case 'HR': return <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
        case 'Safety': return <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />;
        default: return <BookOpen className="w-5 h-5 text-gold-600 dark:text-gold-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
      switch(category) {
          case 'IT': return 'bg-blue-50 dark:bg-blue-900/20';
          case 'HR': return 'bg-purple-50 dark:bg-purple-900/20';
          case 'Safety': return 'bg-red-50 dark:bg-red-900/20';
          default: return 'bg-gold-50 dark:bg-gold-900/20';
      }
  };

  return (
    <div className="space-y-8">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
         <div>
            <h2 className="text-3xl font-medium text-navy-900 dark:text-white">Company Policies</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Access the latest guidelines, handbooks, and procedures</p>
         </div>
         
         <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <div className="relative w-full sm:w-64">
                 <Input 
                   placeholder="Search policies..." 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   className="pl-9"
                 />
                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
             </div>
             <div className="w-full sm:w-48">
                <Select 
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="General">General</option>
                    <option value="HR">Human Resources</option>
                    <option value="IT">IT & Security</option>
                    <option value="Safety">Safety</option>
                </Select>
             </div>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolicies.map(policy => (
              <Card 
                key={policy.id} 
                className="flex flex-col h-full hover:shadow-lg transition-all duration-300 cursor-pointer group border-l-4 border-l-transparent hover:border-l-gold-500"
                onClick={() => navigate(`/policies/${policy.id}`)}
              >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-lg ${getCategoryColor(policy.category)}`}>
                          {getCategoryIcon(policy.category)}
                      </div>
                      <Badge variant="outline">v{policy.version}</Badge>
                  </div>
                  
                  <h3 className="text-lg font-medium text-navy-900 dark:text-white mb-2 line-clamp-2 group-hover:text-gold-600 dark:group-hover:text-gold-500 transition-colors">
                      {policy.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-1 line-clamp-3 leading-relaxed">
                      {policy.content}
                  </p>

                  <div className="pt-4 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between mt-auto">
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {policy.dateUpdated}
                      </div>
                      <span className="text-sm font-medium text-gold-600 dark:text-gold-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Read Policy <ArrowRight className="w-3 h-3" />
                      </span>
                  </div>
              </Card>
          ))}
       </div>
       
       {filteredPolicies.length === 0 && (
           <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-navy-900 rounded-xl border border-dashed border-slate-200 dark:border-navy-700">
               <div className="w-16 h-16 bg-slate-50 dark:bg-navy-800 rounded-full flex items-center justify-center mb-4">
                   <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
               </div>
               <h3 className="text-lg font-medium text-navy-900 dark:text-white">No policies found</h3>
               <p className="text-slate-500 text-sm mt-1 max-w-xs text-center">We couldn't find any policies matching your search criteria.</p>
               <Button variant="outline" className="mt-4" onClick={() => {setSearchTerm(''); setCategoryFilter('All');}}>
                   Clear Filters
               </Button>
           </div>
       )}
    </div>
  );
};

export default Policies;