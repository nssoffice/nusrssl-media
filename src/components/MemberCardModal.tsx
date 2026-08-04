import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, generateQRCodeDataUrl, generateBarcodeSvg } from '../utils/formatters';
import { X, Printer, Download, ShieldCheck, Building2, UserCheck } from 'lucide-react';

export const MemberCardModal: React.FC = () => {
  const { 
    selectedMemberCard, 
    setSelectedMemberCard, 
    societyInfo, 
    language 
  } = useApp();

  const [qrUrl, setQrUrl] = useState<string>('');
  const [barcodeUrl, setBarcodeUrl] = useState<string>('');
  
  const member = selectedMemberCard;
  const isBn = language === 'bn';

  useEffect(() => {
    if (member) {
      generateQRCodeDataUrl(`NUSRSSL-MEMBER:${member.id}:${member.nid}`).then(setQrUrl);
      setBarcodeUrl(generateBarcodeSvg(member.id));
    }
  }, [member]);

  if (!member) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md print:p-0 print:bg-white">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden print:shadow-none print:border-none print:w-full">
        {/* Header Bar */}
        <div className="bg-emerald-800 text-white px-5 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-sm">
              {isBn ? 'সদস্য পরিচয়পত্র (Member ID Card)' : 'Member Identity Card'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium flex items-center gap-1 transition"
            >
              <Printer className="w-4 h-4" />
              <span>{isBn ? 'প্রিন্ট' : 'Print'}</span>
            </button>
            <button
              onClick={() => setSelectedMemberCard(null)}
              className="p-1 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <div className="w-[320px] mx-auto bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-2xl p-5 shadow-2xl border-2 border-emerald-500/40 relative overflow-hidden space-y-4">
            {/* Watermark Logo */}
            <Building2 className="absolute -right-10 -bottom-10 w-48 h-48 text-white/5 pointer-events-none" />

            {/* Header */}
            <div className="text-center border-b border-emerald-700/50 pb-2">
              <span className="text-[10px] font-semibold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {societyInfo.regNoBn || societyInfo.regNoEn 
                  ? (isBn ? societyInfo.regNoBn : societyInfo.regNoEn)
                  : (isBn ? 'স্মার্ট সদস্য কার্ড' : 'Smart Member Card')}
              </span>
              <h4 className="text-sm font-bold text-emerald-100 leading-tight mt-1">
                {societyInfo.nameBn}
              </h4>
              <p className="text-[9px] text-emerald-300">{societyInfo.sloganBn}</p>
            </div>

            {/* Photo & Member ID */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-24 rounded-lg overflow-hidden border-2 border-emerald-400 bg-white shrink-0 shadow">
                <img src={member.photoUrl} alt={member.nameEn} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-[9px] text-emerald-300 block">{isBn ? 'সদস্য নং:' : 'Member ID:'}</span>
                  <span className="font-mono font-bold text-amber-300 text-sm">{member.id}</span>
                </div>
                <div>
                  <span className="text-[9px] text-emerald-300 block">{isBn ? 'নাম:' : 'Name:'}</span>
                  <span className="font-semibold text-emerald-50">{isBn ? member.nameBn : member.nameEn}</span>
                </div>
                <div>
                  <span className="text-[9px] text-emerald-300 block">{isBn ? 'রক্তের গ্রুপ:' : 'Blood Group:'}</span>
                  <span className="font-bold text-rose-300">{member.bloodGroup || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Address & Joining */}
            <div className="text-[10px] space-y-1 bg-black/20 p-2 rounded-lg border border-white/10">
              <div className="flex justify-between">
                <span className="text-slate-300">{isBn ? 'মোবাইল:' : 'Mobile:'}</span>
                <span className="font-mono">{member.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">{isBn ? 'যোগদানের তারিখ:' : 'Joined:'}</span>
                <span>{formatDate(member.joiningDate, language)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">{isBn ? 'এনআইডি:' : 'NID:'}</span>
                <span className="font-mono">{member.nid}</span>
              </div>
            </div>

            {/* QR Code & Barcode */}
            <div className="pt-2 border-t border-emerald-700/50 flex items-center justify-between">
              {qrUrl && <img src={qrUrl} alt="QR" className="w-12 h-12 bg-white p-0.5 rounded" />}
              {barcodeUrl && <img src={barcodeUrl} alt="Barcode" className="h-8 w-32 bg-white p-1 rounded object-contain" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
