import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { INITIAL_NATIONAL_TEAMS } from '../../data/nationalTeamsData';
import { NationalTeam } from '../../types/football';
import {
  Globe,
  Trophy,
  Shield,
  Award,
  Users,
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const NationalTeamsView: React.FC = () => {
  const { state } = useGame();
  const [selectedConfederation, setSelectedConfederation] = useState<string>('ALL');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('nat_england');

  const teams = Object.values(INITIAL_NATIONAL_TEAMS);

  const filteredTeams = teams.filter((t) => {
    if (selectedConfederation !== 'ALL' && t.confederation !== selectedConfederation) return false;
    return true;
  });

  const selectedTeam = INITIAL_NATIONAL_TEAMS[selectedTeamId] || teams[0];

  // Find eligible players from the game database for this nation
  const nationalSquadPlayers = Object.values(state.players)
    .filter((p) => p.nationality.toLowerCase() === selectedTeam.name.toLowerCase())
    .sort((a, b) => b.currentAbility - a.currentAbility);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-sky-400" />
            <h2 className="text-2xl font-black text-white tracking-tight">International & National Teams</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            FIFA World Rankings, continental confederations, international call-ups, and major tournament glory.
          </p>
        </div>

        {/* Confederation Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {['ALL', 'UEFA', 'CONMEBOL', 'CAF'].map((conf) => (
            <button
              key={conf}
              onClick={() => setSelectedConfederation(conf)}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 border ${
                selectedConfederation === conf
                  ? 'bg-sky-500 text-black border-sky-400 shadow'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {conf}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Teams List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="font-bold text-xs uppercase text-slate-400 tracking-wider">
            FIFA World Rankings ({filteredTeams.length})
          </h3>

          <div className="space-y-2">
            {filteredTeams.map((team) => {
              const isSelected = selectedTeamId === team.id;
              return (
                <div
                  key={team.id}
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-sky-500 shadow-lg ring-1 ring-sky-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-xs text-slate-500 w-6">#{team.ranking}</span>
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-xs border border-white/20 shadow"
                      style={{ backgroundColor: team.primaryColor }}
                    >
                      {team.code}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{team.name}</h4>
                      <span className="text-[11px] text-slate-400">{team.confederation} • Coach: {team.managerName}</span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-amber-400">
                    🏆 {team.trophies.length}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Nation Dossier (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedTeam && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl sticky top-20">
              {/* Nation Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-xl border-2 border-white/20 shadow-lg"
                    style={{ backgroundColor: selectedTeam.primaryColor }}
                  >
                    {selectedTeam.code}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-xl">{selectedTeam.name}</h3>
                    <span className="text-xs text-slate-400 font-mono">
                      Confederation: {selectedTeam.confederation} • Manager: {selectedTeam.managerName}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs text-slate-400 block">World Rank</span>
                  <span className="text-2xl font-black text-sky-400">#{selectedTeam.ranking}</span>
                </div>
              </div>

              {/* Trophies Cabinet */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 text-xs uppercase flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" />
                  <span>Major Honors Cabinet</span>
                </span>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                  {selectedTeam.trophies.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold"
                    >
                      🏆 {t.name} ({t.year})
                    </span>
                  ))}
                </div>
              </div>

              {/* Eligible International Squad (from current DB) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Eligible Senior Roster ({nationalSquadPlayers.length} in DB)</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">Sorted by Current Ability</span>
                </div>

                {nationalSquadPlayers.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-4 bg-slate-950 rounded-xl">
                    No active players in current database match this nationality. Add players via the Database Creator!
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar p-1">
                    {nationalSquadPlayers.map((player) => (
                      <div
                        key={player.id}
                        className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-mono"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sky-400 w-8">{player.position}</span>
                          <span className="font-bold text-white">{player.name}</span>
                          <span className="text-slate-500 text-[10px]">({state.clubs[player.clubId]?.shortName || 'Free Agent'})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-400 font-bold">CA {player.currentAbility}</span>
                          <span className="text-amber-400 text-[10px]">PA {player.potentialAbility}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
