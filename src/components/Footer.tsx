import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Shield, 
  Heart, 
  Lock, 
  FileCheck2, 
  QrCode 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, societyInfo, setActivePage } = useApp();
  const isBn = language === 'bn';

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: Brand & Org Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {isBn ? societyInfo.nameBn : societyInfo.nameEn}
              </h3>
              <p className="text-xs text-emerald-400 font-medium">
                {isBn ? societyInfo.sloganBn : societyInfo.sloganEn}
              </p>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 leading-relaxed">
            {isBn 
              ? 'একটি প্রতিশ্রুতিশীল প্রাইভেট সঞ্চয় ও ক্ষুদ্র ঋণদান সমবায় প্রতিষ্ঠান। সদস্য কেন্দ্রিক স্বচ্ছ সেবা ও উন্নয়নই আমাদের মূল অঙ্গীকার।'
              : 'A dedicated Private Savings and Credit Cooperative Society committed to member financial prosperity and transparent management.'}
          </p>

          <div className="inline-block bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-medium">
            <Shield className="w-3.5 h-3.5 inline mr-1.5 text-emerald-500" />
            {societyInfo.regNoBn || societyInfo.regNoEn 
              ? (isBn ? societyInfo.regNoBn : societyInfo.regNoEn)
              : (isBn ? 'প্রাইভেট সমবায় সমিতি (অ-নিবন্ধিত)' : 'Private Cooperative Society (Unregistered)')}
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
            {isBn ? 'গুরুত্বপূর্ণ লিঙ্ক' : 'Quick Navigation'}
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setActivePage('about')} className="hover:text-emerald-400 transition">
                {isBn ? 'সমিতির সংক্ষিপ্ত ইতিহাস' : 'About NUSRSSL'}
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('committee')} className="hover:text-emerald-400 transition">
                {isBn ? 'ব্যবস্থাপনা কমিটি ও উপদেষ্টা' : 'Executive Board & Advisors'}
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('savings')} className="hover:text-emerald-400 transition">
                {isBn ? 'সঞ্চয় স্কিম ও ডিপোজিট' : 'Savings Schemes'}
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('loans')} className="hover:text-emerald-400 transition">
                {isBn ? 'ক্ষুদ্র ঋণ ও ব্যবসায়িক ঋণ' : 'Loan Products'}
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('dps')} className="hover:text-emerald-400 transition">
                {isBn ? 'ডিপিএস ডিপোজিট পেনশন' : 'DPS Services'}
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('calculators')} className="hover:text-emerald-400 transition">
                {isBn ? 'মুনাফা ও ইএমআই ক্যালকুলেটর' : 'Loan & EMI Calculator'}
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('passbook')} className="hover:text-emerald-400 transition">
                {isBn ? 'অনলাইন ডিজিটাল পাসবই' : 'Digital Passbook Portal'}
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Legal & Governance */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
            {isBn ? 'আইন ও ডাউনলোড' : 'Governance & Legal'}
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setActivePage('constitution')} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isBn ? 'সমিতির পূর্ণাঙ্গ উপ-আইন/সংবিধান' : 'Society Constitution (By-Laws)'}</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('downloads')} className="hover:text-emerald-400 transition">
                {isBn ? 'আবেদন ফরম ও বার্ষিক রিপোর্ট ডাউনলোড' : 'Download Forms & Reports'}
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('privacy-terms')} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>{isBn ? 'গোপনীয়তা নীতি ও শর্তাবলী' : 'Privacy Policy & Terms'}</span>
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('contact')} className="hover:text-emerald-400 transition">
                {isBn ? 'সাধারণ জিজ্ঞাসা (FAQ) ও সাহায্য' : 'FAQ & Support'}
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('admin')} className="hover:text-emerald-400 transition text-emerald-400 font-semibold">
                {isBn ? 'অফিসিয়াল এডমিন প্যানেল' : 'Official Admin Portal'}
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Office Address & Helpline */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
            {isBn ? 'কার্যালয় ও যোগাযোগ' : 'Office Location'}
          </h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{isBn ? societyInfo.addressBn : societyInfo.addressEn}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{societyInfo.phone1} / {societyInfo.phone2}</span>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{isBn ? 'অনলাইন সেবা হেল্পলাইন:' : 'Online Help:'} {societyInfo.onlineService}</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{societyInfo.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} {isBn ? societyInfo.nameBn : societyInfo.nameEn}. {isBn ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
        </p>
        <p className="flex items-center gap-1">
          <span>{isBn ? 'ডিজিটাল কুষ্টিয়া সমবায় সিস্টেম' : 'Digital Cooperative Platform Kushtia'}</span>
        </p>
      </div>
    </footer>
  );
};
