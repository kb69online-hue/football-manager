import React from 'react';
import { useGame } from '../../context/GameContext';
import { formatMoney } from '../../services/currencyService';
import { SupportedCurrency } from '../../types/football';
import {
  Calendar,
  ChevronRight,
  Coins,
  Shield,
  Bot,
  Save,
  PlusCircle,
  Settings,
  Mail,
  Flame,
  Award,
  Globe,
  Search,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    state,
    continueDay,
    isSimulating,
    setIsAiModalOpen,
    setIsSaveLoadModalOpen,
    setIsNewCareerModalOpen,
    setIsAdminModalOpen,
    setActiveTab,
    updateCurrency,
    setIsSearchModalOpen,
  } = useGame();

  const userClub = state.clubs[state.userClubId];
  const unreadInboxCount = state.inbox.filter((item) => !item.read).length;

  const formattedDate = new Date(state.currentDate).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Club Identity */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg shadow-md border border-white/10"
            style={{ backgroundColor: userClub?.primaryColor || '#10B981', color: userClub?.textColor || '#FFF' }}
          >
            {userClub?.shortName || 'CLB'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-wide text-white">{userClub?.name || 'Club'}</span>
              <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                1st Division
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{state.manager.name}</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Reputation {state.manager.reputation}%</span>
            </div>
          </div>
        </div>

        {/* Center: Finances, Calendar Date & Multi-Currency Switcher */}
        <div className="hidden lg:flex items-center gap-4 text-xs">
          {/* Transfer Budget with Multi-Currency */}
          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
            <Coins className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">Transfer Budget</span>
              <span className="font-bold text-slate-200">
                {formatMoney(userClub?.transferBudget || 0, state.settings.currency, true)}
              </span>
            </div>
          </div>

          {/* Weekly Wages */}
          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
            <Shield className="w-4 h-4 text-indigo-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">Weekly Wages</span>
              <span className="font-bold text-slate-200">
                {formatMoney(userClub?.wageBudgetWeekly || 0, state.settings.currency, true)}/wk
              </span>
            </div>
          </div>

          {/* Season Date */}
          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">Season {state.currentSeason}</span>
              <span className="font-bold text-slate-200">{formattedDate}</span>
            </div>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-700">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={state.settings.currency}
              onChange={(e) => updateCurrency(e.target.value as SupportedCurrency)}
              className="bg-transparent text-[11px] font-bold text-emerald-400 focus:outline-none cursor-pointer"
            >
              <option value="EUR" className="bg-slate-900 text-white">EUR (€)</option>
              <option value="USD" className="bg-slate-900 text-white">USD ($)</option>
              <option value="GBP" className="bg-slate-900 text-white">GBP (£)</option>
              <option value="TZS" className="bg-slate-900 text-white">TZS (TSh)</option>
              <option value="KES" className="bg-slate-900 text-white">KES (KSh)</option>
              <option value="NGN" className="bg-slate-900 text-white">NGN (₦)</option>
              <option value="ZAR" className="bg-slate-900 text-white">ZAR (R)</option>
            </select>
          </div>
        </div>

        {/* Right: Actions & CONTINUE BUTTON */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition"
            title="Global Football Search (Ctrl+K)"
          >
            <Search className="w-4 h-4 text-emerald-400" />
          </button>

          {/* AI Assistant Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white hover:border-indigo-400 text-xs font-semibold transition"
            title="Assistant Tactical Director AI"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Tactical AI</span>
          </button>

          {/* Inbox quick icon */}
          <button
            onClick={() => setActiveTab('inbox')}
            className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition"
            title="Manager Inbox"
          >
            <Mail className="w-4 h-4" />
            {unreadInboxCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                {unreadInboxCount}
              </span>
            )}
          </button>

          {/* Save / Load */}
          <button
            onClick={() => setIsSaveLoadModalOpen(true)}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition"
            title="Saves & Career Backups"
          >
            <Save className="w-4 h-4" />
          </button>

          {/* New Career */}
          <button
            onClick={() => setIsNewCareerModalOpen(true)}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition"
            title="New Career / Custom Club"
          >
            <PlusCircle className="w-4 h-4" />
          </button>

          {/* CONTINUE BUTTON */}
          <button
            onClick={continueDay}
            disabled={isSimulating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider text-black shadow-lg transition active:scale-95 ${
              isSimulating
                ? 'bg-amber-400 animate-pulse cursor-wait'
                : 'bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-emerald-500/20'
            }`}
          >
            {isSimulating ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

