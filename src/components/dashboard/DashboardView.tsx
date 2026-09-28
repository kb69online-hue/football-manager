import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  Calendar,
  ChevronRight,
  TrendingUp,
  HeartPulse,
  Flame,
  ShieldAlert,
  Bot,
  ArrowUpRight,
  Sparkles,
  Trophy,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { state, setActiveTab, startMatch, setIsAiModalOpen, setSelectedPlayer } = useGame();

  const userClub = state.clubs[state.userClubId];
  const userPlayers = Object.values(state.players).filter((p) => p.clubId === state.userClubId);

  // Find next fixture
  const nextFixture = state.fixtures.find(
    (f) => !f.played && (f.homeClubId === state.userClubId || f.awayClubId === state.userClubId)
  );

  const isHome = nextFixture?.homeClubId === state.userClubId;
  const oppClubId = isHome ? nextFixture?.awayClubId : nextFixture?.homeClubId;
  const oppClub = oppClubId ? state.clubs[oppClubId] : null;

  // League table snippet
  const comp = state.competitions['comp_premier_div'];
  const table = comp?.table || [];

  // Team averages
  const avgCondition = Math.round(
    userPlayers.reduce((acc, p) => acc + (p.condition || 90), 0) / (userPlayers.length || 1)
  );
  const avgMorale = Math.round(
    userPlayers.reduce((acc, p) => acc + (p.morale || 85), 0) / (userPlayers.length || 1)
  );
  const injuredPlayers = userPlayers.filter((p) => p.injury);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Next Match Highlight */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Matchday info */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 font-bold text-xs px-2.5 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
                Upcoming Fixture
              </span>
              <span className="text-xs text-slate-400">
                Gameweek {nextFixture?.gameweek || 1} • {nextFixture?.date || state.currentDate}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {userClub?.name} <span className="text-slate-500 font-light">vs</span> {oppClub?.name || 'Upcoming Opponent'}
            </h2>
            <p className="text-xs text-slate-400">
              Venue: {isHome ? userClub?.stadiumName : oppClub?.stadiumName} • Expected Attendance:{' '}
              {((userClub?.stadiumCapacity || 50000) * 0.94).toLocaleString()}
            </p>
          </div>

          {/* Opponent Crest vs User Crest */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl shadow-lg border border-white/10 mx-auto"
                style={{ backgroundColor: userClub?.primaryColor || '#10B981', color: userClub?.textColor || '#FFF' }}
              >
                {userClub?.shortName || 'CLB'}
              </div>
              <span className="text-xs font-semibold text-slate-300 mt-1 block">Home</span>
            </div>

            <div className="text-center font-mono font-bold text-slate-500 text-lg">VS</div>

            <div className="text-center">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl shadow-lg border border-white/10 mx-auto"
                style={{ backgroundColor: oppClub?.primaryColor || '#3B82F6', color: oppClub?.textColor || '#FFF' }}
              >
                {oppClub?.shortName || 'OPP'}
              </div>
              <span className="text-xs font-semibold text-slate-300 mt-1 block">Away</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('tactics')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            >
              Adjust Tactics
            </button>
            {nextFixture && (
              <button
                onClick={() => startMatch(nextFixture)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition active:scale-95"
              >
                Play Match
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: League Standings & Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Championship Standings</span>
            </h3>
            <button
              onClick={() => setActiveTab('competitions')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
            >
              <span>Full Table</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 pb-2">
                  <th className="py-1.5 px-2">#</th>
                  <th className="py-1.5 px-2">Club</th>
                  <th className="py-1.5 px-2 text-center">PL</th>
                  <th className="py-1.5 px-2 text-center">GD</th>
                  <th className="py-1.5 px-2 text-center font-bold">PTS</th>
                  <th className="py-1.5 px-2 text-center">Form</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {table.slice(0, 6).map((row, idx) => {
                  const club = state.clubs[row.clubId];
                  const isUser = row.clubId === state.userClubId;

                  return (
                    <tr
                      key={row.clubId}
                      className={`hover:bg-slate-800/40 transition ${isUser ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-slate-300'}`}
                    >
                      <td className="py-2 px-2 text-slate-400">{idx + 1}</td>
                      <td className="py-2 px-2 flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: club?.primaryColor || '#666' }}
                        />
                        <span className="truncate max-w-[110px]">{club?.name || row.clubId}</span>
                      </td>
                      <td className="py-2 px-2 text-center text-slate-400">{row.played}</td>
                      <td className="py-2 px-2 text-center text-slate-400">
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </td>
                      <td className="py-2 px-2 text-center font-black text-white">{row.points}</td>
                      <td className="py-2 px-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {row.form.length > 0 ? (
                            row.form.map((res, fIdx) => (
                              <span
                                key={fIdx}
                                className={`w-3.5 h-3.5 rounded-full text-[9px] font-bold flex items-center justify-center text-white ${
                                  res === 'W' ? 'bg-emerald-500' : res === 'D' ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                              >
                                {res}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-500">-</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Center Column: Board & Fan Confidence & Squad Health */}
        <div className="space-y-6">
          {/* Confidence meters */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Club Confidence & Status</span>
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Board Approval</span>
                  <span className="font-bold text-emerald-400">{userClub?.boardConfidence || 85}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${userClub?.boardConfidence || 85}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Supporters Mood</span>
                  <span className="font-bold text-teal-400">{userClub?.fanConfidence || 82}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${userClub?.fanConfidence || 82}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Board Target:</span>
                <span className="font-semibold text-slate-200">{userClub?.objectives.leagueTarget}</span>
              </div>
            </div>
          </div>

          {/* Squad Condition */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-400" />
              <span>Squad Fitness & Health</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">Avg Condition</span>
                <span className="font-bold text-base text-emerald-400">{avgCondition}%</span>
              </div>
              <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
                <span className="text-slate-400 block text-[10px]">Team Morale</span>
                <span className="font-bold text-base text-amber-400">{avgMorale}%</span>
              </div>
            </div>

            {injuredPlayers.length > 0 ? (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-2.5 text-xs text-rose-300">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Medical Ward ({injuredPlayers.length})</span>
                </div>
                <ul className="space-y-0.5 text-[11px]">
                  {injuredPlayers.map((inj) => (
                    <li key={inj.id} className="flex justify-between">
                      <span>{inj.name}</span>
                      <span className="text-slate-400">{inj.injury?.type} ({inj.injury?.daysRemaining}d)</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <span>✓ Full squad available for selection.</span>
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Assistant Coach Tactical Sticky & News */}
        <div className="space-y-6">
          {/* Tactical Assistant Quick Note */}
          <div className="bg-gradient-to-br from-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-lg relative">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <Bot className="w-4 h-4 text-indigo-400" />
                <span>Assistant Manager's Brief</span>
              </span>
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="text-[11px] text-indigo-300 hover:text-white flex items-center gap-0.5"
              >
                <span>Ask AI</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Boss, {oppClub?.name || 'our next opponent'} relies heavily on counter-pressing out wide. Our current{' '}
              <strong className="text-white">{state.tactics.formation}</strong> with inverted wingers will create 2-on-1 overloads in their half-spaces."
            </p>
          </div>

          {/* Breaking News Feed */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-200">World Football Wire</h3>
              <button onClick={() => setActiveTab('news')} className="text-xs text-slate-400 hover:text-white">
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {state.news.slice(0, 3).map((item) => (
                <div key={item.id} className="border-b border-slate-800/60 pb-2 last:border-0 last:pb-0">
                  <span className="text-[10px] text-slate-500 font-mono block">{item.date}</span>
                  <h4 className="text-xs font-semibold text-slate-200 hover:text-emerald-400 cursor-pointer transition">
                    {item.headline}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
