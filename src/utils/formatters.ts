import { Language } from '../types';
import QRCode from 'qrcode';

// Bangla numeral mapping
const bnDigits: { [key: string]: string } = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯'
};

export const toBanglaDigits = (str: string | number): string => {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[0-9]/g, (w) => bnDigits[w] || w);
};

export const formatCurrency = (amount: number, lang: Language = 'bn'): string => {
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(amount);

  if (lang === 'bn') {
    return `৳ ${toBanglaDigits(formattedNumber)}`;
  }
  return `৳ ${formattedNumber}`;
};

export const formatDate = (dateStr: string, lang: Language = 'bn'): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  const formatted = d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  if (lang === 'bn') {
    return toBanglaDigits(formatted);
  }
  return formatted;
};

// Generate QR Code data URL asynchronously
export const generateQRCodeDataUrl = async (text: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(text, {
      margin: 1,
      width: 150,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('QR code generation error', err);
    return '';
  }
};

// Simple SVG barcode generator helper as Data URI
export const generateBarcodeSvg = (text: string): string => {
  // Generate a mock clean barcode SVG data URI
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50" viewBox="0 0 200 50">
    <rect width="100%" height="100%" fill="#ffffff"/>
    <g fill="#0f172a">
      <rect x="10" y="5" width="4" height="32"/>
      <rect x="16" y="5" width="2" height="32"/>
      <rect x="20" y="5" width="6" height="32"/>
      <rect x="28" y="5" width="2" height="32"/>
      <rect x="34" y="5" width="4" height="32"/>
      <rect x="40" y="5" width="6" height="32"/>
      <rect x="48" y="5" width="2" height="32"/>
      <rect x="54" y="5" width="4" height="32"/>
      <rect x="60" y="5" width="2" height="32"/>
      <rect x="66" y="5" width="6" height="32"/>
      <rect x="74" y="5" width="4" height="32"/>
      <rect x="80" y="5" width="2" height="32"/>
      <rect x="86" y="5" width="6" height="32"/>
      <rect x="94" y="5" width="2" height="32"/>
      <rect x="100" y="5" width="4" height="32"/>
      <rect x="106" y="5" width="6" height="32"/>
      <rect x="114" y="5" width="2" height="32"/>
      <rect x="120" y="5" width="4" height="32"/>
      <rect x="128" y="5" width="6" height="32"/>
      <rect x="136" y="5" width="2" height="32"/>
      <rect x="142" y="5" width="4" height="32"/>
      <rect x="148" y="5" width="2" height="32"/>
      <rect x="154" y="5" width="6" height="32"/>
      <rect x="162" y="5" width="2" height="32"/>
      <rect x="168" y="5" width="4" height="32"/>
      <rect x="176" y="5" width="4" height="32"/>
      <rect x="182" y="5" width="2" height="32"/>
    </g>
    <text x="100" y="46" font-family="monospace" font-size="10" text-anchor="middle" fill="#334155">${text}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
