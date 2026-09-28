import React from 'react';
import { useGame } from '../../context/GameContext';
import { Building2, Trophy, Coins, Hammer, Users, Shield, ArrowUpRight } from 'lucide-react';

export const ClubView: React.FC = () => {
  const { state, upgradeFacility } = useGame();
  const club = state.clubs[state.userClubId];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg border border-white/10"
            style={{ backgroundColor: club?.primaryColor || '#10B981', color: club?.textColor || '#FFF' }}
          >
            {club?.shortName}
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">{club?.name}</h2>
            <span className="text-xs text-slate-400">
              {club?.stadiumName} • Capacity: {club?.stadiumCapacity.toLocaleString()} • Founded 1892
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">Club Balance</span>
          <span className="font-mono font-black text-emerald-400 text-lg">
            €{((club?.currentBalance || 0) / 1000000).toFixed(1)}M
          </span>
        </div>
      </div>

      {/* Grid: Infrastructure Upgrades & Board Targets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Facilities & Stadium Upgrades */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Infrastructure & Facilities</span>
          </h3>

          <div className="space-y-3">
            {/* Stadium Expansion */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block text-sm">Stadium Expansion (+6,500 seats)</span>
                <span className="text-slate-400 text-[11px]">
                  Current Capacity: {club?.stadiumCapacity.toLocaleString()} • Boosts matchday gate receipts
                </span>
              </div>
              <button
                onClick={() => upgradeFacility('stadium')}
                disabled={(club?.currentBalance || 0) < 25000000}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-black font-bold text-xs transition"
              >
                Upgrade (€25M)
              </button>
            </div>

            {/* Training Grounds */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block text-sm">Training Grounds (Level {club?.trainingGroundLevel}/10)</span>
                <span className="text-slate-400 text-[11px]">Accelerates player attribute growth & sharpness</span>
              </div>
              <button
                onClick={() => upgradeFacility('training')}
                disabled={(club?.currentBalance || 0) < 14000000 || (club?.trainingGroundLevel || 0) >= 10}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-black font-bold text-xs transition"
              >
                Upgrade (€14M)
              </button>
            </div>

            {/* Youth Academy */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block text-sm">Youth Academy (Level {club?.youthAcademyLevel}/10)</span>
                <span className="text-slate-400 text-[11px]">Increases quality of annual Golden Generation intake</span>
              </div>
              <button
                onClick={() => upgradeFacility('youth')}
                disabled={(club?.currentBalance || 0) < 18000000 || (club?.youthAcademyLevel || 0) >= 10}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-black font-bold text-xs transition"
              >
                Upgrade (€18M)
              </button>
            </div>
          </div>
        </div>

        {/* Board Expectations & Club History */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Board Directives & Objectives</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-slate-400 block text-[10px]">League Target</span>
              <span className="font-bold text-white text-sm">{club?.objectives.leagueTarget}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-slate-400 block text-[10px]">Cup Competition Target</span>
              <span className="font-bold text-white text-sm">{club?.objectives.cupTarget}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <span className="text-slate-400 block text-[10px]">Youth Development Directive</span>
              <span className="font-bold text-white text-sm">{club?.objectives.youthTarget}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300 block mb-2">Trophy Cabinet</span>
            <div className="flex flex-wrap gap-2">
              {club?.trophiesWon.map((t, idx) => (
                <span
                  key={idx}
                  className="bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{t.name} ({t.season})</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
