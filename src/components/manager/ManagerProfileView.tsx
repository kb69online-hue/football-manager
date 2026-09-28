import React from 'react';
import { useGame } from '../../context/GameContext';
import { User, Trophy, Award, Shield, Flame, CheckCircle, Zap } from 'lucide-react';

export const ManagerProfileView: React.FC = () => {
  const { state } = useGame();
  const manager = state.manager;
  const userClub = state.clubs[state.userClubId];

  const totalMatches = manager.careerStats.matches;
  const winRate = totalMatches > 0 ? Math.round((manager.careerStats.wins / totalMatches) * 100) : 0;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-2xl text-black shadow-lg">
            <User className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
                Head Coach Profile
              </span>
              <span className="text-xs text-slate-400">Level {manager.level} Manager</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">{manager.name}</h2>
            <span className="text-xs text-slate-400">
              {manager.nationality} • Age {manager.age} • Managing {userClub?.name}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block">World Reputation</span>
          <span className="font-mono font-black text-emerald-400 text-2xl">{manager.reputation}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Manager Coaching Attributes (6 Cols) */}
        <div className="md:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Coaching Attributes (1-20 Scale)</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {Object.entries(manager.attributes).map(([key, val]) => (
              <div
                key={key}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60"
              >
                <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span
                  className={`font-mono font-black text-sm ${
                    val >= 16 ? 'text-emerald-400' : val >= 12 ? 'text-amber-400' : 'text-slate-300'
                  }`}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Career Stats & Trophies (6 Cols) */}
        <div className="md:col-span-6 space-y-6">
          {/* Career Record */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>Managerial Record</span>
            </h3>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">Matches</span>
                <span className="font-black text-base text-white">{totalMatches}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">Wins</span>
                <span className="font-black text-base text-emerald-400">{manager.careerStats.wins}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">Draws</span>
                <span className="font-black text-base text-amber-400">{manager.careerStats.draws}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">Win Rate</span>
                <span className="font-black text-base text-purple-400">{winRate}%</span>
              </div>
            </div>
          </div>

          {/* Unlocked Achievements */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Managerial Milestones</span>
            </h3>

            <div className="space-y-2">
              {state.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    ach.unlocked
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-slate-800/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-white text-xs">{ach.title}</h4>
                    <p className="text-[11px] text-slate-400">{ach.description}</p>
                  </div>
                  {ach.unlocked ? (
                    <span className="font-bold text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded">
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-600">Locked</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
