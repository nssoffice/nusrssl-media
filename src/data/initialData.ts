import { Member, SavingsAccount, LoanAccount, DPSAccount, Transaction, CashBookEntry, Notice, ExecutiveMember, SocietyInfo } from '../types';

export const SOCIETY_INFO: SocietyInfo = {
  nameBn: 'নিরাপদ উন্নয়ন সঞ্চয় ও ঋণদান সমবায় সমিতি (NUSRSSL)',
  nameEn: 'Nirapad Unnayan Sanchay & Rindan Samabay Samity (NUSRSSL)',
  shortName: 'NUSRSSL',
  sloganBn: 'একসাথে সঞ্চয়, একসাথে উন্নয়ন',
  sloganEn: 'Saving Together, Developing Together',
  typeBn: 'প্রাইভেট সঞ্চয় ও ঋণদান সমবায় সমিতি',
  typeEn: 'Private Savings & Loan Cooperative Society',
  isRegistered: false,
  regNoBn: '',
  regNoEn: '',
  registrationDate: '',
  addressBn: 'শহীদ উকিল আলাউদ্দিন রোড, বৌ বাজার, কালিশংকরপুর, কুষ্টিয়া সদর, কুষ্টিয়া-৭০০০',
  addressEn: 'Shahid Ukil Alauddin Road, Bou Bazar, Kalishankarpur, Kushtia Sadar, Kushtia-7000',
  phone1: '+8801731127864',
  phone2: '+8801722324324',
  onlineService: '+8801748647079',
  email: 'info.nusrssl.kushtia@gmail.com',
  website: 'https://nusrssl-kushtia.org'
};

