export type Language = 'bn' | 'en';

export interface SocietyInfo {
  nameBn: string;
  nameEn: string;
  shortName: string;
  sloganBn: string;
  sloganEn: string;
  typeBn: string;
  typeEn: string;
  isRegistered: boolean;
  regNoBn: string;
  regNoEn: string;
  registrationDate?: string;
  addressBn: string;
  addressEn: string;
  phone1: string;
  phone2: string;
  onlineService: string;
  email: string;
  website: string;
}

export interface Member {
  id: string; // e.g., NUSRSSL-2026-0101
  nameBn: string;
  nameEn: string;
  fatherHusbandBn: string;
  fatherHusbandEn: string;
  motherNameBn: string;
  motherNameEn: string;
  nid: string;
  presentAddressBn: string;
  presentAddressEn: string;
  permanentAddressBn: string;
  permanentAddressEn: string;
  occupationBn: string;
  occupationEn: string;
  mobile: string;
  email: string;
  bloodGroup: string;
  joiningDate: string;
  photoUrl: string;
  signatureUrl?: string;
  status: 'active' | 'pending' | 'suspended';
  shareCount: number;
  totalShareValue: number;
  
  // Nominee info
  nomineeNameBn: string;
  nomineeNameEn: string;
  nomineeRelationBn: string;
  nomineeRelationEn: string;
  nomineeNid: string;
  nomineeMobile: string;
}

export interface Transaction {
  id: string;
  memberId: string;
  accountType: 'savings' | 'loan' | 'dps' | 'share';
  accountNo: string;
  date: string;
  type: 'deposit' | 'withdrawal' | 'loan_disbursement' | 'loan_repayment' | 'dps_installment' | 'dps_maturity';
  amount: number;
  feeOrFine?: number;
  balanceAfter: number;
  voucherNo: string;
  collectorName: string;
  remarks?: string;
}

export interface SavingsAccount {
  accountNo: string;
  memberId: string;
  schemeType: 'daily' | 'weekly' | 'monthly';
  openingDate: string;
  balance: number;
  status: 'active' | 'closed';
  interestRate: number; // e.g., 7.5%
}

export interface LoanAccount {
  loanNo: string;
  memberId: string;
  loanType: 'microcredit' | 'business' | 'emergency' | 'agricultural';
  disbursementDate: string;
  principalAmount: number;
  interestRate: number; // e.g., 10%
  durationMonths: number;
  installmentType: 'weekly' | 'monthly';
  totalInstallments: number;
  installmentAmount: number;
  paidInstallments: number;
  totalPaid: number;
  remainingDue: number;
  purpose: string;
  guarantorName: string;
  guarantorMobile: string;
  guarantorNid: string;
  status: 'pending' | 'approved' | 'disbursed' | 'paid' | 'rejected';
}

export interface DPSAccount {
  dpsNo: string;
  memberId: string;
  monthlyInstallment: number;
  termYears: number; // 3, 5, 10
  startDate: string;
  maturityDate: string;
  expectedMaturityAmount: number;
  profitRate: number;
  totalPaidAmount: number;
  paidInstallmentsCount: number;
  totalInstallmentsCount: number;
  status: 'running' | 'matured' | 'closed';
}

export interface CashBookEntry {
  id: string;
  date: string;
  voucherNo: string;
  category: 'income' | 'expense';
  headName: string;
  description: string;
  amount: number;
  paymentMode: 'cash' | 'bank' | 'bkash' | 'nagad';
  recordedBy: string;
}

export interface Notice {
  id: string;
  titleBn: string;
  titleEn: string;
  date: string;
  category: 'general' | 'agm' | 'holiday' | 'dps';
  contentBn: string;
  contentEn: string;
  isImportant?: boolean;
}

export interface ExecutiveMember {
  id: string;
  nameBn: string;
  nameEn: string;
  designationBn: string;
  designationEn: string;
  roleType: 'executive' | 'advisor';
  mobile: string;
  photoUrl: string;
  bioBn: string;
  bioEn: string;
}

export interface CalculatorState {
  savingsScheme: 'daily' | 'weekly' | 'monthly';
  savingsAmount: number;
  savingsPeriodMonths: number;
  savingsRate: number;

  loanAmount: number;
  loanTermMonths: number;
  loanInterestRate: number;

  dpsMonthly: number;
  dpsYears: number;
  dpsRate: number;
}
