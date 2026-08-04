import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { generateBarcodeDataUrl } from './barcodeGenerator';
import { Member, SavingsAccount, LoanAccount, DPSAccount, Transaction } from '../types';
import { SOCIETY_INFO } from '../data/initialData';
import { formatCurrency, formatDate } from './formatters';

export type PdfPageSize = 'a4' | 'a5';

export interface PdfExportOptions {
  pageSize: PdfPageSize;
  includeWatermark: boolean;
  includeQrCode: boolean;
  includeBarcode: boolean;
  includeSignatures: boolean;
}

export type DocumentType = 
  | 'profile'
  | 'savings_passbook'
  | 'loan_passbook'
  | 'dps_passbook'
  | 'loan_statement'
  | 'savings_statement'
  | 'receipts'
  | 'id_card'
  | 'certificate';

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, { bn: string; en: string }> = {
  profile: { bn: 'সদস্য প্রোফাইল', en: 'Member Profile' },
  savings_passbook: { bn: 'সঞ্চয় পাশবই', en: 'Savings Passbook' },
  loan_passbook: { bn: 'ঋণ পাশবই', en: 'Loan Passbook' },
  dps_passbook: { bn: 'ডিপিএস পাশবই', en: 'DPS Passbook' },
  loan_statement: { bn: 'ঋণ হিসাব বিবরণী', en: 'Loan Statement' },
  savings_statement: { bn: 'সঞ্চয় হিসাব বিবরণী', en: 'Savings Statement' },
  receipts: { bn: 'আদায় রসিদ কপি', en: 'Payment Receipts' },
  id_card: { bn: 'সদস্য আইডি কার্ড', en: 'Member ID Card' },
  certificate: { bn: 'সদস্যপদ সনদপত্র', en: 'Membership Certificate' }
};

/**
 * Generate QR Code data URL asynchronously
 */
export async function getQrCodeDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, { width: 160, margin: 1 });
  } catch (err) {
    console.error('QR code generation error:', err);
    return '';
  }
}

/**
 * Helper to construct standard off-screen HTML element for pixel-perfect PDF rendering
 * Bengali text will render 100% correctly through HTML2Canvas -> jsPDF
 */
