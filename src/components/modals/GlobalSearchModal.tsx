import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Player, Club } from '../../types/football';
import { formatMoney } from '../../services/currencyService';
import { HISTORICAL_SEASONS_ARCHIVE } from '../../data/historicalData';
import {
  Search,
  Users,
  Building2,
  Calendar,
  X,
  Filter,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface GlobalSearchModalProps {
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ onClose }) => {
  const { state, setSelectedPlayer } = useGame();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'ALL' | 'PLAYERS' | 'CLUBS' | 'HISTORICAL'>('ALL');
  const [minRating, setMinRating] = useState(0);

  const allPlayers = Object.values(state.players);
  const allClubs = Object.values(state.clubs);

  const q = query.toLowerCase().trim();

  const matchingPlayers = allPlayers.filter((p) => {
    if (minRating > 0 && p.currentAbility < minRating) return false;
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.position.toLowerCase().includes(q) ||
      p.nationality.toLowerCase().includes(q) ||
      state.clubs[p.clubId]?.name.toLowerCase().includes(q)
    );
  }).slice(0, 15);

  const matchingClubs = allClubs.filter((c) => {
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.stadiumName.toLowerCase().includes(q)
    );
  }).slice(0, 10);

  const matchingHistorical = HISTORICAL_SEASONS_ARCHIVE.filter((s) => {
    if (!q) return true;
    return s.seasonLabel.toLowerCase().includes(q) || s.summary.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header & Search Input */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-400" />
            <h3 className="font-black text-white text-base">Global Football Search</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-mono text-sm">
            ✕
          </button>
        </div>

        {/* Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            autoFocus
            type="text"
            placeholder="Search players, clubs, leagues, seasons, coaches..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1">
            {(['ALL', 'PLAYERS', 'CLUBS', 'HISTORICAL'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-lg font-bold transition border ${
                  category === cat
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
            <span>Min Ability:</span>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-white"
            >
              <option value="0">Any</option>
              <option value="75">75+ CA</option>
              <option value="80">80+ CA</option>
              <option value="85">85+ CA</option>
            </select>
          </div>
        </div>

        {/* Results Stream */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1 text-xs">
          {(category === 'ALL' || category === 'PLAYERS') && matchingPlayers.length > 0 && (
            <div className="space-y-1.5">
              <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
                Players ({matchingPlayers.length})
              </span>
              {matchingPlayers.map((player) => (
                <div
                  key={player.id}
                  onClick={() => {
                    setSelectedPlayer(player);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/60 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="font-mono font-black text-emerald-400 w-8">{player.position}</span>
                    <span className="font-bold text-white truncate">{player.name}</span>
                    <span className="text-slate-500 text-[11px]">({state.clubs[player.clubId]?.shortName || 'Free Agent'})</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
                    <span className="text-emerald-400 font-bold">CA {player.currentAbility}</span>
                    <span className="text-slate-400">{formatMoney(player.marketValue, state.settings.currency, true)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(category === 'ALL' || category === 'CLUBS') && matchingClubs.length > 0 && (
            <div className="space-y-1.5">
              <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
                Clubs ({matchingClubs.length})
              </span>
              {matchingClubs.map((club) => (
                <div
                  key={club.id}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: club.primaryColor }} />
                    <span className="font-bold text-white">{club.name}</span>
                    <span className="text-slate-500 text-[11px]">({club.country})</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">Stadium: {club.stadiumName}</span>
                </div>
              ))}
            </div>
          )}

          {(category === 'ALL' || category === 'HISTORICAL') && matchingHistorical.length > 0 && (
            <div className="space-y-1.5">
              <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
                Historical Seasons ({matchingHistorical.length})
              </span>
              {matchingHistorical.map((season) => (
                <div
                  key={season.year}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-400">{season.seasonLabel}</span>
                    <span className="text-[10px] text-slate-500">{season.generation}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans line-clamp-1">{season.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
