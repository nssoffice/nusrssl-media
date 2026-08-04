import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, ShieldCheck, MapPin, Phone, Mail, Award, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { language, societyInfo, setActivePage } = useApp();
  const isBn = language === 'bn';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          {isBn ? 'আমাদের সমবায় পরিচিতি' : 'About Our Cooperative Society'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {isBn ? societyInfo.nameBn : societyInfo.nameEn}
        </h1>
        <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-base">
          "{isBn ? societyInfo.sloganBn : societyInfo.sloganEn}"
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white border-l-4 border-emerald-600 pl-3">
            {isBn ? 'আমাদের পথচলা ও ইতিহাস' : 'Background & History'}
          </h2>
          <p>
            {isBn 
              ? 'নিরাপদ উন্নয়ন সঞ্চয় ও ঋণদান সমবায় সমিতি (NUSRSSL) কুষ্টিয়া জেলার একটি অগ্রগামী প্রাইভেট সমবায় ব্যবস্থাপনা প্রতিষ্ঠান। স্থানীয় ব্যবসায়ী, ক্ষুদ্র উদ্যোক্তা ও মেহনতী মানুষদের মধ্যে নিয়মিত ক্ষুদ্র সঞ্চয়ের অভ্যাস গড়ে তোলা এবং অর্থনৈতিক স্বাবলম্বিতা অর্জনের লক্ষ্যে এটি গঠিত ও পরিচালিত।'
              : 'Nirapad Unnayan Sanchay & Rindan Samabay Samity (NUSRSSL) was established in Kushtia to foster micro-savings, empower local traders, and provide low-cost credit facilities under transparent private cooperative management.'}
          </p>
          <p>
            {isBn
              ? 'এটি একটি বেসরকারি সমবায় ব্যবস্থাপনা সমিতি। পরিচালনা পর্ষদের সিদ্ধান্ত, নিজস্ব গঠনতন্ত্র ও উপ-আইন অনুসরণ করে এর সকল আর্থিক কর্মকাণ্ড পরিচালনা করা হয়।'
              : 'Operating as a private cooperative management system, the society follows internal bylaws and democratic governance.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 p-2.5 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
              <span>
                {societyInfo.regNoBn || societyInfo.regNoEn 
                  ? (isBn ? societyInfo.regNoBn : societyInfo.regNoEn)
                  : (isBn ? 'প্রাইভেট সমবায় সমিতি (অ-নিবন্ধিত)' : 'Private Cooperative Society')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 p-2.5 rounded-xl">
              <Award className="w-5 h-5" />
              <span>{isBn ? '১০০% অডিটকৃত হিসাব' : '100% Audited Accounts'}</span>
            </div>
          </div>
        </div>

        {/* Office & Contact Box */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-8 rounded-3xl shadow-xl space-y-6">
          <h3 className="text-lg font-bold border-b border-emerald-700/50 pb-3 text-emerald-300">
            {isBn ? 'কার্যালয়ের ঠিকানা ও যোগাযোগ' : 'Office Headquarters'}
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-200">{isBn ? 'রেজিস্টার্ড কার্যালয়:' : 'Registered Office:'}</strong>
                <p className="text-slate-300 leading-relaxed">{isBn ? societyInfo.addressBn : societyInfo.addressEn}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-200">{isBn ? 'মোবাইল ও ফোন:' : 'Hotlines:'}</strong>
                <p className="text-slate-300">{societyInfo.phone1} | {societyInfo.phone2}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-200">{isBn ? 'অনলাইন সেবা ও সহায়তা:' : 'Online Help Desk:'}</strong>
                <p className="text-slate-300">{societyInfo.onlineService} | {societyInfo.email}</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActivePage('committee')}
              className="w-full py-3 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400 transition"
            >
              {isBn ? 'পরিচালনা পরিষদের সাথে পরিচিত হন' : 'Meet Executive Board'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
