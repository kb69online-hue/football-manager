import React from 'react';
import { useGame } from '../../context/GameContext';
import { GraduationCap, Sparkles, UserPlus, Star } from 'lucide-react';

export const YouthAcademyView: React.FC = () => {
  const { state, promoteYouth, setSelectedPlayer } = useGame();
  const youthIntake = state.youthIntakePlayers;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
              La Masia / Carrington System
            </span>
            <span className="text-xs text-slate-400">Next Generation Development</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Youth Academy & Annual Intake</h2>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Class of 2026/27 Intake Candidates</span>
          </h3>
        </div>

        {youthIntake.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4">All candidates have been processed or promoted to first team.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {youthIntake.map((p) => (
              <div
                key={p.id}
                className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between"
              >
                <div
                  onClick={() => setSelectedPlayer(p)}
                  className="space-y-1 cursor-pointer hover:opacity-80 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700 text-white">
                      {p.position}
                    </span>
                    <h4 className="font-bold text-white text-base">{p.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    {p.age} y/o • {p.nationality} • Current: <strong className="text-emerald-400">{p.currentAbility}</strong>
                  </p>
                  <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-purple-400" /> Potential: {p.potentialAbility}/100 (Generational Talent)
                  </span>
                </div>

                <button
                  onClick={() => promoteYouth(p.id)}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition active:scale-95 flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Promote to Senior</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
