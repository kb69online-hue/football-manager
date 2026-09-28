import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ShieldAlert, X, Database, Coins, Flame, RefreshCw, CheckCircle2 } from 'lucide-react';

export const AdminModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state } = useGame();
  const [stats, setStats] = useState<{ totalUsers?: number; totalSaves?: number; hasGemini?: boolean } | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.log('Admin stats fetch error:', err));
  }, []);

  const handleInjectFunds = () => {
    const userClub = state.clubs[state.userClubId];
    if (userClub) {
      userClub.transferBudget += 50000000;
      userClub.currentBalance += 50000000;
      setMessage('Injected €50,000,000 into club transfer treasury!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleBoostMorale = () => {
    Object.values(state.players).forEach((p) => {
      if (p.clubId === state.userClubId) {
        p.morale = 100;
        p.condition = 100;
      }
    });
    setMessage('Maximized all first-team player morale and fitness to 100%!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 p-5 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Apex FM Admin Console</h3>
              <span className="text-xs text-amber-400/80">Diagnostics, Developer Tools & Database Controls</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar text-xs">
          {message && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{message}</span>
            </div>
          )}

          {/* Database Health Cards */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Total Clubs</span>
              <span className="font-black text-base text-white">{Object.keys(state.clubs).length}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Registered Players</span>
              <span className="font-black text-base text-emerald-400">{Object.keys(state.players).length}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Competitions</span>
              <span className="font-black text-base text-purple-400">{Object.keys(state.competitions).length}</span>
            </div>
          </div>

          {/* Developer Cheats / Simulation Triggers */}
          <div className="space-y-3">
            <span className="font-bold text-slate-300 block">Simulation Overrides</span>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Inject €50M Transfer Funds</span>
                <span className="text-slate-400 text-[11px]">Instant grant into active club treasury</span>
              </div>
              <button
                onClick={handleInjectFunds}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition"
              >
                +€50M
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Max Squad Morale & Fitness</span>
                <span className="text-slate-400 text-[11px]">Set all squad players to 100% condition & morale</span>
              </div>
              <button
                onClick={handleBoostMorale}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition"
              >
                Max Morale
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Close Admin Console
          </button>
        </div>
      </div>
    </div>
  );
};
