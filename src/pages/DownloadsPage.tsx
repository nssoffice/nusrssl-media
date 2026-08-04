import React from 'react';
import { useApp } from '../context/AppContext';
import { Download, FileText, CheckCircle2 } from 'lucide-react';

export const DownloadsPage: React.FC = () => {
  const { language, societyInfo } = useApp();
  const isBn = language === 'bn';

  const forms = [
    { titleBn: 'নতুন সদস্য ফরম (Member Join Form PDF)', titleEn: 'New Member Registration Form', size: '1.2 MB' },
    { titleBn: 'ঋণ আবেদনের ফরম (Loan Application Form PDF)', titleEn: 'Loan Application Form', size: '950 KB' },
    { titleBn: 'ডিপিএস হিসাব খোলার ফরম (DPS Opening Form PDF)', titleEn: 'DPS Account Opening Form', size: '820 KB' },
    { titleBn: 'মনোনীত ব্যক্তি পরিবর্তন ফরম (Nominee Change Form)', titleEn: 'Nominee Change Request Form', size: '540 KB' },
    { titleBn: 'সমিতির পূর্ণাঙ্গ উপ-আইন বই (Complete Constitution)', titleEn: 'Society Constitution & By-Laws PDF', size: '3.4 MB' },
    { titleBn: 'বার্ষিক অডিট রিপোর্ট ২০২৫ (Annual Audit Report)', titleEn: 'Annual Financial Audit Report 2025', size: '4.1 MB' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          {isBn ? 'ডাউনলোড সেন্টার' : 'Official Downloads Center'}
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {isBn ? 'ফরম ও রিপোর্টস ডাউনলোড' : 'Forms & Audit Reports Download'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {forms.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-emerald-500/50 transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isBn ? item.titleBn : item.titleEn}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{item.size}</p>
              </div>
            </div>

            <button
              onClick={() => alert(isBn ? 'ডাউনলোড শুরু হচ্ছে...' : 'Downloading PDF File...')}
              className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition shadow"
              title={isBn ? 'ডাউনলোড' : 'Download'}
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
