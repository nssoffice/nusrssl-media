import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  Member, 
  SavingsAccount, 
  LoanAccount, 
  DPSAccount, 
  Transaction, 
  CashBookEntry, 
  Notice, 
  ExecutiveMember,
  SocietyInfo
} from '../types';
import { 
  SOCIETY_INFO, 
  INITIAL_EXECUTIVE_MEMBERS, 
  INITIAL_MEMBERS, 
  INITIAL_SAVINGS_ACCOUNTS, 
  INITIAL_LOAN_ACCOUNTS, 
  INITIAL_DPS_ACCOUNTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_CASHBOOK, 
  INITIAL_NOTICES 
} from '../data/initialData';
import { 
  saveFirestoreMember, 
  deleteFirestoreMember, 
  saveFirestoreSavings, 
  saveFirestoreLoan, 
  saveFirestoreDPS, 
  saveFirestoreTransaction, 
  saveFirestoreNotice, 
  saveFirestoreSocietyInfo 
} from '../utils/firestoreService';

export type ActivePage = 
  | 'home'
  | 'about'
  | 'mission-vision'
  | 'committee'
  | 'members'
  | 'savings'
  | 'loans'
  | 'dps'
  | 'calculators'
  | 'register'
  | 'loan-application'
  | 'passbook'
  | 'receipt'
  | 'constitution'
  | 'downloads'
  | 'news'
  | 'contact'
  | 'privacy-terms'
  | 'admin'
  | 'bulk-export';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  
  // Data State
  societyInfo: SocietyInfo;
  updateSocietyInfo: (info: Partial<SocietyInfo>) => void;
  executiveMembers: ExecutiveMember[];
  members: Member[];
  savingsAccounts: SavingsAccount[];
  loanAccounts: LoanAccount[];
  dpsAccounts: DPSAccount[];
  transactions: Transaction[];
  cashBookEntries: CashBookEntry[];
  notices: Notice[];
  
  // Actions
  registerMember: (memberData: Omit<Member, 'id' | 'status' | 'joiningDate'>) => Member;
  updateMember: (id: string, updatedData: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  openDPSScheme: (dpsData: { memberId: string; monthlyInstallment: number; termYears: number; profitRate?: number }) => DPSAccount;
  addSavingsTransaction: (txn: Omit<Transaction, 'id' | 'date' | 'voucherNo'>) => Transaction;
  applyLoan: (loanData: Omit<LoanAccount, 'loanNo' | 'disbursementDate' | 'status' | 'paidInstallments' | 'totalPaid' | 'remainingDue'>) => LoanAccount;
  addLoanRepayment: (loanNo: string, amount: number, collector: string) => Transaction;
  addDPSInstallment: (dpsNo: string, amount: number, collector: string) => Transaction;
  addCashBookEntry: (entry: Omit<CashBookEntry, 'id' | 'date'>) => CashBookEntry;
  addNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  
  // Passbook & Receipt Modals
  selectedMemberForPassbook: Member | null;
  setSelectedMemberForPassbook: (m: Member | null) => void;
  selectedReceiptTransaction: Transaction | null;
  setSelectedReceiptTransaction: (t: Transaction | null) => void;
  selectedMemberCard: Member | null;
  setSelectedMemberCard: (m: Member | null) => void;
  
  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('bn');
  const [darkMode, setDarkModeState] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<ActivePage>('home');

  // Core Data
  const [societyInfo, setSocietyInfo] = useState<SocietyInfo>(() => {
    const saved = localStorage.getItem('nusrssl_society_info');
    return saved ? JSON.parse(saved) : SOCIETY_INFO;
  });

  const updateSocietyInfo = (info: Partial<SocietyInfo>) => {
    setSocietyInfo((prev) => {
      const updated = { ...prev, ...info };
      localStorage.setItem('nusrssl_society_info', JSON.stringify(updated));
      return updated;
    });
  };

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('nusrssl_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>(() => {
    const saved = localStorage.getItem('nusrssl_savings');
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_ACCOUNTS;
  });

  const [loanAccounts, setLoanAccounts] = useState<LoanAccount[]>(() => {
    const saved = localStorage.getItem('nusrssl_loans');
    return saved ? JSON.parse(saved) : INITIAL_LOAN_ACCOUNTS;
  });

  const [dpsAccounts, setDpsAccounts] = useState<DPSAccount[]>(() => {
    const saved = localStorage.getItem('nusrssl_dps');
    return saved ? JSON.parse(saved) : INITIAL_DPS_ACCOUNTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('nusrssl_txns');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [cashBookEntries, setCashBookEntries] = useState<CashBookEntry[]>(() => {
    const saved = localStorage.getItem('nusrssl_cashbook');
    return saved ? JSON.parse(saved) : INITIAL_CASHBOOK;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('nusrssl_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  // Modals state
  const [selectedMemberForPassbook, setSelectedMemberForPassbook] = useState<Member | null>(null);
  const [selectedReceiptTransaction, setSelectedReceiptTransaction] = useState<Transaction | null>(null);
  const [selectedMemberCard, setSelectedMemberCard] = useState<Member | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setDarkMode = (val: boolean | ((prev: boolean) => boolean)) => {
    setDarkModeState((prev) => {
      const next = typeof val === 'function' ? val(prev) : val;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem('nusrssl_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('nusrssl_savings', JSON.stringify(savingsAccounts));
  }, [savingsAccounts]);

  useEffect(() => {
    localStorage.setItem('nusrssl_loans', JSON.stringify(loanAccounts));
  }, [loanAccounts]);

  useEffect(() => {
    localStorage.setItem('nusrssl_dps', JSON.stringify(dpsAccounts));
  }, [dpsAccounts]);

  useEffect(() => {
    localStorage.setItem('nusrssl_txns', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('nusrssl_cashbook', JSON.stringify(cashBookEntries));
  }, [cashBookEntries]);

  // Actions
  const registerMember = (memberData: Omit<Member, 'id' | 'status' | 'joiningDate'>): Member => {
    const nextSeq = (members.length + 101).toString();
    const newId = `NUSRSSL-2026-${nextSeq.padStart(4, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    
    const newMember: Member = {
      ...memberData,
      id: newId,
      status: 'active',
      joiningDate: today
    };

    // Auto create default savings account for member
    const newSavingsAcc: SavingsAccount = {
      accountNo: `SAV-${nextSeq}-M`,
      memberId: newId,
      schemeType: 'monthly',
      openingDate: today,
      balance: newMember.totalShareValue || 500,
      status: 'active',
      interestRate: 7.5
    };

    setMembers((prev) => [newMember, ...prev]);
    setSavingsAccounts((prev) => [newSavingsAcc, ...prev]);
    saveFirestoreMember(newMember);
    saveFirestoreSavings(newSavingsAcc);
    showToast(language === 'bn' ? `নতুন সদস্য নিবন্ধিত: ${newId}` : `New Member Registered: ${newId}`, 'success');
    return newMember;
  };

  const updateMember = (id: string, updatedData: Partial<Member>) => {
    let updatedMember: Member | null = null;
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          updatedMember = { ...m, ...updatedData };
          return updatedMember;
        }
        return m;
      })
    );
    if (updatedMember) {
      saveFirestoreMember(updatedMember);
    }
    showToast(language === 'bn' ? 'সদস্যের তথ্য সফলভাবে আপডেট করা হয়েছে' : 'Member updated successfully', 'success');
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    deleteFirestoreMember(id);
    showToast(language === 'bn' ? 'সদস্য মুছে ফেলা হয়েছে' : 'Member deleted successfully', 'info');
  };

  const openDPSScheme = (dpsData: { memberId: string; monthlyInstallment: number; termYears: number; profitRate?: number }): DPSAccount => {
    const nextSeq = Math.floor(100 + Math.random() * 900);
    const dpsNo = `DPS-2026-${nextSeq}`;
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];
    
    const matDateObj = new Date(today);
    matDateObj.setFullYear(matDateObj.getFullYear() + dpsData.termYears);
    const maturityDate = matDateObj.toISOString().split('T')[0];

    const totalInstallments = dpsData.termYears * 12;
    const totalPrincipal = dpsData.monthlyInstallment * totalInstallments;
    const rate = dpsData.profitRate || (dpsData.termYears === 3 ? 10 : dpsData.termYears === 5 ? 12 : 14);
    const expectedMaturityAmount = Math.round(totalPrincipal * (1 + (rate / 100)));

    const newDPS: DPSAccount = {
      dpsNo,
      memberId: dpsData.memberId,
      monthlyInstallment: dpsData.monthlyInstallment,
      termYears: dpsData.termYears,
      startDate,
      maturityDate,
      expectedMaturityAmount,
      profitRate: rate,
      totalPaidAmount: 0,
      paidInstallmentsCount: 0,
      totalInstallmentsCount: totalInstallments,
      status: 'running'
    };

    setDpsAccounts((prev) => [newDPS, ...prev]);
    saveFirestoreDPS(newDPS);
    showToast(language === 'bn' ? `নতুন ডিপিএস স্কিম চালু হয়েছে (${dpsNo})` : `New DPS Account Opened (${dpsNo})`, 'success');
    return newDPS;
  };

  const addSavingsTransaction = (txnData: Omit<Transaction, 'id' | 'date' | 'voucherNo'>): Transaction => {
    const id = `TXN-${Date.now().toString().slice(-6)}`;
    const date = new Date().toISOString().split('T')[0];
    const voucherNo = `V-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTxn: Transaction = {
      ...txnData,
      id,
      date,
      voucherNo
    };

    // Update balance
    setSavingsAccounts((prev) =>
      prev.map((acc) => {
        if (acc.accountNo === txnData.accountNo) {
          const newBal = txnData.type === 'deposit' 
            ? acc.balance + txnData.amount 
            : acc.balance - txnData.amount;
          return { ...acc, balance: Math.max(0, newBal) };
        }
        return acc;
      })
    );

    setTransactions((prev) => [newTxn, ...prev]);
    showToast(language === 'bn' ? 'সঞ্চয় লেনদেন সফল হয়েছে' : 'Savings Transaction Successful', 'success');
    return newTxn;
  };

  const applyLoan = (loanData: Omit<LoanAccount, 'loanNo' | 'disbursementDate' | 'status' | 'paidInstallments' | 'totalPaid' | 'remainingDue'>): LoanAccount => {
    const loanNo = `LN-2026-${Math.floor(100 + Math.random() * 900)}`;
    const today = new Date().toISOString().split('T')[0];
    const totalDue = Math.round(loanData.principalAmount * (1 + (loanData.interestRate / 100)));

    const newLoan: LoanAccount = {
      ...loanData,
      loanNo,
      disbursementDate: today,
      status: 'pending',
      paidInstallments: 0,
      totalPaid: 0,
      remainingDue: totalDue
    };

    setLoanAccounts((prev) => [newLoan, ...prev]);
    showToast(language === 'bn' ? `ঋণ আবেদন জমা হয়েছে (${loanNo})` : `Loan Application Submitted (${loanNo})`, 'info');
    return newLoan;
  };

  const addLoanRepayment = (loanNo: string, amount: number, collector: string): Transaction => {
    const loan = loanAccounts.find((l) => l.loanNo === loanNo);
    const memberId = loan ? loan.memberId : 'UNKNOWN';
    const id = `TXN-${Date.now().toString().slice(-6)}`;
    const date = new Date().toISOString().split('T')[0];
    const voucherNo = `V-LN-${Math.floor(1000 + Math.random() * 9000)}`;

    let newRemDue = 0;
    setLoanAccounts((prev) =>
      prev.map((l) => {
        if (l.loanNo === loanNo) {
          const paidInst = l.paidInstallments + 1;
          const totalP = l.totalPaid + amount;
          const rem = Math.max(0, l.remainingDue - amount);
          newRemDue = rem;
          return {
            ...l,
            paidInstallments: paidInst,
            totalPaid: totalP,
            remainingDue: rem,
            status: rem <= 0 ? 'paid' : l.status
          };
        }
        return l;
      })
    );

    const newTxn: Transaction = {
      id,
      memberId,
      accountType: 'loan',
      accountNo: loanNo,
      date,
      type: 'loan_repayment',
      amount,
      balanceAfter: newRemDue,
      voucherNo,
      collectorName: collector,
      remarks: 'ঋণ কিস্তি পরিশোধ'
    };

    setTransactions((prev) => [newTxn, ...prev]);
    showToast(language === 'bn' ? 'ঋণ কিস্তি জমা সফল হয়েছে' : 'Loan Repayment Recorded', 'success');
    return newTxn;
  };

  const addDPSInstallment = (dpsNo: string, amount: number, collector: string): Transaction => {
    const dps = dpsAccounts.find((d) => d.dpsNo === dpsNo);
    const memberId = dps ? dps.memberId : 'UNKNOWN';
    const id = `TXN-${Date.now().toString().slice(-6)}`;
    const date = new Date().toISOString().split('T')[0];
    const voucherNo = `V-DPS-${Math.floor(1000 + Math.random() * 9000)}`;

    let totalPaidAcc = 0;
    setDpsAccounts((prev) =>
      prev.map((d) => {
        if (d.dpsNo === dpsNo) {
          const totalP = d.totalPaidAmount + amount;
          const paidCnt = d.paidInstallmentsCount + 1;
          totalPaidAcc = totalP;
          return {
            ...d,
            totalPaidAmount: totalP,
            paidInstallmentsCount: paidCnt
          };
        }
        return d;
      })
    );

    const newTxn: Transaction = {
      id,
      memberId,
      accountType: 'dps',
      accountNo: dpsNo,
      date,
      type: 'dps_installment',
      amount,
      balanceAfter: totalPaidAcc,
      voucherNo,
      collectorName: collector,
      remarks: 'ডিপিএস মাসিক কিস্তি'
    };

    setTransactions((prev) => [newTxn, ...prev]);
    showToast(language === 'bn' ? 'ডিপিএস কিস্তি জমা সফল' : 'DPS Installment Deposited', 'success');
    return newTxn;
  };

  const addCashBookEntry = (entryData: Omit<CashBookEntry, 'id' | 'date'>): CashBookEntry => {
    const id = `CB-${Date.now().toString().slice(-6)}`;
    const date = new Date().toISOString().split('T')[0];

    const newEntry: CashBookEntry = {
      ...entryData,
      id,
      date
    };

    setCashBookEntries((prev) => [newEntry, ...prev]);
    showToast(language === 'bn' ? 'ক্যাশবুকে হিসাব যুক্ত হয়েছে' : 'Cash Book Entry Added', 'success');
    return newEntry;
  };

  const addNotice = (noticeData: Omit<Notice, 'id' | 'date'>) => {
    const id = `NOT-${Date.now().toString().slice(-4)}`;
    const date = new Date().toISOString().split('T')[0];

    const newNotice: Notice = {
      ...noticeData,
      id,
      date
    };

    setNotices((prev) => [newNotice, ...prev]);
    showToast(language === 'bn' ? 'নতুন নোটিশ প্রকাশিত' : 'New Notice Published', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        darkMode,
        setDarkMode,
        activePage,
        setActivePage,
        societyInfo,
        updateSocietyInfo,
        executiveMembers: INITIAL_EXECUTIVE_MEMBERS,
        members,
        savingsAccounts,
        loanAccounts,
        dpsAccounts,
        transactions,
        cashBookEntries,
        notices,
        registerMember,
        updateMember,
        deleteMember,
        openDPSScheme,
        addSavingsTransaction,
        applyLoan,
        addLoanRepayment,
        addDPSInstallment,
        addCashBookEntry,
        addNotice,
        selectedMemberForPassbook,
        setSelectedMemberForPassbook,
        selectedReceiptTransaction,
        setSelectedReceiptTransaction,
        selectedMemberCard,
        setSelectedMemberCard,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
