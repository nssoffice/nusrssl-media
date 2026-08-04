import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, Globe, Send, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FAQContactPage: React.FC = () => {
  const { language, societyInfo, showToast } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const isBn = language === 'bn';

  const [contactForm, setContactForm] = useState({
    name: '',
    mobile: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      qBn: 'নিরাপদ উন্নয়ন সমবায় সমিতির সদস্য কিভাবে হওয়া যায়?',
      qEn: 'How to become a member of NUSRSSL?',
      aBn: 'জাতীয় পরিচয়পত্র, ২ কপি ছবি ও প্রয়োজনীয় ফি সহ অনলাইন সদস্য ফরম পূরণ করে আবেদন করতে পারেন অথবা সমিতি প্রধান কার্যালয়ে উপস্থিত হয়ে সদস্য হওয়া যায়।',
      aEn: 'Fill out the online membership registration form with NID, photo, and initial share fees, or visit our Kushtia main office.'
    },
    {
      qBn: 'সঞ্চয়ের উপর বার্ষিক লাভ বা মুনাফার হার কত?',
      qEn: 'What is the dividend/interest rate on savings?',
      aBn: 'সমবায় নিয়মাবলী অনুযায়ী বাৎসরিক সাধারণ সভায় অনুমোদিত ৭.৫% থেকে ৮.০% হারে মুনাফা প্রদান করা হয়।',
      aEn: 'Approved annual dividends range from 7.5% to 8.0% based on AGM distributions.'
    },
    {
      qBn: 'ডিজিটাল পাসবই কিভাবে দেখতে পাবো?',
      qEn: 'How do I access my digital passbook online?',
      aBn: 'আমাদের ওয়েবসাইটের "ডিজিটাল পাসবই" ট্যাবে গিয়ে আপনার সদস্য নম্বর (যেমন: NUSRSSL-2026-0101) লিখলেই পাসবই দেখা যাবে।',
      aEn: 'Go to the Digital Passbook menu, enter your Member ID, and access your live ledger statement instantly.'
    },
    {
      qBn: 'ঋণ আবেদনের জন্য কি কি জামানত প্রয়োজন?',
      qEn: 'What collateral is required for a loan application?',
      aBn: 'সদস্যের নিজস্ব সঞ্চয় এবং ২ জন নিয়মিত সদস্যের লিখিত গ্যারান্টি বা জামিননামা আবশ্যক।',
      aEn: 'Member savings balance along with two active member guarantors are required.'
    }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(isBn ? 'আপনার বার্তা সফলভাবে প্রেরিত হয়েছে।' : 'Message sent successfully.', 'success');
    setContactForm({ name: '', mobile: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          {isBn ? 'সরাসরি যোগাযোগ ও সহায়তা' : 'Help & Contact Center'}
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {isBn ? 'সাধারণ জিজ্ঞাসা (FAQ) ও যোগাযোগ' : 'Frequently Asked Questions & Contact Us'}
        </h1>
      </div>

      {/* FAQ Accordion Section */}
      <div className="max-w-3xl mx-auto space-y-4">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          <span>{isBn ? 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)' : 'Frequently Asked Questions'}</span>
        </h2>

        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
          >
            <button
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full text-left p-4 text-xs font-bold text-slate-800 dark:text-slate-100 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
            >
              <span>{isBn ? faq.qBn : faq.qEn}</span>
              {openFaq === idx ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openFaq === idx && (
              <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                {isBn ? faq.aBn : faq.aEn}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Form & Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
        {/* Info Box */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-8 rounded-3xl shadow-xl space-y-6">
          <h3 className="font-bold text-lg text-emerald-300 border-b border-white/10 pb-3">
            {isBn ? 'আমাদের অফিসে আসুন' : 'Visit Our Office'}
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-200">{isBn ? 'প্রধান কার্যালয়:' : 'Head Office:'}</strong>
                <p className="text-slate-300 leading-relaxed">{isBn ? societyInfo.addressBn : societyInfo.addressEn}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-200">{isBn ? 'ফোন ও হটলাইন:' : 'Phones:'}</strong>
                <p className="text-slate-300">{societyInfo.phone1} | {societyInfo.phone2}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-200">{isBn ? 'অনলাইন সেবা সহায়তা:' : 'Online Help Service:'}</strong>
                <p className="text-slate-300">{societyInfo.onlineService}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Box */}
        <form onSubmit={handleSendMessage} className="lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white border-b pb-3">
            {isBn ? 'সরাসরি মেসেজ পাঠান' : 'Send Us a Direct Message'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">{isBn ? 'আপনার নাম:' : 'Your Name:'}</label>
              <input
                type="text"
                required
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">{isBn ? 'মোবাইল নম্বর:' : 'Mobile No:'}</label>
              <input
                type="tel"
                required
                value={contactForm.mobile}
                onChange={(e) => setContactForm({ ...contactForm, mobile: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-mono"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold mb-1">{isBn ? 'বিষয় (Subject):' : 'Subject:'}</label>
            <input
              type="text"
              required
              value={contactForm.subject}
              onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
            />
          </div>

          <div className="text-xs">
            <label className="block font-semibold mb-1">{isBn ? 'বার্তার বিবরণ:' : 'Message:'}</label>
            <textarea
              required
              rows={4}
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{isBn ? 'বার্তা পাঠান' : 'Send Message'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
