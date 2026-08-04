import React, { useState } from 'react';
import { useApp, ActivePage } from '../context/AppContext';
import { 
  Building2, 
  Phone, 
  Globe, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  ChevronDown, 
  UserCheck, 
  Calculator, 
  BookOpen, 
  ShieldCheck, 
  Download, 
  FileText, 
  HelpCircle,
  PiggyBank,
  Landmark,
  CreditCard,
  Users
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    darkMode, 
    setDarkMode, 
    activePage, 
    setActivePage, 
    societyInfo 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const isBn = language === 'bn';

  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    setDropdownOpen(null);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Top Banner Info Bar */}
      <div className="bg-emerald-700 dark:bg-emerald-950 text-emerald-50 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span>{isBn ? 'হটলাইন:' : 'Hotline:'} {societyInfo.phone1} | {societyInfo.phone2}</span>
            </span>
            <span className="hidden sm:inline-block">|</span>
            <span className="hidden sm:inline flex items-center gap-1">
              <span>{isBn ? 'অনলাইন সেবা:' : 'Online Service:'} {societyInfo.onlineService}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Reg Badge */}
            <span className="hidden md:inline-block bg-emerald-800 dark:bg-emerald-900 px-2.5 py-0.5 rounded text-[11px] font-medium border border-emerald-600/40">
              {societyInfo.regNoBn || societyInfo.regNoEn 
                ? (isBn ? societyInfo.regNoBn : societyInfo.regNoEn)
                : (isBn ? 'প্রাইভেট সমবায় সমিতি' : 'Private Cooperative Society')}
            </span>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(isBn ? 'en' : 'bn')}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded transition text-xs font-semibold"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isBn ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1 hover:bg-white/10 rounded transition"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xl">
              <Building2 className="w-7 h-7" />
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {isBn ? societyInfo.nameBn : societyInfo.nameEn}
            </h1>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {isBn ? societyInfo.sloganBn : societyInfo.sloganEn}
            </p>
          </div>
        </div>

        {/* Desktop Menu Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => handleNav('home')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              activePage === 'home' 
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isBn ? 'হোম' : 'Home'}
          </button>

          {/* About Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(dropdownOpen === 'about' ? null : 'about')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition ${
                ['about', 'mission-vision', 'committee'].includes(activePage)
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{isBn ? 'আমাদের কথা' : 'About Us'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {dropdownOpen === 'about' && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                <button
                  onClick={() => handleNav('about')}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'সমিতির পরিচিতি' : 'Overview'}</span>
                </button>
                <button
                  onClick={() => handleNav('mission-vision')}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'লক্ষ্য ও উদ্দেশ্য' : 'Mission & Vision'}</span>
                </button>
                <button
                  onClick={() => handleNav('committee')}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'পরিচালনা পরিষদ ও উপদেষ্টা' : 'Executive Board'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Services Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(dropdownOpen === 'services' ? null : 'services')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition ${
                ['savings', 'loans', 'dps'].includes(activePage)
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{isBn ? 'সেবাসমূহ' : 'Services'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {dropdownOpen === 'services' && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                <button
                  onClick={() => handleNav('savings')}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <PiggyBank className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'সঞ্চয় স্কিম' : 'Savings Schemes'}</span>
                </button>
                <button
                  onClick={() => handleNav('loans')}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Landmark className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'ঋণ সেবাসমূহ' : 'Loan Schemes'}</span>
                </button>
                <button
                  onClick={() => handleNav('dps')}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'ডিপিএস স্কিম (DPS)' : 'DPS Services'}</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNav('calculators')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
              activePage === 'calculators'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>{isBn ? 'ক্যালকুলেটর' : 'Calculators'}</span>
          </button>

          <button
            onClick={() => handleNav('passbook')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
              activePage === 'passbook'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>{isBn ? 'ডিজিটাল পাসবই' : 'Digital Passbook'}</span>
          </button>

          <button
            onClick={() => handleNav('bulk-export')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
              activePage === 'bulk-export'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Download className="w-4 h-4 text-teal-600" />
            <span>{isBn ? 'বাল্ক এক্সপোর্ট' : 'Bulk PDF Export'}</span>
          </button>

          <button
            onClick={() => handleNav('constitution')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              activePage === 'constitution'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isBn ? 'উপ-আইন/সংবিধান' : 'Constitution'}
          </button>

          <button
            onClick={() => handleNav('news')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              activePage === 'news'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isBn ? 'সংবাদ ও গ্যালারি' : 'News & Gallery'}
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => handleNav('register')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-emerald-600/30 transition flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" />
            <span>{isBn ? 'সদস্য আবেদন' : 'Member Join'}</span>
          </button>

          <button
            onClick={() => handleNav('admin')}
            className="px-3 py-2 rounded-xl border border-emerald-600/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 font-medium text-sm transition flex items-center gap-1"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isBn ? 'এডমিন প্যানেল' : 'Admin Portal'}</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-2">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isBn ? 'হোম' : 'Home'}
          </button>
          <button
            onClick={() => handleNav('about')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isBn ? 'আমাদের কথা' : 'About Us'}
          </button>
          <button
            onClick={() => handleNav('committee')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isBn ? 'পরিচালনা পরিষদ' : 'Executive Board'}
          </button>
          <button
            onClick={() => handleNav('savings')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isBn ? 'সঞ্চয় সেবাসমূহ' : 'Savings Schemes'}
          </button>
          <button
            onClick={() => handleNav('loans')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isBn ? 'ঋণ সেবাসমূহ' : 'Loan Schemes'}
          </button>
          <button
            onClick={() => handleNav('dps')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isBn ? 'ডিপিএস স্কিম' : 'DPS Services'}
          </button>
          <button
            onClick={() => handleNav('calculators')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isBn ? 'ফাইন্যান্সিয়াল ক্যালকুলেটর' : 'Financial Calculators'}
          </button>
          <button
            onClick={() => handleNav('passbook')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isBn ? 'ডিজিটাল পাসবই' : 'Digital Passbook'}
          </button>
          <button
            onClick={() => handleNav('bulk-export')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 font-bold"
          >
            {isBn ? 'বাল্ক পিডিএফ ও রিপোর্ট এক্সপোর্ট' : 'Bulk PDF & Report Export'}
          </button>
          <button
            onClick={() => handleNav('constitution')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isBn ? 'সমিতির উপ-আইন' : 'Constitution'}
          </button>
          <button
            onClick={() => handleNav('contact')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isBn ? 'যোগাযোগ ও হেল্পলাইন' : 'Contact & Helpline'}
          </button>
          
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => handleNav('register')}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm text-center"
            >
              {isBn ? 'অনলাইন সদস্য নিবন্ধিত হন' : 'Register Member'}
            </button>
            <button
              onClick={() => handleNav('admin')}
              className="w-full py-2.5 rounded-xl border border-emerald-600 text-emerald-600 dark:text-emerald-400 font-medium text-sm text-center"
            >
              {isBn ? 'এডমিন পোর্টাল প্রবেশ' : 'Admin Portal Login'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