export const INITIAL_EXECUTIVE_MEMBERS: ExecutiveMember[] = [
  {
    id: 'exec-1',
    nameBn: 'আলহাজ্ব মোঃ গোলাম মোস্তফা',
    nameEn: 'Alhaj Md. Golam Mostafa',
    designationBn: 'সভাপতি (President)',
    designationEn: 'President',
    roleType: 'executive',
    mobile: '+8801731127864',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bioBn: 'দীর্ঘ ২০ বছর ধরে সমবায় খাত এবং সামাজিক উন্নয়নে নিবেদিতপ্রাণ।',
    bioEn: 'Dedicated to the cooperative movement and social development for over 20 years.'
  },
  {
    id: 'exec-2',
    nameBn: 'মো: রফিকুল ইসলাম',
    nameEn: 'Md. Rafiqul Islam',
    designationBn: 'সসহ-সভাপতি (Vice-President)',
    designationEn: 'Vice President',
    roleType: 'executive',
    mobile: '+8801722324324',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    bioBn: 'ব্যবসায়ী ও কুষ্টিয়া জেলা সমবায় ইউনিয়নের সদস্য।',
    bioEn: 'Businessman and distinguished member of Kushtia District Cooperative Union.'
  },
  {
    id: 'exec-3',
    nameBn: 'ইঞ্জিনিয়ার মোঃ আখতারুজ্জামান',
    nameEn: 'Engr. Md. Akhtaruzzaman',
    designationBn: 'সাধারণ সম্পাদক (General Secretary)',
    designationEn: 'General Secretary',
    roleType: 'executive',
    mobile: '+8801748647079',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    bioBn: 'ক্ষুদ্র সঞ্চয় ও ডিজিটাল সমবায় ব্যবস্থার প্রধান উদ্যোক্তা।',
    bioEn: 'Lead architect of micro-savings and digital cooperative systems.'
  },
  {
    id: 'exec-4',
    nameBn: 'মোছাঃ পারভীন আক্তার',
    nameEn: 'Mst. Parvin Akhtar',
    designationBn: 'কোষাধ্যক্ষ (Treasurer)',
    designationEn: 'Treasurer',
    roleType: 'executive',
    mobile: '+8801711987654',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    bioBn: 'মহিলা ক্ষমতায়ন ও ক্ষুদ্র উদ্যোক্তা ঋণ কার্যক্রমের পরিচালক।',
    bioEn: 'Director of women empowerment and micro-enterprise loan programs.'
  },
  {
    id: 'exec-5',
    nameBn: 'অধ্যাপক ড. মোঃ আব্দুল কুদ্দুস',
    nameEn: 'Prof. Dr. Md. Abdul Kuddus',
    designationBn: 'প্রধান উপদেষ্টা (Chief Advisor)',
    designationEn: 'Chief Advisor',
    roleType: 'advisor',
    mobile: '+8801715001122',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bioBn: 'সাবেক অধ্যাপক, অর্থনীতি বিভাগ, ইসলামী বিশ্ববিদ্যালয়, কুষ্টিয়া।',
    bioEn: 'Former Professor, Dept of Economics, Islamic University, Kushtia.'
  },
  {
    id: 'exec-6',
    nameBn: 'এডভোকেট মোঃ আব্দুর রশীদ',
    nameEn: 'Advocate Md. Abdur Rashid',
    designationBn: 'আইন উপদেষ্টা (Legal Advisor)',
    designationEn: 'Legal Advisor',
    roleType: 'advisor',
    mobile: '+8801712334455',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    bioBn: 'সিনিয়র আইনজীবী, কুষ্টিয়া জেলা জজ কোর্ট।',
    bioEn: 'Senior Advocate, Kushtia District Judge Court.'
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'NUSRSSL-2026-0101',
    nameBn: 'মোঃ হাবিবুর রহমান',
    nameEn: 'Md. Habibur Rahman',
    fatherHusbandBn: 'মৃত আকমল হোসেন',
    fatherHusbandEn: 'Late Akmal Hossain',
    motherNameBn: 'জাহানারা বেগম',
    motherNameEn: 'Jahanara Begum',
    nid: '1988501234567890',
    presentAddressBn: 'কালিশংকরপুর, কুষ্টিয়া সদর',
    presentAddressEn: 'Kalishankarpur, Kushtia Sadar',
    permanentAddressBn: 'কালিশংকরপুর, কুষ্টিয়া সদর',
    permanentAddressEn: 'Kalishankarpur, Kushtia Sadar',
    occupationBn: 'ব্যবসায়ী',
    occupationEn: 'Businessman',
    mobile: '01712345678',
    email: 'habib.kushtia@gmail.com',
    bloodGroup: 'B+',
    joiningDate: '2019-03-15',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    shareCount: 10,
    totalShareValue: 1000,
    nomineeNameBn: 'মোছাঃ নাসরীন সুলতানা',
    nomineeNameEn: 'Mst. Nasrin Sultana',
    nomineeRelationBn: 'স্ত্রী',
    nomineeRelationEn: 'Wife',
    nomineeNid: '1992509876543210',
    nomineeMobile: '01712998877'
  },
  {
    id: 'NUSRSSL-2026-0102',
    nameBn: 'মোছাঃ সাবিনা ইয়াসমিন',
    nameEn: 'Mst. Sabina Yasmin',
    fatherHusbandBn: 'মো: আজহার আলী',
    fatherHusbandEn: 'Md. Azhar Ali',
    motherNameBn: 'আমেনা খাতুন',
    motherNameEn: 'Amena Khatun',
    nid: '1994503456789012',
    presentAddressBn: 'বৌ বাজার, কুষ্টিয়া সদর',
    presentAddressEn: 'Bou Bazar, Kushtia Sadar',
    permanentAddressBn: 'বৌ বাজার, কুষ্টিয়া সদর',
    permanentAddressEn: 'Bou Bazar, Kushtia Sadar',
    occupationBn: 'শিক্ষিকা',
    occupationEn: 'Teacher',
    mobile: '01823456789',
    email: 'sabina.kushtia@yahoo.com',
    bloodGroup: 'A+',
    joiningDate: '2020-01-10',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    shareCount: 5,
    totalShareValue: 500,
    nomineeNameBn: 'মো: আজহার আলী',
    nomineeNameEn: 'Md. Azhar Ali',
    nomineeRelationBn: 'স্বামী',
    nomineeRelationEn: 'Husband',
    nomineeNid: '1989505544332211',
    nomineeMobile: '01823000000'
  },
  {
    id: 'NUSRSSL-2026-0103',
    nameBn: 'ইঞ্জিনিয়ার তানভীর আহমেদ',
    nameEn: 'Engr. Tanvir Ahmed',
    fatherHusbandBn: 'মোঃ মোজাম্মেল হক',
    fatherHusbandEn: 'Md. Mozammel Hoque',
    motherNameBn: 'রোকেয়া বেগম',
    motherNameEn: 'Rokeya Begum',
    nid: '1990507788990011',
    presentAddressBn: 'মজুপুর, কুষ্টিয়া সদর',
    presentAddressEn: 'Mojumpur, Kushtia Sadar',
    permanentAddressBn: 'মজুপুর, কুষ্টিয়া সদর',
    permanentAddressEn: 'Mojumpur, Kushtia Sadar',
    occupationBn: 'চাকুরীজীবী',
    occupationEn: 'Service Holder',
    mobile: '01912345678',
    email: 'tanvir.eng@gmail.com',
    bloodGroup: 'O+',
    joiningDate: '2021-06-01',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    shareCount: 20,
    totalShareValue: 2000,
    nomineeNameBn: 'মোঃ মোজাম্মেল হক',
    nomineeNameEn: 'Md. Mozammel Hoque',
    nomineeRelationBn: 'পিতা',
    nomineeRelationEn: 'Father',
    nomineeNid: '1965501122334455',
    nomineeMobile: '01912999999'
  }
];

