import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Player, Position, SquadCategory } from '../../types/football';
import { Search, Filter, ShieldAlert, Sparkles, UserPlus } from 'lucide-react';

export const SquadView: React.FC = () => {
  const { state, setSelectedPlayer, setTransferModalPlayer } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<SquadCategory | 'All'>('All');
  const [selectedPosFilter, setSelectedPosFilter] = useState<'All' | 'GK' | 'DEF' | 'MID' | 'ATT'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Player | 'rating'>('currentAbility');
  const [sortAsc, setSortAsc] = useState(false);

  const players = Object.values(state.players).filter((p) => p.clubId === state.userClubId);

  const filteredPlayers = players.filter((p) => {
    if (selectedCategory !== 'All' && p.squadCategory !== selectedCategory) return false;
    if (selectedPosFilter === 'GK' && p.position !== 'GK') return false;
    if (selectedPosFilter === 'DEF' && !['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p.position)) return false;
    if (selectedPosFilter === 'MID' && !['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(p.position)) return false;
    if (selectedPosFilter === 'ATT' && !['ST', 'CF', 'LW', 'RW'].includes(p.position)) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  filteredPlayers.sort((a, b) => {
    let valA = a[sortField as keyof Player] as any;
    let valB = b[sortField as keyof Player] as any;
    if (typeof valA === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? valA - valB : valB - valA;
  });

  const handleSort = (field: keyof Player | 'rating') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Squad Management</h2>
          <p className="text-xs text-slate-400">
            Total Players: {players.length} • Active Roster: {filteredPlayers.length}
          </p>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search player name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-56"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['All', 'First Team', 'Reserves', 'U21', 'Academy'] as (SquadCategory | 'All')[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {(['All', 'GK', 'DEF', 'MID', 'ATT'] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => setSelectedPosFilter(pos)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                selectedPosFilter === pos
                  ? 'bg-slate-700 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Squad Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-700/60">
              <tr>
                <th onClick={() => handleSort('squadNumber')} className="py-3 px-3 cursor-pointer">
                  #
                </th>
                <th onClick={() => handleSort('position')} className="py-3 px-3 cursor-pointer">
                  Pos
                </th>
                <th onClick={() => handleSort('name')} className="py-3 px-3 cursor-pointer">
                  Player Name
                </th>
                <th onClick={() => handleSort('age')} className="py-3 px-3 cursor-pointer text-center">
                  Age
                </th>
                <th onClick={() => handleSort('nationality')} className="py-3 px-3 cursor-pointer">
                  Nat
                </th>
                <th onClick={() => handleSort('currentAbility')} className="py-3 px-3 cursor-pointer text-center">
                  OVR
                </th>
                <th onClick={() => handleSort('potentialAbility')} className="py-3 px-3 cursor-pointer text-center">
                  POT
                </th>
                <th onClick={() => handleSort('condition')} className="py-3 px-3 cursor-pointer text-center">
                  FIT
                </th>
                <th onClick={() => handleSort('morale')} className="py-3 px-3 cursor-pointer text-center">
                  Morale
                </th>
                <th onClick={() => handleSort('marketValue')} className="py-3 px-3 cursor-pointer text-right">
                  Value
                </th>
                <th className="py-3 px-3 text-right">Wage</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredPlayers.map((player) => {
                const isWonderkid = player.potentialAbility >= 88 && player.age <= 21;
                const isInjured = !!player.injury;

                return (
                  <tr
                    key={player.id}
                    onClick={() => setSelectedPlayer(player)}
                    className="hover:bg-slate-800/50 cursor-pointer transition text-slate-200"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-400">{player.squadNumber || '-'}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block font-bold text-[10px] px-2 py-0.5 rounded text-white ${
                          player.position === 'GK'
                            ? 'bg-amber-600'
                            : ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(player.position)
                            ? 'bg-blue-600'
                            : ['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(player.position)
                            ? 'bg-emerald-600'
                            : 'bg-rose-600'
                        }`}
                      >
                        {player.position}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                      <span>{player.name}</span>
                      {isWonderkid && (
                        <span className="flex items-center gap-0.5 text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">
                          <Sparkles className="w-2.5 h-2.5" /> Wonderkid
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-300">{player.age}</td>
                    <td className="py-2.5 px-3 text-slate-400">{player.nationality}</td>
                    <td className="py-2.5 px-3 text-center font-black text-emerald-400 text-sm">
                      {player.currentAbility}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-purple-400">{player.potentialAbility}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`font-semibold ${
                          player.condition > 85 ? 'text-emerald-400' : player.condition > 70 ? 'text-amber-400' : 'text-red-400'
                        }`}
                      >
                        {player.condition}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-300">{player.morale}%</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-300">
                      €{(player.marketValue / 1000000).toFixed(1)}M
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                      €{(player.contract.salaryWeekly / 1000).toFixed(0)}k/wk
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {isInjured ? (
                        <span className="text-[10px] font-bold bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded border border-rose-500/40">
                          Injured ({player.injury?.daysRemaining}d)
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-400">Fit</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
