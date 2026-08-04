import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Member } from '../types';
import { 
  DOCUMENT_TYPE_LABELS, 
  DocumentType, 
  PdfExportOptions, 
  generateMemberDocumentHtml, 
  renderDocumentToPdfBlob 
} from '../utils/pdfGenerator';
import { 
  REPORT_TYPE_LABELS, 
  ReportType, 
  exportReportToCSV, 
  exportReportToExcel, 
  exportReportToPDF, 
  generateReportDataRows 
} from '../utils/reportExporter';
import { formatCurrency, formatDate } from '../utils/formatters';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { 
  FileText, 
  Download, 
  CheckSquare, 
  Square, 
  Users, 
  UserCheck, 
  Search, 
  Settings, 
  FileArchive, 
  Sparkles, 
  Printer, 
  Clock, 
  BarChart3, 
  FileSpreadsheet, 
  FileCode, 
  X, 
  Loader2, 
  AlertCircle,
  Filter,
  CheckCircle2,
  Building2,
  ShieldCheck,
  CreditCard,
  BookOpen,
  Calendar
} from 'lucide-react';

export const BulkExportPage: React.FC = () => {
  const { 
    language, 
    members, 
    savingsAccounts, 
    loanAccounts, 
    dpsAccounts, 
    transactions, 
    cashBookEntries,
    showToast 
  } = useApp();

  const isBn = language === 'bn';

  // Active module tab
  const [activeTab, setActiveTab] = useState<'bulk_members' | 'reports'>('bulk_members');

  // Member Selection State
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple' | 'all'>('multiple');
  const [singleMemberId, setSingleMemberId] = useState<string>(members[0]?.id || '');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(members.map(m => m.id));
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Documents Checklist State
  const [selectedDocs, setSelectedDocs] = useState<Record<DocumentType, boolean>>({
    profile: true,
    savings_passbook: true,
    loan_passbook: true,
    dps_passbook: true,
    loan_statement: false,
    savings_statement: false,
    receipts: false,
    id_card: true,
    certificate: false
  });

  // Export Settings
  const [pdfOptions, setPdfOptions] = useState<PdfExportOptions>({
    pageSize: 'a4',
    includeWatermark: true,
    includeQrCode: true,
    includeBarcode: true,
    includeSignatures: true
  });
  const [exportAsZip, setExportAsZip] = useState(true);

  // Generation Progress Modal State
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [cancelRequested, setCancelRequested] = useState(false);

  // Financial Report State
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('daily_collection');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filtered member list for search
  const filteredMembers = members.filter(m => 
    m.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.mobile.includes(searchQuery)
  );

  // Toggle single document checkbox
  const toggleDoc = (docType: DocumentType) => {
    setSelectedDocs(prev => ({ ...prev, [docType]: !prev[docType] }));
  };

  // Select / Deselect all documents
  const selectAllDocs = (select: boolean) => {
    const updated: Record<DocumentType, boolean> = { ...selectedDocs };
    (Object.keys(updated) as DocumentType[]).forEach(key => {
      updated[key] = select;
    });
    setSelectedDocs(updated);
  };

  // Member selection handlers
  const handleSelectAllMembers = () => {
    setSelectedMemberIds(members.map(m => m.id));
  };

  const handleClearAllMembers = () => {
    setSelectedMemberIds([]);
  };

  const toggleMemberSelection = (id: string) => {
    setSelectedMemberIds(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  // Get effective members for export
  const getTargetMembers = (): Member[] => {
    if (selectionMode === 'single') {
      const found = members.find(m => m.id === singleMemberId);
      return found ? [found] : [];
    }
    if (selectionMode === 'all') {
      return members;
    }
    return members.filter(m => selectedMemberIds.includes(m.id));
  };

  // Main Bulk PDF Generation Logic
  const handleStartBulkExport = async () => {
    const targetMembers = getTargetMembers();
    const activeDocTypes = (Object.keys(selectedDocs) as DocumentType[]).filter(k => selectedDocs[k]);

    if (targetMembers.length === 0) {
      showToast(isBn ? 'অনুগ্রহ করে অন্তত একজন সদস্য নির্বাচন করুন' : 'Please select at least one member', 'error');
      return;
    }

    if (activeDocTypes.length === 0) {
      showToast(isBn ? 'অনুগ্রহ করে অন্তত একটি ডকুমেন্ট অপশন নির্বাচন করুন' : 'Please select at least one document type', 'error');
      return;
    }

    setIsGenerating(true);
    setProgressPercent(0);
    setCancelRequested(false);
    setStatusText(isBn ? 'পিডিএফ জেনারেটর প্রস্তুত করা হচ্ছে...' : 'Initializing PDF engine...');

    try {
      const zip = new JSZip();
      const totalSteps = targetMembers.length * activeDocTypes.length;
      let completedSteps = 0;

      for (let i = 0; i < targetMembers.length; i++) {
        if (cancelRequested) break;
        const member = targetMembers[i];
        
        // Member sub-folder inside ZIP or separate files
        const memberFolder = zip.folder(`${member.id}_${member.nameEn.replace(/[^a-zA-Z0-9]/g, '_')}`);

        for (let j = 0; j < activeDocTypes.length; j++) {
          if (cancelRequested) break;
          const docType = activeDocTypes[j];

          setStatusText(
            isBn 
              ? `জেনারেট হচ্ছে (${i + 1}/${targetMembers.length}): ${member.nameBn} - ${DOCUMENT_TYPE_LABELS[docType].bn}...` 
              : `Generating (${i + 1}/${targetMembers.length}): ${member.id} - ${DOCUMENT_TYPE_LABELS[docType].en}...`
          );

          // 1. Generate HTML element offscreen
          const container = await generateMemberDocumentHtml(
            docType,
            member,
            savingsAccounts,
            loanAccounts,
            dpsAccounts,
            transactions,
            pdfOptions
          );

          // 2. Render HTML to high-DPI PDF Blob
          const pdfBlob = await renderDocumentToPdfBlob(container, pdfOptions);

          // 3. Add to ZIP or trigger instant download
          const fileName = `${member.id}_${docType}_${optionsLabel(pdfOptions.pageSize)}.pdf`;

          if (exportAsZip && memberFolder) {
            memberFolder.file(fileName, pdfBlob);
          } else {
            saveAs(pdfBlob, fileName);
          }

          completedSteps++;
          setProgressPercent(Math.round((completedSteps / totalSteps) * 100));

          // Give browser small event loop breather
          await new Promise(res => setTimeout(res, 50));
        }
      }

      if (exportAsZip && !cancelRequested) {
        setStatusText(isBn ? 'জিফ (ZIP) ফাইল প্রস্তুত করা হচ্ছে...' : 'Bundling into ZIP package...');
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const zipName = `NUSRSSL_Member_PDFs_${new Date().toISOString().split('T')[0]}.zip`;
        saveAs(zipBlob, zipName);
      }

      if (!cancelRequested) {
        setStatusText(isBn ? 'ডাউনলোড সম্পূর্ণ হয়েছে!' : 'Export finished successfully!');
        showToast(isBn ? 'বাল্ক পিডিএফ সফলভাবে তৈরি ও ডাউনলোড হয়েছে' : 'Bulk PDF export complete!', 'success');
      } else {
        showToast(isBn ? 'রপ্তানি প্রক্রিয়া বাতিল করা হয়েছে' : 'Export cancelled', 'info');
      }
    } catch (err) {
      console.error('Bulk PDF Export Error:', err);
      showToast(isBn ? 'পিডিএফ তৈরিতে একটি সমস্যা হয়েছে' : 'Failed to generate PDF export', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const optionsLabel = (size: string) => size.toUpperCase();

  // Generated financial report preview data
  const currentReportData = generateReportDataRows(
    selectedReportType,
    members,
    savingsAccounts,
    loanAccounts,
    dpsAccounts,
    transactions,
    cashBookEntries,
    startDate,
    endDate
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-600/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-emerald-400/30">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isBn ? 'বাল্ক পিডিএফ এবং অফিসিয়াল রিপোর্ট মডিউল' : 'Bulk PDF & Report Center'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isBn ? 'সমিতি বাল্ক এক্সপোর্ট ও অটো-রিপোর্ট' : 'Bulk PDF & Automated Report Hub'}
            </h1>
            <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
              {isBn 
                ? 'একক বা একাধিক সদস্যের প্রোফাইল, পাশবই, স্টেটমেন্ট, স্মার্ট আইডি কার্ড ও সনদপত্র এক ক্লিকে আলাদা পিডিএফ বা জিপ (ZIP) প্যাকেজে রপ্তানি করুন। সাথে পান সম্পূর্ণ প্রিন্ট-রেডি প্রতিবেদন।'
                : 'Generate and batch-export Member Profiles, Passbooks, Statements, Smart ID Cards, and Financial Reports into individual PDFs or a combined ZIP archive.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('bulk_members')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                activeTab === 'bulk_members'
                  ? 'bg-white text-emerald-900 shadow-lg'
                  : 'bg-emerald-950/40 text-emerald-100 hover:bg-emerald-900/60 border border-emerald-600/40'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isBn ? 'সদস্য বাল্ক এক্সপোর্ট' : 'Bulk Members PDF'}</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                activeTab === 'reports'
                  ? 'bg-white text-emerald-900 shadow-lg'
                  : 'bg-emerald-950/40 text-emerald-100 hover:bg-emerald-900/60 border border-emerald-600/40'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{isBn ? 'আর্থিক রিপোর্ট সেন্টার' : 'Financial Reports'}</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'bulk_members' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Member Selection & Config (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Member Selection */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    ১
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                      {isBn ? 'সদস্য নির্বাচন করুন (Target Members)' : 'Select Target Members'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {isBn ? 'একজন, নির্দিষ্ট একাধিক বা সমস্ত সদস্য নির্বাচন করুন' : 'Select one member, multiple selected, or all members'}
                    </p>
                  </div>
                </div>

                {/* Selection Mode Selector Pills */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setSelectionMode('single')}
                    className={`px-3 py-1.5 rounded-md transition ${selectionMode === 'single' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    {isBn ? 'একক সদস্য' : 'One Member'}
                  </button>
                  <button
                    onClick={() => setSelectionMode('multiple')}
                    className={`px-3 py-1.5 rounded-md transition ${selectionMode === 'multiple' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    {isBn ? 'একাধিক সদস্য' : 'Multiple'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectionMode('all');
                      handleSelectAllMembers();
                    }}
                    className={`px-3 py-1.5 rounded-md transition ${selectionMode === 'all' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    {isBn ? 'সকল সদস্য' : 'All Members'}
                  </button>
                </div>
              </div>

              {/* Selection Content depending on mode */}
              {selectionMode === 'single' ? (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isBn ? 'সদস্য বেছে নিন:' : 'Select Member:'}
                  </label>
                  <select
                    value={singleMemberId}
                    onChange={(e) => setSingleMemberId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.id} - {m.nameBn} ({m.mobile})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Search Bar & Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder={isBn ? 'সদস্যের নাম, আইডি বা মোবাইল দিয়ে খুঁজুন...' : 'Search by name, ID or mobile...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAllMembers}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5"
                      >
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isBn ? 'সবাইকে সিলেক্ট' : 'Select All'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleClearAllMembers}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5"
                      >
                        <Square className="w-3.5 h-3.5 text-slate-400" />
                        <span>{isBn ? 'ফাঁকা করুন' : 'Clear All'}</span>
                      </button>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                        {selectedMemberIds.length} / {members.length}
                      </span>
                    </div>
                  </div>

                  {/* Members Grid with Checkboxes */}
                  <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredMembers.map(m => {
                      const isSelected = selectedMemberIds.includes(m.id);
                      return (
                        <div
                          key={m.id}
                          onClick={() => toggleMemberSelection(m.id)}
                          className={`flex items-center justify-between p-3 cursor-pointer transition ${
                            isSelected 
                              ? 'bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100' 
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // Handled by div click
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <img src={m.photoUrl} alt={m.nameBn} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                            <div>
                              <div className="font-bold text-xs">{m.nameBn} <span className="text-slate-400 font-normal">({m.id})</span></div>
                              <div className="text-[11px] text-slate-500">{m.mobile} | শেয়ার: {m.shareCount} টি</div>
                            </div>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${m.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-amber-100 text-amber-700'}`}>
                            {m.status === 'active' ? 'সক্রিয়' : 'পেন্ডিং'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Documents Options Checklist */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                    ২
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                      {isBn ? 'রপ্তানিযোগ্য ডকুমেন্টস (Export Documents Checklist)' : 'Export Documents Checklist'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {isBn ? 'সদস্য প্রতি কোন কোন পিডিএফ তৈরি করা হবে তা নির্বাচন করুন' : 'Check documents to generate for each target member'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => selectAllDocs(true)}
                    className="text-xs font-semibold text-emerald-600 hover:underline"
                  >
                    {isBn ? 'সব সিলেক্ট' : 'Select All'}
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => selectAllDocs(false)}
                    className="text-xs font-semibold text-slate-500 hover:underline"
                  >
                    {isBn ? 'ফাঁকা করুন' : 'Clear All'}
                  </button>
                </div>
              </div>

              {/* Document Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(Object.keys(DOCUMENT_TYPE_LABELS) as DocumentType[]).map(docType => {
                  const isChecked = selectedDocs[docType];
                  return (
                    <div
                      key={docType}
                      onClick={() => toggleDoc(docType)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                        isChecked
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Handled by parent
                        className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="font-bold text-xs">{DOCUMENT_TYPE_LABELS[docType].bn}</div>
                        <div className="text-[10px] text-slate-500">{DOCUMENT_TYPE_LABELS[docType].en}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: PDF Design & Page Layout Config (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card rounded-2xl p-6 space-y-6 border border-slate-200 dark:border-slate-800 sticky top-20">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  ৩
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {isBn ? 'পিডিএফ লেআউট ও ডিজাইন' : 'PDF Design & Format'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {isBn ? 'পেজ সাইজ, লোগো, ওয়াটারমার্ক ও বারকোড অপশন' : 'Page size, logo, watermark, and barcode options'}
                  </p>
                </div>
              </div>

              {/* Page Size Switcher */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isBn ? 'কাগজের সাইজ (Page Size):' : 'Page Size:'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPdfOptions(prev => ({ ...prev, pageSize: 'a4' }))}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition text-center ${
                      pdfOptions.pageSize === 'a4'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    A4 Size (Standard)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfOptions(prev => ({ ...prev, pageSize: 'a5' }))}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition text-center ${
                      pdfOptions.pageSize === 'a5'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    A5 Size (Passbook)
                  </button>
                </div>
              </div>

              {/* Design Elements Toggles */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isBn ? 'ডিজাইন বৈশিষ্ট্যসমূহ:' : 'Design Features:'}
                </label>
                
                <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {isBn ? 'জলছাপ (Watermark)' : 'Watermark Logo'}
                  </span>
                  <input
                    type="checkbox"
                    checked={pdfOptions.includeWatermark}
                    onChange={(e) => setPdfOptions(prev => ({ ...prev, includeWatermark: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {isBn ? 'কিউআর কোড (QR Code)' : 'Dynamic QR Code'}
                  </span>
                  <input
                    type="checkbox"
                    checked={pdfOptions.includeQrCode}
                    onChange={(e) => setPdfOptions(prev => ({ ...prev, includeQrCode: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {isBn ? 'বারকোড (Barcode)' : 'ID Barcode'}
                  </span>
                  <input
                    type="checkbox"
                    checked={pdfOptions.includeBarcode}
                    onChange={(e) => setPdfOptions(prev => ({ ...prev, includeBarcode: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {isBn ? 'অফিসিয়াল স্বাক্ষর ব্লক' : 'Header & Signatures'}
                  </span>
                  <input
                    type="checkbox"
                    checked={pdfOptions.includeSignatures}
                    onChange={(e) => setPdfOptions(prev => ({ ...prev, includeSignatures: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
              </div>

              {/* Export Mode Choice */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isBn ? 'রপ্তানির ধরণ (Export Mode):' : 'Output Package Format:'}
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer bg-emerald-50/50 dark:bg-emerald-950/20">
                    <input
                      type="radio"
                      name="export_format"
                      checked={exportAsZip}
                      onChange={() => setExportAsZip(true)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <FileArchive className="w-4 h-4 text-emerald-600" />
                        <span>{isBn ? 'একটি জিপ (ZIP) ফাইলে সব পিডিএফ' : 'Bundle all in a ZIP file'}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{isBn ? 'সদস্য ভিত্তিক ফোল্ডারে সাজানো জিপ ফাইল' : 'Download one clean .zip package'}</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <input
                      type="radio"
                      name="export_format"
                      checked={!exportAsZip}
                      onChange={() => setExportAsZip(false)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-teal-600" />
                        <span>{isBn ? 'আলাদা আলাদা পিডিএফ ডাউনলোড' : 'Individual PDF downloads'}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{isBn ? 'প্রতিটি ডকুমেন্ট আলাদা ডাউনলোড হবে' : 'Download separate files one by one'}</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Start Export CTA Button */}
              <button
                onClick={handleStartBulkExport}
                disabled={isGenerating}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                <span>
                  {isBn 
                    ? `বাল্ক পিডিএফ জেনারেট করুন (${getTargetMembers().length} জন সদস্য)` 
                    : `Generate Bulk PDFs (${getTargetMembers().length} Members)`}
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Financial & Operational Reports Tab */
        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 border border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
                <span>{isBn ? 'আর্থিক ও পরিচালনা রিপোর্ট সেন্টার' : 'Financial & Operational Report Hub'}</span>
              </h2>
              <p className="text-xs text-slate-500">
                {isBn ? 'দৈনিক, সাপ্তাহিক, মাসিক, বার্ষিক আদায়, সঞ্চয়, ঋণ, ডিপিএস, ক্যাশ বুক ও ব্যালেন্স শিট প্রস্তুত করুন' : 'Generate Daily/Monthly collection, Cash Book, Ledger, and Balance Sheet'}
              </p>
            </div>

            {/* Quick Export Formats Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => exportReportToPDF(selectedReportType, currentReportData)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <FileText className="w-4 h-4" />
                <span>PDF Export</span>
              </button>
              <button
                onClick={() => exportReportToExcel(selectedReportType, currentReportData)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Excel (.xlsx)</span>
              </button>
              <button
                onClick={() => exportReportToCSV(selectedReportType, currentReportData)}
                className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <FileCode className="w-4 h-4" />
                <span>CSV Export</span>
              </button>
            </div>
          </div>

          {/* Controls: Select Report Type & Date Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'রিপোর্টের নাম নির্বাচন করুন:' : 'Select Report Type:'}
              </label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value as ReportType)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
              >
                {(Object.keys(REPORT_TYPE_LABELS) as ReportType[]).map(rKey => (
                  <option key={rKey} value={rKey}>
                    {REPORT_TYPE_LABELS[rKey].bn} ({REPORT_TYPE_LABELS[rKey].en})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'শুরুর তারিখ (Start Date):' : 'Start Date:'}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'শেষ তারিখ (End Date):' : 'End Date:'}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>
          </div>

          {/* Report Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{isBn ? 'মোট জমা / আয়' : 'Total Inflow'}</span>
              <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                {formatCurrency(currentReportData.summary.totalIn)}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{isBn ? 'মোট উত্তোলন / ব্যয়' : 'Total Outflow'}</span>
              <div className="text-xl font-bold text-rose-700 dark:text-rose-300 mt-1">
                {formatCurrency(currentReportData.summary.totalOut)}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
              <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">{isBn ? 'মোট রেকর্ড সংখ্যা' : 'Total Entries'}</span>
              <div className="text-xl font-bold text-sky-700 dark:text-sky-300 mt-1">
                {currentReportData.summary.netCount} টি
              </div>
            </div>
          </div>

          {/* Live Preview Data Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>{isBn ? 'রিপোর্ট ডাটা প্রিভিউ' : 'Live Data Preview'}</span>
              <span className="text-xs text-slate-400">{currentReportData.title}</span>
            </h3>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                    {currentReportData.columns.map((col, idx) => (
                      <th key={idx} className="p-3 whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentReportData.rows.length === 0 ? (
                    <tr>
                      <td colSpan={currentReportData.columns.length} className="p-8 text-center text-slate-400">
                        {isBn ? 'কোন রেকর্ড পাওয়া যায়নি' : 'No report data found'}
                      </td>
                    </tr>
                  ) : (
                    currentReportData.rows.map(r => (
                      <tr key={r.sl} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-semibold">{r.sl}</td>
                        <td className="p-3">{r.date}</td>
                        <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{r.refNo}</td>
                        <td className="p-3">{r.memberId}</td>
                        <td className="p-3 font-bold">{r.memberName}</td>
                        <td className="p-3">{r.category}</td>
                        <td className="p-3 text-right font-bold text-emerald-600">{r.inAmount ? formatCurrency(r.inAmount) : '-'}</td>
                        <td className="p-3 text-right font-bold text-rose-600">{r.outAmount ? formatCurrency(r.outAmount) : '-'}</td>
                        <td className="p-3 text-right font-black text-slate-800 dark:text-slate-100">{formatCurrency(r.balance)}</td>
                        <td className="p-3">{r.collector}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Generation Progress Modal */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {isBn ? 'বাল্ক পিডিএফ তৈরি হচ্ছে...' : 'Generating Bulk PDFs...'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{statusText}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {progressPercent}% {isBn ? 'সম্পন্ন' : 'Completed'}
              </div>
            </div>

            <button
              onClick={() => setCancelRequested(true)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
            >
              {isBn ? 'বাতিল করুন' : 'Cancel Generation'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
