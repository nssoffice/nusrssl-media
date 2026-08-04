import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import { Landmark, ShieldCheck, CheckCircle2, FileText, Printer } from 'lucide-react';

export const LoanApplicationPage: React.FC = () => {
  const { language, members, applyLoan, setActivePage } = useApp();
  const isBn = language === 'bn';

  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || '');
  const [loanType, setLoanType] = useState<'microcredit' | 'business' | 'emergency' | 'agricultural'>('business');
  const [amount, setAmount] = useState<number>(50000);
  const [durationMonths, setDurationMonths] = useState<number>(12);
  const [purpose, setPurpose] = useState<string>('দোকানের মালামাল ও ব্যবসা বৃদ্ধি');
  const [guarantorName, setGuarantorName] = useState<string>('');
  const [guarantorMobile, setGuarantorMobile] = useState<string>('');
  const [guarantorNid, setGuarantorNid] = useState<string>('');

  const [submittedLoan, setSubmittedLoan] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !amount) {
      alert(isBn ? 'দয়া করে সদস্য নির্বাচন করুন ও পরিমাণ দিন।' : 'Please select member and amount.');
      return;
    }

    const applied = applyLoan({
      memberId: selectedMemberId,
      loanType,
      principalAmount: amount,
      interestRate: loanType === 'emergency' ? 9 : 10,
      durationMonths,
      installmentType: 'monthly',
      totalInstallments: durationMonths,
      installmentAmount: Math.round((amount * 1.1) / durationMonths),
      purpose,
      guarantorName: guarantorName || 'মো: রফিকুল ইসলাম',
      guarantorMobile: guarantorMobile || '01722324324',
      guarantorNid: guarantorNid || '1985501111222333'
    });

    setSubmittedLoan(applied);
  };

  if (submittedLoan) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          {isBn ? 'ঋণ আবেদন সফলভাবে গৃহীয় হয়েছে!' : 'Loan Application Received!'}
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400">
          {isBn
            ? `আবেদন নম্বর: ${submittedLoan.loanNo}। পরিচালনা পরিষদ দ্রুত যাচাই-বাছাই করে অনুমোদন প্রদান করবে।`
            : `Application Ref: ${submittedLoan.loanNo}. Pending Executive Board Review.`}
        </p>

        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2 max-w-md mx-auto">
          <div className="flex justify-between">
            <span className="text-slate-500">{isBn ? 'ঋণ ট্র্যাকিং নম্বর:' : 'Loan Ref:'}</span>
            <strong className="font-mono text-emerald-600">{submittedLoan.loanNo}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{isBn ? 'আবেদনকৃত পরিমাণ:' : 'Requested Amount:'}</span>
            <strong className="font-mono text-base">{formatCurrency(submittedLoan.principalAmount, language)}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{isBn ? 'ঋণের উদ্দেশ্য:' : 'Purpose:'}</span>
            <span>{submittedLoan.purpose}</span>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>{isBn ? 'আবেদন কপি প্রিন্ট করুন' : 'Print Application'}</span>
          </button>
          <button
            onClick={() => setActivePage('loans')}
            className="px-5 py-2.5 bg-slate-800 text-white font-semibold text-xs rounded-xl hover:bg-slate-700 transition"
          >
            {isBn ? 'ঋণ তালিকায় যান' : 'Back to Loans'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
          {isBn ? 'সহজ ঋণ সেবা' : 'Online Credit Application'}
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {isBn ? 'ঋণ আবেদন ফরম' : 'Loan Application Form'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">{isBn ? 'আবেদনকারী সদস্য চয়ন করুন:' : 'Select Member:'}</label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 text-white dark:bg-slate-900"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} - {m.nameBn} ({m.mobile})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">{isBn ? 'ঋণের ধরন (Loan Category):' : 'Loan Type:'}</label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value as any)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 text-white dark:bg-slate-900"
              >
                <option value="business">{isBn ? 'ব্যবসায়িক ঋণ (Business Loan)' : 'Business Loan'}</option>
                <option value="microcredit">{isBn ? 'ক্ষুদ্র ঋণ (Microcredit)' : 'Microcredit'}</option>
                <option value="emergency">{isBn ? 'জরুরী ঋণ (Emergency)' : 'Emergency Loan'}</option>
                <option value="agricultural">{isBn ? 'কৃষি ঋণ (Agricultural)' : 'Agricultural Loan'}</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">{isBn ? 'আবেদনকৃত টাকার পরিমাণ:' : 'Requested Amount (Tk):'}</label>
              <input
                type="number"
                required
                min={5000}
                max={500000}
                step={5000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">{isBn ? 'ঋণের উদ্দেশ্য (Purpose of Loan):' : 'Purpose:'}</label>
            <textarea
              required
              rows={2}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
            />
          </div>

          <div className="border-t pt-4 space-y-3">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              {isBn ? 'জামিনদার/গ্যারান্টার এর তথ্য (Guarantor Details)' : 'Guarantor Information'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">{isBn ? 'গ্যারান্টারের নাম:' : 'Guarantor Name:'}</label>
                <input
                  type="text"
                  required
                  placeholder="মো: রফিকুল ইসলাম"
                  value={guarantorName}
                  onChange={(e) => setGuarantorName(e.target.value)}
                  className="w-full p-2 rounded-lg border bg-transparent"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">{isBn ? 'গ্যারান্টারের মোবাইল:' : 'Guarantor Mobile:'}</label>
                <input
                  type="tel"
                  required
                  placeholder="01722324324"
                  value={guarantorMobile}
                  onChange={(e) => setGuarantorMobile(e.target.value)}
                  className="w-full p-2 rounded-lg border bg-transparent font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">{isBn ? 'গ্যারান্টারের এনআইডি:' : 'Guarantor NID:'}</label>
                <input
                  type="text"
                  required
                  placeholder="1985501111222333"
                  value={guarantorNid}
                  onChange={(e) => setGuarantorNid(e.target.value)}
                  className="w-full p-2 rounded-lg border bg-transparent font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-xl transition shadow-lg"
        >
          {isBn ? 'ঋণ আবেদন সাবমিট করুন' : 'Submit Loan Request'}
        </button>
      </form>
    </div>
  );
};