export const INITIAL_SAVINGS_ACCOUNTS: SavingsAccount[] = [
  {
    accountNo: 'SAV-0101-M',
    memberId: 'NUSRSSL-2026-0101',
    schemeType: 'monthly',
    openingDate: '2019-03-20',
    balance: 85500,
    status: 'active',
    interestRate: 7.5
  },
  {
    accountNo: 'SAV-0102-W',
    memberId: 'NUSRSSL-2026-0102',
    schemeType: 'weekly',
    openingDate: '2020-01-15',
    balance: 42000,
    status: 'active',
    interestRate: 7.0
  },
  {
    accountNo: 'SAV-0103-D',
    memberId: 'NUSRSSL-2026-0103',
    schemeType: 'daily',
    openingDate: '2021-06-05',
    balance: 124000,
    status: 'active',
    interestRate: 8.0
  }
];

export const INITIAL_LOAN_ACCOUNTS: LoanAccount[] = [
  {
    loanNo: 'LN-2026-001',
    memberId: 'NUSRSSL-2026-0101',
    loanType: 'business',
    disbursementDate: '2025-08-10',
    principalAmount: 100000,
    interestRate: 10,
    durationMonths: 12,
    installmentType: 'monthly',
    totalInstallments: 12,
    installmentAmount: 9167,
    paidInstallments: 6,
    totalPaid: 55002,
    remainingDue: 54998,
    purpose: 'দোকান সম্প্রসারণ ও মালামাল ক্রয়',
    guarantorName: 'মো: রফিকুল ইসলাম',
    guarantorMobile: '01722324324',
    guarantorNid: '1985501111222333',
    status: 'disbursed'
  },
  {
    loanNo: 'LN-2026-002',
    memberId: 'NUSRSSL-2026-0102',
    loanType: 'microcredit',
    disbursementDate: '2026-01-05',
    principalAmount: 50000,
    interestRate: 9,
    durationMonths: 6,
    installmentType: 'monthly',
    totalInstallments: 6,
    installmentAmount: 8708,
    paidInstallments: 3,
    totalPaid: 26124,
    remainingDue: 26126,
    purpose: 'সেলাই মেশিন ক্রয় ও কুটির শিল্প',
    guarantorName: 'মোছাঃ পারভীন আক্তার',
    guarantorMobile: '01711987654',
    guarantorNid: '1988509999888777',
    status: 'disbursed'
  }
];

