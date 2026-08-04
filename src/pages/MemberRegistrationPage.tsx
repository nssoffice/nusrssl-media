import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateQRCodeDataUrl, generateBarcodeSvg } from '../utils/formatters';
import { UserPlus, Camera, Upload, CheckCircle2, QrCode, Shield, ArrowRight } from 'lucide-react';

export const MemberRegistrationPage: React.FC = () => {
  const { language, registerMember, setSelectedMemberCard, setActivePage } = useApp();
  const isBn = language === 'bn';

  const [formData, setFormData] = useState({
    nameBn: '',
    nameEn: '',
    fatherHusbandBn: '',
    fatherHusbandEn: '',
    motherNameBn: '',
    motherNameEn: '',
    nid: '',
    presentAddressBn: '',
    presentAddressEn: '',
    permanentAddressBn: '',
    permanentAddressEn: '',
    occupationBn: '',
    occupationEn: '',
    mobile: '',
    email: '',
    bloodGroup: 'B+',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    shareCount: 10,
    totalShareValue: 1000,
    nomineeNameBn: '',
    nomineeNameEn: '',
    nomineeRelationBn: '',
    nomineeRelationEn: '',
    nomineeNid: '',
    nomineeMobile: ''
  });

  const [submittedMember, setSubmittedMember] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameEn || !formData.mobile || !formData.nid) {
      alert(isBn ? 'দয়া করে নাম, মোবাইল এবং এনআইডি প্রবেশ করান।' : 'Please enter Name, Mobile, and NID.');
      return;
    }

    const created = registerMember(formData);
    setSubmittedMember(created);
  };

  if (submittedMember) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          {isBn ? 'সদস্য রেজিস্ট্রেশন সম্পন্ন হয়েছে!' : 'Member Registration Successful!'}
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400">
          {isBn
            ? `আপনার নতুন সদস্য আইডি: ${submittedMember.id}। আপনার কিউআর কোড এবং ডিজিটাল আইডি কার্ড তৈরি হয়েছে।`
            : `Assigned Member ID: ${submittedMember.id}. Digital Passbook & QR card ready.`}
        </p>

        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2 max-w-md mx-auto">
          <div className="flex justify-between">
            <span className="text-slate-500">{isBn ? 'সদস্য নম্বর:' : 'Member No:'}</span>
            <strong className="font-mono text-emerald-600">{submittedMember.id}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{isBn ? 'সদস্যের নাম:' : 'Name:'}</span>
            <strong>{submittedMember.nameEn}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{isBn ? 'মোবাইল:' : 'Mobile:'}</span>
            <strong className="font-mono">{submittedMember.mobile}</strong>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => setSelectedMemberCard(submittedMember)}
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition"
          >
            {isBn ? 'ডিজিটাল আইডেন্টিটি কার্ড দেখুন' : 'View ID Card'}
          </button>
          
          <button
            onClick={() => setActivePage('passbook')}
            className="px-5 py-2.5 bg-slate-800 text-white font-semibold text-xs rounded-xl hover:bg-slate-700 transition"
          >
            {isBn ? 'ডিজিটাল পাসবই পোর্টালে যান' : 'Go to Digital Passbook'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          {isBn ? 'অনলাইন সদস্যভুক্তি' : 'Online Member Join Form'}
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {isBn ? 'নতুন সদস্য রেজিস্ট্রেশন ফরম' : 'New Member Registration Application'}
        </h1>
        <p className="text-xs text-slate-500">
          {isBn ? 'সমবায় সমিতির নিয়ম অনুযায়ী নিচের সকল সঠিক তথ্য প্রদান করুন।' : 'Please fill all fields according to official Samabay requirements.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-8">
        {/* SECTION 1: PERSONAL INFO */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-emerald-700 dark:text-emerald-400 border-b pb-2 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            <span>{isBn ? '১. আবেদনকারীর ব্যক্তিগত তথ্য' : '1. Applicant Information'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">{isBn ? 'সদস্যের নাম (বাংলায়):' : 'Name (Bangla):'}</label>
              <input
                type="text"
                required
                placeholder="যেমন: মোঃ হাবিবুর রহমান"
                value={formData.nameBn}
                onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">{isBn ? 'সদস্যের নাম (ইংরেজিতে):' : 'Name (English):'}</label>
              <input
                type="text"
                required
                placeholder="e.g. Md. Habibur Rahman"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">{isBn ? 'পিতা / স্বামীর নাম (বাংলায়):' : 'Father / Husband Name (BN):'}</label>
              <input
                type="text"
                required
                value={formData.fatherHusbandBn}
                onChange={(e) => setFormData({ ...formData, fatherHusbandBn: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">{isBn ? 'পিতা / স্বামীর নাম (ইংরেজি):' : 'Father / Husband Name (EN):'}</label>
              <input
                type="text"
                required
                value={formData.fatherHusbandEn}
                onChange={(e) => setFormData({ ...formData, fatherHusbandEn: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">{isBn ? 'মাতার নাম (বাংলায়):' : 'Mother Name (BN):'}</label>
              <input
                type="text"
                value={formData.motherNameBn}
                onChange={(e) => setFormData({ ...formData, motherNameBn: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">{isBn ? 'জাতীয় পরিচয়পত্র নম্বর (NID):' : 'National ID Number (NID):'}</label>
              <input
                type="text"
                required
                placeholder="e.g. 19905012345678"
                value={formData.nid}
                onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">{isBn ? 'মোবাইল নম্বর:' : 'Mobile Number:'}</label>
              <input
                type="tel"
                required
                placeholder="01712345678"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">{isBn ? 'রক্তের গ্রুপ (Blood Group):' : 'Blood Group:'}</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 text-white dark:bg-slate-900"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block font-semibold mb-1 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? 'সদস্যের ছবি আপলোড (Photo Upload):' : 'Member Photo:'}</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>

            {/* Signature Upload */}
            <div>
              <label className="block font-semibold mb-1 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? 'সদস্যের স্বাক্ষর আপলোড (Signature):' : 'Member Signature:'}</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData(prev => ({ ...prev, signatureUrl: reader.result as string }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>
        </div>


        {/* SECTION 2: ADDRESS & OCCUPATION */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-emerald-700 dark:text-emerald-400 border-b pb-2">
            {isBn ? '২. ঠিকানা ও পেশা' : '2. Address & Occupation'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">{isBn ? 'বর্তমান ঠিকানা (বাংলায়):' : 'Present Address (BN):'}</label>
              <input
                type="text"
                required
                placeholder="কালিশংকরপুর, কুষ্টিয়া সদর"
                value={formData.presentAddressBn}
                onChange={(e) => setFormData({ ...formData, presentAddressBn: e.target.value, presentAddressEn: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">{isBn ? 'পেশা (Occupation):' : 'Occupation:'}</label>
              <input
                type="text"
                required
                placeholder="যেমন: ব্যবসায়ী / শিক্ষক"
                value={formData.occupationBn}
                onChange={(e) => setFormData({ ...formData, occupationBn: e.target.value, occupationEn: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: NOMINEE INFO */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-emerald-700 dark:text-emerald-400 border-b pb-2">
            {isBn ? '৩. মনোনীত ব্যক্তি (Nominee Details)' : '3. Nominee Details'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">{isBn ? 'মনোনীত ব্যক্তির নাম:' : 'Nominee Name:'}</label>
              <input
                type="text"
                required
                value={formData.nomineeNameBn}
                onChange={(e) => setFormData({ ...formData, nomineeNameBn: e.target.value, nomineeNameEn: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">{isBn ? 'সম্পর্ক (Relation):' : 'Relation:'}</label>
              <input
                type="text"
                required
                placeholder="স্ত্রী / স্বামী / পুত্র"
                value={formData.nomineeRelationBn}
                onChange={(e) => setFormData({ ...formData, nomineeRelationBn: e.target.value, nomineeRelationEn: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">{isBn ? 'মনোনীত ব্যক্তির এনআইডি:' : 'Nominee NID:'}</label>
              <input
                type="text"
                value={formData.nomineeNid}
                onChange={(e) => setFormData({ ...formData, nomineeNid: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t">
          <button
            type="submit"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{isBn ? 'অনলাইন আবেদন সাবমিট করুন' : 'Submit Registration Application'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
