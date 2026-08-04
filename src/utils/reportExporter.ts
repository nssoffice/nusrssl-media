import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Member, SavingsAccount, LoanAccount, DPSAccount, Transaction, CashBookEntry } from '../types';
import { SOCIETY_INFO } from '../data/initialData';
import { formatCurrency, formatDate } from './formatters';

export type ReportType = 
  | 'daily_collection'
  | 'weekly_collection'
  | 'monthly_collection'
  | 'yearly_collection'
  | 'savings_report'
  | 'loan_report'
  | 'dps_report'
  | 'cashbook'
  | 'ledger'
  | 'balance_sheet';

export const REPORT_TYPE_LABELS: Record<ReportType, { bn: string; en: string }> = {
  daily_collection: { bn: 'দৈনিক আদায় রিপোর্ট', en: 'Daily Collection Report' },
  weekly_collection: { bn: 'সাপ্তাহিক আদায় রিপোর্ট', en: 'Weekly Collection Report' },
  monthly_collection: { bn: 'মাসিক আদায় রিপোর্ট', en: 'Monthly Collection Report' },
  yearly_collection: { bn: 'বার্ষিক আদায় রিপোর্ট', en: 'Yearly Collection Report' },
  savings_report: { bn: 'সঞ্চয় স্থিতি ও সমন্বয় রিপোর্ট', en: 'Savings Account Report' },
  loan_report: { bn: 'ঋণ বণ্টন ও আদায় রিপোর্ট', en: 'Loan Disbursement & Recovery' },
  dps_report: { bn: 'ডিপিএস আমানত হিসাব রিপোর্ট', en: 'DPS Account Summary' },
  cashbook: { bn: 'ক্যাশ বই (আয়-ব্যয় জাবেদা)', en: 'Cash Book Journal' },
  ledger: { bn: 'সাধারণ খতিয়ান বই', en: 'General Ledger Report' },
  balance_sheet: { bn: 'উদ্বৃত্ত পত্র (ব্যালেন্স শিট)', en: 'Balance Sheet & Financial Position' }
};

export interface ReportDataRow {
  sl: number;
  date: string;
  refNo: string;
  memberId: string;
  memberName: string;
  category: string;
  inAmount: number;
  outAmount: number;
  balance: number;
  collector: string;
  remarks: string;
}

/**
 * Filter transactions/cashbook entries into tabular data based on selected report type
 */