export const INITIAL_DPS_ACCOUNTS: DPSAccount[] = [
  {
    dpsNo: 'DPS-2026-501',
    memberId: 'NUSRSSL-2026-0101',
    monthlyInstallment: 2000,
    termYears: 5,
    startDate: '2022-01-01',
    maturityDate: '2027-01-01',
    expectedMaturityAmount: 154000,
    profitRate: 10.5,
    totalPaidAmount: 96000,
    paidInstallmentsCount: 48,
    totalInstallmentsCount: 60,
    status: 'running'
  },
  {
    dpsNo: 'DPS-2026-502',
    memberId: 'NUSRSSL-2026-0103',
    monthlyInstallment: 5000,
    termYears: 3,
    startDate: '2024-03-01',
    maturityDate: '2027-03-01',
    expectedMaturityAmount: 212000,
    profitRate: 10.0,
    totalPaidAmount: 140000,
    paidInstallmentsCount: 28,
    totalInstallmentsCount: 36,
    status: 'running'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-901',
    memberId: 'NUSRSSL-2026-0101',
    accountType: 'savings',
    accountNo: 'SAV-0101-M',
    date: '2026-08-01',
    type: 'deposit',
    amount: 5000,
    balanceAfter: 85500,
    voucherNo: 'V-2026-801',
    collectorName: 'মো: জসীম উদ্দিন',
    remarks: 'মাসিক সঞ্চয় জমা'
  },
  {
    id: 'TXN-902',
    memberId: 'NUSRSSL-2026-0101',
    accountType: 'loan',
    accountNo: 'LN-2026-001',
    date: '2026-08-01',
    type: 'loan_repayment',
    amount: 9167,
    balanceAfter: 54998,
    voucherNo: 'V-2026-802',
    collectorName: 'মো: জসীম উদ্দিন',
    remarks: '৬ষ্ঠ কিস্তি পরিষদ'
  },
  {
    id: 'TXN-903',
    memberId: 'NUSRSSL-2026-0103',
    accountType: 'dps',
    accountNo: 'DPS-2026-502',
    date: '2026-08-02',
    type: 'dps_installment',
    amount: 5000,
    balanceAfter: 140000,
    voucherNo: 'V-2026-803',
    collectorName: 'আব্দুর রহিম',
    remarks: '২৮তম ডিপিএস কিস্তি'
  }
];

