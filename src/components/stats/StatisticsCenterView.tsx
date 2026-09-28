import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Player, Club } from '../../types/football';
import {
  BarChart3,
  TrendingUp,
  Award,
  Trophy,
  Flame,
  Shield,
  Target,
  Sparkles,
  Users,
} from 'lucide-react';

export const StatisticsCenterView: React.FC = () => {
  const { state, setSelectedPlayer } = useGame();
  const [activeCategory, setActiveCategory] = useState<'players' | 'teams'>('players');

  const allPlayers = Object.values(state.players);
  const allClubs = Object.values(state.clubs);

  // Top Scorers
  const topScorers = [...allPlayers].sort((a, b) => (b.stats.goals || 0) - (a.stats.goals || 0)).slice(0, 10);
  // Top Assists
  const topAssists = [...allPlayers].sort((a, b) => (b.stats.assists || 0) - (a.stats.assists || 0)).slice(0, 10);
  // Top Match Rating
  const topRatings = [...allPlayers].sort((a, b) => (b.stats.avgRating || 0) - (a.stats.avgRating || 0)).slice(0, 10);
  // Clean Sheets (Goalkeepers)
  const topCleanSheets = allPlayers
    .filter((p) => p.position === 'GK')
    .sort((a, b) => (b.stats.cleanSheets || 0) - (a.stats.cleanSheets || 0))
    .slice(0, 8);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-black text-white tracking-tight">Advanced Statistics & Analytics Center</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Deep analytical metrics: Goals, Assists, Expected Goals (xG), Average Ratings, and Clean Sheets.
          </p>
        </div>

        {/* View Toggle */}
        <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
          <button
            onClick={() => setActiveCategory('players')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeCategory === 'players' ? 'bg-emerald-500 text-black shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Player Metrics</span>
          </button>
          <button
            onClick={() => setActiveCategory('teams')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeCategory === 'teams' ? 'bg-emerald-500 text-black shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Club Standings & Form</span>
          </button>
        </div>
      </div>

      {activeCategory === 'players' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Top Goalscorers */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5 uppercase font-mono">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span>Golden Boot Leaders</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Goals</span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              {topScorers.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlayer(p)}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-slate-500 w-5">#{idx + 1}</span>
                    <span className="font-bold text-white truncate">{p.name}</span>
                    <span className="text-[10px] text-slate-500">({state.clubs[p.clubId]?.shortName})</span>
                  </div>
                  <span className="font-black text-emerald-400 text-sm">{p.stats.goals || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Assists */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-sky-400 text-xs flex items-center gap-1.5 uppercase font-mono">
                <Target className="w-4 h-4 text-sky-400" />
                <span>Playmaker Assist Kings</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Assists</span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              {topAssists.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlayer(p)}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-slate-500 w-5">#{idx + 1}</span>
                    <span className="font-bold text-white truncate">{p.name}</span>
                    <span className="text-[10px] text-slate-500">({state.clubs[p.clubId]?.shortName})</span>
                  </div>
                  <span className="font-black text-sky-400 text-sm">{p.stats.assists || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Average Match Rating */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-amber-400 text-xs flex items-center gap-1.5 uppercase font-mono">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Highest Match Ratings</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Rating</span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              {topRatings.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlayer(p)}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-slate-500 w-5">#{idx + 1}</span>
                    <span className="font-bold text-white truncate">{p.name}</span>
                    <span className="text-[10px] text-slate-500">({p.position})</span>
                  </div>
                  <span className="font-black text-amber-300 text-sm">⭐ {(p.stats.avgRating || 7.0).toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Team Analytics & Performance */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-xs">
            <span className="font-bold text-white">Club Performance Matrix</span>
            <span className="text-slate-400 font-mono">Season {state.currentSeason}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Club</th>
                  <th className="py-2.5 px-3 text-center">Squad Size</th>
                  <th className="py-2.5 px-3 text-center">Reputation</th>
                  <th className="py-2.5 px-3 text-center">Facilities</th>
                  <th className="py-2.5 px-3 text-center">Stadium Capacity</th>
                  <th className="py-2.5 px-4 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {allClubs.map((club) => {
                  const squadCount = allPlayers.filter((p) => p.clubId === club.id).length;
                  return (
                    <tr key={club.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: club.primaryColor }} />
                        <span>{club.name}</span>
                      </td>
                      <td className="py-3 px-3 text-center text-slate-300">{squadCount}</td>
                      <td className="py-3 px-3 text-center text-amber-400 font-bold">{club.reputation}/100</td>
                      <td className="py-3 px-3 text-center text-slate-300">{club.facilitiesLevel}/10</td>
                      <td className="py-3 px-3 text-center text-slate-300">{club.stadiumCapacity.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400">
                        €{(club.currentBalance / 1_000_000).toFixed(1)}M
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
