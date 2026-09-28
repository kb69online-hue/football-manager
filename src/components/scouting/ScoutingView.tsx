import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Binoculars, Star, Globe, UserCheck, Sparkles, PlusCircle } from 'lucide-react';
import { Position } from '../../types/football';

export const ScoutingView: React.FC = () => {
  const { state, setSelectedPlayer } = useGame();
  const scouts = state.scouts;
  const [selectedRegion, setSelectedRegion] = useState('Continental Europe');

  const scoutedWonderkids = Object.values(state.players).filter(
    (p) => p.potentialAbility >= 86 && p.age <= 22 && p.clubId !== state.userClubId
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
              Recruitment Department
            </span>
            <span className="text-xs text-slate-400">Global Talent Identification</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Scouting Network</h2>
        </div>
      </div>

      {/* Scouts Assigned Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scouts.map((scout) => (
          <div
            key={scout.id}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 font-bold border border-slate-700">
                <Binoculars className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">{scout.name}</h4>
                <span className="text-xs text-slate-400">
                  {scout.nationality} • Judging Potential: <strong className="text-purple-400">{scout.potentialJudging}/20</strong>
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
                  Assigned Region: {scout.currentAssignment?.region || 'Europe'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] bg-slate-800 text-slate-300 font-semibold px-2 py-1 rounded border border-slate-700">
                Active Assignment
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Scouted Talent Dossier (Wonderkids & Top Targets) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>High Priority Scout Reports (Potential 86+)</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scoutedWonderkids.map((p) => {
            const club = state.clubs[p.clubId];
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPlayer(p)}
                className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl p-4 cursor-pointer transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white bg-slate-700">
                    {p.position}
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-400 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-purple-400" /> {p.potentialAbility} POT
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{p.name}</h4>
                  <span className="text-xs text-slate-400">
                    {p.age} y/o • {p.nationality} • {club?.name || 'Free Agent'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-700/50 flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Current OVR: <strong className="text-emerald-400">{p.currentAbility}</strong></span>
                  <span className="text-slate-300">€{(p.marketValue / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