export function generateReportDataRows(
  reportType: ReportType,
  members: Member[],
  savingsAccs: SavingsAccount[],
  loanAccs: LoanAccount[],
  dpsAccs: DPSAccount[],
  transactions: Transaction[],
  cashBookEntries: CashBookEntry[],
  startDate?: string,
  endDate?: string
): { title: string; columns: string[]; rows: ReportDataRow[]; summary: Record<string, number> } {
  const memberMap = new Map<string, Member>();
  members.forEach(m => memberMap.set(m.id, m));

  let rows: ReportDataRow[] = [];
  let title = REPORT_TYPE_LABELS[reportType].bn;
  let columns: string[] = ['ক্রমিক', 'তারিখ', 'ভাউচার/রেফ', 'সদস্য নং', 'সদস্যের নাম', 'বিবরণ', 'জমা (টাকা)', 'উত্তোলন/প্রদান', 'অবশিষ্ট স্থিতি', 'সংগ্রহকারী'];

  // Filter date helper
  const isWithinDate = (dateStr: string) => {
    if (!startDate && !endDate) return true;
    if (startDate && dateStr < startDate) return false;
    if (endDate && dateStr > endDate) return false;
    return true;
  };

  switch (reportType) {
    case 'daily_collection':
    case 'weekly_collection':
    case 'monthly_collection':
    case 'yearly_collection': {
      const filteredTxns = transactions.filter(t => isWithinDate(t.date));
      rows = filteredTxns.map((t, idx) => {
        const mem = memberMap.get(t.memberId);
        return {
          sl: idx + 1,
          date: formatDate(t.date),
          refNo: t.voucherNo,
          memberId: t.memberId,
          memberName: mem ? mem.nameBn : 'অজানা সদস্য',
          category: t.accountType === 'savings' ? 'সঞ্চয় আদায়' : t.accountType === 'loan' ? 'ঋণ কিস্তি' : 'ডিপিএস জমা',
          inAmount: ['deposit', 'loan_repayment', 'dps_installment'].includes(t.type) ? t.amount : 0,
          outAmount: ['withdrawal', 'loan_disbursement'].includes(t.type) ? t.amount : 0,
          balance: t.balanceAfter,
          collector: t.collectorName,
          remarks: t.remarks || ''
        };
      });
      break;
    }

    case 'savings_report': {
      columns = ['ক্রমিক', 'হিসাব নম্বর', 'সদস্য আইডি', 'সদস্যের নাম', 'স্কিম টাইপ', 'মুনাফা হার', 'বর্তমান স্থিতি (টাকা)', 'স্ট্যাটাস'];
      rows = savingsAccs.map((s, idx) => {
        const mem = memberMap.get(s.memberId);
        return {
          sl: idx + 1,
          date: formatDate(s.openingDate),
          refNo: s.accountNo,
          memberId: s.memberId,
          memberName: mem ? mem.nameBn : 'N/A',
          category: `সঞ্চয় (${s.schemeType})`,
          inAmount: s.balance,
          outAmount: 0,
          balance: s.balance,
          collector: `${s.interestRate}%`,
          remarks: s.status === 'active' ? 'সক্রিয়' : 'বন্ধ'
        };
      });
      break;
    }

    case 'loan_report': {
      columns = ['ক্রমিক', 'ঋণ নম্বর', 'সদস্য আইডি', 'সদস্যের নাম', 'মঞ্জুরীকৃত ঋণ', 'পরিশোধিত টাকা', 'অবশিষ্ট বকেয়া', 'কিস্তি সংখ্যা', 'স্ট্যাটাস'];
      rows = loanAccs.map((l, idx) => {
        const mem = memberMap.get(l.memberId);
        return {
          sl: idx + 1,
          date: formatDate(l.disbursementDate),
          refNo: l.loanNo,
          memberId: l.memberId,
          memberName: mem ? mem.nameBn : 'N/A',
          category: l.loanType,
          inAmount: l.principalAmount,
          outAmount: l.totalPaid,
          balance: l.remainingDue,
          collector: `${l.paidInstallments}/${l.totalInstallments}`,
          remarks: l.status
        };
      });
      break;
    }

    case 'dps_report': {
      columns = ['ক্রমিক', 'ডিপিএস নং', 'সদস্য আইডি', 'সদস্যের নাম', 'মাসিক কিস্তি', 'মোট জমাকৃত তহবীল', 'মেয়াদান্তে প্রাক্কলিত', 'পরিশোধিত কিস্তি', 'স্ট্যাটাস'];
      rows = dpsAccs.map((d, idx) => {
        const mem = memberMap.get(d.memberId);
        return {
          sl: idx + 1,
          date: formatDate(d.startDate),
          refNo: d.dpsNo,
          memberId: d.memberId,
          memberName: mem ? mem.nameBn : 'N/A',
          category: `${d.termYears} বছর`,
          inAmount: d.monthlyInstallment,
          outAmount: d.totalPaidAmount,
          balance: d.expectedMaturityAmount,
          collector: `${d.paidInstallmentsCount}/${d.totalInstallmentsCount}`,
          remarks: d.status
        };
      });
      break;
    }

    case 'cashbook':
    case 'ledger': {
      const filteredEntries = cashBookEntries.filter(c => isWithinDate(c.date));
      rows = filteredEntries.map((c, idx) => ({
        sl: idx + 1,
        date: formatDate(c.date),
        refNo: c.voucherNo,
        memberId: 'N/A',
        memberName: c.recordedBy,
        category: c.headName,
        inAmount: c.category === 'income' ? c.amount : 0,
        outAmount: c.category === 'expense' ? c.amount : 0,
        balance: 0,
        collector: c.paymentMode.toUpperCase(),
        remarks: c.description
      }));
      break;
    }

    case 'balance_sheet': {
      columns = ['ক্রমিক', 'খাত / হিসাবের বিবরণ', 'হিসাবের ধরন', 'ডেবিট (আবাস/সম্পদ)', 'ক্রেডিট (দায়/তহবীল)', 'নীট স্থিতি'];
      const totalSavings = savingsAccs.reduce((a, b) => a + b.balance, 0);
      const totalLoansDue = loanAccs.reduce((a, b) => a + b.remainingDue, 0);
      const totalDpsFund = dpsAccs.reduce((a, b) => a + b.totalPaidAmount, 0);
      const totalIncome = cashBookEntries.filter(c => c.category === 'income').reduce((a, b) => a + b.amount, 0);
      const totalExpense = cashBookEntries.filter(c => c.category === 'expense').reduce((a, b) => a + b.amount, 0);

      rows = [
        { sl: 1, date: formatDate(new Date().toISOString()), refNo: 'BS-01', memberId: 'N/A', memberName: 'সমবায় স্থাবর ও অস্হাবর সম্পদ', category: 'সম্পদ (Asset)', inAmount: totalLoansDue, outAmount: 0, balance: totalLoansDue, collector: 'ডেবিট', remarks: 'সদস্য ঋণ বকেয়া স্থিতি' },
        { sl: 2, date: formatDate(new Date().toISOString()), refNo: 'BS-02', memberId: 'N/A', memberName: 'সদস্য সঞ্চয় আমানত', category: 'দায় (Liability)', inAmount: 0, outAmount: totalSavings, balance: totalSavings, collector: 'ক্রেডিট', remarks: 'সাধারণ সঞ্চয় তহবীল' },
        { sl: 3, date: formatDate(new Date().toISOString()), refNo: 'BS-03', memberId: 'N/A', memberName: 'ডিপিএস সঞ্চয় তহবীল', category: 'দায় (Liability)', inAmount: 0, outAmount: totalDpsFund, balance: totalDpsFund, collector: 'ক্রেডিট', remarks: 'মেয়াদী ডিপিএস তহবীল' },
        { sl: 4, date: formatDate(new Date().toISOString()), refNo: 'BS-04', memberId: 'N/A', memberName: 'সমিতির নীট আয়-ব্যয় উদ্বৃত্ত', category: 'সমাপনী উদ্বৃত্ত', inAmount: totalIncome, outAmount: totalExpense, balance: totalIncome - totalExpense, collector: 'সমন্বিত', remarks: 'রিজার্ভ তহবীল' }
      ];
      break;
    }
  }

  const totalIn = rows.reduce((acc, r) => acc + (r.inAmount || 0), 0);
  const totalOut = rows.reduce((acc, r) => acc + (r.outAmount || 0), 0);

  return {
    title,
    columns,
    rows,
    summary: { totalIn, totalOut, netCount: rows.length }
  };
}

