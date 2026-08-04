import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PiggyBank, Landmark, CreditCard, CheckCircle2, ArrowRight, ShieldCheck, Calculator } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { language, setActivePage } = useApp();
  const [activeTab, setActiveTab] = useState<'savings' | 'loans' | 'dps'>('savings');
  const isBn = language === 'bn';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          {isBn ? 'আর্থিক সেবা ও প্রজেক্ট' : 'Financial Services & Products'}
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {isBn ? 'সঞ্চয়, ঋণ ও ডিপিএস স্কিমসমূহ' : 'Savings, Loan & Deposit Pension Schemes'}
        </h1>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex justify-center border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('savings')}
            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'savings'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <PiggyBank className="w-5 h-5" />
            <span>{isBn ? 'সঞ্চয় স্কিম (Savings)' : 'Savings Schemes'}</span>
          </button>

          <button
            onClick={() => setActiveTab('loans')}
            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'loans'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Landmark className="w-5 h-5" />
            <span>{isBn ? 'ঋণ সেবাসমূহ (Loans)' : 'Loan Services'}</span>
          </button>

          <button
            onClick={() => setActiveTab('dps')}
            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'dps'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span>{isBn ? 'ডিপিএস স্কিম (DPS)' : 'DPS Schemes'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SAVINGS */}
      {activeTab === 'savings' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow space-y-3">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md">
                {isBn ? 'দৈনিক স্কিম' : 'Daily Savings'}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{isBn ? 'দৈনিক ক্ষুদ্র সঞ্চয়' : 'Daily Micro Savings'}</h3>
              <p className="text-xs text-slate-500">{isBn ? 'দোকানী, ব্যবসায়ী ও হকারদের জন্য প্রতিদিনের সঞ্চয় আদায়।' : 'Daily doorstep collection starting from Tk 20 per day.'}</p>
              <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                <li>• {isBn ? 'বার্ষিক লভ্যাংশ: ৮.০%' : 'Annual Interest: 8.0%'}</li>
                <li>• {isBn ? 'তাত্ক্ষণিক ই-রসিদ ও পাসবই' : 'Instant E-Receipt SMS & Passbook'}</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow space-y-3">
              <span className="text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-md">
                {isBn ? 'সাপ্তাহিক স্কিম' : 'Weekly Savings'}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{isBn ? 'সাপ্তাহিক জমা হিসাব' : 'Weekly Savings Account'}</h3>
              <p className="text-xs text-slate-500">{isBn ? 'সপ্তাহিক ভিত্তিতে ১০০ টাকা থেকে নিয়মিত জমা।' : 'Deposit every week with guaranteed interest compound.'}</p>
              <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                <li>• {isBn ? 'বার্ষিক লভ্যাংশ: ৭.৫%' : 'Annual Interest: 7.5%'}</li>
                <li>• {isBn ? 'ফ্রি অনলাইন অ্যাকাউন্টিং' : 'Free online statement ledger'}</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow space-y-3">
              <span className="text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-950 px-2.5 py-1 rounded-md">
                {isBn ? 'মাসিক সঞ্চয়' : 'Monthly Savings'}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{isBn ? 'মাসিক মেয়াদী সঞ্চয়' : 'Monthly Savings Account'}</h3>
              <p className="text-xs text-slate-500">{isBn ? 'চাকুরীজীবী ও পেশাজীবীদের জন্য প্রতি মাসে নির্দিষ্ট জমা।' : 'Ideal for salaried employees and long-term planners.'}</p>
              <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                <li>• {isBn ? 'বার্ষিক লভ্যাংশ: ৭.৫%' : 'Annual Interest: 7.5%'}</li>
                <li>• {isBn ? 'ঋণ জামানত হিসাবে ব্যবহারযোগ্য' : 'Usable as collateral for loans'}</li>
              </ul>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => setActivePage('register')}
              className="px-6 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition shadow-lg"
            >
              {isBn ? 'সদস্য হয়ে সঞ্চয় হিসাব খুলুন' : 'Join Member & Open Savings Account'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: LOANS */}
      {activeTab === 'loans' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{isBn ? 'ক্ষুদ্র ও ব্যবসা ঋণ (Micro-Business Loan)' : 'Micro & Small Enterprise Loan'}</h3>
              <p className="text-xs text-slate-500">{isBn ? 'ব্যবসার মালামাল ক্রয়, দোকান সম্প্রসারণ ও মূলধন পূরণে ঋণ।' : 'For inventory purchase, shop extension, and working capital.'}</p>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs space-y-1">
                <p>• {isBn ? 'সর্বোচ্চ ঋণ পরিমাণ: ৫,০০,০০০/- টাকা' : 'Max Amount: Tk 5,00,000'}</p>
                <p>• {isBn ? 'মেয়াদ: ৬ থেকে ২৪ মাস' : 'Duration: 6 to 24 Months'}</p>
                <p>• {isBn ? 'সুদের হার: ১০.০% (হ্রাসমান স্থিতি)' : 'Interest Rate: 10.0% Reducing'}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{isBn ? 'জরুরী ও কৃষি ঋণ (Emergency & Agriculture)' : 'Emergency & Agricultural Loan'}</h3>
              <p className="text-xs text-slate-500">{isBn ? 'কৃষি কাজ, পোল্ট্রি, ডেইরি ও জরুরী ব্যক্তিগত প্রয়োজনে তৎক্ষনাৎ ঋণ।' : 'For farming, livestock, medical, or urgent personal needs.'}</p>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs space-y-1">
                <p>• {isBn ? 'সর্বোচ্চ ঋণ পরিমাণ: ১,০০,০০০/- টাকা' : 'Max Amount: Tk 1,00,000'}</p>
                <p>• {isBn ? 'মেয়াদ: ৩ থেকে ১২ মাস' : 'Duration: 3 to 12 Months'}</p>
                <p>• {isBn ? 'সুদের হার: ৯.০% মাত্র' : 'Interest Rate: 9.0% Only'}</p>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => setActivePage('loan-application')}
              className="px-6 py-3 bg-amber-600 text-white font-bold text-xs rounded-xl hover:bg-amber-500 transition shadow-lg"
            >
              {isBn ? 'অনলাইন ঋণ আবেদন করুন' : 'Apply for Online Loan'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: DPS */}
      {activeTab === 'dps' && (
        <div className="space-y-8">
          <div className="bg-emerald-900 text-white p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold">{isBn ? 'ডিপিএস ডিপোজিট পেনশন স্কিম চার্ট' : 'DPS Deposit Pension Scheme Return Chart'}</h3>
            <p className="text-xs text-emerald-200">
              {isBn ? 'মাসিক নির্দিষ্ট কিস্তি জমায় ৩, ৫ ও ১০ বছর মেয়াদের মুনাফা রিটার্ন তালিকা:' : 'Estimated maturity returns based on monthly installment amounts:'}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-white">
                <thead className="bg-white/10 text-emerald-300 font-bold border-b border-white/20">
                  <tr>
                    <th className="p-3">মাসিক কিস্তি (Monthly)</th>
                    <th className="p-3">৩ বছর মেয়াদ (3 Yrs)</th>
                    <th className="p-3">৫ বছর মেয়াদ (5 Yrs)</th>
                    <th className="p-3">১০ বছর মেয়াদ (10 Yrs)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 font-mono">
                  <tr>
                    <td className="p-3 font-bold text-amber-300">৳ ৫০০</td>
                    <td className="p-3">৳ ২১,২০০</td>
                    <td className="p-3">৳ ৩৮,৫০০</td>
                    <td className="p-3">৳ ৯৮,০০০</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-amber-300">৳ ১,০০০</td>
                    <td className="p-3">৳ ৪২,৪০০</td>
                    <td className="p-3">৳ ৭৭,০০০</td>
                    <td className="p-3">৳ ১,৯৬,০০০</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-amber-300">৳ ২,০০০</td>
                    <td className="p-3">৳ ৮৪,৮০০</td>
                    <td className="p-3">৳ ১,৫৪,০০০</td>
                    <td className="p-3">৳ ৩,৯২,০০০</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-amber-300">৳ ৫,০০০</td>
                    <td className="p-3">৳ ২,১২,০০০</td>
                    <td className="p-3">৳ ৩,৮৫,০০০</td>
                    <td className="p-3">৳ ৯,৮০,০০০</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
