import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/formatters';
import { Bell, Image as ImageIcon, Calendar } from 'lucide-react';

export const NewsGalleryPage: React.FC = () => {
  const { language, notices } = useApp();
  const [activeTab, setActiveTab] = useState<'news' | 'gallery'>('news');
  const isBn = language === 'bn';

  const galleryImages = [
    {
      titleBn: 'বার্ষিক সাধারণ সভা (AGM) ও সদস্যদের লভ্যাংশ বন্টন',
      titleEn: 'Annual General Meeting & Dividend Distribution',
      url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80'
    },
    {
      titleBn: 'কুষ্টিয়া জেলা সমবায় র্যালিতে সমিতির সদসদের অংশগ্রহণ',
      titleEn: 'Cooperative Rally in Kushtia District',
      url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&auto=format&fit=crop&q=80'
    },
    {
      titleBn: 'সদস্যদের মাঝে ডিজিটাল পাসবই বিতরণ কর্মসূচি',
      titleEn: 'Digital Passbook Distribution Ceremony',
      url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80'
    },
    {
      titleBn: 'সফল ক্ষুদ্র উদ্যোক্তাদের মাঝে ঋণের চেক হস্তান্তর',
      titleEn: 'Micro-Enterprise Loan Disbursement Event',
      url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          {isBn ? 'সংবাদ ও ফটো অ্যালবাম' : 'News & Photo Gallery'}
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {isBn ? 'সংবাদ, নোটিশ ও আলোকচিত্র গ্যালারি' : 'News, Announcements & Events Gallery'}
        </h1>
      </div>

      <div className="flex justify-center border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('news')}
            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'news'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span>{isBn ? 'নোটিশ ও সংবাদ' : 'Notices & News'}</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'gallery'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span>{isBn ? 'ফটো গ্যালারি (Gallery)' : 'Photo Gallery'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'news' && (
        <div className="space-y-4">
          {notices.map((n) => (
            <div key={n.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span className="font-semibold text-emerald-600 uppercase">{n.category}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(n.date, language)}</span>
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {isBn ? n.titleBn : n.titleEn}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isBn ? n.contentBn : n.contentEn}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 group">
              <div className="h-56 overflow-hidden">
                <img
                  src={img.url}
                  alt={img.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                  {isBn ? img.titleBn : img.titleEn}
                </h4>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