export async function generateMemberDocumentHtml(
  docType: DocumentType,
  member: Member,
  savingsAccs: SavingsAccount[],
  loanAccs: LoanAccount[],
  dpsAccs: DPSAccount[],
  txns: Transaction[],
  options: PdfExportOptions
): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';

  // Page dimensions
  const widthPx = options.pageSize === 'a5' ? 559 : 794; // A5 or A4 width at 96 DPI
  container.style.width = `${widthPx}px`;
  container.style.minHeight = options.pageSize === 'a5' ? '794px' : '1123px';
  container.style.backgroundColor = '#FFFFFF';
  container.style.color = '#0f172a';
  container.style.fontFamily = "'Plus Jakarta Sans', 'Hind Siliguri', sans-serif";
  container.style.padding = options.pageSize === 'a5' ? '20px' : '36px';
  container.style.boxSizing = 'border-box';
  container.style.position = 'relative';

  // Generate QR & Barcode
  const qrUrl = options.includeQrCode ? await getQrCodeDataUrl(member.id) : '';
  const barcodeUrl = options.includeBarcode ? generateBarcodeDataUrl(member.id, 240, 60) : '';

  // Watermark markup
  const watermarkHtml = options.includeWatermark
    ? `<div style="position: absolute; top: 35%; left: 10%; right: 10%; transform: rotate(-30deg); text-align: center; font-size: 38px; font-weight: 800; color: rgba(13, 148, 136, 0.06); pointer-events: none; text-transform: uppercase; z-index: 0; line-height: 1.2;">
        ${SOCIETY_INFO.nameBn}<br/>${member.id}
       </div>`
    : '';

  // Header markup
  const headerHtml = `
    <div style="border-bottom: 2px solid #0d9488; padding-bottom: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 1;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 52px; height: 52px; background: linear-gradient(135deg, #047857, #0d9488); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 22px;">
          ন
        </div>
        <div>
          <h1 style="margin: 0; font-size: 18px; font-weight: 800; color: #064e3b; line-height: 1.2;">
            ${SOCIETY_INFO.nameBn}
          </h1>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #047857; font-weight: 600;">
            ${SOCIETY_INFO.nameEn}
          </p>
          <p style="margin: 2px 0 0 0; font-size: 10px; color: #64748b;">
            ${SOCIETY_INFO.regNoBn ? `${SOCIETY_INFO.regNoBn} | ` : ''}${SOCIETY_INFO.addressBn} | হটলাইন: ${SOCIETY_INFO.phone1}
          </p>
        </div>
      </div>
      <div style="text-align: right;">
        ${qrUrl ? `<img src="${qrUrl}" style="width: 58px; height: 58px; border-radius: 4px; border: 1px solid #cbd5e1;" />` : ''}
      </div>
    </div>
  `;

  // Footer / Signatures markup
  const signatureHtml = options.includeSignatures ? `
    <div style="margin-top: 40px; pt: 20px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: flex-end; position: relative; z-index: 1;">
      <div style="text-align: center; width: 22%;">
        <div style="border-bottom: 1px solid #475569; margin-bottom: 4px; height: 30px;"></div>
        <p style="margin: 0; font-size: 11px; font-weight: 600; color: #334155;">সদস্যের স্বাক্ষর</p>
      </div>
      <div style="text-align: center; width: 22%;">
        <div style="border-bottom: 1px solid #475569; margin-bottom: 4px; height: 30px;"></div>
        <p style="margin: 0; font-size: 11px; font-weight: 600; color: #334155;">আদায়কারী / ক্যাশিয়ার</p>
      </div>
      <div style="text-align: center; width: 22%;">
        <div style="border-bottom: 1px solid #475569; margin-bottom: 4px; height: 30px;"></div>
        <p style="margin: 0; font-size: 11px; font-weight: 600; color: #334155;">ব্যবস্থাপক / সম্পাদক</p>
      </div>
      <div style="text-align: center; width: 22%;">
        <div style="border-bottom: 1px solid #475569; margin-bottom: 4px; height: 30px;"></div>
        <p style="margin: 0; font-size: 11px; font-weight: 600; color: #334155;">সভাপতি</p>
      </div>
    </div>
  ` : '';

  const pageFooterHtml = `
    <div style="margin-top: 24px; padding-top: 8px; border-top: 1px solid #e2e8f0; font-size: 9px; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1;">
      <span>কারিগরি সহায়তা: সমবায় কম্পিউটার সিস্টেম | প্রিন্ট তারিখ: ${new Date().toLocaleDateString('bn-BD')}</span>
      <span>${SOCIETY_INFO.nameBn} - কপিরাইট © ২০২৬</span>
    </div>
  `;

  // Filter member data
  const memberSavings = savingsAccs.filter(s => s.memberId === member.id);
  const memberLoans = loanAccs.filter(l => l.memberId === member.id);
  const memberDps = dpsAccs.filter(d => d.memberId === member.id);
  const memberTxns = txns.filter(t => t.memberId === member.id);

  let bodyContent = '';

  switch (docType) {
    case 'profile': {
      bodyContent = `
        <div style="position: relative; z-index: 1;">
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 10px 14px; border-radius: 6px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
            <h2 style="margin: 0; font-size: 15px; font-weight: 700; color: #166534;">সদস্য জীবনবৃত্তান্ত ও মৌলিক তথ্য (Member Profile)</h2>
            <span style="font-size: 12px; font-weight: 700; color: #047857; background: #dcfce7; padding: 2px 8px; border-radius: 4px;">স্ট্যাটাস: ${member.status === 'active' ? 'সক্রিয়' : 'অপেক্ষমাণ'}</span>
          </div>

          <div style="display: flex; gap: 20px; margin-bottom: 20px;">
            <div style="text-align: center;">
              <img src="${member.photoUrl}" style="width: 110px; height: 130px; object-fit: cover; border-radius: 6px; border: 2px solid #0d9488;" />
              <div style="margin-top: 6px;">
                ${barcodeUrl ? `<img src="${barcodeUrl}" style="width: 130px; height: 35px;" />` : ''}
              </div>
            </div>

            <div style="flex: 1;">
              <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <tr>
                  <td style="padding: 4px 0; font-weight: 700; width: 32%; color: #475569;">সদস্য আইডি:</td>
                  <td style="padding: 4px 0; font-weight: 800; color: #0f172a;">${member.id}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: 700; color: #475569;">সদস্যের নাম (বাংলা):</td>
                  <td style="padding: 4px 0; font-weight: 700; color: #065f46;">${member.nameBn}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: 700; color: #475569;">Name (English):</td>
                  <td style="padding: 4px 0; font-weight: 600; color: #334155;">${member.nameEn}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: 700; color: #475569;">পিতা/স্বামীর নাম:</td>
                  <td style="padding: 4px 0;">${member.fatherHusbandBn} (${member.fatherHusbandEn})</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: 700; color: #475569;">মাতার নাম:</td>
                  <td style="padding: 4px 0;">${member.motherNameBn}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: 700; color: #475569;">এনআইডি (NID):</td>
                  <td style="padding: 4px 0; font-weight: 700;">${member.nid}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: 700; color: #475569;">মোবাইল নম্বর:</td>
                  <td style="padding: 4px 0; font-weight: 700; color: #0284c7;">${member.mobile}</td>
                </tr>
              </table>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
            <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; background: #f8fafc;">
              <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #0f766e; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">বর্তমান ও স্থায়ী ঠিকানা</h3>
              <p style="margin: 4px 0; font-size: 11px;"><strong>বর্তমান:</strong> ${member.presentAddressBn}</p>
              <p style="margin: 4px 0; font-size: 11px;"><strong>স্থায়ী:</strong> ${member.permanentAddressBn}</p>
              <p style="margin: 4px 0; font-size: 11px;"><strong>পেশা:</strong> ${member.occupationBn}</p>
              <p style="margin: 4px 0; font-size: 11px;"><strong>রক্তের গ্রুপ:</strong> <span style="color: #dc2626; font-weight: 700;">${member.bloodGroup}</span></p>
            </div>

            <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; background: #f8fafc;">
              <h3 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #0f766e; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">শেয়ার ও মনোনীত ব্যক্তি (নমিনী)</h3>
              <p style="margin: 4px 0; font-size: 11px;"><strong>শেয়ার সংখ্যা:</strong> ${member.shareCount} টি (মূল্য: ${formatCurrency(member.totalShareValue)})</p>
              <p style="margin: 4px 0; font-size: 11px;"><strong>যোগদানের তারিখ:</strong> ${formatDate(member.joiningDate)}</p>
              <p style="margin: 4px 0; font-size: 11px;"><strong>নমিনীর নাম:</strong> ${member.nomineeNameBn}</p>
              <p style="margin: 4px 0; font-size: 11px;"><strong>সম্পর্ক:</strong> ${member.nomineeRelationBn} | <strong>মোবাইল:</strong> ${member.nomineeMobile}</p>
            </div>
          </div>

          <!-- Account Summary Overview -->
          <div style="border: 1px solid #0d9488; border-radius: 6px; overflow: hidden;">
            <div style="background: #0d9488; color: white; padding: 6px 12px; font-weight: 700; font-size: 12px;">
              সদস্যের আর্থিক হিসাবসমূহ (Financial Accounts Summary)
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
              <tr style="background: #f1f5f9; text-align: left;">
                <th style="padding: 6px 10px; border-bottom: 1px solid #cbd5e1;">হিসাব প্রকার</th>
                <th style="padding: 6px 10px; border-bottom: 1px solid #cbd5e1;">হিসাব নম্বর</th>
                <th style="padding: 6px 10px; border-bottom: 1px solid #cbd5e1;">স্থিতি / বিতরণ / জমা</th>
                <th style="padding: 6px 10px; border-bottom: 1px solid #cbd5e1;">স্ট্যাটাস</th>
              </tr>
              ${memberSavings.map(s => `
                <tr>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #f1f5f9;">সঞ্চয় হিসাব (${s.schemeType})</td>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #f1f5f9; font-weight: 600;">${s.accountNo}</td>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #f1f5f9; font-weight: 700; color: #047857;">${formatCurrency(s.balance)}</td>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #f1f5f9;">${s.status}</td>
                </tr>
              `).join('')}
              ${memberLoans.map(l => `
                <tr>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #f1f5f9;">ঋণ হিসাব (${l.loanType})</td>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #f1f5f9; font-weight: 600;">${l.loanNo}</td>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #f1f5f9; font-weight: 700; color: #dc2626;">বকেয়া: ${formatCurrency(l.remainingDue)}</td>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #f1f5f9;">${l.status}</td>
                </tr>
              `).join('')}
              ${memberDps.map(d => `
                <tr>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #f1f5f9;">ডিপিএস হিসাব (${d.termYears} বছর)</td>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #f1f5f9; font-weight: 600;">${d.dpsNo}</td>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #f1f5f9; font-weight: 700; color: #0284c7;">জমা: ${formatCurrency(d.totalPaidAmount)}</td>
                  <td style="padding: 6px 10px; border-bottom: 1px solid #f1f5f9;">${d.status}</td>
                </tr>
              `).join('')}
            </table>
          </div>
        </div>
      `;
      break;
    }

    case 'savings_passbook':
    case 'savings_statement': {
      const mainSavings = memberSavings[0] || { accountNo: 'N/A', balance: 0, schemeType: 'monthly', interestRate: 7.5, openingDate: member.joiningDate };
      const savingsTxns = memberTxns.filter(t => t.accountType === 'savings');

      bodyContent = `
        <div style="position: relative; z-index: 1;">
          <div style="background: #ecfdf5; border: 1px solid #6ee7b7; padding: 10px 14px; border-radius: 6px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h2 style="margin: 0; font-size: 15px; font-weight: 700; color: #065f46;">সঞ্চয় হিসাব পাশবই ও স্টেটমেন্ট (Savings Passbook)</h2>
              <p style="margin: 2px 0 0 0; font-size: 11px; color: #047857;">সদস্য: ${member.nameBn} (${member.id}) | হিসাব নং: ${mainSavings.accountNo}</p>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 10px; color: #64748b;">বর্তমান সঞ্চয় স্থিতি</span>
              <div style="font-size: 16px; font-weight: 800; color: #047857;">${formatCurrency(mainSavings.balance)}</div>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px;">
            <thead>
              <tr style="background: #0f766e; color: white;">
                <th style="padding: 6px 8px; border: 1px solid #0f766e;">তারিখ</th>
                <th style="padding: 6px 8px; border: 1px solid #0f766e;">ভাউচার নং</th>
                <th style="padding: 6px 8px; border: 1px solid #0f766e;">বিবরণ</th>
                <th style="padding: 6px 8px; border: 1px solid #0f766e; text-align: right;">জমা (টাকা)</th>
                <th style="padding: 6px 8px; border: 1px solid #0f766e; text-align: right;">উত্তোলন (টাকা)</th>
                <th style="padding: 6px 8px; border: 1px solid #0f766e; text-align: right;">অবশিষ্ট স্থিতি</th>
                <th style="padding: 6px 8px; border: 1px solid #0f766e;">সংগ্রহকারী</th>
              </tr>
            </thead>
            <tbody>
              ${savingsTxns.length === 0 ? `
                <tr><td colspan="7" style="padding: 12px; text-align: center; color: #64748b;">কোন লেনদেন পাওয়া যায়নি</td></tr>
              ` : savingsTxns.map(t => `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 6px 8px; text-align: center;">${formatDate(t.date)}</td>
                  <td style="padding: 6px 8px; text-align: center; font-weight: 600;">${t.voucherNo}</td>
                  <td style="padding: 6px 8px;">${t.remarks || (t.type === 'deposit' ? 'সঞ্চয় জমা' : 'সঞ্চয় উত্তোলন')}</td>
                  <td style="padding: 6px 8px; text-align: right; font-weight: 700; color: #047857;">${t.type === 'deposit' ? formatCurrency(t.amount) : '-'}</td>
                  <td style="padding: 6px 8px; text-align: right; font-weight: 700; color: #dc2626;">${t.type === 'withdrawal' ? formatCurrency(t.amount) : '-'}</td>
                  <td style="padding: 6px 8px; text-align: right; font-weight: 800; color: #0f172a;">${formatCurrency(t.balanceAfter)}</td>
                  <td style="padding: 6px 8px;">${t.collectorName}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      break;
    }

    case 'loan_passbook':
    case 'loan_statement': {
      const mainLoan = memberLoans[0] || { loanNo: 'N/A', principalAmount: 0, remainingDue: 0, totalPaid: 0, installmentAmount: 0, paidInstallments: 0, totalInstallments: 12, purpose: 'N/A', guarantorName: 'N/A' };
      const loanTxns = memberTxns.filter(t => t.accountType === 'loan');

      bodyContent = `
        <div style="position: relative; z-index: 1;">
          <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 10px 14px; border-radius: 6px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h2 style="margin: 0; font-size: 15px; font-weight: 700; color: #c2410c;">ঋণ হিসাব পাশবই ও স্টেটমেন্ট (Loan Statement)</h2>
              <p style="margin: 2px 0 0 0; font-size: 11px; color: #9a3412;">সদস্য: ${member.nameBn} (${member.id}) | ঋণ নং: ${mainLoan.loanNo} | জামিনদার: ${mainLoan.guarantorName}</p>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 10px; color: #64748b;">অবশিষ্ট বকেয়া ঋণ</span>
              <div style="font-size: 16px; font-weight: 800; color: #dc2626;">${formatCurrency(mainLoan.remainingDue)}</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px; font-size: 11px;">
            <div style="background: #f8fafc; padding: 8px; border-radius: 4px; border: 1px solid #e2e8f0;">
              <span style="color: #64748b; font-size: 10px;">মঞ্জুরীকৃত ঋণ</span>
              <div style="font-weight: 700; font-size: 12px; color: #0f172a;">${formatCurrency(mainLoan.principalAmount)}</div>
            </div>
            <div style="background: #f8fafc; padding: 8px; border-radius: 4px; border: 1px solid #e2e8f0;">
              <span style="color: #64748b; font-size: 10px;">মোট আদায়কৃত</span>
              <div style="font-weight: 700; font-size: 12px; color: #047857;">${formatCurrency(mainLoan.totalPaid)}</div>
            </div>
            <div style="background: #f8fafc; padding: 8px; border-radius: 4px; border: 1px solid #e2e8f0;">
              <span style="color: #64748b; font-size: 10px;">প্রতি কিস্তি</span>
              <div style="font-weight: 700; font-size: 12px; color: #0284c7;">${formatCurrency(mainLoan.installmentAmount)}</div>
            </div>
            <div style="background: #f8fafc; padding: 8px; border-radius: 4px; border: 1px solid #e2e8f0;">
              <span style="color: #64748b; font-size: 10px;">পরিশোধিত কিস্তি</span>
              <div style="font-weight: 700; font-size: 12px; color: #7c3aed;">${mainLoan.paidInstallments} / ${mainLoan.totalInstallments} টি</div>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px;">
            <thead>
              <tr style="background: #c2410c; color: white;">
                <th style="padding: 6px 8px; border: 1px solid #c2410c;">তারিখ</th>
                <th style="padding: 6px 8px; border: 1px solid #c2410c;">ভাউচার নং</th>
                <th style="padding: 6px 8px; border: 1px solid #c2410c;">বিবরণ</th>
                <th style="padding: 6px 8px; border: 1px solid #c2410c; text-align: right;">জমা/কিস্তি (টাকা)</th>
                <th style="padding: 6px 8px; border: 1px solid #c2410c; text-align: right;">অবশিষ্ট বকেয়া</th>
                <th style="padding: 6px 8px; border: 1px solid #c2410c;">সংগ্রহকারী</th>
              </tr>
            </thead>
            <tbody>
              ${loanTxns.length === 0 ? `
                <tr><td colspan="6" style="padding: 12px; text-align: center; color: #64748b;">কোন ঋণ পরিশোধের তথ্য পাওয়া যায়নি</td></tr>
              ` : loanTxns.map(t => `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 6px 8px; text-align: center;">${formatDate(t.date)}</td>
                  <td style="padding: 6px 8px; text-align: center; font-weight: 600;">${t.voucherNo}</td>
                  <td style="padding: 6px 8px;">${t.remarks || 'ঋণ কিস্তি পরিশোধ'}</td>
                  <td style="padding: 6px 8px; text-align: right; font-weight: 700; color: #047857;">${formatCurrency(t.amount)}</td>
                  <td style="padding: 6px 8px; text-align: right; font-weight: 800; color: #dc2626;">${formatCurrency(t.balanceAfter)}</td>
                  <td style="padding: 6px 8px;">${t.collectorName}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      break;
    }

    case 'dps_passbook': {
      const mainDps = memberDps[0] || { dpsNo: 'N/A', monthlyInstallment: 0, termYears: 3, totalPaidAmount: 0, expectedMaturityAmount: 0, paidInstallmentsCount: 0, totalInstallmentsCount: 36, status: 'running' };
      const dpsTxns = memberTxns.filter(t => t.accountType === 'dps');

      bodyContent = `
        <div style="position: relative; z-index: 1;">
          <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 10px 14px; border-radius: 6px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h2 style="margin: 0; font-size: 15px; font-weight: 700; color: #0369a1;">ডিপিএস পাশবই (DPS Deposit Passbook)</h2>
              <p style="margin: 2px 0 0 0; font-size: 11px; color: #0284c7;">সদস্য: ${member.nameBn} (${member.id}) | ডিপিএস নং: ${mainDps.dpsNo} | মেয়াদ: ${mainDps.termYears} বছর</p>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 10px; color: #64748b;">মোট জমাকৃত ডিপিএস তহবীল</span>
              <div style="font-size: 16px; font-weight: 800; color: #0284c7;">${formatCurrency(mainDps.totalPaidAmount)}</div>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px;">
            <thead>
              <tr style="background: #0284c7; color: white;">
                <th style="padding: 6px 8px; border: 1px solid #0284c7;">তারিখ</th>
                <th style="padding: 6px 8px; border: 1px solid #0284c7;">ভাউচার নং</th>
                <th style="padding: 6px 8px; border: 1px solid #0284c7;">মাসিক কিস্তি</th>
                <th style="padding: 6px 8px; border: 1px solid #0284c7; text-align: right;">জমাকৃত পরিমাণ</th>
                <th style="padding: 6px 8px; border: 1px solid #0284c7; text-align: right;">সর্বমোট স্থিতি</th>
                <th style="padding: 6px 8px; border: 1px solid #0284c7;">সংগ্রহকারী</th>
              </tr>
            </thead>
            <tbody>
              ${dpsTxns.length === 0 ? `
                <tr><td colspan="6" style="padding: 12px; text-align: center; color: #64748b;">কোন ডিপিএস কিস্তির তথ্য পাওয়া যায়নি</td></tr>
              ` : dpsTxns.map(t => `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 6px 8px; text-align: center;">${formatDate(t.date)}</td>
                  <td style="padding: 6px 8px; text-align: center; font-weight: 600;">${t.voucherNo}</td>
                  <td style="padding: 6px 8px;">${t.remarks || 'ডিপিএস কিস্তি'}</td>
                  <td style="padding: 6px 8px; text-align: right; font-weight: 700; color: #047857;">${formatCurrency(t.amount)}</td>
                  <td style="padding: 6px 8px; text-align: right; font-weight: 800; color: #0284c7;">${formatCurrency(t.balanceAfter)}</td>
                  <td style="padding: 6px 8px;">${t.collectorName}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      break;
    }

    case 'receipts': {
      const latestTxn = memberTxns[0] || { voucherNo: 'V-2026-9901', date: new Date().toISOString(), type: 'deposit', amount: 1000, balanceAfter: 15000, collectorName: 'ক্যাশিয়ার' };
      
      bodyContent = `
        <div style="position: relative; z-index: 1;">
          <h2 style="font-size: 16px; font-weight: 800; color: #0f766e; text-align: center; margin-bottom: 16px;">অফিসিয়াল টাকা জমার আদায় রসিদ (Payment Receipt)</h2>
          
          <!-- Office & Member Receipt side by side or stacked -->
          <div style="border: 2px dashed #0d9488; padding: 14px; border-radius: 8px; background: #fafafa; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 10px;">
              <span style="font-weight: 700; color: #047857;">ভাউচার নং: ${latestTxn.voucherNo}</span>
              <span style="font-size: 11px; color: #64748b;">তারিখ: ${formatDate(latestTxn.date)}</span>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <tr>
                <td style="padding: 4px; font-weight: 600; width: 30%;">সদস্যের নাম:</td>
                <td style="padding: 4px; font-weight: 800;">${member.nameBn} (${member.id})</td>
              </tr>
              <tr>
                <td style="padding: 4px; font-weight: 600;">মোবাইল নম্বর:</td>
                <td style="padding: 4px;">${member.mobile}</td>
              </tr>
              <tr>
                <td style="padding: 4px; font-weight: 600;">লেনদেনের ধরন:</td>
                <td style="padding: 4px; font-weight: 700; color: #0d9488;">${latestTxn.type}</td>
              </tr>
              <tr>
                <td style="padding: 4px; font-weight: 600;">জমাকৃত পরিমাণ:</td>
                <td style="padding: 4px; font-weight: 800; font-size: 16px; color: #047857;">${formatCurrency(latestTxn.amount)}</td>
              </tr>
              <tr>
                <td style="padding: 4px; font-weight: 600;">বর্তমান মোট স্থিতি:</td>
                <td style="padding: 4px; font-weight: 700;">${formatCurrency(latestTxn.balanceAfter)}</td>
              </tr>
              <tr>
                <td style="padding: 4px; font-weight: 600;">সংগ্রহকারী কর্মকর্তা:</td>
                <td style="padding: 4px;">${latestTxn.collectorName}</td>
              </tr>
            </table>
          </div>
        </div>
      `;
      break;
    }

    case 'id_card': {
      bodyContent = `
        <div style="position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; padding: 20px 0;">
          <h2 style="font-size: 16px; font-weight: 800; color: #047857; margin-bottom: 10px;">ডিজিটাল সদস্য স্মার্ট কার্ড (Member ID Card)</h2>
          
          <!-- Front ID Card -->
          <div style="width: 360px; height: 220px; background: linear-gradient(135deg, #064e3b 0%, #0d9488 100%); border-radius: 12px; padding: 14px; color: white; box-shadow: 0 10px 25px rgba(0,0,0,0.2); position: relative; box-sizing: border-box;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.25); padding-bottom: 6px;">
              <span style="font-size: 11px; font-weight: 800; letter-spacing: 0.5px;">${SOCIETY_INFO.nameBn}</span>
              <span style="font-size: 8px; background: #fbbf24; color: #78350f; padding: 1px 5px; border-radius: 3px; font-weight: 800;">মেম্বার কার্ড</span>
            </div>

            <div style="display: flex; gap: 12px; margin-top: 10px; align-items: center;">
              <img src="${member.photoUrl}" style="width: 70px; height: 82px; border-radius: 6px; border: 2px solid white; object-fit: cover;" />
              <div style="font-size: 11px; line-height: 1.4;">
                <div style="font-size: 14px; font-weight: 800; color: #fef08a;">${member.nameBn}</div>
                <div style="font-size: 10px; opacity: 0.9;">${member.nameEn}</div>
                <div style="margin-top: 4px; font-size: 10px;"><strong>আইডি:</strong> ${member.id}</div>
                <div style="font-size: 10px;"><strong>মোবাইল:</strong> ${member.mobile}</div>
                <div style="font-size: 10px;"><strong>রক্তের গ্রুপ:</strong> <span style="color: #fca5a5; font-weight: 800;">${member.bloodGroup}</span></div>
              </div>
            </div>

            <div style="position: absolute; bottom: 10px; right: 14px; left: 14px; display: flex; justify-content: space-between; align-items: flex-end;">
              ${barcodeUrl ? `<img src="${barcodeUrl}" style="height: 30px; background: white; padding: 2px; border-radius: 4px;" />` : ''}
              <span style="font-size: 8px; opacity: 0.8;">যোগদান: ${formatDate(member.joiningDate)}</span>
            </div>
          </div>
        </div>
      `;
      break;
    }

    case 'certificate': {
      bodyContent = `
        <div style="position: relative; z-index: 1; border: 8px double #0d9488; padding: 24px; border-radius: 12px; background: #fffdfa; text-align: center; margin-top: 10px;">
          <div style="font-size: 12px; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px;">
            ${SOCIETY_INFO.nameBn}
          </div>
          <p style="font-size: 10px; color: #64748b; margin: 0 0 16px 0;">${SOCIETY_INFO.regNoBn ? `${SOCIETY_INFO.regNoBn} | ` : 'প্রাইভেট সমবায় সমিতি | '}স্থাপিত: ২০১৬ ইং</p>

          <h1 style="font-size: 26px; font-weight: 900; color: #064e3b; margin: 10px 0; font-family: 'Hind Siliguri', serif; border-bottom: 2px dashed #0d9488; display: inline-block; padding-bottom: 6px;">
            সদস্যপদ সনদপত্র (Membership Certificate)
          </h1>

          <p style="font-size: 13px; color: #334155; line-height: 1.8; margin: 20px 20px;">
            এতদ্বারা সগৌরবে প্রত্যয়ন করা যাচ্ছে যে, জনাব/বেগম <strong style="color: #0d9488; font-size: 16px;">${member.nameBn}</strong>, পিতা/স্বামী: ${member.fatherHusbandBn}, মাতা: ${member.motherNameBn}, ঠিকানা: ${member.presentAddressBn}, অত্র <strong>${SOCIETY_INFO.nameBn}</strong>-এর একজন সম্মানিত নিয়মিত ও সক্রিয় সদস্য। তাহার সদস্য নম্বর: <strong style="color: #0d9488; font-size: 15px;">${member.id}</strong>।
          </p>

          <p style="font-size: 12px; color: #475569; margin-bottom: 30px;">
            তিনি সমিতির সকল নিয়ম-কানুন যথাযথভাবে অনুসরণ করিয়া নিয়মিত সঞ্চয় ও লেনদেন পরিচালনা করিয়া আসিতেছেন। আমরা তাহার উত্তরোত্তর সার্বিক কল্যাণ ও সমৃদ্ধি কামনা করি।
          </p>
        </div>
      `;
      break;
    }
  }

  container.innerHTML = `
    ${watermarkHtml}
    ${headerHtml}
    ${bodyContent}
    ${signatureHtml}
    ${pageFooterHtml}
  `;

  document.body.appendChild(container);
  return container;
}

/**
 * Converts off-screen document element into high-dpi PDF Blob using jsPDF + html2canvas
 */
export async function renderDocumentToPdfBlob(
  container: HTMLElement,
  options: PdfExportOptions
): Promise<Blob> {
  try {
    const canvas = await html2canvas(container, {
      scale: 2, // High resolution crisp text
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: options.pageSize === 'a5' ? 'a5' : 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    
    // Clean up temporary DOM element
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }

    return pdf.output('blob');
  } catch (err) {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
    throw err;
  }
}