/**
 * Export report as CSV with UTF-8 BOM so Bengali Unicode opens directly in Excel
 */
export function exportReportToCSV(
  reportType: ReportType,
  data: ReturnType<typeof generateReportDataRows>
) {
  const headers = data.columns.join(',');
  const rowStrings = data.rows.map(r => [
    r.sl,
    `"${r.date}"`,
    `"${r.refNo}"`,
    `"${r.memberId}"`,
    `"${r.memberName.replace(/"/g, '""')}"`,
    `"${r.category}"`,
    r.inAmount,
    r.outAmount,
    r.balance,
    `"${r.collector}"`
  ].join(','));

  const csvContent = '\uFEFF' + [headers, ...rowStrings].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
}

/**
 * Export report as Excel (.xlsx) using xlsx library
 */
export function exportReportToExcel(
  reportType: ReportType,
  data: ReturnType<typeof generateReportDataRows>
) {
  const sheetData = data.rows.map(r => ({
    'ক্রমিক': r.sl,
    'তারিখ': r.date,
    'ভাউচার/রেফ': r.refNo,
    'সদস্য নম্বর': r.memberId,
    'সদস্যের নাম': r.memberName,
    'বিবরণ/ক্যাটাগরি': r.category,
    'জমা/আদায় (টাকা)': r.inAmount,
    'উত্তোলন/প্রদান (টাকা)': r.outAmount,
    'অবশিষ্ট স্থিতি (টাকা)': r.balance,
    'সংগ্রহকারী/স্ট্যাটাস': r.collector,
    'মন্তব্য': r.remarks
  }));

  const worksheet = XLSX.utils.json_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${reportType}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

/**
 * Export report as PDF using jsPDF + html2canvas / autotable
 */
export function exportReportToPDF(
  reportType: ReportType,
  data: ReturnType<typeof generateReportDataRows>
) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Add Title and Header info
  doc.setFontSize(16);
  doc.setTextColor(4, 120, 87);
  doc.text(SOCIETY_INFO.nameBn, 14, 15);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  const regSub = SOCIETY_INFO.regNoBn ? ` | ${SOCIETY_INFO.regNoBn}` : ' | (প্রাইভেট সমবায় সমিতি)';
  doc.text(`${REPORT_TYPE_LABELS[reportType].bn}${regSub}`, 14, 21);
  doc.text(`প্রিন্ট তারিখ: ${new Date().toLocaleDateString('bn-BD')}`, 240, 21);

  const tableHead = [data.columns];
  const tableBody = data.rows.map(r => [
    r.sl,
    r.date,
    r.refNo,
    r.memberId,
    r.memberName,
    r.category,
    r.inAmount ? formatCurrency(r.inAmount) : '-',
    r.outAmount ? formatCurrency(r.outAmount) : '-',
    formatCurrency(r.balance),
    r.collector
  ]);

  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: 26,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] }
  });

  doc.save(`${reportType}_${new Date().toISOString().split('T')[0]}.pdf`);
}
