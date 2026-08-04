import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { FileText, Search, BookOpen, UserCheck, ShieldCheck, Printer, ArrowRight } from 'lucide-react';

export const DigitalPassbookPage: React.FC = () => {
  const { 
    members, 
    savingsAccounts, 
    loanAccounts, 
    dpsAccounts, 
    transactions,
    setSelectedMemberForPassbook, 
    setSelectedMemberCard,
    language 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const isBn = language === 'bn';

  const filteredMembers = members.filter((m) => 
    m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.nameBn.includes(searchQuery) ||
    m.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.mobile.includes(searchQuery) ||
    m.nid.includes(searchQuery)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          {isBn ? 'ডিজিটাল সমবায় পোর্টাল' : 'Digital Passbook & Ledger Portal'}
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {isBn ? 'সদস্য ডিজিটাল পাসবই পোর্টালে অনুসন্ধান' : 'Search Member Passbook & Statements'}
        </h1>
        <p className="text-xs text-slate-500">
          {isBn ? 'সদস্য নম্বর, নাম, মোবাইল নম্বর অথবা এনআইডি দিয়ে খুঁজুন।' : 'Search by Member ID (e.g. NUSRSSL-2026-0101), Name, Mobile, or NID.'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder={isBn ? 'সদস্য নম্বর (যেমন: NUSRSSL-2026-0101) বা নাম লিখুন...' : 'Search Member ID, Name or Mobile...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm shadow-md focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => {
          const mSavings = savingsAccounts.filter((s) => s.memberId === member.id);
          const mLoans = loanAccounts.filter((l) => l.memberId === member.id);
          const mDPS = dpsAccounts.filter((d) => d.memberId === member.id);

          const totalSavingsBal = mSavings.reduce((acc, curr) => acc + curr.balance, 0);

          return (
            <div
              key={member.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition space-y-4"
            >
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <img
                  src={member.photoUrl}
                  alt={member.nameEn}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow"
                />
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    {member.id}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mt-1">
                    {isBn ? member.nameBn : member.nameEn}
                  </h3>
                  <p className="text-xs text-slate-500">{member.mobile}</p>
                </div>
              </div>

              {/* Financial Snapshot */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <div>
                  <span className="text-slate-500 block">{isBn ? 'সঞ্চয় স্থিতি:' : 'Savings:'}</span>
                  <strong className="font-mono text-emerald-600">{formatCurrency(totalSavingsBal, language)}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">{isBn ? 'ঋণ হিসাব:' : 'Loans:'}</span>
                  <strong className="font-mono text-amber-600">{mLoans.length}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">{isBn ? 'ডিপিএস:' : 'DPS:'}</span>
                  <strong className="font-mono text-teal-600">{mDPS.length}</strong>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMemberForPassbook(member)}
                  className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition flex items-center justify-center gap-1.5 shadow"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{isBn ? 'ডিজিটাল পাসবই খুলুন' : 'Open Passbook'}</span>
                </button>

                <button
                  onClick={() => setSelectedMemberCard(member)}
                  className="p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300"
                  title={isBn ? 'সদস্য কার্ড প্রিন্ট' : 'Print ID Card'}
                >
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