export const INITIAL_CASHBOOK: CashBookEntry[] = [
  {
    id: 'CB-101',
    date: '2026-08-01',
    voucherNo: 'IN-001',
    category: 'income',
    headName: 'সঞ্চয় আমানত গ্রহণ',
    description: 'সদস্যদের দৈনন্দিন ও মাসিক সঞ্চয় জমা',
    amount: 35000,
    paymentMode: 'cash',
    recordedBy: 'মোছাঃ পারভীন আক্তার (কোষাধ্যক্ষ)'
  },
  {
    id: 'CB-102',
    date: '2026-08-01',
    voucherNo: 'EX-001',
    category: 'expense',
    headName: 'অফিস ভাড়া ও বিদ্যুৎ বিল',
    description: 'কুষ্টিয়া অফিসের আগস্ট মাসের ভাড়া',
    amount: 12000,
    paymentMode: 'bank',
    recordedBy: 'মোছাঃ পারভীন আক্তার (কোষাধ্যক্ষ)'
  },
  {
    id: 'CB-103',
    date: '2026-08-02',
    voucherNo: 'IN-002',
    category: 'income',
    headName: 'ঋণের কিস্তি আদায়',
    description: 'চলতি মাসের ঋণ কিস্তি বাবদ আদায়',
    amount: 48500,
    paymentMode: 'cash',
    recordedBy: 'মোছাঃ পারভীন আক্তার (কোষাধ্যক্ষ)'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'NOT-01',
    titleBn: 'বার্ষিক সাধারণ সভা (AGM) ২০২৬ এর বিজ্ঞপ্তি',
    titleEn: 'Annual General Meeting (AGM) 2026 Notice',
    date: '2026-08-01',
    category: 'agm',
    isImportant: true,
    contentBn: 'এতদ্বারা সমিতির সকল সম্মানিত সদস্যবৃন্দকে জানানো যাচ্ছে যে, আগামী ২৫শে আগস্ট ২০২৬, রবিবার সকাল ১০:০০ ঘটিকায় সমিতির নিজ কার্যালয়ে বার্ষিক সাধারণ সভা অনুষ্ঠিত হবে। সকল সদস্যের উপস্থিতি একান্ত কাম্য।',
    contentEn: 'All honorable members are hereby informed that the Annual General Meeting (AGM) will be held on August 25, 2026 at 10:00 AM at the Society Registered Office. Presence of all members is highly requested.'
  },
  {
    id: 'NOT-02',
    titleBn: 'ডিপিএস ও সঞ্চয় মুনাফা বন্টন সংক্রান্ত',
    titleEn: 'DPS & Savings Profit Distribution Notice',
    date: '2026-07-20',
    category: 'dps',
    isImportant: false,
    contentBn: '২০২৫-২০২৬ অর্থবছরের অর্জিত মুনাফা সকল নিয়মিত সঞ্চয়ী ও ডিপিএস হিসাবধারীদের একাউন্টে জমা করা হয়েছে। সদস্যরা পাসবই হালনাগাদ করে নিতে পারবেন।',
    contentEn: 'The net profit earned for the fiscal year 2025-2026 has been disbursed into regular savings and DPS accounts. Members may update their digital passbooks.'
  },
  {
    id: 'NOT-03',
    titleBn: 'নতুন সদস্য ফরম ও অনলাইন ডিজিটাল পাসবই সেবা চালু',
    titleEn: 'Launch of Digital Passbook & Online Registration',
    date: '2026-07-01',
    category: 'general',
    isImportant: true,
    contentBn: 'নিরাপদ উন্নয়ন সমবায় সমিতিতে এখন থেকে অনলাইন নিবন্ধনের মাধ্যমে কিউআর কোড যুক্ত ডিজিটাল পাসবই ও ই-রসিদ সুবিধা প্রদান করা হচ্ছে।',
    contentEn: 'NUSRSSL has officially launched online membership registration along with QR Code embedded Digital Passbooks and E-Receipts.'
  }
];

