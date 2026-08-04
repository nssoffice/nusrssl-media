import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Users, Shield, Award } from 'lucide-react';

export const CommitteePage: React.FC = () => {
  const { language, executiveMembers } = useApp();
  const isBn = language === 'bn';

  const executiveBoard = executiveMembers.filter((m) => m.roleType === 'executive');
  const advisorsBoard = executiveMembers.filter((m) => m.roleType === 'advisor');

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Page Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          {isBn ? 'নেতৃত্ব ও পরিচালনামণ্ডলী' : 'Leadership & Board Members'}
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {isBn ? 'পরিচালনা পরিষদ ও উপদেষ্টা প্যানেল' : 'Executive Committee & Advisors'}
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          {isBn ? 'দক্ষ, অভিজ্ঞ এবং নীতিবান নেতৃত্বের পরিচালনায় নিরাপদ উন্নয়ন সমবায় সমিতি সুসংগঠিত।' : 'Guided by experienced community leaders dedicated to cooperative development.'}
        </p>
      </div>

      {/* EXECUTIVE COMMITTEE */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-l-4 border-emerald-600 pl-3">
          <Users className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isBn ? 'ব্যবস্থাপনা ও পরিচালনা কমিটি' : 'Executive Managing Committee'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {executiveBoard.map((member) => (
            <div 
              key={member.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition text-center space-y-3 group"
            >
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-emerald-500/30 group-hover:border-emerald-500 transition-colors shadow">
                <img 
                  src={member.photoUrl} 
                  alt={member.nameEn} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {isBn ? member.nameBn : member.nameEn}
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  {isBn ? member.designationBn : member.designationEn}
                </p>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {isBn ? member.bioBn : member.bioEn}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{member.mobile}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADVISORY BOARD */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center gap-2 border-l-4 border-teal-600 pl-3">
          <Award className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isBn ? 'সম্মানিত উপদেষ্টা প্যানেল' : 'Advisory Panel'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {advisorsBoard.map((advisor) => (
            <div 
              key={advisor.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 flex items-center gap-5"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-teal-500/30 shrink-0">
                <img src={advisor.photoUrl} alt={advisor.nameEn} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {isBn ? advisor.nameBn : advisor.nameEn}
                </h3>
                <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                  {isBn ? advisor.designationBn : advisor.designationEn}
                </p>
                <p className="text-xs text-slate-500">
                  {isBn ? advisor.bioBn : advisor.bioEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
