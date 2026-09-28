import React from 'react';
import { useGame } from '../../context/GameContext';
import { CircleDollarSign, TrendingUp, TrendingDown, Coins, Shield } from 'lucide-react';

export const FinancesView: React.FC = () => {
  const { state } = useGame();
  const club = state.clubs[state.userClubId];

  const estimatedMonthlyIncome = Math.round((club?.stadiumCapacity || 50000) * (club?.ticketPrice || 60) * 2.2 + 8500000);
  const estimatedMonthlyWages = Math.round((club?.wageBudgetWeekly || 3000000) * 4.3);
  const estimatedMaintenance = 1200000;
  const netSurplus = estimatedMonthlyIncome - (estimatedMonthlyWages + estimatedMaintenance);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
              Treasury & Accounts
            </span>
            <span className="text-xs text-slate-400">Fiscal Health & Revenue Forecast</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Club Financial Ledger</h2>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Overall Balance</span>
          <span className="font-mono font-black text-emerald-400 text-2xl">
            €{((club?.currentBalance || 0) / 1000000).toFixed(1)}M
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Monthly Income
            </h3>
            <span className="font-mono font-black text-white">€{(estimatedMonthlyIncome / 1000000).toFixed(1)}M</span>
          </div>
          <ul className="space-y-2 text-xs divide-y divide-slate-800/60 pt-2">
            <li className="flex justify-between py-1 text-slate-300">
              <span>Matchday Gate Receipts</span>
              <span className="font-mono">€{((club?.stadiumCapacity || 50000) * (club?.ticketPrice || 60) * 2.2 / 1000000).toFixed(1)}M</span>
            </li>
            <li className="flex justify-between py-1 text-slate-300">
              <span>Championship Broadcast Rights</span>
              <span className="font-mono">€5.5M</span>
            </li>
            <li className="flex justify-between py-1 text-slate-300">
              <span>Commercial & Sponsorships</span>
              <span className="font-mono">€3.0M</span>
            </li>
          </ul>
        </div>

        {/* Expenses Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-rose-400 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" /> Monthly Expenses
            </h3>
            <span className="font-mono font-black text-white">
              €{((estimatedMonthlyWages + estimatedMaintenance) / 1000000).toFixed(1)}M
            </span>
          </div>
          <ul className="space-y-2 text-xs divide-y divide-slate-800/60 pt-2">
            <li className="flex justify-between py-1 text-slate-300">
              <span>Player & Staff Wage Bill</span>
              <span className="font-mono">€{(estimatedMonthlyWages / 1000000).toFixed(1)}M</span>
            </li>
            <li className="flex justify-between py-1 text-slate-300">
              <span>Stadium Maintenance</span>
              <span className="font-mono">€0.8M</span>
            </li>
            <li className="flex justify-between py-1 text-slate-300">
              <span>Academy & Travel Costs</span>
              <span className="font-mono">€0.4M</span>
            </li>
          </ul>
        </div>

        {/* Net Monthly Result */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-200">Net Operating Position</h3>
            <p className="text-xs text-slate-400 mt-1">
              Projected monthly net balance change based on current wage expenditures and attendance rates.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              {netSurplus >= 0 ? 'Monthly Surplus' : 'Monthly Deficit'}
            </span>
            <span
              className={`text-2xl font-black font-mono ${
                netSurplus >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {netSurplus >= 0 ? '+' : '-'}€{Math.abs(Math.round(netSurplus / 1000000)).toFixed(1)}M/mo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
