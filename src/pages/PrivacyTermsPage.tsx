import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Lock, FileText } from 'lucide-react';

export const PrivacyTermsPage: React.FC = () => {
  const { language, societyInfo } = useApp();
  const isBn = language === 'bn';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          {isBn ? 'গোপনীয়তা ও শর্তাবলী' : 'Privacy & Terms'}
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {isBn ? 'গোপনীয়তা নীতি ও ব্যবহারের শর্তাবলী' : 'Privacy Policy & Terms of Service'}
        </h1>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>{isBn ? '১. তথ্যের গোপনীয়তা নীতি' : '1. Privacy Policy'}</span>
          </h2>
          <p>
            {isBn
              ? 'নিরাপদ উন্নয়ন সঞ্চয় ও ঋণদান সমবায় সমিতি (NUSRSSL) সদস্যদের ব্যক্তিগত তথ্য, এনআইডি, ছবি, ও লেনদেন হিসাব অভ্যন্তরীণ নীতিমালার আওতায় শতভাগ গোপনীয় রাখে। কোনো তথ্য ৩য় কোনো ব্যক্তির সাথে শেয়ার করা হয় না।'
              : 'NUSRSSL strictly protects all member data including NID, address, photo, and transaction logs under internal security policies.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>{isBn ? '২. ব্যবহারের শর্তাবলী' : '2. Terms of Service'}</span>
          </h2>
          <p>
            {isBn
              ? 'সদস্যগণ ডিজিটাল পাসবই পোর্টালে তাদের নিজেদের সদস্য নম্বর ব্যবহার করে স্টেটমেন্ট চেক করতে পারবেন। অনলাইন পোর্টালে প্রকাশিত সকল ডেটা সমিতির নিবন্ধিত ক্যাশ বই ও লেজারের সাথে চূড়ান্তভাবে মেলানো হয়।'
              : 'Digital passbook statements are mirrored from the society ledger. Any transaction discrepancies must be reported to the Treasurer within 7 days.'}
          </p>
        </section>
      </div>
    </div>
  );
};
