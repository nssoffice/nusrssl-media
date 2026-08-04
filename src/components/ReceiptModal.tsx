import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, generateQRCodeDataUrl } from '../utils/formatters';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import jsPDF from 'jspdf';

export const ReceiptModal: React.FC = () => {
  const { 
    selectedReceiptTransaction, 
    setSelectedReceiptTransaction, 
    members, 
    societyInfo, 
    language 
  } = useApp();

  const [qrUrl, setQrUrl] = useState<string>('');
  const txn = selectedReceiptTransaction;
  const isBn = language === 'bn';

  const member = txn ? members.find((m) => m.id === txn.memberId) : null;

  useEffect(() => {
    if (txn) {
      const qrData = `NUSRSSL-VOUCHER:${txn.voucherNo}:${txn.amount}:${txn.date}`;
      generateQRCodeDataUrl(qrData).then(setQrUrl);
    }
  }, [txn]);

  if (!txn) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(societyInfo.nameEn, 20, 20);
    doc.setFontSize(10);
    doc.text(`Official Transaction Receipt - Voucher: ${txn.voucherNo}`, 20, 28);
    doc.text(`Date: ${txn.date} | Member ID: ${txn.memberId}`, 20, 34);
    if (member) {
      doc.text(`Member Name: ${member.nameEn}`, 20, 40);
    }
    doc.text(`Account Type: ${txn.accountType.toUpperCase()} | Account No: ${txn.accountNo}`, 20, 46);
    doc.setFontSize(14);
    doc.text(`Amount Paid: Tk ${txn.amount}`, 20, 60);
    doc.setFontSize(10);
    doc.text(`Collector Signature: ${txn.collectorName}`, 20, 72);
    doc.save(`Receipt-${txn.voucherNo}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md print:p-0 print:bg-white">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden print:shadow-none print:border-none print:w-full">
        {/* Header Bar */}
        <div className="bg-emerald-700 text-white px-5 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-sm">
              {isBn ? 'ডিজিটাল ই-রসিদ (Payment Receipt)' : 'Official E-Receipt'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 hover:bg-white/10 rounded-lg text-xs font-medium flex items-center gap-1 transition"
            >
              <Printer className="w-4 h-4" />
              <span>{isBn ? 'প্রিন্ট' : 'Print'}</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-2.5 py-1 bg-emerald-400 text-slate-950 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => setSelectedReceiptTransaction(null)}
              className="p-1 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Receipt Voucher Body */}
        <div className="p-6 space-y-5 text-slate-800 dark:text-slate-100 font-sans border-4 border-dashed border-emerald-700/40 m-4 rounded-xl">
          {/* Org Header */}
          <div className="text-center border-b pb-3">
            <h2 className="font-extrabold text-base text-emerald-800 dark:text-emerald-300">
              {societyInfo.nameBn}
            </h2>
            <p className="text-[11px] text-slate-500">{societyInfo.addressBn}</p>
            <div className="inline-block px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded text-[10px] font-bold mt-1">
              {isBn ? `অফিসিয়াল টাকা জমার ভাউচার` : `Money Deposit Voucher`}
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">{isBn ? 'ভাউচার নং:' : 'Voucher No:'}</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{txn.voucherNo}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">{isBn ? 'তারিখ:' : 'Date:'}</span>
              <span className="font-medium">{formatDate(txn.date, language)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">{isBn ? 'সদস্য নং:' : 'Member ID:'}</span>
              <span className="font-mono font-bold">{txn.memberId}</span>
            </div>

            {member && (
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">{isBn ? 'সদস্যের নাম:' : 'Member Name:'}</span>
                <span className="font-semibold">{isBn ? member.nameBn : member.nameEn}</span>
              </div>
            )}

            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">{isBn ? 'হিসাবের ধরন & নং:' : 'Account & Type:'}</span>
              <span className="font-mono uppercase">{txn.accountType} ({txn.accountNo})</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">{isBn ? 'বিবরণ:' : 'Particulars:'}</span>
              <span>{txn.remarks || txn.type}</span>
            </div>

            {/* Amount Box */}
            <div className="bg-emerald-50 dark:bg-emerald-950/60 p-3 rounded-lg flex justify-between items-center text-sm font-bold text-emerald-800 dark:text-emerald-300">
              <span>{isBn ? 'জমা/পরিশোধিত টাকা:' : 'Amount Paid:'}</span>
              <span className="text-lg font-mono">{formatCurrency(txn.amount, language)}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500">{isBn ? 'বর্তমান স্থিতি/জের:' : 'Balance After:'}</span>
              <span className="font-mono font-semibold">{formatCurrency(txn.balanceAfter, language)}</span>
            </div>
          </div>

          {/* Verification QR & Signatures */}
          <div className="pt-3 border-t flex items-center justify-between text-xs">
            {qrUrl && <img src={qrUrl} alt="QR Code" className="w-16 h-16 rounded border" />}

            <div className="text-right space-y-6">
              <div className="inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isBn ? 'ডিজিটাল সিস্টেম জেনারেটেড' : 'Digital System Generated'}</span>
              </div>

              <div>
                <div className="border-b border-slate-400 w-28 ml-auto"></div>
                <p className="text-[10px] text-slate-500 mt-0.5">{txn.collectorName} ({isBn ? 'আদায়কারী' : 'Collector'})</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
