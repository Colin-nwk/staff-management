import React, { useRef, useState, useEffect } from 'react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { User } from '../types';
import { Modal, Button } from './ui/Components';
import { Download, Printer } from 'lucide-react';

interface IDCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const IDCardModal: React.FC<IDCardModalProps> = ({ isOpen, onClose, user }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (user && isOpen) {
      // Generate vCard data for QR Code
      const qrData = `BEGIN:VCARD
VERSION:3.0
N:${user.lastName};${user.firstName}
FN:${user.firstName} ${user.lastName}
ORG:Nexus Inc.
TITLE:${user.position}
TEL;TYPE=CELL:${user.phone || ''}
EMAIL:${user.email}
END:VCARD`;

      QRCode.toDataURL(qrData, { 
        width: 256, 
        margin: 1, 
        color: { dark: '#000000', light: '#ffffff' },
        errorCorrectionLevel: 'M'
      })
      .then((url: string) => {
        setQrCodeUrl(url);
      })
      .catch((err: any) => {
        console.error("Error generating QR code", err);
      });
    }
  }, [user, isOpen]);

  if (!user) return null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // Higher resolution
        backgroundColor: null,
        useCORS: true // Attempt to load external images
      });
      const link = document.createElement('a');
      link.download = `Nexus_ID_${user.firstName}_${user.lastName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Failed to generate ID card image", err);
    }
    setIsDownloading(false);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('printable-id-card');
    const windowUrl = 'about:blank';
    const uniqueName = new Date();
    const windowName = 'Print' + uniqueName.getTime();
    const printWindow = window.open(windowUrl, windowName, 'left=50000,top=50000,width=0,height=0');

    if (printWindow && printContent) {
      printWindow.document.write(`
        <html>
          <head>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
              .id-card-container { transform: scale(1); transform-origin: top left; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500); // Allow time for images to load
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Staff Identity Card" className="max-w-2xl">
      <div className="flex flex-col items-center space-y-6">
        
        {/* ID Card Display Area */}
        <div id="printable-id-card">
          <div 
            ref={cardRef}
            className="w-[400px] h-[250px] bg-gradient-to-br from-navy-900 to-navy-800 rounded-xl shadow-2xl overflow-hidden relative text-white flex border border-navy-700"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
             {/* Background Pattern */}
             <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500 rounded-full mix-blend-overlay opacity-10 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-overlay opacity-10 blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

             {/* Left Side: Photo */}
             <div className="w-1/3 bg-navy-950/30 flex flex-col items-center justify-center p-4 border-r border-white/10 relative z-10">
                <div className="w-24 h-24 rounded-full border-4 border-gold-500 shadow-lg overflow-hidden mb-3 bg-white">
                  <img 
                    src={user.avatarUrl} 
                    alt="Staff" 
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous" 
                  />
                </div>
                <div className="text-center">
                    <span className="block text-[10px] uppercase tracking-widest opacity-60">Join Date</span>
                    <span className="text-xs font-mono font-medium">{user.joinDate}</span>
                </div>
             </div>

             {/* Right Side: Details */}
             <div className="flex-1 p-5 flex flex-col justify-between relative z-10">
                <div className="flex justify-between items-start">
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                         <div className="w-6 h-6 rounded bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 font-serif font-bold text-xs shadow-sm">N</div>
                         <span className="font-serif text-lg font-bold tracking-tight">Nexus Inc.</span>
                      </div>
                   </div>
                   {/* QR Code */}
                   <div className="p-1 bg-white rounded-lg">
                      <div style={{ height: "64px", width: "64px" }}>
                        {qrCodeUrl && (
                            <img src={qrCodeUrl} alt="QR Code" className="w-full h-full" />
                        )}
                      </div>
                   </div>
                </div>

                <div className="mt-2">
                   <h2 className="text-xl font-bold leading-tight">{user.firstName} {user.lastName}</h2>
                   <p className="text-gold-400 text-xs uppercase font-bold tracking-wider mt-0.5">{user.position}</p>
                   <p className="text-xs opacity-70 mt-0.5">{user.department} Dept.</p>
                </div>

                <div className="space-y-1 mt-2">
                   <div className="flex justify-between items-end border-b border-white/10 pb-1">
                      <span className="text-[10px] opacity-60 uppercase">Staff ID</span>
                      <span className="text-xs font-mono font-bold">{user.id.toUpperCase()}</span>
                   </div>
                   <div className="flex justify-between items-end border-b border-white/10 pb-1">
                       <span className="text-[10px] opacity-60 uppercase">Email</span>
                       <span className="text-[10px]">{user.email}</span>
                   </div>
                   <div className="flex justify-between items-end">
                       <span className="text-[10px] opacity-60 uppercase">Phone</span>
                       <span className="text-[10px]">{user.phone || 'N/A'}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 w-full justify-center">
           <Button variant="outline" onClick={handleDownload} disabled={isDownloading}>
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? 'Processing...' : 'Download PNG'}
           </Button>
           <Button onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print Card
           </Button>
        </div>

        <p className="text-xs text-slate-400 text-center max-w-sm">
           This ID card is property of Nexus Inc. If found, please return to the nearest Nexus office or contact support@nexus.com.
        </p>
      </div>
    </Modal>
  );
};

export default IDCardModal;