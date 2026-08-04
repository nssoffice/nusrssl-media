import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, ArrowRight, CheckCircle2, KeyRound, Mail, ArrowLeft } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

export const LoginPage: React.FC = () => {
  const { language, login, currentUser, setActivePage, showToast } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('admin');
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);

  const isBn = language === 'bn';

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username || (role === 'admin' ? 'admin' : 'NUSRSSL-2026-0101'), password || '123456', role);
    if (success) {
      if (role === 'admin') {
        setActivePage('admin');
      } else {
        setActivePage('passbook');
      }
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      showToast(isBn ? 'অনুগ্রহ করে একটি বৈধ ইমেইল বা মেম্বার আইডি লিখুন' : 'Please provide a valid email or Member ID', 'error');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      showToast(isBn ? 'পাসওয়ার্ড রিসেট লিঙ্ক আপনার ইমেইলে পাঠানো হয়েছে!' : 'Password reset link sent to your email!', 'success');
      setResetSubmitted(true);
    } catch {
      // Demo fallback success message if offline or demo environment
      showToast(
        isBn 
          ? `পাসওয়ার্ড রিসেট অনুরোধ গৃহীত হয়েছে (${resetEmail})। এডমিন অফিসারের সাথে যোগাযোগ করুন।` 
          : `Password reset request received for ${resetEmail}. Contact Admin Officer for immediate key reset.`, 
        'info'
      );
      setResetSubmitted(true);
    }
  };

  if (currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isBn ? `স্বাগতম, ${currentUser.name}!` : `Welcome back, ${currentUser.name}!`}
        </h2>
        <p className="text-xs text-slate-500">
          {isBn ? `আপনার রোল: ${currentUser.role === 'admin' ? 'এডমিন (অফিসার)' : 'সাধারণ সদস্য'}` : `Logged in as ${currentUser.role.toUpperCase()}`}
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => setActivePage(currentUser.role === 'admin' ? 'admin' : 'passbook')}
            className="px-6 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-500 transition shadow"
          >
            {currentUser.role === 'admin' ? (isBn ? 'এডমিন প্যানেলে যান' : 'Go to Admin Panel') : (isBn ? 'ডিজিটাল পাসবই দেখুন' : 'View Digital Passbook')}
          </button>
        </div>
      </div>
    );
  }

  if (isResetMode) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {isBn ? 'পাসওয়ার্ড রিসেট' : 'Reset Password'}
          </h1>
          <p className="text-xs text-slate-500">
            {isBn ? 'আপনার নিবন্ধিত ইমেইল বা আইডি প্রদান করে নতুন পাসওয়ার্ড সেট করুন।' : 'Enter your registered email or Member ID to reset your password.'}
          </p>
        </div>

        <form onSubmit={handlePasswordReset} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
          {resetSubmitted ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                {isBn ? 'পাসওয়ার্ড পুনঃস্থাপনের নির্দেশনা পাঠানো হয়েছে।' : 'Password reset instructions have been dispatched.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setResetSubmitted(false);
                }}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                {isBn ? 'লগইন ফর্মে ফিরে যান' : 'Back to Login'}
              </button>
            </div>
          ) : (
            <>
              <div className="text-xs space-y-3">
                <div>
                  <label className="block font-semibold mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isBn ? 'ইমেইল বা সদস্য আইডি (Email / Member ID):' : 'Registered Email or Member ID:'}</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. member@nusrssl.com or NUSRSSL-2026-0101"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-medium text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>{isBn ? 'রিসেট লিঙ্ক পাঠান' : 'Send Password Reset Link'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsResetMode(false)}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isBn ? 'লগইন ফর্মে ফিরে যান' : 'Return to Sign In'}</span>
              </button>
            </>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {isBn ? 'লগইন করুন' : 'Sign In to NUSRSSL Portal'}
        </h1>
        <p className="text-xs text-slate-500">
          {isBn ? 'এডমিন অফিসার অথবা সদস্য পোর্টালে প্রবেশ করুন।' : 'Access Member Passbook or Admin Management Suite.'}
        </p>
      </div>

      <form onSubmit={handleLoginSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
        {/* Role Selector */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 rounded-lg transition ${role === 'admin' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 dark:text-slate-400'}`}
          >
            {isBn ? 'এডমিন অফিসার' : 'Admin Officer'}
          </button>
          <button
            type="button"
            onClick={() => setRole('member')}
            className={`flex-1 py-2 rounded-lg transition ${role === 'member' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 dark:text-slate-400'}`}
          >
            {isBn ? 'সাধারণ সদস্য' : 'Member Portal'}
          </button>
        </div>

        <div className="text-xs space-y-3">
          <div>
            <label className="block font-semibold mb-1">{role === 'admin' ? (isBn ? 'ইউজারনেম (Username):' : 'Username:') : (isBn ? 'সদস্য আইডি (Member ID):' : 'Member ID:')}</label>
            <input
              type="text"
              required
              placeholder={role === 'admin' ? 'admin' : 'NUSRSSL-2026-0101'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-mono"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-semibold">{isBn ? 'পাসওয়ার্ড (Password):' : 'Password:'}</label>
              <button
                type="button"
                onClick={() => setIsResetMode(true)}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
              >
                {isBn ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot password?'}
              </button>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
            />
          </div>
        </div>

        {/* Demo Credentials Helper Box */}
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 space-y-1">
          <strong>{isBn ? 'ডেমো লগইন টেস্ট তথ্য:' : 'Demo Credentials:'}</strong>
          <p>{role === 'admin' ? 'User: admin | Pass: 123456' : 'Member ID: NUSRSSL-2026-0101 | Pass: 123456'}</p>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
        >
          <span>{isBn ? 'লগইন করুন' : 'Sign In Now'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

