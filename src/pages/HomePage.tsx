import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { 
  Building2, 
  PiggyBank, 
  Landmark, 
  CreditCard, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Bell, 
  Calculator, 
  FileText, 
  CheckCircle2, 
  PhoneCall, 
  Award,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomePage: React.FC = () => {
  const { 
    language, 
    setActivePage, 
    societyInfo, 
    members, 
    savingsAccounts, 
    loanAccounts, 
    dpsAccounts, 
    notices,
    setSelectedMemberForPassbook
  } = useApp();

  const isBn = language === 'bn';

  const totalMembers = members.length;
  const totalSavings = savingsAccounts.reduce((acc, curr) => acc + curr.balance, 0);
  const totalLoans = loanAccounts.reduce((acc, curr) => acc + curr.principalAmount, 0);
  const totalDPS = dpsAccounts.reduce((acc, curr) => acc + curr.totalPaidAmount, 0);

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white py-16 lg:py-24 px-4 rounded-3xl mx-4 mt-4 shadow-2xl">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1.5 rounded-full text-emerald-300 text-xs font-semibold backdrop-blur-md"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {societyInfo.regNoBn || societyInfo.regNoEn 
                  ? (isBn ? societyInfo.regNoBn : societyInfo.regNoEn) 
                  : (isBn ? 'প্রাইভেট সমবায় সমিতি (অ-নিবন্ধিত)' : 'Private Cooperative Society (Unregistered)')}
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight"
            >
              {isBn ? societyInfo.nameBn : societyInfo.nameEn}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-emerald-200 text-base sm:text-xl font-medium"
            >
              "{isBn ? societyInfo.sloganBn : societyInfo.sloganEn}"
            </motion.p>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed"
            >
              {isBn
                ? 'কুষ্টিয়া জেলায় স্থায়ী ক্ষুদ্র সঞ্চয় সৃষ্টি, স্বাবলম্বিতা অর্জন এবং সহজ শর্তে ক্ষুদ্র ও মাঝারি ঋণ সুবিধার প্রাইভেট সমবায় ব্যবস্থাপনা।'
                : 'A private financial cooperative empowering communities through micro-savings, DPS schemes, and transparent loan facilities in Kushtia.'}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2"
            >
              <button
                onClick={() => setActivePage('register')}
                className="px-6 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 text-sm"
              >
                <span>{isBn ? 'সদস্য পদের জন্য আবেদন' : 'Apply for Membership'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setActivePage('passbook')}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-semibold text-white transition flex items-center gap-2 text-sm"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>{isBn ? 'ডিজিটাল পাসবই চেক' : 'Digital Passbook'}</span>
              </button>
            </motion.div>
          </div>

          {/* Stat Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl text-center hover:bg-white/15 transition">
              <Users className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
              <h3 className="text-2xl font-black text-white">{totalMembers + 150}+</h3>
              <p className="text-xs text-emerald-200 font-medium">{isBn ? 'মোট সম্মানিত সদস্য' : 'Active Members'}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl text-center hover:bg-white/15 transition">
              <PiggyBank className="w-8 h-8 mx-auto text-teal-300 mb-2" />
              <h3 className="text-xl font-black text-white">{formatCurrency(totalSavings + 2500000, language)}</h3>
              <p className="text-xs text-emerald-200 font-medium">{isBn ? 'মোট আমানত স্থিতি' : 'Total Savings'}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl text-center hover:bg-white/15 transition">
              <Landmark className="w-8 h-8 mx-auto text-amber-300 mb-2" />
              <h3 className="text-xl font-black text-white">{formatCurrency(totalLoans + 1800000, language)}</h3>
              <p className="text-xs text-emerald-200 font-medium">{isBn ? 'বিতরণকৃত মোট ঋণ' : 'Loans Disbursed'}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl text-center hover:bg-white/15 transition">
              <CreditCard className="w-8 h-8 mx-auto text-sky-300 mb-2" />
              <h3 className="text-xl font-black text-white">{formatCurrency(totalDPS + 1200000, language)}</h3>
              <p className="text-xs text-emerald-200 font-medium">{isBn ? 'চলতি ডিপিএস ফান্ড' : 'Active DPS Fund'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            {isBn ? 'আমাদের প্রধান সেবাসমূহ' : 'Core Financial Services'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {isBn ? 'আপনার সঞ্চয় ও ভবিষ্যতের নিরাপদ বিশ্বস্ত সাথী' : 'Your Trusted Partner for Savings & Loans'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Savings */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition group space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <PiggyBank className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {isBn ? 'সঞ্চয় সেবাসমূহ (Savings)' : 'Savings Schemes'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isBn 
                ? 'দৈনিক, সাপ্তাহিক ও মাসিক স্কিমে আকর্ষণীয় মুনাফায় ক্ষুদ্র সঞ্চয় করুন। অনলাইন পাসবই দিয়ে যেকোনো সময় ব্যালেন্স পরীক্ষা করুন।'
                : 'Flexible daily, weekly, and monthly deposit options with attractive annual interest and real-time passbook tracking.'}
            </p>
            <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? 'দৈনিক নূন্যতম ২০ টাকা থেকে জমা' : 'Start from minimum Tk 20/day'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? 'বার্ষিক ৭.৫% লাভজনক লভ্যাংশ' : 'Up to 7.5% annual dividend'}</span>
              </li>
            </ul>
            <button
              onClick={() => setActivePage('savings')}
              className="pt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              <span>{isBn ? 'বিস্তারিত জানুন' : 'Learn More'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Loans */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition group space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Landmark className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {isBn ? 'সহজ ঋণ সেবা (Loans)' : 'Micro & Business Loans'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isBn
                ? 'ক্ষুদ্র ব্যবসা সম্প্রসারণ, কৃষি কাজ ও জরুরী প্রয়োজনে সহজ শর্তে ও সহজ ইএমআই কিস্তিতে ঋণ সুবিধা।'
                : 'Microcredit, agriculture, and small business development loans with low interest rates and simple guarantor rules.'}
            </p>
            <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>{isBn ? 'সঞ্চয়ের ৫ গুণ পর্যন্ত ঋণ সুবিধা' : 'Up to 5x of savings collateral'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>{isBn ? 'সহজ মাসিক কিস্তি পরিশোধ' : 'Flexible monthly EMI payback'}</span>
              </li>
            </ul>
            <button
              onClick={() => setActivePage('loans')}
              className="pt-2 text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              <span>{isBn ? 'ঋণ আবেদন করুন' : 'Apply for Loan'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: DPS */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition group space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-950/60 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
              <CreditCard className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {isBn ? 'ডিপিএস স্কিম (DPS Pension)' : 'DPS Deposit Schemes'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isBn
                ? '৩, ৫ বা ১০ বছর মেয়াদী ডিপিএস সঞ্চয়ে নিশ্চিত মুনাফা লাভ করুন। আপনার সন্তানের ভবিষ্যৎ বা অবসরের নির্ভরতা।'
                : '3, 5, or 10-year term deposit pension schemes offering high return rates for long-term security.'}
            </p>
            <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>{isBn ? 'মাসিক ৫০০ টাকা থেকে শুরু' : 'Monthly starts from Tk 500'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>{isBn ? 'মেয়াদের দিনই তাত্ক্ষণিক মুনাফা বোনাস' : 'Instant bonus on maturity date'}</span>
              </li>
            </ul>
            <button
              onClick={() => setActivePage('dps')}
              className="pt-2 text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              <span>{isBn ? 'ডিপিএস হিসাব খুলুন' : 'Open DPS Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* QUICK CALCULATOR & PASSBOOK WIDGET */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Passbook quick search */}
        <div className="lg:col-span-6 bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-emerald-300" />
            <div>
              <h3 className="text-xl font-bold">{isBn ? 'অনলাইন ডিজিটাল পাসবই পোর্টালে স্বাগত' : 'Online Digital Passbook Portal'}</h3>
              <p className="text-xs text-emerald-200">{isBn ? 'আপনার সদস্য নম্বর দিয়ে পাসবই খুলুন' : 'View your member passbook ledger online'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-slate-200">
              {isBn 
                ? 'নিরাপদ উন্নয়ন সমবায় সমিতির সকল সদস্য তাদের কিউআর কোড যুক্ত ডিজিটাল পাসবই অনলাইনে দেখতে পারবেন।'
                : 'Members can access their multi-ledger digital passbook, savings statements, loan repayments, and DPS schedules.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  if (members.length > 0) {
                    setSelectedMemberForPassbook(members[0]);
                  }
                }}
                className="px-5 py-3 bg-white text-emerald-950 font-bold rounded-xl text-xs hover:bg-emerald-100 transition shadow"
              >
                {isBn ? 'নমুনা সদস্য পাসবই দেখুন (Demo Passbook)' : 'View Demo Passbook'}
              </button>
              
              <button
                onClick={() => setActivePage('passbook')}
                className="px-5 py-3 border border-white/30 text-white font-semibold rounded-xl text-xs hover:bg-white/10 transition"
              >
                {isBn ? 'সদস্য নম্বর দিয়ে সার্চ করুন' : 'Search Member Passbook'}
              </button>
            </div>
          </div>
        </div>

        {/* Notices Board Widget */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Bell className="w-5 h-5 text-rose-500 animate-pulse" />
              <h3 className="font-bold text-base">{isBn ? 'সমিতির সাম্প্রতিক নোটিশ বোর্ড' : 'Latest Announcements'}</h3>
            </div>
            <button
              onClick={() => setActivePage('news')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
            >
              {isBn ? 'সকল নোটিশ' : 'View All'}
            </button>
          </div>

          <div className="space-y-3">
            {notices.slice(0, 3).map((notice) => (
              <div 
                key={notice.id}
                onClick={() => setActivePage('news')}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800 transition cursor-pointer space-y-1 border border-slate-100 dark:border-slate-700/50"
              >
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase">{notice.category}</span>
                  <span>{formatDate(notice.date, language)}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                  {isBn ? notice.titleBn : notice.titleEn}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                  {isBn ? notice.contentBn : notice.contentEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {isBn ? 'কেন নিরাপদ উন্নয়ন সমবায় সমিতি বেছে নেবেন?' : 'Why Choose NUSRSSL Kushtia?'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isBn ? 'আমাদের মূল ভিত্তি স্বচ্ছতা, সততা এবং সমবায় সদস্যকেন্দ্রিক ডিজিটাল পরিচালনা।' : 'Guaranteed transparency, democratic management, and digital cooperative governance.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <ShieldCheck className="w-10 h-10 mx-auto text-emerald-600" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{isBn ? 'প্রাইভেট সমবায় সমিতি' : 'Private Cooperative'}</h4>
              <p className="text-xs text-slate-500">{isBn ? 'সদস্যদের যৌথ পরিচালনায় পরিচালিত প্রাইভেট সমবায় প্রতিষ্ঠান।' : 'Privately managed cooperative organization run by members.'}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <TrendingUp className="w-10 h-10 mx-auto text-teal-600" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{isBn ? 'স্বচ্ছ মুনাফা বন্টন' : 'Transparent Profits'}</h4>
              <p className="text-xs text-slate-500">{isBn ? 'প্রতি বছরের অর্জিত নিট মুনাফার লাভ্যংশ সরাসরি বন্টন।' : 'Annual audited net profits distributed directly to members.'}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <Calculator className="w-10 h-10 mx-auto text-amber-600" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{isBn ? 'ডিজিটাল হিসাব খাতা' : 'Digital Accounting'}</h4>
              <p className="text-xs text-slate-500">{isBn ? 'বারকোড ও কিউআর রসিদ দিয়ে তাৎক্ষণিক আর্থিক হিসাব।' : 'QR verified e-receipts and digital passbooks for members.'}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <PhoneCall className="w-10 h-10 mx-auto text-sky-600" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{isBn ? 'অনলাইন সহায়তা' : '24/7 Helpline'}</h4>
              <p className="text-xs text-slate-500">{isBn ? 'জরুরী সাহায্য ও তথ্যের জন্য অনলাইন সার্ভিস হটলাইন।' : 'Dedicated member support hotline at +8801748647079.'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