export const CONSTITUTION_CHAPTERS = [
  {
    chapterNo: '১',
    titleBn: 'প্রাথমিক ও নামকরণ (Preliminary & Name)',
    titleEn: 'Preliminary & Organization Name',
    contentBn: '১. এই সমবায় সমিতির নাম হবে "নিরাপদ উন্নয়ন সঞ্চয় ও ঋণদান সমবায় সমিতি (NUSRSSL)" (সংক্ষেপে- NUSRSSL)।\n২. ইহার প্রধান কার্যালয় শহীদ উকিল আলাউদ্দিন রোড, বৌ বাজার, কালিশংকরপুর, কুষ্টিয়া সদর, কুষ্টিয়া-৭০০০ তে অবস্থিত থাকবে।\n৩. সমিতিটি নিজস্ব অভ্যন্তরীণ গঠনতন্ত্র ও সমবায় উপ-আইন অনুযায়ী প্রাইভেট সমবায় সমিতি হিসেবে পরিচালিত হবে।'
  },
  {
    chapterNo: '২',
    titleBn: 'উদ্দেশ্য ও কর্ম এলাকা (Objectives & Operational Area)',
    titleEn: 'Objectives & Operational Area',
    contentBn: '১. সদস্যদের মধ্যে নিয়মিত ক্ষুদ্র সঞ্চয়ের অভ্যাস গড়ে তোলা।\n২. আত্মকর্মসংস্থান ও ক্ষুদ্র ব্যবসার প্রসারে সহজ শর্তে ঋণ প্রদান।\n৩. কুষ্টিয়া জেলা সহ তৎসংলগ্ন এলাকায় অর্থনৈতিক স্বাবলম্বিতা আনয়ন।\n৪. অসচ্ছল ও প্রান্তিক জনগোষ্ঠীর জীবনযাত্রার মান উন্নয়ন।'
  },
  {
    chapterNo: '৩',
    titleBn: 'সদস্যপদ লাভ ও যোগ্যতা (Membership Eligibility)',
    titleEn: 'Membership Eligibility & Admission',
    contentBn: '১. ন্যূনতম ১৮ বছর বয়সী সুস্থ মস্তিস্ক সম্পন্ন যেকোন বাংলাদেশী নাগরিক সদস্য হতে পারবেন।\n২. সমিতির ঘোষিত উদ্দেশ্য ও উপ-আইন মেনে চলার লিখিত সম্মতি প্রদান করতে হবে।\n৩. ন্যূনতম ১০টি শেয়ার ক্রয় এবং প্রবেশ ফি প্রদান আবশ্যক।\n৪. পরিচালনা পর্ষদ কর্তৃক আবেদন মঞ্জুর হতে হবে।'
  },
  {
    chapterNo: '৪',
    titleBn: 'শেয়ার ও মূলধন গঠন (Shares & Capital Structure)',
    titleEn: 'Shares & Capital Structure',
    contentBn: '১. সমিতির অনুমোদিত শেয়ার মূলধন ৫০,০০,০০০/- (পঞ্চাশ লক্ষ) টাকা।\n২. প্রতিটি শেয়ারের মূল্য ১০০/- (একশত) টাকা।\n৩. কোন সদস্য মোট অনুমোদিত মূলধনের ১/৫ অংশের বেশি শেয়ার ধারণ করতে পারবেন না।\n৪. শেয়ার হস্তান্তর পরিচালনা পর্ষদের অনুমোদন সাপেক্ষ।'
  },
  {
    chapterNo: '৫',
    titleBn: 'সঞ্চয় ও ডিপিএস স্কিম (Savings & DPS Schemes)',
    titleEn: 'Savings & DPS Rules',
    contentBn: '১. দৈনিক, সাপ্তাহিক এবং মাসিক সঞ্চয় আমানত হিসাব গ্রহণ করা হবে।\n২. মেয়াদী সঞ্চয় (ডিপিএস) ৩, ৫ এবং ১০ বছর মেয়াদে পরিচালিত হবে।\n৩. বাৎসরিক মুনাফার হার সমিতির গঠনতন্ত্রের আওতায় বার্ষিক সাধারণ সভায় অনুমোদিত হবে।'
  },
  {
    chapterNo: '৬',
    titleBn: 'ঋণদান নীতিমালা ও জামানত (Loan Policy & Collateral)',
    titleEn: 'Loan Policy & Collateral Requirements',
    contentBn: '১. একজন সদস্য তার জমানো সঞ্চয়ের সর্বোচ্চ ৫ গুণ পর্যন্ত ঋণ পাওয়ার যোগ্য হবেন।\n২. ক্ষুদ্র ঋণ, ব্যবসায়িক ঋণ, জরুরী ঋণ ও কৃষি ঋণ ক্যাটাগরিতে ঋণ বিতরণ করা হবে।\n৩. সকল ঋণের জন্য ২ জন নিয়মিত সদস্যের গ্যারান্টি প্রদান আবশ্যক।'
  },
  {
    chapterNo: '৭',
    titleBn: 'ব্যবস্থাপনা কমিটি ও সাধারণ সভা (Management Board & AGM)',
    titleEn: 'Management Board & Meetings',
    contentBn: '১. সমিতির সর্বোচ্চ ক্ষমতা সাধারণ সভার উপর ন্যস্ত থাকবে।\n২. প্রতি বছর অন্তত একবার বার্ষিক সাধারণ সভা (AGM) অনুষ্ঠিত হবে।\n৩. পরিচালকমণ্ডলী ৬ সদস্য বিশিষ্ট হবেন যারা ৩ বছর মেয়াদে নির্বাচিত হবেন।'
  }
];
