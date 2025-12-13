import React, { useState, useRef } from 'react';
import { Card, Button, Badge, Modal, Input, TextArea } from '../components/ui/Components';
import { MOCK_DOCUMENTS } from '../constants';
import { Document, DocumentVersion } from '../types';
import { useAuth, useApprovals } from '../App';
import { UploadCloud, FileText, Download, Trash2, Eye, History, Upload, File, X, Quote } from 'lucide-react';

const Documents = () => {
  const { user } = useAuth();
  const { addApproval } = useApprovals();
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [isDragging, setIsDragging] = useState(false);
  
  // Modals
  const [historyModalDoc, setHistoryModalDoc] = useState<Document | null>(null);
  const [uploadVersionDoc, setUploadVersionDoc] = useState<Document | null>(null);
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);

  // Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form Data
  const [newDocData, setNewDocData] = useState({ title: '', category: 'Other' });
  const [versionNotes, setVersionNotes] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const versionFileInputRef = useRef<HTMLInputElement>(null);

  // --- Helpers ---
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const resetUploadState = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setNewDocData({ title: '', category: 'Other' });
    setVersionNotes('');
  };

  const closeModals = () => {
    if (isUploading) return; // Prevent closing while uploading
    setHistoryModalDoc(null);
    setUploadVersionDoc(null);
    setIsNewDocModalOpen(false);
    resetUploadState();
  };

  // --- Handlers ---

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (file: File) => {
    // Validate file type/size if needed
    setSelectedFile(file);
    // Auto-fill title for new doc if empty
    if (!newDocData.title) {
        setNewDocData(prev => ({ ...prev, title: file.name.split('.')[0] }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
      if (!uploadVersionDoc) {
          setIsNewDocModalOpen(true);
      }
    }
  };

  const handleMainUploadClick = () => {
      // Trigger file input
      if (fileInputRef.current) {
          fileInputRef.current.click();
      }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          handleFileSelect(e.target.files[0]);
          setIsNewDocModalOpen(true);
      }
  };

  const handleVersionFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          handleFileSelect(e.target.files[0]);
      }
  };

  // --- Upload Logic ---

  const simulateUploadProcess = (onComplete: () => void) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          return 95; // Wait for final step
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => {
        onComplete();
        resetUploadState();
      }, 500);
    }, 2000);
  };

  const handleNewDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    simulateUploadProcess(() => {
        const newDoc: Document = {
            id: `d${Date.now()}`,
            title: newDocData.title,
            category: newDocData.category as any,
            status: 'pending',
            dateUploaded: 'Just now',
            size: formatBytes(selectedFile.size),
            type: selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE',
            uploadedBy: 'You',
            version: 1,
            history: [],
            notes: 'Initial Upload'
        };
        setDocuments([newDoc, ...documents]);
        
        // Notify HR
        addApproval({
          type: 'Document',
          user: user ? `${user.firstName} ${user.lastName}` : 'Staff Member',
          detail: `Uploaded new document: ${newDocData.title}`
        });

        setIsNewDocModalOpen(false);
    });
  };

  const handleVersionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadVersionDoc || !selectedFile) return;

    simulateUploadProcess(() => {
      const updatedDocs = documents.map(doc => {
        if (doc.id === uploadVersionDoc.id) {
          // Archive current version
          const historyEntry: DocumentVersion = {
            id: `${doc.id}_v${doc.version}`,
            dateUploaded: doc.dateUploaded,
            status: doc.status,
            size: doc.size,
            uploadedBy: doc.uploadedBy,
            version: doc.version,
            notes: doc.notes
          };
          
          // Update doc
          return {
            ...doc,
            version: doc.version + 1,
            dateUploaded: 'Just now',
            status: 'pending',
            size: formatBytes(selectedFile.size),
            type: selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE',
            history: [historyEntry, ...(doc.history || [])],
            notes: versionNotes
          };
        }
        return doc;
      });

      setDocuments(updatedDocs);
      
      // Notify HR
      addApproval({
        type: 'Document',
        user: user ? `${user.firstName} ${user.lastName}` : 'Staff Member',
        detail: `Updated document: ${uploadVersionDoc.title} (v${uploadVersionDoc.version + 1})`
      });

      setUploadVersionDoc(null);
    });
  };

  // --- UI Components ---

  const FilePreview = ({ file, onRemove }: { file: File, onRemove?: () => void }) => (
    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg relative overflow-hidden">
      <div className="relative z-10 flex items-center gap-4 w-full">
        <div className="p-2 bg-white rounded shadow-sm text-navy-900">
            <FileText className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-navy-900 truncate">{file.name}</p>
            <div className="flex items-center gap-2">
                <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
                {isUploading && <span className="text-xs text-emerald-600 font-medium">• Uploading...</span>}
            </div>
        </div>
        {onRemove && !isUploading && (
            <button onClick={onRemove} className="text-slate-400 hover:text-red-500 transition-colors">
            <X className="w-5 h-5" />
            </button>
        )}
        {isUploading && (
            <div className="text-emerald-600">
                <span className="text-sm font-bold">{Math.round(uploadProgress)}%</span>
            </div>
        )}
      </div>
      {isUploading && (
          <div 
            className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-300 ease-out"
            style={{ width: `${uploadProgress}%` }}
          />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-medium text-navy-900">Documents</h2>
          <p className="text-slate-500 mt-1">Manage your employment files and contracts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <Card className="lg:col-span-3">
           <div 
             className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${isDragging ? 'border-gold-500 bg-gold-50' : 'border-slate-300 hover:border-navy-500 hover:bg-slate-50'}`}
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}
             onClick={handleMainUploadClick}
           >
             <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                onChange={handleFileInputChange}
             />
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
               <UploadCloud className="w-8 h-8" />
             </div>
             <h3 className="text-lg font-medium text-navy-900">Upload New Document</h3>
             <p className="text-slate-500 mt-1 max-w-sm">Drag and drop your files here, or click to browse. Supported formats: PDF, JPG, PNG (Max 5MB)</p>
           </div>
        </Card>

        {/* Document List */}
        <div className="lg:col-span-3">
          <Card noPadding>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <th className="px-6 py-4">Document Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Uploaded Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="p-2 bg-slate-100 rounded text-slate-600 group-hover:bg-white group-hover:text-navy-900 transition-colors">
                              <FileText className="w-5 h-5" />
                            </div>
                            {doc.version > 1 && (
                              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-navy-900 text-[10px] text-white font-bold">
                                v{doc.version}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-navy-900">{doc.title}</p>
                            <p className="text-xs text-slate-500">{doc.size} • {doc.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {doc.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{doc.dateUploaded}</td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          doc.status === 'approved' ? 'success' : 
                          doc.status === 'rejected' ? 'error' : 'warning'
                        }>
                          {doc.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            className="p-2 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-200" 
                            title="Upload New Version"
                            onClick={() => {
                                setUploadVersionDoc(doc);
                                resetUploadState();
                            }}
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-200" 
                            title="Version History"
                            onClick={() => setHistoryModalDoc(doc)}
                          >
                            <History className="w-4 h-4" />
                          </button>
                          <div className="w-px h-4 bg-slate-300 mx-1"></div>
                          <button className="p-2 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-200" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-200" title="Download">
                            <Download className="w-4 h-4" />
                          </button>
                          {doc.status !== 'approved' && (
                            <button className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* --- Modals --- */}

      {/* New Document Upload Modal */}
      <Modal
        isOpen={isNewDocModalOpen}
        onClose={closeModals}
        title="Upload New Document"
      >
          <form onSubmit={handleNewDocSubmit} className="space-y-6">
              {!selectedFile ? (
                   <div 
                   className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-navy-500 hover:bg-slate-50 transition-all cursor-pointer"
                   onClick={() => fileInputRef.current?.click()}
                 >
                    <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-700">Click to select file</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG up to 5MB</p>
                 </div>
              ) : (
                  <FilePreview file={selectedFile} onRemove={() => setSelectedFile(null)} />
              )}

              <div className="space-y-4">
                  <Input 
                    label="Document Title" 
                    value={newDocData.title}
                    onChange={e => setNewDocData({...newDocData, title: e.target.value})}
                    placeholder="e.g. Employment Contract Signed"
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                    <select 
                        className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900"
                        value={newDocData.category}
                        onChange={e => setNewDocData({...newDocData, category: e.target.value})}
                    >
                        <option value="Contract">Contract</option>
                        <option value="ID">ID / Passport</option>
                        <option value="Certificate">Certificate</option>
                        <option value="Other">Other</option>
                    </select>
                  </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                 <Button type="button" variant="ghost" onClick={closeModals} disabled={isUploading}>Cancel</Button>
                 <Button type="submit" isLoading={isUploading} disabled={!selectedFile}>Upload Document</Button>
              </div>
          </form>
      </Modal>

      {/* Upload New Version Modal */}
      <Modal 
        isOpen={!!uploadVersionDoc} 
        onClose={closeModals} 
        title="Upload New Version"
      >
        <form onSubmit={handleVersionSubmit} className="space-y-6">
           {uploadVersionDoc && (
             <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm flex items-center gap-3">
               <File className="w-4 h-4" />
               <div>
                 <p className="font-medium">Updating: {uploadVersionDoc.title}</p>
                 <p className="text-xs opacity-80">Creating Version {uploadVersionDoc.version + 1}</p>
               </div>
             </div>
           )}

           {!selectedFile ? (
             <div 
               className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-navy-500 hover:bg-slate-50 transition-all cursor-pointer"
               onClick={() => versionFileInputRef.current?.click()}
             >
                <input 
                    type="file" 
                    ref={versionFileInputRef}
                    className="hidden" 
                    onChange={handleVersionFileInputChange}
                />
                <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-700">Select new version file</p>
                <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG up to 5MB</p>
             </div>
           ) : (
                <FilePreview file={selectedFile} onRemove={() => setSelectedFile(null)} />
           )}
           
           <TextArea 
             label="Change Notes" 
             placeholder="What changed in this version? (e.g. Updated address)" 
             value={versionNotes}
             onChange={e => setVersionNotes(e.target.value)}
             rows={3}
           />

           <div className="flex justify-end gap-3 pt-2">
             <Button type="button" variant="ghost" onClick={closeModals} disabled={isUploading}>Cancel</Button>
             <Button type="submit" isLoading={isUploading} disabled={!selectedFile}>Upload Version</Button>
           </div>
        </form>
      </Modal>

      {/* Version History Modal */}
      <Modal 
        isOpen={!!historyModalDoc} 
        onClose={closeModals} 
        title="Version History"
        className="max-w-2xl"
      >
        {historyModalDoc && (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="p-2 bg-white rounded shadow-sm">
                <FileText className="w-6 h-6 text-navy-900" />
              </div>
              <div>
                <h4 className="font-medium text-navy-900">{historyModalDoc.title}</h4>
                <p className="text-sm text-slate-500">Current Version: v{historyModalDoc.version}</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-0 bottom-0 left-6 w-px bg-slate-200"></div>
              <div className="space-y-6">
                {/* Current Version */}
                <div className="relative pl-14">
                   <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white shadow-sm"></div>
                   <div className="flex justify-between items-start bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                     <div className="flex-1">
                       <div className="flex items-center gap-2 mb-2">
                         <span className="font-bold text-navy-900 text-sm">Version {historyModalDoc.version}</span>
                         <Badge variant={historyModalDoc.status === 'approved' ? 'success' : historyModalDoc.status === 'rejected' ? 'error' : 'warning'}>
                           {historyModalDoc.status}
                         </Badge>
                         <span className="text-xs text-emerald-600 font-medium bg-white px-2 py-0.5 rounded-full border border-emerald-100 shadow-sm">Current</span>
                       </div>
                       <p className="text-xs text-slate-500 mt-1">Uploaded {historyModalDoc.dateUploaded} by {historyModalDoc.uploadedBy}</p>
                       {historyModalDoc.notes && (
                           <div className="flex items-start gap-2 mt-3 text-slate-600 bg-white/60 p-2 rounded border border-emerald-100/50">
                             <Quote className="w-3 h-3 mt-0.5 flex-shrink-0 text-emerald-400" />
                             <p className="text-sm italic">{historyModalDoc.notes}</p>
                           </div>
                       )}
                     </div>
                     <div className="text-right pl-4">
                       <span className="text-xs font-mono text-slate-500 block">{historyModalDoc.size}</span>
                       <Button size="sm" variant="ghost" className="h-7 px-2 mt-2 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100">
                          <Download className="w-3 h-3 mr-1" /> Download
                       </Button>
                     </div>
                   </div>
                </div>

                {/* History */}
                {historyModalDoc.history && historyModalDoc.history.map((ver) => (
                  <div key={ver.id} className="relative pl-14">
                    <div className="absolute left-5 top-2 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-white"></div>
                    <div className="flex justify-between items-start p-4 rounded-lg border border-slate-100 bg-white hover:bg-slate-50 transition-colors group">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-slate-700 text-sm">Version {ver.version}</span>
                          <Badge variant={ver.status === 'approved' ? 'success' : ver.status === 'rejected' ? 'error' : 'warning'}>
                           {ver.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Uploaded {ver.dateUploaded} by {ver.uploadedBy}</p>
                         {ver.notes && (
                           <div className="flex items-start gap-2 mt-2 text-slate-500">
                             <Quote className="w-3 h-3 mt-0.5 flex-shrink-0 text-slate-300" />
                             <p className="text-sm italic">{ver.notes}</p>
                           </div>
                       )}
                      </div>
                      <div className="text-right pl-4 flex flex-col items-end">
                        <span className="text-xs font-mono text-slate-500">{ver.size}</span>
                         <Button size="sm" variant="ghost" className="h-7 px-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Download className="w-3 h-3 mr-1" /> Download
                       </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {(!historyModalDoc.history || historyModalDoc.history.length === 0) && (
                   <div className="pl-14 py-4 text-center">
                     <p className="text-sm text-slate-400 italic">No previous versions available.</p>
                   </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button variant="ghost" onClick={closeModals}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Documents;