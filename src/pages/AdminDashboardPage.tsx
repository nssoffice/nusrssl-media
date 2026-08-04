import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { 
  ShieldCheck, 
  Users, 
  PiggyBank, 
  Landmark, 
  CreditCard, 
  Plus, 
  Search, 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Bell, 
  Database, 
  RefreshCw,
  TrendingUp,
  DollarSign,
  Briefcase,
  Building2,
  Save,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import jsPDF from 'jspdf';
import { Member } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const { 
    language, 
    societyInfo,
    updateSocietyInfo,
    members, 
    savingsAccounts, 
    loanAccounts, 
    dpsAccounts, 
    transactions,
    cashBookEntries,
    notices,
    updateMember,
    deleteMember,
    openDPSScheme,
    applyLoan,
    addSavingsTransaction,
    addLoanRepayment,
    addDPSInstallment,
    addCashBookEntry,
    addNotice,
    setSelectedReceiptTransaction,
    setSelectedMemberForPassbook,
    setSelectedMemberCard,
    setActivePage,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'members' | 'savings' | 'loans' | 'dps' | 'accounting' | 'reports' | 'notices' | 'backup' | 'settings'>('dashboard');
  const isBn = language === 'bn';

  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [societyForm, setSocietyForm] = useState(societyInfo);

  // Sync society form when societyInfo changes
  React.useEffect(() => {
    setSocietyForm(societyInfo);
  }, [societyInfo]);

  // State for forms
  const [savingsTxnForm, setSavingsTxnForm] = useState({
    memberId: members[0]?.id || '',
    accountNo: savingsAccounts[0]?.accountNo || '',
    type: 'deposit' as 'deposit' | 'withdrawal',
    amount: 1000,
    collectorName: 'মোছাঃ পারভীন আক্তার (কোষাধ্যক্ষ)'
  });

  const [loanRepayForm, setLoanRepayForm] = useState({
    loanNo: loanAccounts[0]?.loanNo || '',
    amount: 5000,
    collectorName: 'মো: জসীম উদ্দিন'
  });

  const [dpsInstallForm, setDpsInstallForm] = useState({
    dpsNo: dpsAccounts[0]?.dpsNo || '',
    amount: 2000,
    collectorName: 'আব্দুর রহিম'
  });

  const [cashbookForm, setCashbookForm] = useState({
    category: 'income' as 'income' | 'expense',
    headName: 'সঞ্চয় আমানত জমা',
    description: 'দৈনিক ও সাপ্তাহিক সঞ্চয় সংগ্রহ',
    amount: 5000,
    paymentMode: 'cash' as 'cash' | 'bank',
    recordedBy: 'কোষাধ্যক্ষ'
  });

  const [noticeForm, setNoticeForm] = useState({
    titleBn: '',
    titleEn: '',
    category: 'general' as any,
    contentBn: '',
    contentEn: '',
    isImportant: false
  });

  // Calculate High-level Dashboard Metrics
  const totalMembersCount = members.length;
  const totalSavingsBal = savingsAccounts.reduce((acc, c) => acc + c.balance, 0);
  const totalDisbursedLoans = loanAccounts.reduce((acc, c) => acc + c.principalAmount, 0);
  const totalRemainingLoanDue = loanAccounts.reduce((acc, c) => acc + c.remainingDue, 0);
  const totalDpsFund = dpsAccounts.reduce((acc, c) => acc + c.totalPaidAmount, 0);

  const totalIncome = cashBookEntries.filter(c => c.category === 'income').reduce((acc, c) => acc + c.amount, 0);
  const totalExpense = cashBookEntries.filter(c => c.category === 'expense').reduce((acc, c) => acc + c.amount, 0);

  // Chart Data
  const chartData = [
    { name: isBn ? 'জানু' : 'Jan', savings: 45000, loans: 30000 },
    { name: isBn ? 'ফেব্রু' : 'Feb', savings: 52000, loans: 40000 },
    { name: isBn ? 'মার্চ' : 'Mar', savings: 61000, loans: 35000 },
    { name: isBn ? 'এপ্রিল' : 'Apr', savings: 75000, loans: 50000 },
    { name: isBn ? 'মে' : 'May', savings: 82000, loans: 48000 },
    { name: isBn ? 'জুন' : 'Jun', savings: 95000, loans: 60000 },
    { name: isBn ? 'জুলাই' : 'Jul', savings: 110000, loans: 55000 }
  ];

  const handleSavingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addSavingsTransaction({
      memberId: savingsTxnForm.memberId,
      accountType: 'savings',
      accountNo: savingsTxnForm.accountNo,
      type: savingsTxnForm.type,
      amount: Number(savingsTxnForm.amount),
      balanceAfter: 0,
      collectorName: savingsTxnForm.collectorName,
      remarks: 'এডমিন পোর্টাল ইন্ট্রি'
    });
    setSelectedReceiptTransaction(created);
  };

  const handleLoanRepaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addLoanRepayment(loanRepayForm.loanNo, Number(loanRepayForm.amount), loanRepayForm.collectorName);
    setSelectedReceiptTransaction(created);
  };

  const handleDpsInstallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addDPSInstallment(dpsInstallForm.dpsNo, Number(dpsInstallForm.amount), dpsInstallForm.collectorName);
    setSelectedReceiptTransaction(created);
  };

  const handleCashbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCashBookEntry({
      voucherNo: `V-${Math.floor(100 + Math.random() * 900)}`,
      category: cashbookForm.category,
      headName: cashbookForm.headName,
      description: cashbookForm.description,
      amount: Number(cashbookForm.amount),
      paymentMode: cashbookForm.paymentMode,
      recordedBy: cashbookForm.recordedBy
    });
  };

  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNotice({
      titleBn: noticeForm.titleBn,
      titleEn: noticeForm.titleEn || noticeForm.titleBn,
      category: noticeForm.category,
      contentBn: noticeForm.contentBn,
      contentEn: noticeForm.contentEn || noticeForm.contentBn,
      isImportant: noticeForm.isImportant
    });
    setNoticeForm({ titleBn: '', titleEn: '', category: 'general', contentBn: '', contentEn: '', isImportant: false });
  };

  const handleExportReportPDF = (reportTitle: string) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${societyInfo.nameEn}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Official Executive Report: ${reportTitle}`, 20, 28);
    doc.setFontSize(10);
    doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 20, 34);
    doc.text(`Total Active Members: ${totalMembersCount}`, 20, 42);
    doc.text(`Total Savings Balance: Tk ${totalSavingsBal}`, 20, 48);
    doc.text(`Total Loan Outstanding: Tk ${totalRemainingLoanDue}`, 20, 54);
    doc.save(`${reportTitle.replace(/\s+/g, '_')}_Report.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-wrap justify-between items-center gap-4 border border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-black">{isBn ? 'এডমিন পোর্টাল ও সেন্ট্রাল ড্যাশবোর্ড' : 'Central Admin Portal'}</h1>
            <p className="text-xs text-emerald-300">{isBn ? societyInfo.nameBn : 'NUSRSSL Kushtia Executive Management Panel'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActivePage('bulk-export')}
            className="px-3.5 py-2 bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-xs rounded-xl hover:brightness-110 transition flex items-center gap-1.5 shadow"
          >
            <Download className="w-4 h-4" />
            <span>{isBn ? 'বাল্ক পিডিএফ ও রিপোর্ট এক্সপোর্ট' : 'Bulk PDF & Report Export'}</span>
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className="px-3.5 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-400 transition flex items-center gap-1.5 shadow"
          >
            <Database className="w-4 h-4" />
            <span>{isBn ? 'ব্যাকআপ ও রিস্টোর' : 'Backup Data'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'dashboard' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{isBn ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'members' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{isBn ? 'সদস্য ব্যবস্থাপনা' : 'Members'}</span>
        </button>

        <button
          onClick={() => setActiveTab('savings')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'savings' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <PiggyBank className="w-4 h-4" />
          <span>{isBn ? 'সঞ্চয় লেনদেন' : 'Savings'}</span>
        </button>

        <button
          onClick={() => setActiveTab('loans')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'loans' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>{isBn ? 'ঋণ ব্যবস্থাপনা' : 'Loans'}</span>
        </button>

        <button
          onClick={() => setActiveTab('dps')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'dps' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>{isBn ? 'ডিপিএস হিসাব' : 'DPS'}</span>
        </button>

        <button
          onClick={() => setActiveTab('accounting')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'accounting' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>{isBn ? 'ক্যাশ বুক ও ভাউচার' : 'Cash Book'}</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'reports' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{isBn ? 'রিপোর্টস ইমপোর্ট/এক্সপোর্ট' : 'Reports'}</span>
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'notices' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>{isBn ? 'নোটিশ বোর্ড' : 'Notices'}</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'settings' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{isBn ? 'নিবন্ধনের তথ্য ও সেটিংস' : 'Society & Reg Info'}</span>
        </button>
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Top 4 Stat Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-500">{isBn ? 'মোট নিবন্ধিত সদস্য' : 'Registered Members'}</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{totalMembersCount}</h3>
              <p className="text-[11px] text-emerald-600 font-semibold">{isBn ? '১০% নতুন বৃদ্ধি' : '+10% This Month'}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-500">{isBn ? 'সঞ্চয় স্থিতি (Savings)' : 'Total Savings Balance'}</span>
              <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(totalSavingsBal, language)}</h3>
              <p className="text-[11px] text-slate-400">{isBn ? 'দৈনিক, সাপ্তাহিক ও মাসিক' : 'Combined Ledger Balance'}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-500">{isBn ? 'অবশিষ্ট বকেয়া ঋণ' : 'Outstanding Loan Due'}</span>
              <h3 className="text-xl font-black text-rose-600 dark:text-rose-400">{formatCurrency(totalRemainingLoanDue, language)}</h3>
              <p className="text-[11px] text-slate-400">{isBn ? `বিতরণকৃত ঋণ: ${formatCurrency(totalDisbursedLoans, language)}` : `Disbursed: Tk ${totalDisbursedLoans}`}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-500">{isBn ? 'ডিপিএস ডিপোজিট ফান্ড' : 'Total DPS Fund'}</span>
              <h3 className="text-xl font-black text-teal-600 dark:text-teal-400">{formatCurrency(totalDpsFund, language)}</h3>
              <p className="text-[11px] text-slate-400">{isBn ? 'মেয়াদী পেনশন আমানত' : 'Term Pension Deposits'}</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{isBn ? 'মাসিক সঞ্চয় ও ঋণ আদায়ের বার চার্ট' : 'Monthly Savings vs Loan Collection'}</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#8884d8" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="savings" fill="#10b981" radius={[4, 4, 0, 0]} name={isBn ? 'সঞ্চয় (Savings)' : 'Savings'} />
                    <Bar dataKey="loans" fill="#f59e0b" radius={[4, 4, 0, 0]} name={isBn ? 'ঋণ (Loans)' : 'Loans'} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white border-b pb-2">
                {isBn ? 'সাম্প্রতিক সঞ্চয় ও ঋণ লেনদেন' : 'Recent Transactions Feed'}
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto text-xs">
                {transactions.slice(0, 5).map((t) => (
                  <div 
                    key={t.id}
                    onClick={() => setSelectedReceiptTransaction(t)}
                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between items-center cursor-pointer hover:bg-emerald-50 dark:hover:bg-slate-700 transition"
                  >
                    <div>
                      <span className="font-mono font-bold text-emerald-600">{t.voucherNo}</span>
                      <p className="text-slate-500 font-sans">{t.memberId}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(t.amount, language)}</span>
                      <p className="text-[10px] text-slate-400">{formatDate(t.date, language)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEMBERS MANAGEMENT */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{isBn ? 'সমিতির সদস্য তালিকা ও তথ্য' : 'Member Directory'}</h3>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-3 py-1 rounded-full">
              {isBn ? `মোট সদস্য: ${members.length} জন` : `Total Members: ${members.length}`}
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b">
                <tr>
                  <th className="p-3">সদস্য নম্বর (ID)</th>
                  <th className="p-3">ছবি ও নাম</th>
                  <th className="p-3">মোবাইল & এনআইডি</th>
                  <th className="p-3">পেশা & ঠিকানা</th>
                  <th className="p-3">শেয়ার সংখ্যা</th>
                  <th className="p-3 text-center">একশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-mono font-bold text-emerald-600">{m.id}</td>
                    <td className="p-3 flex items-center gap-3">
                      <img src={m.photoUrl} alt={m.nameEn} className="w-9 h-9 rounded-full object-cover border" />
                      <div>
                        <strong className="block text-slate-900 dark:text-white">{isBn ? m.nameBn : m.nameEn}</strong>
                        <span className="text-[10px] text-slate-400">{m.joiningDate}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono">
                      <div>{m.mobile}</div>
                      <span className="text-[10px] text-slate-400">{m.nid}</span>
                    </td>
                    <td className="p-3">
                      <div>{isBn ? m.occupationBn : m.occupationEn}</div>
                      <span className="text-[10px] text-slate-400">{isBn ? m.presentAddressBn : m.presentAddressEn}</span>
                    </td>
                    <td className="p-3 font-bold font-mono text-center">{m.shareCount} ({formatCurrency(m.totalShareValue, language)})</td>
                    <td className="p-3 text-center space-x-1">
                      <button
                        onClick={() => setSelectedMemberForPassbook(m)}
                        className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold hover:bg-emerald-500"
                        title={isBn ? 'পাসবই' : 'Passbook'}
                      >
                        {isBn ? 'পাসবই' : 'Passbook'}
                      </button>
                      <button
                        onClick={() => setSelectedMemberCard(m)}
                        className="px-2 py-1 bg-slate-800 text-white rounded text-[10px] font-bold hover:bg-slate-700"
                        title={isBn ? 'আইডি কার্ড' : 'ID Card'}
                      >
                        {isBn ? 'কার্ড' : 'Card'}
                      </button>
                      <button
                        onClick={() => setEditingMember(m)}
                        className="p-1.5 bg-amber-500 text-white rounded hover:bg-amber-400"
                        title={isBn ? 'সম্পাদনা করুন' : 'Edit Member'}
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(isBn ? `আপনি কি নিশ্চিত যে ${m.nameBn} (${m.id}) কে সিস্টেম থেকে মুছে ফেলতে চান?` : `Are you sure you want to delete member ${m.id}?`)) {
                            deleteMember(m.id);
                          }
                        }}
                        className="p-1.5 bg-rose-600 text-white rounded hover:bg-rose-500"
                        title={isBn ? 'সদস্য মুছুন' : 'Delete Member'}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EDIT MEMBER MODAL */}
          {editingMember && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
                <div className="flex justify-between items-center border-b pb-3">
                  <div className="flex items-center gap-2">
                    <Edit className="w-5 h-5 text-amber-500" />
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {isBn ? `সদস্য সম্পাদনা: ${editingMember.id}` : `Edit Member Info: ${editingMember.id}`}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setEditingMember(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editingMember) {
                      updateMember(editingMember.id, editingMember);
                      setEditingMember(null);
                    }
                  }}
                  className="space-y-4 text-xs"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">{isBn ? 'সদস্যের নাম (বাংলা):' : 'Name (Bangla):'}</label>
                      <input
                        type="text"
                        required
                        value={editingMember.nameBn}
                        onChange={(e) => setEditingMember({ ...editingMember, nameBn: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">{isBn ? 'সদস্যের নাম (ইংরেজি):' : 'Name (English):'}</label>
                      <input
                        type="text"
                        required
                        value={editingMember.nameEn}
                        onChange={(e) => setEditingMember({ ...editingMember, nameEn: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">{isBn ? 'মোবাইল নম্বর:' : 'Mobile No:'}</label>
                      <input
                        type="text"
                        required
                        value={editingMember.mobile}
                        onChange={(e) => setEditingMember({ ...editingMember, mobile: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">{isBn ? 'এনআইডি (NID):' : 'NID No:'}</label>
                      <input
                        type="text"
                        required
                        value={editingMember.nid}
                        onChange={(e) => setEditingMember({ ...editingMember, nid: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">{isBn ? 'পেশা (বাংলা):' : 'Occupation (Bangla):'}</label>
                      <input
                        type="text"
                        value={editingMember.occupationBn}
                        onChange={(e) => setEditingMember({ ...editingMember, occupationBn: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">{isBn ? 'বর্তমান ঠিকানা:' : 'Present Address:'}</label>
                      <input
                        type="text"
                        value={editingMember.presentAddressBn}
                        onChange={(e) => setEditingMember({ ...editingMember, presentAddressBn: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">{isBn ? 'নমিনী নাম (বাংলা):' : 'Nominee Name (Bangla):'}</label>
                      <input
                        type="text"
                        value={editingMember.nomineeNameBn}
                        onChange={(e) => setEditingMember({ ...editingMember, nomineeNameBn: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">{isBn ? 'নমিনী সম্পর্ক:' : 'Nominee Relation:'}</label>
                      <input
                        type="text"
                        value={editingMember.nomineeRelationBn}
                        onChange={(e) => setEditingMember({ ...editingMember, nomineeRelationBn: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setEditingMember(null)}
                      className="px-4 py-2 text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 font-bold rounded-xl"
                    >
                      {isBn ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 shadow"
                    >
                      {isBn ? 'আপডেট তথ্য সংরক্ষণ করুন' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}


      {/* TAB 3: SAVINGS TRANSACTION FORM */}
      {activeTab === 'savings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleSavingsSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base border-b pb-2 text-emerald-600">{isBn ? 'নতুন সঞ্চয় জমা / উত্তোলন ইন্ট্রি' : 'New Savings Entry'}</h3>

            <div className="text-xs space-y-3">
              <div>
                <label className="block font-semibold mb-1">{isBn ? 'সদস্য সিলেক্ট করুন:' : 'Select Member:'}</label>
                <select
                  value={savingsTxnForm.memberId}
                  onChange={(e) => {
                    const mid = e.target.value;
                    const acc = savingsAccounts.find((s) => s.memberId === mid);
                    setSavingsTxnForm({
                      ...savingsTxnForm,
                      memberId: mid,
                      accountNo: acc ? acc.accountNo : `SAV-${mid}-M`
                    });
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 text-white dark:bg-slate-900"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.id} - {m.nameBn}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">{isBn ? 'লেনদেনের ধরন:' : 'Transaction Type:'}</label>
                <select
                  value={savingsTxnForm.type}
                  onChange={(e) => setSavingsTxnForm({ ...savingsTxnForm, type: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 text-white dark:bg-slate-900"
                >
                  <option value="deposit">{isBn ? 'জমা (Deposit)' : 'Deposit'}</option>
                  <option value="withdrawal">{isBn ? 'উত্তোলন (Withdrawal)' : 'Withdrawal'}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">{isBn ? 'টাকার পরিমাণ:' : 'Amount (Tk):'}</label>
                <input
                  type="number"
                  required
                  min={10}
                  value={savingsTxnForm.amount}
                  onChange={(e) => setSavingsTxnForm({ ...savingsTxnForm, amount: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent font-mono font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow hover:bg-emerald-500 transition"
              >
                {isBn ? 'লেনদেন সেভ করুন ও রসিদ তৈরি করুন' : 'Save Transaction & Print Receipt'}
              </button>
            </div>
          </form>

          {/* Accounts Table */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base border-b pb-2">{isBn ? 'সদস্য সঞ্চয় হিসাব তালিকা' : 'Savings Accounts List'}</h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 border-b">
                  <tr>
                    <th className="p-2">হিসাব নং</th>
                    <th className="p-2">সদস্য আইডি</th>
                    <th className="p-2 text-right">ব্যালেন্স (Balance)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                  {savingsAccounts.map((acc) => (
                    <tr key={acc.accountNo}>
                      <td className="p-2 font-bold">{acc.accountNo}</td>
                      <td className="p-2">{acc.memberId}</td>
                      <td className="p-2 text-right font-bold text-emerald-600">{formatCurrency(acc.balance, language)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LOAN MANAGEMENT */}
      {activeTab === 'loans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleLoanRepaySubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base border-b pb-2 text-amber-600">{isBn ? 'ঋণ কিস্তি আদায় ইন্ট্রি (Loan EMI Entry)' : 'Record Loan Repayment'}</h3>

            <div className="text-xs space-y-3">
              <div>
                <label className="block font-semibold mb-1">{isBn ? 'ঋণ নম্বর সিলেক্ট করুন:' : 'Select Loan No:'}</label>
                <select
                  value={loanRepayForm.loanNo}
                  onChange={(e) => setLoanRepayForm({ ...loanRepayForm, loanNo: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 text-white dark:bg-slate-900"
                >
                  {loanAccounts.map((l) => (
                    <option key={l.loanNo} value={l.loanNo}>{l.loanNo} - Member: {l.memberId} (Due: {l.remainingDue})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">{isBn ? 'আদায়কৃত কিস্তি পরিমাণ:' : 'Repayment Amount:'}</label>
                <input
                  type="number"
                  required
                  value={loanRepayForm.amount}
                  onChange={(e) => setLoanRepayForm({ ...loanRepayForm, amount: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border font-mono font-bold bg-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 text-white font-bold rounded-xl shadow hover:bg-amber-500 transition"
              >
                {isBn ? 'কিস্তি জমা করুন' : 'Record Loan Payment'}
              </button>
            </div>
          </form>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base border-b pb-2">{isBn ? 'বিতরণকৃত ঋণ একাউন্ট' : 'Disbursed Loans'}</h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 border-b">
                  <tr>
                    <th className="p-2">ঋণ নং</th>
                    <th className="p-2">মূল ঋণ</th>
                    <th className="p-2 text-right">বকেয়া (Due)</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono">
                  {loanAccounts.map((l) => (
                    <tr key={l.loanNo}>
                      <td className="p-2 font-bold">{l.loanNo}</td>
                      <td className="p-2">{formatCurrency(l.principalAmount, language)}</td>
                      <td className="p-2 text-right font-bold text-rose-600">{formatCurrency(l.remainingDue, language)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DPS MANAGEMENT */}
      {activeTab === 'dps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleDpsInstallSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base border-b pb-2 text-teal-600">{isBn ? 'ডিপিএস মাসিক কিস্তি আদায়' : 'Collect DPS Installment'}</h3>

            <div className="text-xs space-y-3">
              <div>
                <label className="block font-semibold mb-1">{isBn ? 'ডিপিএস নম্বর:' : 'DPS No:'}</label>
                <select
                  value={dpsInstallForm.dpsNo}
                  onChange={(e) => setDpsInstallForm({ ...dpsInstallForm, dpsNo: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 text-white dark:bg-slate-900"
                >
                  {dpsAccounts.map((d) => (
                    <option key={d.dpsNo} value={d.dpsNo}>{d.dpsNo} - {d.memberId} (Monthly Tk {d.monthlyInstallment})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">{isBn ? 'জমা পরিমাণ:' : 'Installment Amount:'}</label>
                <input
                  type="number"
                  required
                  value={dpsInstallForm.amount}
                  onChange={(e) => setDpsInstallForm({ ...dpsInstallForm, amount: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border font-mono font-bold bg-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 text-white font-bold rounded-xl shadow hover:bg-teal-500 transition"
              >
                {isBn ? 'ডিপিএস কিস্তি জমা করুন' : 'Record DPS Payment'}
              </button>
            </div>
          </form>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base border-b pb-2">{isBn ? 'সক্রিয় ডিপিএস হিসাব' : 'Running DPS Accounts'}</h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 border-b">
                  <tr>
                    <th className="p-2">ডিপিএস নং</th>
                    <th className="p-2">মাসিক</th>
                    <th className="p-2 text-right">মোট জমা</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono">
                  {dpsAccounts.map((d) => (
                    <tr key={d.dpsNo}>
                      <td className="p-2 font-bold">{d.dpsNo}</td>
                      <td className="p-2">Tk {d.monthlyInstallment}</td>
                      <td className="p-2 text-right font-bold text-emerald-600">{formatCurrency(d.totalPaidAmount, language)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CASH BOOK ACCOUNTING */}
      {activeTab === 'accounting' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form onSubmit={handleCashbookSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="font-bold text-base border-b pb-2">{isBn ? 'ক্যাশ বুক ভাউচার ইন্ট্রি' : 'Cash Book Voucher Entry'}</h3>

              <div className="text-xs space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'ক্যাটাগরি:' : 'Category:'}</label>
                    <select
                      value={cashbookForm.category}
                      onChange={(e) => setCashbookForm({ ...cashbookForm, category: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 text-white dark:bg-slate-900"
                    >
                      <option value="income">{isBn ? 'জমা / আয় (Income)' : 'Income'}</option>
                      <option value="expense">{isBn ? 'খরচ / ব্যয় (Expense)' : 'Expense'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">{isBn ? 'টাকার পরিমাণ:' : 'Amount:'}</label>
                    <input
                      type="number"
                      required
                      value={cashbookForm.amount}
                      onChange={(e) => setCashbookForm({ ...cashbookForm, amount: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border font-mono font-bold bg-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">{isBn ? 'খাত (Head Name):' : 'Head Name:'}</label>
                  <input
                    type="text"
                    required
                    value={cashbookForm.headName}
                    onChange={(e) => setCashbookForm({ ...cashbookForm, headName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border bg-transparent"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">{isBn ? 'বিবরণ:' : 'Description:'}</label>
                  <input
                    type="text"
                    value={cashbookForm.description}
                    onChange={(e) => setCashbookForm({ ...cashbookForm, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border bg-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow hover:bg-emerald-500 transition"
                >
                  {isBn ? 'ক্যাশ বুকে যোগ করুন' : 'Add Cash Book Entry'}
                </button>
              </div>
            </form>

            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-4">
              <h3 className="font-bold text-base border-b border-slate-700 pb-2 text-emerald-300">{isBn ? 'ক্যাশ ব্যালেন্স ও হিসেব' : 'Cash Book Summary'}</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span>{isBn ? 'সর্বমোট আয়/জমা:' : 'Total Income Received:'}</span>
                  <strong className="font-mono text-emerald-400 font-bold">{formatCurrency(totalIncome, language)}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span>{isBn ? 'সর্বমোট ব্যয়/খরচ:' : 'Total Expense Out:'}</span>
                  <strong className="font-mono text-rose-400 font-bold">{formatCurrency(totalExpense, language)}</strong>
                </div>
                <div className="flex justify-between py-3 bg-emerald-950 p-3 rounded-xl font-bold text-sm">
                  <span>{isBn ? 'ক্যাশ হ্যান্ড স্থিতি:' : 'Net Cash in Hand:'}</span>
                  <span className="font-mono text-emerald-300">{formatCurrency(totalIncome - totalExpense, language)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: REPORTS ENGINE */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Advanced Bulk Export Launcher Card */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-700/50">
            <div className="space-y-2">
              <span className="bg-emerald-500/30 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
                {isBn ? 'নতুন অ্যাডভান্সড মডিউল' : 'New Advanced Module'}
              </span>
              <h3 className="font-black text-xl sm:text-2xl text-white">
                {isBn ? 'বাল্ক সদস্য পিডিএফ এক্সপোর্ট ও অল-ইন-ওয়ান রিপোর্ট হাব' : 'Bulk PDF Export & Comprehensive Report Hub'}
              </h3>
              <p className="text-xs text-emerald-100 max-w-xl">
                {isBn ? 'সদস্যের জীবনবৃত্তান্ত, সঞ্চয় পাশবই, ঋণ পাশবই, ডিপিএস পাশবই, স্টেটমেন্ট, রসিদ, স্মার্ট আইডি কার্ড ও সনদপত্র এক ক্লিকে জেনারেট এবং ZIP ফাইলে এক্সপোর্ট করুন।' : 'Generate & export Member Profiles, Passbooks, Statements, Smart ID Cards, and Certificates in bulk into a single clean ZIP package or individual PDFs.'}
              </p>
            </div>
            <button
              onClick={() => setActivePage('bulk-export')}
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/20 transition transform active:scale-98 whitespace-nowrap flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>{isBn ? 'বাল্ক এক্সপোর্ট পেজে যান' : 'Open Bulk Export Studio'}</span>
            </button>
          </div>

          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{isBn ? 'অফিসিয়াল ফাইনান্সিয়াল রিপোর্টস ও দ্রুত ডাউনলোড' : 'Official Reports Engine'}</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{isBn ? 'সদস্য তালিকা ও শেয়ার রিপোর্ট' : 'Member Roster & Share Report'}</h4>
              <p className="text-xs text-slate-500">{isBn ? 'সকল সক্রিয় সদস্যের নাম, ঠিকানা, শেয়ার ও বর্তমান সঞ্চয়।' : 'Full member roster with share holdings and total deposits.'}</p>
              <button
                onClick={() => handleExportReportPDF('Member_Roster')}
                className="w-full py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" />
                <span>PDF Download</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{isBn ? 'ঋণ বিতরণ ও আদায় রিপোর্ট' : 'Loan Disbursement & Recovery'}</h4>
              <p className="text-xs text-slate-500">{isBn ? 'বিতরণকৃত ঋণের তালিকা, আদায়কৃত কিস্তি ও অবশিষ্ট বকেয়া।' : 'Outstanding loan list, EMI repayments, and default risks.'}</p>
              <button
                onClick={() => handleExportReportPDF('Loan_Disbursement')}
                className="w-full py-2.5 bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" />
                <span>PDF Download</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{isBn ? 'ক্যাশ বুক ও প্রফিট/লস স্টেটমেন্ট' : 'Cash Book & Profit Loss'}</h4>
              <p className="text-xs text-slate-500">{isBn ? 'আয়-ব্যয় ভাউচার ও মেয়াদের নিট লাভ-ক্ষতি হিসাব।' : 'Audited general ledger, cash balance, and income statements.'}</p>
              <button
                onClick={() => handleExportReportPDF('Cashbook_Audit')}
                className="w-full py-2.5 bg-teal-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" />
                <span>PDF Download</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: NOTICES MANAGEMENT */}
      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleNoticeSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base border-b pb-2 text-rose-600">{isBn ? 'নতুন নোটিশ তৈরি করুন' : 'Publish New Notice'}</h3>

            <div className="text-xs space-y-3">
              <div>
                <label className="block font-semibold mb-1">{isBn ? 'নোটিশ শিরোনাম (বাংলা):' : 'Title (BN):'}</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: বার্ষিক সাধারণ সভা ২০২৬"
                  value={noticeForm.titleBn}
                  onChange={(e) => setNoticeForm({ ...noticeForm, titleBn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-transparent"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">{isBn ? 'বিবরণ (বাংলা):' : 'Content (BN):'}</label>
                <textarea
                  required
                  rows={4}
                  value={noticeForm.contentBn}
                  onChange={(e) => setNoticeForm({ ...noticeForm, contentBn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border bg-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl shadow hover:bg-rose-500 transition"
              >
                {isBn ? 'নোটিশ প্রকাশ করুন' : 'Publish Notice'}
              </button>
            </div>
          </form>

          <div className="space-y-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{isBn ? 'বর্তমান নোটিশসমূহ' : 'Active Notices'}</h3>
            {notices.map((n) => (
              <div key={n.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border shadow-sm text-xs space-y-1">
                <span className="font-bold text-emerald-600">{n.titleBn}</span>
                <p className="text-slate-500 text-[11px]">{n.contentBn}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: BACKUP & RESTORE */}
      {activeTab === 'backup' && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-2xl mx-auto text-center space-y-6">
          <Database className="w-12 h-12 mx-auto text-emerald-600" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {isBn ? 'সিস্টেম ব্যাকআপ ও ডাটা রিস্টোর' : 'System Database Backup & Restore'}
          </h3>
          <p className="text-xs text-slate-500">
            {isBn ? 'আপনার স্থানীয় ব্রাউজারে সংরক্ষিত সদস্য, সঞ্চয়, ঋণ ও ট্রানজ্যাকশন ডাটা ব্যাকআপ ব্যাকআপ JSON ফাইল হিসাবে ডাউনলোড করুন।' : 'Export system JSON backup file or reset local state.'}
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ members, savingsAccounts, loanAccounts, dpsAccounts, transactions, cashBookEntries }));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `NUSRSSL_Backup_${new Date().toISOString().split('T')[0]}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
                showToast(isBn ? 'ডাটাবেস ব্যাকআপ ডাউনলোড সম্পন্ন' : 'JSON Backup Exported', 'success');
              }}
              className="px-6 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow hover:bg-emerald-500 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isBn ? 'JSON ডাটা ব্যাকআপ ডাউনলোড' : 'Download JSON Backup'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 10: SOCIETY REGISTRATION & INFO SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Header Info Banner */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-2 border border-emerald-500/30">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-emerald-400" />
              <div>
                <h3 className="text-xl font-extrabold text-white">
                  {isBn ? 'সমিতির পরিচিতি ও রেজিস্ট্রেশন সেটিংস' : 'Society Identity & Registration Settings'}
                </h3>
                <p className="text-xs text-emerald-200">
                  {isBn 
                    ? 'প্রতিষ্ঠানটি প্রাইভেট সমবায় সমিতি হিসেবে পরিচালিত। প্রশাসনিক ও রেজিস্ট্রেশন তথ্য এখান থেকে পরিচালনা করুন।' 
                    : 'Operating as a private cooperative management system. Update society identification and registration details here.'}
                </p>
              </div>
            </div>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              updateSocietyInfo(societyForm);
              showToast(isBn ? 'সোসাইটির তথ্য ও রেজিস্ট্রেশন বিবরণ সফলভাবে সংরক্ষিত হয়েছে!' : 'Society details & registration info saved successfully!', 'success');
            }}
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-8"
          >
            {/* Registration Status Toggle */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-800/60 border border-emerald-200 dark:border-emerald-800 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isBn ? 'রেজিস্ট্রেশন অবস্থা' : 'Registration Status'}</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {societyForm.isRegistered 
                      ? (isBn ? 'বর্তমান স্ট্যাটাস: নিবন্ধিত সমবায় সমিতি' : 'Status: Registered Cooperative') 
                      : (isBn ? 'বর্তমান স্ট্যাটাস: প্রাইভেট সমবায় সমিতি (অ-নিবন্ধিত)' : 'Status: Private Cooperative Society (Unregistered)')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-300">
                    <input 
                      type="radio"
                      name="isRegistered"
                      checked={!societyForm.isRegistered}
                      onChange={() => setSocietyForm(prev => ({ ...prev, isRegistered: false, regNoBn: '', regNoEn: '' }))}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{isBn ? 'প্রাইভেট সমবায় (অ-নিবন্ধিত)' : 'Private Cooperative'}</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-300">
                    <input 
                      type="radio"
                      name="isRegistered"
                      checked={societyForm.isRegistered}
                      onChange={() => setSocietyForm(prev => ({ 
                        ...prev, 
                        isRegistered: true,
                        regNoBn: prev.regNoBn || 'নিবন্ধন নং: কুষ্টি/সমবায়/২০২৬-১২৩',
                        regNoEn: prev.regNoEn || 'Reg No: KUS/SAMABAY/2026-123'
                      }))}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{isBn ? 'অফিশিয়ালি নিবন্ধিত' : 'Officially Registered'}</span>
                  </label>
                </div>
              </div>

              {/* Conditional Registration Number inputs */}
              {societyForm.isRegistered && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isBn ? 'রেজিস্ট্রেশন নম্বর (বাংলা)' : 'Registration No (BN)'}
                    </label>
                    <input 
                      type="text"
                      value={societyForm.regNoBn}
                      onChange={(e) => setSocietyForm(prev => ({ ...prev, regNoBn: e.target.value }))}
                      placeholder="নিবন্ধন নং: কুষ্টি/সমবায়/২০২৬-১২৩"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isBn ? 'রেজিস্ট্রেশন নম্বর (ইংরেজি)' : 'Registration No (EN)'}
                    </label>
                    <input 
                      type="text"
                      value={societyForm.regNoEn}
                      onChange={(e) => setSocietyForm(prev => ({ ...prev, regNoEn: e.target.value }))}
                      placeholder="Reg No: KUS/SAMABAY/2026-123"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isBn ? 'রেজিস্ট্রেশনের তারিখ' : 'Registration Date'}
                    </label>
                    <input 
                      type="date"
                      value={societyForm.registrationDate || ''}
                      onChange={(e) => setSocietyForm(prev => ({ ...prev, registrationDate: e.target.value }))}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* General Identity Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b pb-2">
                {isBn ? 'সোসাইটির সাধারণ পরিচিতি' : 'Society General Identity'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isBn ? 'অফিশিয়াল নাম (বাংলা)' : 'Official Name (Bangla)'}
                  </label>
                  <input 
                    type="text"
                    value={societyForm.nameBn}
                    onChange={(e) => setSocietyForm(prev => ({ ...prev, nameBn: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isBn ? 'অফিশিয়াল নাম (ইংরেজি)' : 'Official Name (English)'}
                  </label>
                  <input 
                    type="text"
                    value={societyForm.nameEn}
                    onChange={(e) => setSocietyForm(prev => ({ ...prev, nameEn: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isBn ? 'সংক্ষিপ্ত নাম' : 'Short Name'}
                  </label>
                  <input 
                    type="text"
                    value={societyForm.shortName}
                    onChange={(e) => setSocietyForm(prev => ({ ...prev, shortName: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isBn ? 'সমিতির ধরন' : 'Society Type'}
                  </label>
                  <input 
                    type="text"
                    value={societyForm.typeBn}
                    onChange={(e) => setSocietyForm(prev => ({ ...prev, typeBn: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isBn ? 'স্লোগান (বাংলা)' : 'Slogan (Bangla)'}
                  </label>
                  <input 
                    type="text"
                    value={societyForm.sloganBn}
                    onChange={(e) => setSocietyForm(prev => ({ ...prev, sloganBn: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isBn ? 'স্লোগান (ইংরেজি)' : 'Slogan (English)'}
                  </label>
                  <input 
                    type="text"
                    value={societyForm.sloganEn}
                    onChange={(e) => setSocietyForm(prev => ({ ...prev, sloganEn: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Address & Contact Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b pb-2">
                {isBn ? 'ঠিকানা ও যোগাযোগের তথ্য' : 'Address & Contact Information'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isBn ? 'প্রধান কার্যালয়ের ঠিকানা (বাংলা)' : 'Head Office Address (Bangla)'}
                  </label>
                  <input 
                    type="text"
                    value={societyForm.addressBn}
                    onChange={(e) => setSocietyForm(prev => ({ ...prev, addressBn: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isBn ? 'ফোন নম্বর ১' : 'Phone Number 1'}
                  </label>
                  <input 
                    type="text"
                    value={societyForm.phone1}
                    onChange={(e) => setSocietyForm(prev => ({ ...prev, phone1: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isBn ? 'ফোন নম্বর ২' : 'Phone Number 2'}
                  </label>
                  <input 
                    type="text"
                    value={societyForm.phone2}
                    onChange={(e) => setSocietyForm(prev => ({ ...prev, phone2: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isBn ? 'অনলাইন সার্ভিস নম্বর' : 'Online Service Number'}
                  </label>
                  <input 
                    type="text"
                    value={societyForm.onlineService}
                    onChange={(e) => setSocietyForm(prev => ({ ...prev, onlineService: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                  </label>
                  <input 
                    type="email"
                    value={societyForm.email}
                    onChange={(e) => setSocietyForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-emerald-500 transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isBn ? 'সেটিংস সংরক্ষণ করুন' : 'Save Society Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
