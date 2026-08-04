import React from 'react';
import { useApp } from '../context/AppContext';
import { Target, Eye, Compass, CheckCircle2 } from 'lucide-react';

export const MissionVisionPage: React.FC = () => {
  const { language } = useApp();
  const isBn = language === 'bn';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      {/* Page Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          {isBn ? 'লক্ষ্য, ভিশন ও কর্মপন্থা' : 'Mission, Vision & Strategic Objectives'}
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {isBn ? 'আমাদের ভিশন ও মিশন' : 'Our Mission & Strategic Vision'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission Box */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Target className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isBn ? 'আমাদের মিশন (Our Mission)' : 'Our Mission'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {isBn
              ? 'কুষ্টিয়া অঞ্চলের সর্বস্তরের মানুষের মধ্যে সঞ্চয়ের মানসিকতা গড়ে তোলা, স্থানীয় ক্ষুদ্র ও মাঝারি উদ্যোক্তাদের সহজ শর্তে ঋণ প্রদান করে কর্মসংস্থান সৃষ্টি করা এবং একটি শোষণমুক্ত স্বচ্ছ সমবায় সমাজ গঠন করা।'
              : 'To promote micro-savings habits among communities in Kushtia, provide affordable development credit for small businesses, create self-employment, and maintain absolute financial transparency.'}
          </p>
        </div>

        {/* Vision Box */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Eye className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isBn ? 'আমাদের ভিশন (Our Vision)' : 'Our Vision'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {isBn
              ? 'একটি শতভাগ ডিজিটাল, আধুনিক এবং আত্মনির্ভরশীল সমবায় মডেল প্রতিষ্ঠার মাধ্যমে দেশের দক্ষিণ-পশ্চিমাঞ্চলের সমবায় খাতে শ্রেষ্ঠত্বের স্থান অর্জন করা।'
              : 'To become a gold-standard digital cooperative financial institution in Bangladesh that guarantees long-term economic security and sustainable growth for all member families.'}
          </p>
        </div>
      </div>

      {/* Strategic Objectives */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Compass className="w-6 h-6 text-emerald-600" />
          <span>{isBn ? 'সমিতির প্রধান উদ্দেশ্যসমূহ (Key Objectives)' : 'Core Strategic Objectives'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-slate-700 dark:text-slate-300">
              {isBn ? '১. সদস্যদের থেকে দৈনিক, সাপ্তাহিক ও মাসিক মেয়াদের ক্ষুদ্র সঞ্চয় সংগ্রহ ও লাভজনক স্থানে বিনিয়োগ।' : '1. Accumulate micro-savings via flexible daily, weekly, and monthly schemes.'}
            </p>
          </div>

          <div className="flex items-start gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-slate-700 dark:text-slate-300">
              {isBn ? '২. ক্ষুদ্র ব্যবসা, কৃষি ও কুটির শিল্পের প্রসারে জামানতবিহীন স্বল্প সুদে ঋণ প্রদান।' : '2. Offer microcredit and small enterprise loans without complex red tape.'}
            </p>
          </div>

          <div className="flex items-start gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-slate-700 dark:text-slate-300">
              {isBn ? '৩. ডিপিএস ও পেনশন সঞ্চয় প্রকল্পের মাধ্যমে দীর্ঘমেয়াদী আর্থিক নিরাপত্তা সুনিশ্চিত করা।' : '3. Secure retirement and family savings through high-yield DPS plans.'}
            </p>
          </div>

          <div className="flex items-start gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-slate-700 dark:text-slate-300">
              {isBn ? '৪. কিউআর কোড যুক্ত ডিজিটাল পাসবই ও সফটওয়্যারের মাধ্যমে শতভাগ স্বচ্ছতা প্রদান।' : '4. Deploy QR Code digital passbooks and modern e-receipt systems.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
