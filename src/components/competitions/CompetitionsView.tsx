import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Trophy, Calendar, Award, ChevronLeft, ChevronRight } from 'lucide-react';

export const CompetitionsView: React.FC = () => {
  const { state } = useGame();
  const [selectedCompId, setSelectedCompId] = useState('comp_premier_div');
  const comp = state.competitions[selectedCompId] || state.competitions['comp_premier_div'];
  const table = comp?.table || [];

  // Top scorers calculation across players
  const topScorers = Object.values(state.players)
    .filter((p) => p.stats.goals > 0)
    .sort((a, b) => b.stats.goals - a.stats.goals)
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
              Official Competitions
            </span>
            <span className="text-xs text-slate-400">{comp.country} • Season {state.currentSeason}</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">{comp.name}</h2>
        </div>

        {/* Competition Selector */}
        <select
          value={selectedCompId}
          onChange={(e) => setSelectedCompId(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-emerald-400 font-bold px-3 py-1.5 rounded-xl text-xs focus:outline-none"
        >
          {Object.values(state.competitions).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Full League Table (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Championship Table</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Club</th>
                  <th className="py-2.5 px-3 text-center">PL</th>
                  <th className="py-2.5 px-3 text-center">W</th>
                  <th className="py-2.5 px-3 text-center">D</th>
                  <th className="py-2.5 px-3 text-center">L</th>
                  <th className="py-2.5 px-3 text-center">GF</th>
                  <th className="py-2.5 px-3 text-center">GA</th>
                  <th className="py-2.5 px-3 text-center">GD</th>
                  <th className="py-2.5 px-3 text-center font-bold">PTS</th>
                  <th className="py-2.5 px-3 text-center">Form</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {table.map((row, idx) => {
                  const club = state.clubs[row.clubId];
                  const isUser = row.clubId === state.userClubId;

                  return (
                    <tr
                      key={row.clubId}
                      className={`hover:bg-slate-800/50 transition ${
                        isUser ? 'bg-emerald-500/15 text-emerald-400 font-bold' : 'text-slate-300'
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                            idx === 0
                              ? 'bg-amber-500 text-black'
                              : idx < 4
                              ? 'bg-blue-500/20 text-blue-400'
                              : idx >= table.length - 2
                              ? 'bg-red-500/20 text-red-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full inline-block"
                          style={{ backgroundColor: club?.primaryColor || '#888' }}
                        />
                        <span className="font-bold text-white">{club?.name || row.clubId}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-400">{row.played}</td>
                      <td className="py-2.5 px-3 text-center">{row.won}</td>
                      <td className="py-2.5 px-3 text-center text-slate-400">{row.drawn}</td>
                      <td className="py-2.5 px-3 text-center text-slate-400">{row.lost}</td>
                      <td className="py-2.5 px-3 text-center text-slate-400">{row.goalsFor}</td>
                      <td className="py-2.5 px-3 text-center text-slate-400">{row.goalsAgainst}</td>
                      <td className="py-2.5 px-3 text-center text-slate-300">
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </td>
                      <td className="py-2.5 px-3 text-center font-black text-white text-sm">{row.points}</td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {row.form.map((res, fIdx) => (
                            <span
                              key={fIdx}
                              className={`w-3.5 h-3.5 rounded-full text-[9px] font-bold flex items-center justify-center text-white ${
                                res === 'W' ? 'bg-emerald-500' : res === 'D' ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                            >
                              {res}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fixtures & Golden Boot (1 Col) */}
        <div className="space-y-6">
          {/* Golden Boot Race */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Golden Boot Race</span>
            </h3>

            {topScorers.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No goals recorded yet this season.</p>
            ) : (
              <div className="space-y-2">
                {topScorers.map((p, idx) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 w-4">{idx + 1}</span>
                      <div>
                        <span className="font-bold text-white block">{p.name}</span>
                        <span className="text-[10px] text-slate-400">{state.clubs[p.clubId]?.name}</span>
                      </div>
                    </div>
                    <span className="font-black text-emerald-400 text-sm">{p.stats.goals} G</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fixtures List */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Gameweek Fixtures</span>
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              {comp.fixtures.slice(0, 8).map((fix) => {
                const home = state.clubs[fix.homeClubId];
                const away = state.clubs[fix.awayClubId];
                return (
                  <div
                    key={fix.id}
                    className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-mono block">
                        GW {fix.gameweek} • {fix.date}
                      </span>
                      <div className="flex items-center gap-2 font-semibold text-white">
                        <span>{home?.shortName}</span>
                        <span className="text-slate-500">vs</span>
                        <span>{away?.shortName}</span>
                      </div>
                    </div>

                    <div>
                      {fix.played ? (
                        <span className="font-mono font-black text-emerald-400 text-sm">
                          {fix.homeScore} - {fix.awayScore}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-bold bg-slate-800 px-2 py-1 rounded">
                          Scheduled
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
