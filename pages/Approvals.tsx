import React, { useState } from 'react';
import { Card, Button, Badge, Modal } from '../components/ui/Components';
import { useApprovals, useDocuments } from '../App';
import { CheckCircle, XCircle, Clock, Check, X, Eye, FileText, Download } from 'lucide-react';
import { ApprovalItem } from '../types';

const Approvals = () => {
  const { approvals, processApproval } = useApprovals();
  const { documents } = useDocuments();

  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [reviewItem, setReviewItem] = useState<ApprovalItem | null>(null);
  
  // Local state for tracking field decisions in the modal
  const [fieldDecisions, setFieldDecisions] = useState<Record<string, 'approved' | 'rejected'>>({});

  const filteredApprovals = approvals.filter(item => {
    if (activeTab === 'pending') return item.status === 'pending';
    return item.status !== 'pending';
  });

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    processApproval(id, action === 'approve' ? 'approved' : 'rejected');
  };

  const openReviewModal = (item: ApprovalItem) => {
    setReviewItem(item);
    // Initialize all fields as approved by default for convenience
    if (item.data && item.type === 'Bio Data') {
        const initialDecisions: Record<string, 'approved' | 'rejected'> = {};
        Object.keys(item.data).forEach(key => {
            initialDecisions[key] = 'approved';
        });
        setFieldDecisions(initialDecisions);
    }
  };

  const closeReviewModal = () => {
    setReviewItem(null);
    setFieldDecisions({});
  };

  const toggleFieldDecision = (field: string) => {
    setFieldDecisions(prev => ({
        ...prev,
        [field]: prev[field] === 'approved' ? 'rejected' : 'approved'
    }));
  };

  const submitBioDataReview = () => {
      if (!reviewItem) return;

      const allApproved = Object.values(fieldDecisions).every(status => status === 'approved');
      const allRejected = Object.values(fieldDecisions).every(status => status === 'rejected');
      
      let overallStatus: 'approved' | 'rejected' | 'partially_approved' = 'partially_approved';
      if (allApproved) overallStatus = 'approved';
      if (allRejected) overallStatus = 'rejected';

      processApproval(reviewItem.id, overallStatus, fieldDecisions);
      closeReviewModal();
  };

  // Helper to find document for review
  const getLinkedDocument = () => {
    if (reviewItem?.type === 'Document' && reviewItem.data?.documentId) {
        return documents.find(d => d.id === reviewItem.data.documentId);
    }
    return null;
  };

  const linkedDoc = getLinkedDocument();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-medium text-navy-900 dark:text-white">Approval Center</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review and process staff requests</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200 dark:border-navy-700">
        <button 
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'pending' ? 'text-navy-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-navy-700 dark:hover:text-slate-200'}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Requests
          <span className="ml-2 bg-gold-500 text-white dark:text-navy-900 text-[10px] px-1.5 py-0.5 rounded-full">{approvals.filter(a => a.status === 'pending').length}</span>
          {activeTab === 'pending' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-navy-900 dark:bg-gold-500"></span>}
        </button>
        <button 
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'history' ? 'text-navy-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-navy-700 dark:hover:text-slate-200'}`}
          onClick={() => setActiveTab('history')}
        >
          History
          {activeTab === 'history' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-navy-900 dark:bg-gold-500"></span>}
        </button>
      </div>

      <div className="grid gap-4">
        {filteredApprovals.length === 0 ? (
           <Card className="text-center py-12">
             <div className="w-16 h-16 bg-green-50 dark:bg-emerald-900/20 text-green-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
               <CheckCircle className="w-8 h-8" />
             </div>
             <h3 className="text-lg font-medium text-navy-900 dark:text-white">
                {activeTab === 'pending' ? 'All Caught Up!' : 'No History'}
             </h3>
             <p className="text-slate-500 dark:text-slate-400">
                {activeTab === 'pending' ? 'There are no pending approvals at the moment.' : 'Past approvals will appear here.'}
             </p>
           </Card>
        ) : (
          filteredApprovals.map((item) => (
            <Card key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 dark:bg-navy-700 rounded-lg text-slate-600 dark:text-slate-300">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                     <h4 className="font-medium text-navy-900 dark:text-white">{item.type} <span className="text-slate-400 font-normal">by</span> {item.user}</h4>
                     {item.status !== 'pending' && (
                         <Badge variant={item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'error' : 'warning'}>{item.status}</Badge>
                     )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{item.detail}</p>
                  <p className="text-xs text-slate-400 mt-2">{item.date}</p>
                </div>
              </div>
              
              {item.status === 'pending' && (
                  <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                    {item.type === 'Bio Data' ? (
                       <Button 
                        variant="secondary"
                        onClick={() => openReviewModal(item)}
                       >
                         <Eye className="w-4 h-4 mr-2" />
                         Review Bio
                       </Button>
                    ) : item.type === 'Document' ? (
                        <Button 
                        variant="secondary"
                        onClick={() => openReviewModal(item)}
                       >
                         <FileText className="w-4 h-4 mr-2" />
                         Review Doc
                       </Button>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          className="flex-1 sm:flex-none text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 dark:text-red-400 dark:hover:bg-red-900/20 dark:border-red-900/30"
                          onClick={() => handleAction(item.id, 'reject')}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button 
                          className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:text-white"
                          onClick={() => handleAction(item.id, 'approve')}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      </>
                    )}
                  </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Review Modal (Handles Bio Data & Documents) */}
      <Modal 
        isOpen={!!reviewItem} 
        onClose={closeReviewModal}
        title={reviewItem?.type === 'Document' ? 'Review Document' : 'Review Bio Data'}
        className="max-w-3xl"
      >
          {/* --- Document Review Logic --- */}
          {reviewItem?.type === 'Document' && (
              <div className="space-y-6">
                 {linkedDoc ? (
                     <div className="flex flex-col items-center p-8 bg-slate-50 dark:bg-navy-900/50 rounded-xl border border-slate-200 dark:border-navy-700">
                         <div className="w-16 h-16 bg-white dark:bg-navy-800 rounded-full flex items-center justify-center shadow-sm mb-4">
                             <FileText className="w-8 h-8 text-navy-900 dark:text-white" />
                         </div>
                         <h3 className="text-xl font-medium text-navy-900 dark:text-white">{linkedDoc.title}</h3>
                         <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 dark:text-slate-400">
                             <span className="px-2 py-0.5 bg-slate-200 dark:bg-navy-700 rounded-full text-xs font-bold uppercase">{linkedDoc.type}</span>
                             <span>{linkedDoc.size}</span>
                             <span>•</span>
                             <span>Version {linkedDoc.version}</span>
                         </div>
                         <p className="mt-4 text-center text-slate-600 dark:text-slate-300 italic max-w-md">
                             "{linkedDoc.notes || 'No notes provided.'}"
                         </p>
                         
                         <Button variant="outline" className="mt-6">
                             <Download className="w-4 h-4 mr-2" /> Download to View
                         </Button>
                     </div>
                 ) : (
                     <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-navy-900/50 rounded-lg">
                         Document not found or has been deleted.
                     </div>
                 )}

                 <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-navy-700">
                    <Button variant="ghost" onClick={closeReviewModal}>Cancel</Button>
                    <Button 
                        variant="danger" 
                        onClick={() => {
                            processApproval(reviewItem.id, 'rejected');
                            closeReviewModal();
                        }}
                    >
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                    </Button>
                    <Button 
                        onClick={() => {
                            processApproval(reviewItem.id, 'approved');
                            closeReviewModal();
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" /> Approve
                    </Button>
                 </div>
              </div>
          )}

          {/* --- Bio Data Review Logic --- */}
          {reviewItem?.type === 'Bio Data' && reviewItem.data && (
              <div className="space-y-6">
                  <div className="p-4 bg-slate-50 dark:bg-navy-900/50 rounded-lg text-sm text-slate-600 dark:text-slate-300">
                      Reviewing Bio Data submission for <span className="font-bold text-navy-900 dark:text-white">{reviewItem.user}</span>. 
                      Please review each field below.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                     {Object.entries(reviewItem.data).map(([key, value]) => (
                         <div 
                           key={key} 
                           className={`p-4 border rounded-lg transition-colors flex flex-col justify-between ${
                               fieldDecisions[key] === 'rejected' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30' : 'bg-white dark:bg-navy-800 border-slate-200 dark:border-navy-700'
                           }`}
                         >
                            <div>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <p className={`font-medium text-lg mt-1 ${fieldDecisions[key] === 'rejected' ? 'text-red-700 dark:text-red-400 line-through decoration-red-500' : 'text-navy-900 dark:text-white'}`}>
                                    {String(value) || '-'}
                                </p>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100/50 dark:border-navy-700">
                                <button 
                                  onClick={() => setFieldDecisions(prev => ({...prev, [key]: 'approved'}))}
                                  className={`flex-1 flex items-center justify-center py-1.5 rounded text-sm font-medium transition-colors ${
                                      fieldDecisions[key] === 'approved' 
                                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-navy-700 dark:text-slate-400 dark:hover:bg-navy-600'
                                  }`}
                                >
                                    <Check className="w-3.5 h-3.5 mr-1" /> Approve
                                </button>
                                <button 
                                  onClick={() => setFieldDecisions(prev => ({...prev, [key]: 'rejected'}))}
                                  className={`flex-1 flex items-center justify-center py-1.5 rounded text-sm font-medium transition-colors ${
                                      fieldDecisions[key] === 'rejected' 
                                      ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' 
                                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-navy-700 dark:text-slate-400 dark:hover:bg-navy-600'
                                  }`}
                                >
                                    <X className="w-3.5 h-3.5 mr-1" /> Reject
                                </button>
                            </div>
                         </div>
                     ))}
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-navy-700">
                     <Button variant="ghost" onClick={closeReviewModal}>Cancel Review</Button>
                     <Button onClick={submitBioDataReview}>Finalize Review</Button>
                  </div>
              </div>
          )}
      </Modal>
    </div>
  );
};

export default Approvals;