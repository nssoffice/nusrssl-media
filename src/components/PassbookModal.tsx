import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Member, SavingsAccount, LoanAccount, DPSAccount, Transaction } from '../types';
import { formatCurrency, formatDate, generateQRCodeDataUrl, generateBarcodeSvg } from '../utils/formatters';
import { X, Printer, Download, BookOpen, ChevronLeft, ChevronRight, CheckCircle, ShieldCheck } from 'lucide-react';
import jsPDF from 'jspdf';

export const PassbookModal: React.FC = () => {
  const { 
    selectedMemberForPassbook, 
    setSelectedMemberForPassbook, 
    societyInfo, 
    language,
    savingsAccounts,
    loanAccounts,
    dpsAccounts,
    transactions
  } = useApp();

  const [activeTab, setActiveTab] = useState<'cover' | 'savings' | 'loan' | 'dps' | 'terms'>('cover');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [barcodeUrl, setBarcodeUrl] = useState<string>('');

  const isBn = language === 'bn';
  const member = selectedMemberForPassbook;

  useEffect(() => {
    if (member) {
      // Generate QR Code containing member ID & verification URL
      const verificationText = `NUSRSSL-VERIFIED:${member.id}:${member.nid}`;
      generateQRCodeDataUrl(verificationText).then(setQrUrl);
      setBarcodeUrl(generateBarcodeSvg(member.id));
    }
  }, [member]);

  if (!member) return null;

  const memberSavings = savingsAccounts.filter((s) => s.memberId === member.id);
  const memberLoans = loanAccounts.filter((l) => l.memberId === member.id);
  const memberDPS = dpsAccounts.filter((d) => d.memberId === member.id);
  const memberTxns = transactions.filter((t) => t.memberId === member.id);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(societyInfo.nameEn, 20, 20);
    doc.setFontSize(10);
    doc.text(`Digital Passbook - Member ID: ${member.id}`, 20, 28);
    doc.text(`Name: ${member.nameEn} / NID: ${member.nid}`, 20, 34);
    doc.text(`Address: ${member.presentAddressEn}`, 20, 40);

    doc.setFontSize(12);
    doc.text('Savings Accounts:', 20, 52);
    let y = 60;
    memberSavings.forEach((acc) => {
      doc.setFontSize(10);
      doc.text(`Account No: ${acc.accountNo} | Scheme: ${acc.schemeType} | Balance: Tk ${acc.balance}`, 20, y);
      y += 6;
    });

    y += 6;
    doc.setFontSize(12);
    doc.text('Loans Ledger:', 20, y);
    y += 8;
    memberLoans.forEach((loan) => {
      doc.setFontSize(10);
      doc.text(`Loan No: ${loan.loanNo} | Disbursed: Tk ${loan.principalAmount} | Remaining Due: Tk ${loan.remainingDue}`, 20, y);
      y += 6;
    });

    doc.save(`Passbook-${member.id}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 print:shadow-none print:border-none print:w-full">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-emerald-300" />
            <div>
              <h3 className="font-bold text-lg leading-none">
                {isBn ? 'ডিজিটাল পাসবই (Digital Passbook)' : 'Digital Passbook'}
              </h3>
              <p className="text-xs text-emerald-200">
                {isBn ? `সদস্য নং: ${member.id}` : `Member ID: ${member.id}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" />
              <span>{isBn ? 'প্রিন্ট' : 'Print'}</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-4 h-4" />
              <span>{isBn ? 'পিডিএফ (PDF)' : 'PDF'}</span>
            </button>
            <button
              onClick={() => setSelectedMemberForPassbook(null)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 dark:bg-slate-800/60 px-6 py-2 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-2 text-xs font-medium print:hidden">
          <button
            onClick={() => setActiveTab('cover')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'cover' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {isBn ? 'প্রথম প্রচ্ছদ (Cover Page)' : 'First Cover'}
          </button>
          <button
            onClick={() => setActiveTab('savings')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'savings' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {isBn ? 'সঞ্চয় লেজার (Savings Ledger)' : 'Savings Ledger'}
          </button>
          <button
            onClick={() => setActiveTab('loan')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'loan' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {isBn ? 'ঋণ লেজার (Loan Ledger)' : 'Loan Ledger'}
          </button>
          <button
            onClick={() => setActiveTab('dps')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'dps' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {isBn ? 'ডিপিএস লেজার (DPS Ledger)' : 'DPS Ledger'}
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'terms' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {isBn ? 'নিয়মাবলী ও চুক্তি (Rules & Agreement)' : 'Rules & Declaration'}
          </button>
        </div>

        {/* Passbook Body Frame */}
        <div className="p-6 md:p-8 space-y-6 text-slate-800 dark:text-slate-100 font-sans min-h-[500px]">
          {/* TAB 1: COVER PAGE */}
          {activeTab === 'cover' && (
            <div className="border-4 border-emerald-800 dark:border-emerald-700 p-6 rounded-2xl bg-emerald-50/40 dark:bg-slate-850 space-y-6">
              {/* Header */}
              <div className="text-center border-b border-emerald-800/30 pb-4 space-y-1">
                <div className="inline-block px-3 py-1 bg-emerald-800 text-white text-xs font-semibold rounded-md mb-2">
                  {societyInfo.regNoBn || societyInfo.regNoEn 
                    ? (isBn ? societyInfo.regNoBn : societyInfo.regNoEn)
                    : (isBn ? 'প্রাইভেট সমবায় সমিতি' : 'Private Cooperative Society')}
                </div>
                <h2 className="text-xl md:text-2xl font-black text-emerald-900 dark:text-emerald-300 tracking-tight">
                  {societyInfo.nameBn}
                </h2>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  {societyInfo.nameEn}
                </p>
                <p className="text-xs italic text-slate-600 dark:text-slate-400">
                  "{societyInfo.sloganBn}"
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {societyInfo.addressBn}
                </p>
              </div>

              {/* Main Passbook Profile info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Photo & Signs */}
                <div className="flex flex-col items-center gap-3 border-r border-slate-200 dark:border-slate-700 pr-4">
                  <div className="w-28 h-32 rounded-lg border-2 border-emerald-700 overflow-hidden bg-white shadow-md">
                    <img 
                      src={member.photoUrl} 
                      alt={member.nameEn}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="text-center w-full">
                    <div className="border-b border-slate-400 w-3/4 mx-auto pb-1 min-h-[24px]">
                      <span className="font-serif italic text-xs text-slate-700 dark:text-slate-300">
                        {member.nameEn}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">{isBn ? 'সদস্যের স্বাক্ষর' : 'Member Signature'}</p>
                  </div>
                </div>

                {/* Profile Data */}
                <div className="md:col-span-2 space-y-2 text-xs">
                  <div className="grid grid-cols-3 py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-500">{isBn ? 'সদস্য নং:' : 'Member No:'}</span>
                    <span className="col-span-2 font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                      {member.id}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-500">{isBn ? 'সদস্যের নাম:' : 'Name:'}</span>
                    <span className="col-span-2 font-semibold">{isBn ? member.nameBn : member.nameEn}</span>
                  </div>
                  <div className="grid grid-cols-3 py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-500">{isBn ? 'পিতা/স্বামী:' : 'Father/Husband:'}</span>
                    <span className="col-span-2">{isBn ? member.fatherHusbandBn : member.fatherHusbandEn}</span>
                  </div>
                  <div className="grid grid-cols-3 py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-500">{isBn ? 'পেশা ও মোবাইল:' : 'Occupation/Mobile:'}</span>
                    <span className="col-span-2">{isBn ? member.occupationBn : member.occupationEn} | {member.mobile}</span>
                  </div>
                  <div className="grid grid-cols-3 py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-500">{isBn ? 'জাতীয় পরিচয়পত্র (NID):' : 'NID:'}</span>
                    <span className="col-span-2 font-mono">{member.nid}</span>
                  </div>
                  <div className="grid grid-cols-3 py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-500">{isBn ? 'ঠিকানা:' : 'Address:'}</span>
                    <span className="col-span-2">{isBn ? member.presentAddressBn : member.presentAddressEn}</span>
                  </div>
                  <div className="grid grid-cols-3 py-1 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-500">{isBn ? 'মনোনীত ব্যক্তি (Nominee):' : 'Nominee:'}</span>
                    <span className="col-span-2">
                      {isBn ? member.nomineeNameBn : member.nomineeNameEn} ({isBn ? member.nomineeRelationBn : member.nomineeRelationEn})
                    </span>
                  </div>
                </div>
              </div>

              {/* Codes & Verification Footer */}
              <div className="pt-4 border-t border-emerald-800/30 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {qrUrl && <img src={qrUrl} alt="QR Code" className="w-20 h-20 rounded border border-slate-300" />}
                  {barcodeUrl && <img src={barcodeUrl} alt="Barcode" className="h-12 w-48 object-contain" />}
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isBn ? 'ডিজিটাল সত্যায়িত পাসবই' : 'Digitally Verified Passbook'}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">{isBn ? 'প্রাইভেট সমবায় ডিজিটাল পাসবই' : 'Private Cooperative Digital Passbook'}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SAVINGS LEDGER */}
          {activeTab === 'savings' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-bold text-lg text-emerald-700 dark:text-emerald-400">
                  {isBn ? 'সঞ্চয় হিসাব লেজার (Savings Ledger)' : 'Savings Ledger'}
                </h3>
                <span className="text-xs font-mono bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded text-emerald-800 dark:text-emerald-300">
                  {memberSavings[0]?.accountNo || 'N/A'}
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b">
                    <tr>
                      <th className="p-2.5">তারিখ (Date)</th>
                      <th className="p-2.5">ভাউচার (Voucher)</th>
                      <th className="p-2.5">বিবরণ (Particulars)</th>
                      <th className="p-2.5 text-right">জমা (Deposit)</th>
                      <th className="p-2.5 text-right">উত্তোলন (Withdrawal)</th>
                      <th className="p-2.5 text-right">জের (Balance)</th>
                      <th className="p-2.5 text-center">ক্যাশিয়ার</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                    {memberTxns.filter(t => t.accountType === 'savings').map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-2.5 font-sans">{formatDate(t.date, language)}</td>
                        <td className="p-2.5">{t.voucherNo}</td>
                        <td className="p-2.5 font-sans">{t.remarks || t.type}</td>
                        <td className="p-2.5 text-right font-bold text-emerald-600">
                          {t.type === 'deposit' ? formatCurrency(t.amount, language) : '-'}
                        </td>
                        <td className="p-2.5 text-right font-bold text-rose-600">
                          {t.type === 'withdrawal' ? formatCurrency(t.amount, language) : '-'}
                        </td>
                        <td className="p-2.5 text-right font-bold">{formatCurrency(t.balanceAfter, language)}</td>
                        <td className="p-2.5 text-center font-sans text-[10px] text-slate-500">{t.collectorName}</td>
                      </tr>
                    ))}
                    {memberTxns.filter(t => t.accountType === 'savings').length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-500 font-sans">
                          {isBn ? 'কোন সঞ্চয় লেনদেন রেকর্ড পাওয়া যায়নি' : 'No savings transactions recorded yet'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: LOAN LEDGER */}
          {activeTab === 'loan' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-bold text-lg text-emerald-700 dark:text-emerald-400">
                  {isBn ? 'ঋণ হিসাব লেজার (Loan Ledger)' : 'Loan Ledger'}
                </h3>
                <span className="text-xs font-mono bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded text-emerald-800 dark:text-emerald-300">
                  {memberLoans[0]?.loanNo || 'N/A'}
                </span>
              </div>

              {memberLoans.length > 0 ? (
                memberLoans.map((loan) => (
                  <div key={loan.loanNo} className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-xs">
                      <div>
                        <span className="text-slate-500">{isBn ? 'ঋণ পরিমাণ:' : 'Principal:'}</span>
                        <p className="font-bold">{formatCurrency(loan.principalAmount, language)}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">{isBn ? 'মুনাফা হার:' : 'Interest Rate:'}</span>
                        <p className="font-bold">{loan.interestRate}%</p>
                      </div>
                      <div>
                        <span className="text-slate-500">{isBn ? 'মোট পরিশোধ:' : 'Total Paid:'}</span>
                        <p className="font-bold text-emerald-600">{formatCurrency(loan.totalPaid, language)}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">{isBn ? 'অবশিষ্ট বকেয়া:' : 'Remaining Due:'}</span>
                        <p className="font-bold text-rose-600">{formatCurrency(loan.remainingDue, language)}</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b">
                          <tr>
                            <th className="p-2.5">তারিখ</th>
                            <th className="p-2.5">ভাউচার</th>
                            <th className="p-2.5 text-right">আদায় (Amount)</th>
                            <th className="p-2.5 text-right">অবশিষ্ট ঋণ</th>
                            <th className="p-2.5 text-center">আদায়কারী</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                          {memberTxns.filter(t => t.accountType === 'loan' && t.accountNo === loan.loanNo).map((t) => (
                            <tr key={t.id}>
                              <td className="p-2.5 font-sans">{formatDate(t.date, language)}</td>
                              <td className="p-2.5">{t.voucherNo}</td>
                              <td className="p-2.5 text-right font-bold text-emerald-600">{formatCurrency(t.amount, language)}</td>
                              <td className="p-2.5 text-right font-bold text-rose-600">{formatCurrency(t.balanceAfter, language)}</td>
                              <td className="p-2.5 text-center font-sans text-[10px] text-slate-500">{t.collectorName}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  {isBn ? 'এই সদস্যের কোন সক্রিয় ঋণ হিসাব নেই।' : 'No active loan accounts found for this member.'}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DPS LEDGER */}
          {activeTab === 'dps' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-bold text-lg text-emerald-700 dark:text-emerald-400">
                  {isBn ? 'ডিপিএস লেজার (DPS Pension Ledger)' : 'DPS Ledger'}
                </h3>
                <span className="text-xs font-mono bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded text-emerald-800 dark:text-emerald-300">
                  {memberDPS[0]?.dpsNo || 'N/A'}
                </span>
              </div>

              {memberDPS.length > 0 ? (
                memberDPS.map((dps) => (
                  <div key={dps.dpsNo} className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-xs">
                      <div>
                        <span className="text-slate-500">{isBn ? 'মাসিক কিস্তি:' : 'Monthly:'}</span>
                        <p className="font-bold">{formatCurrency(dps.monthlyInstallment, language)}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">{isBn ? 'মেয়াদ:' : 'Term:'}</span>
                        <p className="font-bold">{dps.termYears} Years</p>
                      </div>
                      <div>
                        <span className="text-slate-500">{isBn ? 'জমা কিস্তি:' : 'Paid Months:'}</span>
                        <p className="font-bold">{dps.paidInstallmentsCount} / {dps.totalInstallmentsCount}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">{isBn ? 'মেয়াদের সাম্ভাব্য রিটার্ন:' : 'Maturity Return:'}</span>
                        <p className="font-bold text-emerald-600">{formatCurrency(dps.expectedMaturityAmount, language)}</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold border-b">
                          <tr>
                            <th className="p-2.5">তারিখ</th>
                            <th className="p-2.5">ভাউচার</th>
                            <th className="p-2.5 text-right">কিস্তি পরিমাণ</th>
                            <th className="p-2.5 text-right">সর্বমোট জমাকৃত</th>
                            <th className="p-2.5 text-center">আদায়কারী</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                          {memberTxns.filter(t => t.accountType === 'dps' && t.accountNo === dps.dpsNo).map((t) => (
                            <tr key={t.id}>
                              <td className="p-2.5 font-sans">{formatDate(t.date, language)}</td>
                              <td className="p-2.5">{t.voucherNo}</td>
                              <td className="p-2.5 text-right font-bold text-emerald-600">{formatCurrency(t.amount, language)}</td>
                              <td className="p-2.5 text-right font-bold text-emerald-600">{formatCurrency(t.balanceAfter, language)}</td>
                              <td className="p-2.5 text-center font-sans text-[10px] text-slate-500">{t.collectorName}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  {isBn ? 'এই সদস্যের কোন সক্রিয় ডিপিএস হিসাব নেই।' : 'No active DPS accounts for this member.'}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: TERMS & RULES */}
          {activeTab === 'terms' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <h3 className="font-bold text-base text-emerald-800 dark:text-emerald-400 border-b pb-2">
                {isBn ? 'সদস্যের সাধারণ নিয়মাবলী ও অঙ্গীকারনামা' : 'Member Declaration & Society By-laws'}
              </h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>সদস্যকে পাসবই যত্নসহকারে সংরক্ষণ করতে হবে। পাসবই হারিয়ে গেলে নির্দিষ্ট ফি প্রদানপূর্বক দুplicat পাশবই গ্রহণ করতে হবে।</li>
                <li>প্রতিবার সঞ্চয় জমা বা ঋণ কিস্তি প্রদানের সাথে সাথে ক্যাশিয়ারের স্বাক্ষর ও ভাউচার রসিদ বুঝে নিতে হবে।</li>
                <li>নির্ধারিত তারিখের মধ্যে কিস্তি পরিশোধে ব্যর্থ হলে উপ-আইন অনুযায়ী বিলম্ব ফি প্রযোজ্য হতে পারে।</li>
                <li>সদস্য তার জমাকৃত শেয়ার ও সঞ্চয় সমবায় আইন ২০০১ (সংশোধিত ২০১৩) এর আওতায় প্রত্যাহার করতে পারবেন।</li>
              </ol>

              <div className="pt-8 grid grid-cols-2 gap-8 text-center border-t border-slate-300 dark:border-slate-700">
                <div>
                  <div className="border-b border-slate-400 w-32 mx-auto mb-1"></div>
                  <p className="font-bold">{isBn ? 'সদস্যের স্বাক্ষর' : 'Member Signature'}</p>
                </div>
                <div>
                  <div className="border-b border-slate-400 w-32 mx-auto mb-1"></div>
                  <p className="font-bold">{isBn ? 'সম্পাদক / কোষাধ্যক্ষ' : 'General Secretary / Treasurer'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
