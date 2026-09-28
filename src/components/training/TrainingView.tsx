import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Compass, Zap, Flame, Shield, HeartPulse, Check } from 'lucide-react';

const WEEKLY_MODULES = [
  { id: 'attacking', name: 'Attacking Movement & Finishing', focus: 'Shooting & Final Third Overloads', intensity: 'Medium' },
  { id: 'defending', name: 'Defensive Rest & Low Block', focus: 'Tackling & Aerial Clearance', intensity: 'Medium' },
  { id: 'possession', name: 'Tiki-Taka Possession & Rondos', focus: 'First Touch & Progressive Passing', intensity: 'High' },
  { id: 'fitness', name: 'High-Intensity Aerobic Stamina', focus: 'Pace & Recovery Sprints', intensity: 'High' },
  { id: 'tactical', name: 'Opponent Tactical Briefing', focus: 'Shape & Set-Piece Routines', intensity: 'Low' },
  { id: 'recovery', name: 'Physio Recovery & Cryotherapy', focus: 'Fatigue Reduction & Injury Prevention', intensity: 'Low' },
];

export const TrainingView: React.FC = () => {
  const { state } = useGame();
  const [selectedSchedule, setSelectedSchedule] = useState('possession');
  const userPlayers = Object.values(state.players).filter((p) => p.clubId === state.userClubId);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
              Training Grounds
            </span>
            <span className="text-xs text-slate-400">First Team Conditioning & Tactical Drills</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Team Training Schedule</h2>
        </div>
      </div>

      {/* Weekly Training Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {WEEKLY_MODULES.map((mod) => (
          <div
            key={mod.id}
            onClick={() => setSelectedSchedule(mod.id)}
            className={`p-4 rounded-2xl border cursor-pointer transition shadow-lg space-y-3 ${
              selectedSchedule === mod.id
                ? 'bg-emerald-500/10 border-emerald-500/50 shadow-emerald-500/10'
                : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" /> {mod.name}
              </span>
              {selectedSchedule === mod.id && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-xs">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400">{mod.focus}</p>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500">Intensity:</span>
              <span
                className={`font-bold ${
                  mod.intensity === 'High' ? 'text-rose-400' : mod.intensity === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {mod.intensity}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Player Sharpness & Individual Focus Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-slate-200">Individual Training Focus & Sharpness</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800/80 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-700/60">
              <tr>
                <th className="py-2.5 px-3">Player</th>
                <th className="py-2.5 px-3">Position</th>
                <th className="py-2.5 px-3 text-center">Condition</th>
                <th className="py-2.5 px-3 text-center">Sharpness</th>
                <th className="py-2.5 px-3">Individual Focus</th>
                <th className="py-2.5 px-3 text-center">Injury Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {userPlayers.slice(0, 15).map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition text-slate-200">
                  <td className="py-2 px-3 font-bold text-white">{p.name}</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold">{p.position}</td>
                  <td className="py-2 px-3 text-center font-bold">{p.condition}%</td>
                  <td className="py-2 px-3 text-center font-bold text-amber-400">{p.sharpness}%</td>
                  <td className="py-2 px-3 text-slate-300">
                    {p.position === 'ST'
                      ? 'Finishing & Penalty Box Poaching'
                      : ['LW', 'RW'].includes(p.position)
                      ? 'Explosive Acceleration & Dribbling'
                      : ['CM', 'CDM'].includes(p.position)
                      ? 'Through Balls & Tactical Positioning'
                      : 'Tackling & Aerial Duels'}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.condition < 80 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {p.condition < 80 ? 'High' : 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
