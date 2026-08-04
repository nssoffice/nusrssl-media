import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/formatters';
import { Calculator, TrendingUp, DollarSign, PieChart, RefreshCw } from 'lucide-react';

export const CalculatorsPage: React.FC = () => {
  const { language } = useApp();
  const isBn = language === 'bn';

  const [calcType, setCalcType] = useState<'loan' | 'savings' | 'dps'>('loan');

  // Loan State
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [loanRate, setLoanRate] = useState<number>(10);
  const [loanMonths, setLoanMonths] = useState<number>(12);

  // DPS State
  const [dpsMonthly, setDpsMonthly] = useState<number>(2000);
  const [dpsYears, setDpsYears] = useState<number>(5);
  const [dpsRate, setDpsRate] = useState<number>(10);

  // Savings State
  const [savingsMonthly, setSavingsMonthly] = useState<number>(1000);
  const [savingsYears, setSavingsYears] = useState<number>(3);
  const [savingsRate, setSavingsRate] = useState<number>(7.5);

  // Loan EMI Calculations (Reducing balance formula)
  const monthlyRate = loanRate / 12 / 100;
  const emi = monthlyRate > 0
    ? Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanMonths)) / (Math.pow(1 + monthlyRate, loanMonths) - 1))
    : Math.round(loanAmount / loanMonths);

  const totalPayableLoan = emi * loanMonths;
  const totalInterestLoan = totalPayableLoan - loanAmount;

  // DPS Calculations
  const totalDpsDeposit = dpsMonthly * 12 * dpsYears;
  const estimatedDpsMaturity = Math.round(totalDpsDeposit * (1 + (dpsRate / 100) * (dpsYears / 2)));
  const dpsProfit = estimatedDpsMaturity - totalDpsDeposit;

  // Savings Projections
  const totalSavingsDeposit = savingsMonthly * 12 * savingsYears;
  const estimatedSavingsReturn = Math.round(totalSavingsDeposit * Math.pow(1 + (savingsRate / 100), savingsYears));
  const savingsProfit = estimatedSavingsReturn - totalSavingsDeposit;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          {isBn ? 'ফাইন্যান্সিয়াল টুলস' : 'Financial Planning Calculators'}
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {isBn ? 'ঋণ, সঞ্চয় ও ইএমআই ক্যালকুলেটর' : 'Loan, Savings & EMI Calculator'}
        </h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          {isBn ? 'আপনার প্রয়োজনীয় কিস্তি ও সাম্ভাব্য মুনাফা হিসাব করুন এক ক্লিকেই।' : 'Accurately estimate loan installments and expected DPS maturity returns.'}
        </p>
      </div>

      {/* Calculator Type Switcher */}
      <div className="flex justify-center border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-4">
          <button
            onClick={() => setCalcType('loan')}
            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              calcType === 'loan'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span>{isBn ? 'ঋণ ইএমআই ক্যালকুলেটর' : 'Loan EMI Calculator'}</span>
          </button>

          <button
            onClick={() => setCalcType('dps')}
            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              calcType === 'dps'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>{isBn ? 'ডিপিএস মুনাফা ক্যালকুলেটর' : 'DPS Profit Calculator'}</span>
          </button>

          <button
            onClick={() => setCalcType('savings')}
            className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              calcType === 'savings'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span>{isBn ? 'সাধারণ সঞ্চয় হিসাব' : 'Savings Projection'}</span>
          </button>
        </div>
      </div>

      {/* CALCULATOR 1: LOAN EMI */}
      {calcType === 'loan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white border-b pb-2">
              {isBn ? 'ঋণের তথ্য দিন' : 'Enter Loan Parameters'}
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isBn ? `ঋণ পরিমাণ (টাকা): ${formatCurrency(loanAmount, language)}` : `Loan Amount: ${formatCurrency(loanAmount, language)}`}
              </label>
              <input 
                type="range" 
                min={10000} 
                max={1000000} 
                step={5000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isBn ? `বার্ষিক সুদের হার (%): ${loanRate}%` : `Annual Interest Rate: ${loanRate}%`}
              </label>
              <input 
                type="range" 
                min={5} 
                max={18} 
                step={0.5}
                value={loanRate}
                onChange={(e) => setLoanRate(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isBn ? `ঋণের সময়কাল (মাস): ${loanMonths} মাস` : `Loan Duration: ${loanMonths} Months`}
              </label>
              <input 
                type="range" 
                min={3} 
                max={36} 
                step={3}
                value={loanMonths}
                onChange={(e) => setLoanMonths(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>

          {/* Result Summary */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl flex flex-col justify-between space-y-4 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wider">
              {isBn ? 'ইএমআই হিসাব বিবরণী' : 'EMI Calculation Summary'}
            </h4>

            <div className="space-y-4">
              <div className="bg-emerald-600 text-white p-4 rounded-xl text-center shadow">
                <span className="text-xs opacity-90 block">{isBn ? 'মাসিক কিস্তি (Monthly EMI)' : 'Monthly Installment (EMI)'}</span>
                <span className="text-2xl font-black font-mono">{formatCurrency(emi, language)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
                  <span className="text-slate-500 block">{isBn ? 'মূল ঋণ:' : 'Principal:'}</span>
                  <strong className="font-mono text-slate-800 dark:text-slate-100">{formatCurrency(loanAmount, language)}</strong>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
                  <span className="text-slate-500 block">{isBn ? 'মোট সুদ:' : 'Total Interest:'}</span>
                  <strong className="font-mono text-amber-600 dark:text-amber-400">{formatCurrency(totalInterestLoan, language)}</strong>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border text-xs flex justify-between items-center">
                <span className="text-slate-500">{isBn ? 'সর্বমোট পরিশোধ:' : 'Total Payable:'}</span>
                <strong className="font-mono text-base text-emerald-700 dark:text-emerald-400">{formatCurrency(totalPayableLoan, language)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR 2: DPS */}
      {calcType === 'dps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white border-b pb-2">
              {isBn ? 'ডিপিএস ডিপোজিট তথ্য' : 'DPS Parameters'}
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isBn ? `মাসিক কিস্তি: ${formatCurrency(dpsMonthly, language)}` : `Monthly Installment: ${formatCurrency(dpsMonthly, language)}`}
              </label>
              <input 
                type="range" 
                min={500} 
                max={20000} 
                step={500}
                value={dpsMonthly}
                onChange={(e) => setDpsMonthly(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isBn ? `ডিপিএস মেয়াদ: ${dpsYears} বছর` : `DPS Term: ${dpsYears} Years`}
              </label>
              <input 
                type="range" 
                min={1} 
                max={10} 
                step={1}
                value={dpsYears}
                onChange={(e) => setDpsYears(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl flex flex-col justify-between space-y-4 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wider">
              {isBn ? 'ডিপিএস মেয়াদের সাম্ভাব্য রিটার্ন' : 'Maturity Return Forecast'}
            </h4>

            <div className="space-y-4">
              <div className="bg-emerald-600 text-white p-4 rounded-xl text-center shadow">
                <span className="text-xs opacity-90 block">{isBn ? 'মেয়াদের আনুমানিক প্রাপ্তি' : 'Estimated Return at Maturity'}</span>
                <span className="text-2xl font-black font-mono">{formatCurrency(estimatedDpsMaturity, language)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
                  <span className="text-slate-500 block">{isBn ? 'আপনার মোট জমা:' : 'Total Deposit:'}</span>
                  <strong className="font-mono text-slate-800 dark:text-slate-100">{formatCurrency(totalDpsDeposit, language)}</strong>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
                  <span className="text-slate-500 block">{isBn ? 'লাভ/মুনাফা:' : 'Total Profit:'}</span>
                  <strong className="font-mono text-emerald-600 font-bold">{formatCurrency(dpsProfit, language)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR 3: SAVINGS */}
      {calcType === 'savings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white border-b pb-2">
              {isBn ? 'সঞ্চয় জমার পরিমাণ' : 'Savings Parameters'}
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isBn ? `মাসিক জমা: ${formatCurrency(savingsMonthly, language)}` : `Monthly Amount: ${formatCurrency(savingsMonthly, language)}`}
              </label>
              <input 
                type="range" 
                min={200} 
                max={10000} 
                step={200}
                value={savingsMonthly}
                onChange={(e) => setSavingsMonthly(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isBn ? `সময়কাল: ${savingsYears} বছর` : `Period: ${savingsYears} Years`}
              </label>
              <input 
                type="range" 
                min={1} 
                max={5} 
                step={1}
                value={savingsYears}
                onChange={(e) => setSavingsYears(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl flex flex-col justify-between space-y-4 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wider">
              {isBn ? 'সঞ্চয় মুনাফা স্থিতি' : 'Savings Compound Projection'}
            </h4>

            <div className="space-y-4">
              <div className="bg-emerald-600 text-white p-4 rounded-xl text-center shadow">
                <span className="text-xs opacity-90 block">{isBn ? 'মেয়াদ শেষে মোট সঞ্চয়' : 'Total Future Value'}</span>
                <span className="text-2xl font-black font-mono">{formatCurrency(estimatedSavingsReturn, language)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
                  <span className="text-slate-500 block">{isBn ? 'জমাকৃত আসল:' : 'Total Principal:'}</span>
                  <strong className="font-mono">{formatCurrency(totalSavingsDeposit, language)}</strong>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
                  <span className="text-slate-500 block">{isBn ? 'মুনাফা যোগ:' : 'Profit Earned:'}</span>
                  <strong className="font-mono text-emerald-600 font-bold">{formatCurrency(savingsProfit, language)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
