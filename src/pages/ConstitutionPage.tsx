import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CONSTITUTION_CHAPTERS } from '../data/initialData';
import { BookOpen, FileCheck2, ShieldCheck, Download, Printer } from 'lucide-react';

export const ConstitutionPage: React.FC = () => {
  const { language, societyInfo } = useApp();
  const [selectedChapter, setSelectedChapter] = useState<number>(0);
  const isBn = language === 'bn';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          {isBn ? 'সমবায় সমবায় আইন ও উপ-আইন' : 'Cooperative Society Constitution & By-Laws'}
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {isBn ? 'সমিতির পূর্ণাঙ্গ উপ-আইন ও নিয়মানুবর্তিতা' : 'Full Constitution & Regulatory Rules'}
        </h1>
        <p className="text-xs text-slate-500">
          {isBn ? 'বাংলাদেশ সমবায় সমিতি আইন ২০০১ (সংশোধিত ২০১৩) এবং সমবায় সমিতি বিধিমালা ২০০৪ অনুসরণে প্রণীত।' : 'Governed under Bangladesh Cooperative Societies Act 2001 (Amended 2013) & Rules 2004.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Chapter Navigation Sidebar */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-lg border border-slate-200 dark:border-slate-800 space-y-2">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            {isBn ? 'উপ-আইন অধ্যায়সমূহ (Chapters)' : 'Constitution Chapters'}
          </h3>

          {CONSTITUTION_CHAPTERS.map((ch, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedChapter(idx)}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-medium transition flex items-center justify-between ${
                selectedChapter === idx
                  ? 'bg-emerald-600 text-white font-bold shadow'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>অধ্যায় {ch.chapterNo}: {isBn ? ch.titleBn : ch.titleEn}</span>
            </button>
          ))}
        </div>

        {/* Selected Chapter View */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                {isBn ? `অধ্যায় ${CONSTITUTION_CHAPTERS[selectedChapter].chapterNo}` : `Chapter ${CONSTITUTION_CHAPTERS[selectedChapter].chapterNo}`}
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {isBn ? CONSTITUTION_CHAPTERS[selectedChapter].titleBn : CONSTITUTION_CHAPTERS[selectedChapter].titleEn}
              </h2>
            </div>

            <button
              onClick={() => window.print()}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition text-slate-700 dark:text-slate-300"
              title={isBn ? 'প্রিন্ট করুন' : 'Print'}
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>

          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-4 font-sans">
            {CONSTITUTION_CHAPTERS[selectedChapter].contentBn}
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>{isBn ? 'সমিতির অনুমোদিত গঠনতন্ত্র ও উপ-আইন' : 'Approved Society Constitution & Bylaws'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
