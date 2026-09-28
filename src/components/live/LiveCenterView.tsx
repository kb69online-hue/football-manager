import React, { useState, useEffect } from 'react';
import { RealWorldMatch } from '../../types/football';
import {
  INITIAL_REAL_WORLD_MATCHES,
  REAL_WORLD_DATA_PROVIDER_INFO,
  REAL_WORLD_LEAGUE_TABLES,
  REAL_WORLD_TRANSFERS,
  REAL_WORLD_INJURIES,
  REAL_WORLD_SUSPENSIONS,
  REAL_WORLD_TOP_SCORERS,
  REAL_WORLD_TOP_ASSISTS,
  REAL_WORLD_TEAM_STATS,
} from '../../data/realWorldData';
import { generateClubBadgeSvg } from '../../services/assetService';
import {
  Activity,
  Calendar,
  Clock,
  Shield,
  Trophy,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Flame,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Tv,
  Users,
  ShieldAlert,
  Sliders,
  Sparkles,
  Play,
  Pause,
  Plus,
} from 'lucide-react';

export const LiveCenterView: React.FC = () => {
  const [matches, setMatches] = useState<RealWorldMatch[]>(INITIAL_REAL_WORLD_MATCHES);
  const [activeTab, setActiveTab] = useState<
    'LIVE' | 'UPCOMING' | 'FINISHED' | 'TODAY' | 'TOMORROW' | 'THIS_WEEK' | 'COMPETITIONS' | 'STATS' | 'INJURIES' | 'TRANSFERS'
  >('LIVE');
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[0]?.id || '');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('premier_league');
  const [inspectorSubTab, setInspectorSubTab] = useState<'timeline' | 'stats' | 'lineups' | 'player_stats'>('timeline');

  // Auto-update timer for live matches
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setMatches((prevMatches) =>
        prevMatches.map((m) => {
          if (m.status === 'LIVE' && m.minute && m.minute < 90) {
            const nextMin = m.minute + 1;
            // Chance of random event during live simulation
            const shouldEvent = Math.random() < 0.12;
            let newHomeScore = m.homeScore || 0;
            let newAwayScore = m.awayScore || 0;
            const newEvents = [...m.events];

            if (shouldEvent) {
              const eventRoll = Math.random();
              if (eventRoll < 0.35) {
                // Goal
                const isHome = Math.random() < 0.55;
                if (isHome) {
                  newHomeScore += 1;
                  newEvents.push({
                    minute: nextMin,
                    type: 'Goal',
                    team: 'home',
                    player: m.homeLineup?.[Math.floor(Math.random() * (m.homeLineup.length - 2)) + 2] || 'Attacker',
                    description: 'Goal! Swept into the corner after dynamic team combination!',
                  });
                } else {
                  newAwayScore += 1;
                  newEvents.push({
                    minute: nextMin,
                    type: 'Goal',
                    team: 'away',
                    player: m.awayLineup?.[Math.floor(Math.random() * (m.awayLineup.length - 2)) + 2] || 'Striker',
                    description: 'Goal! Rapid counter-attack clinical strike past keeper!',
                  });
                }
              } else if (eventRoll < 0.65) {
                // VAR Decision
                const isHome = Math.random() < 0.5;
                newEvents.push({
                  minute: nextMin,
                  type: 'VarDecision',
                  team: isHome ? 'home' : 'away',
                  player: isHome ? (m.homeLineup?.[2] || 'Defender') : (m.awayLineup?.[2] || 'Defender'),
                  description: 'VAR Check: Decision confirmed by video assistant referee after pitch-side monitor verification.',
                });
              } else if (eventRoll < 0.85) {
                // Yellow Card
                const isHome = Math.random() < 0.5;
                newEvents.push({
                  minute: nextMin,
                  type: 'YellowCard',
                  team: isHome ? 'home' : 'away',
                  player: isHome ? (m.homeLineup?.[4] || 'Midfielder') : (m.awayLineup?.[4] || 'Midfielder'),
                  description: 'Caution for professional foul stopping attacking progress.',
                });
              } else {
                // Substitution
                const isHome = Math.random() < 0.5;
                newEvents.push({
                  minute: nextMin,
                  type: 'Substitution',
                  team: isHome ? 'home' : 'away',
                  player: 'Fresh Substitute',
                  assistOrSub: isHome ? (m.homeLineup?.[8] || 'Winger') : (m.awayLineup?.[8] || 'Winger'),
                  description: 'Tactical replacement to adjust energy in wide areas.',
                });
              }
            }

            return {
              ...m,
              minute: nextMin,
              homeScore: newHomeScore,
              awayScore: newAwayScore,
              events: newEvents,
            };
          }
          return m;
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleManualStep = () => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === selectedMatchId && m.status === 'LIVE' && m.minute) {
          const nextMin = Math.min(90, m.minute + 1);
          return {
            ...m,
            minute: nextMin,
            events: [
              ...m.events,
              {
                minute: nextMin,
                type: 'VarDecision',
                team: 'home',
                player: 'Referee VAR Review',
                description: 'VAR Check complete: Ball over line confirmed by Goal-Line Technology.',
              },
            ],
          };
        }
        return m;
      })
    );
  };

  const selectedMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  const filteredMatches = matches.filter((m) => {
    if (activeTab === 'LIVE') return m.status === 'LIVE';
    if (activeTab === 'UPCOMING') return m.status === 'UPCOMING';
    if (activeTab === 'FINISHED') return m.status === 'FINISHED';
    if (activeTab === 'TODAY') return m.matchDayCategory === 'TODAY';
    if (activeTab === 'TOMORROW') return m.matchDayCategory === 'TOMORROW';
    if (activeTab === 'THIS_WEEK') return m.matchDayCategory === 'THIS WEEK';
    return true;
  });

  const activeLeagueTable = REAL_WORLD_LEAGUE_TABLES[selectedLeagueId] || REAL_WORLD_LEAGUE_TABLES.premier_league;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Real-World Football Data Mode Notice & Source Attribution Banner */}
      <div className="bg-gradient-to-r from-blue-950/90 via-slate-900 to-indigo-950/90 border border-blue-500/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400 shrink-0">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500 text-black">
                  REAL-WORLD FOOTBALL MODE
                </span>
                <span className="text-xs text-blue-200 font-bold">
                  Data Provider: {REAL_WORLD_DATA_PROVIDER_INFO.providerName}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-2.5 h-2.5" />
                  {REAL_WORLD_DATA_PROVIDER_INFO.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-3xl">
                {REAL_WORLD_DATA_PROVIDER_INFO.disclaimer} Real-time live match scores, timelines, authorized league tables, certified squad lineups, and transfer intelligence.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
            <button
              onClick={handleManualStep}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
              title="Manually simulate next minute and incident"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              <span>Simulate Minute</span>
            </button>

            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-2 ${
                autoRefresh
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/20 shadow'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {autoRefresh ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Live Stream: ON</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Stream Paused</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs border-b border-slate-800">
        {[
          { id: 'LIVE', label: '🔴 LIVE NOW', count: matches.filter((m) => m.status === 'LIVE').length },
          { id: 'TODAY', label: 'Today', count: matches.filter((m) => m.matchDayCategory === 'TODAY').length },
          { id: 'TOMORROW', label: 'Tomorrow', count: matches.filter((m) => m.matchDayCategory === 'TOMORROW').length },
          { id: 'THIS_WEEK', label: 'This Week', count: matches.filter((m) => m.matchDayCategory === 'THIS WEEK').length },
          { id: 'UPCOMING', label: 'Upcoming', count: matches.filter((m) => m.status === 'UPCOMING').length },
          { id: 'FINISHED', label: 'Finished Results', count: matches.filter((m) => m.status === 'FINISHED').length },
          { id: 'COMPETITIONS', label: 'League Tables', count: Object.keys(REAL_WORLD_LEAGUE_TABLES).length },
          { id: 'STATS', label: 'Statistics Center', count: REAL_WORLD_TOP_SCORERS.length },
          { id: 'INJURIES', label: 'Injuries & Bans', count: REAL_WORLD_INJURIES.length },
          { id: 'TRANSFERS', label: 'Verified Transfers', count: REAL_WORLD_TRANSFERS.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 font-bold rounded-t-xl transition shrink-0 flex items-center gap-1.5 border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400 bg-slate-900/80 shadow'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content Area based on Active Tab */}
      {activeTab === 'COMPETITIONS' ? (
        /* League Tables Section */
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Real-World Standings & Tables</span>
            </h3>

            <div className="flex items-center gap-2 flex-wrap">
              {Object.values(REAL_WORLD_LEAGUE_TABLES).map((league) => (
                <button
                  key={league.id}
                  onClick={() => setSelectedLeagueId(league.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    selectedLeagueId === league.id
                      ? 'bg-blue-600 text-white border-blue-500 shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {league.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex justify-between items-center text-xs">
              <span className="font-bold text-white text-sm">
                {activeLeagueTable.name} ({activeLeagueTable.season})
              </span>
              <span className="text-slate-400">{activeLeagueTable.country} • Verified Official Standings</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/40 text-slate-400 border-b border-slate-800/80 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-4 w-12">#</th>
                    <th className="py-3 px-4">Club</th>
                    <th className="py-3 px-3 text-center">PL</th>
                    <th className="py-3 px-3 text-center">W</th>
                    <th className="py-3 px-3 text-center">D</th>
                    <th className="py-3 px-3 text-center">L</th>
                    <th className="py-3 px-3 text-center">GF</th>
                    <th className="py-3 px-3 text-center">GA</th>
                    <th className="py-3 px-3 text-center">GD</th>
                    <th className="py-3 px-4 text-center font-bold">PTS</th>
                    <th className="py-3 px-4 text-center">Recent Form</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {activeLeagueTable.table.map((row) => (
                    <tr key={row.team} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-300">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                            row.rank <= 4
                              ? 'bg-blue-500/20 text-blue-400 font-black border border-blue-500/30'
                              : 'text-slate-400'
                          }`}
                        >
                          {row.rank}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0 shadow"
                          style={{ backgroundColor: row.color }}
                        />
                        <span className="font-semibold text-slate-100">{row.team}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-300">{row.played}</td>
                      <td className="py-3 px-3 text-center font-mono text-slate-300">{row.won}</td>
                      <td className="py-3 px-3 text-center font-mono text-slate-300">{row.drawn}</td>
                      <td className="py-3 px-3 text-center font-mono text-slate-300">{row.lost}</td>
                      <td className="py-3 px-3 text-center font-mono text-slate-400">{row.gf}</td>
                      <td className="py-3 px-3 text-center font-mono text-slate-400">{row.ga}</td>
                      <td className="py-3 px-3 text-center font-mono font-semibold text-slate-200">
                        {row.gd > 0 ? `+${row.gd}` : row.gd}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-black text-emerald-400 text-sm">
                        {row.points}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 font-mono text-[9px] font-bold">
                          {row.form.map((f, i) => (
                            <span
                              key={i}
                              className={`w-4 h-4 rounded flex items-center justify-center text-black font-black ${
                                f === 'W' ? 'bg-emerald-400' : f === 'D' ? 'bg-amber-400' : 'bg-rose-500 text-white'
                              }`}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === 'STATS' ? (
        /* Real-World Statistics Center */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <span>Real-World Player & Team Statistics Leaders</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">2024/2025 European Campaigns</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Goalscorers */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-500" />
                <span>Golden Boot Contenders</span>
              </h4>
              <div className="space-y-2 text-xs">
                {REAL_WORLD_TOP_SCORERS.map((s) => (
                  <div key={s.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono font-bold text-slate-500 text-xs w-4">#{s.rank}</span>
                      <div className="min-w-0">
                        <span className="font-bold text-white truncate block">{s.name}</span>
                        <span className="text-[11px] text-slate-400">{s.team} • {s.competition}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-base font-mono text-emerald-400">{s.value}</span>
                      <span className="text-[10px] text-slate-500 block font-mono">{s.secondaryStat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Playmakers / Assists */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Top Playmakers & Assists</span>
              </h4>
              <div className="space-y-2 text-xs">
                {REAL_WORLD_TOP_ASSISTS.map((s) => (
                  <div key={s.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono font-bold text-slate-500 text-xs w-4">#{s.rank}</span>
                      <div className="min-w-0">
                        <span className="font-bold text-white truncate block">{s.name}</span>
                        <span className="text-[11px] text-slate-400">{s.team} • {s.competition}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-base font-mono text-blue-400">{s.value}</span>
                      <span className="text-[10px] text-slate-500 block font-mono">{s.secondaryStat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Style & Dominance Metrics */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Team Dominance & Control</span>
              </h4>
              <div className="space-y-2 text-xs">
                {REAL_WORLD_TEAM_STATS.map((t) => (
                  <div key={t.team} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono font-bold text-slate-500 text-xs w-4">#{t.rank}</span>
                      <div className="min-w-0">
                        <span className="font-bold text-white truncate block">{t.team}</span>
                        <span className="text-[11px] text-slate-400">{t.league}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-sm font-mono text-amber-300">{t.value}</span>
                      <span className="text-[10px] text-slate-500 block font-mono">{t.secondaryStat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'INJURIES' ? (
        /* Real-World Injuries & Suspensions */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Real-World Medical & Disciplinary Bulletins</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Medical Clearances & Suspensions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Injuries */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Active Player Injuries ({REAL_WORLD_INJURIES.length})</span>
              </h4>
              <div className="space-y-2.5 text-xs">
                {REAL_WORLD_INJURIES.map((inj) => (
                  <div key={inj.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{inj.player}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inj.severity === 'Severe'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {inj.severity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>{inj.team}</span>
                      <span className="font-mono text-rose-300 font-semibold">{inj.injury}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
                      <span>Expected Return: {inj.expectedReturn}</span>
                      <span className="text-slate-400 font-bold">{inj.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suspensions */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-500" />
                <span>Disciplinary Suspensions ({REAL_WORLD_SUSPENSIONS.length})</span>
              </h4>
              <div className="space-y-2.5 text-xs">
                {REAL_WORLD_SUSPENSIONS.map((susp) => (
                  <div key={susp.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{susp.player}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        {susp.matchesRemaining === 0 ? 'Clearance Complete' : `${susp.matchesRemaining} Match Ban`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>{susp.team} • {susp.competition}</span>
                      <span className="font-mono text-amber-300">{susp.reason}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'TRANSFERS' ? (
        /* Real Transfers Section */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Real-World Verified Transfers & Market Intelligence</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Official Club Clearances & UEFA Clearances</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REAL_WORLD_TRANSFERS.map((t) => (
              <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.status === 'Confirmed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {t.status}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{t.date}</span>
                </div>

                <div>
                  <h4 className="font-black text-white text-base">{t.player}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-300 mt-1 font-semibold">
                    <span>{t.fromTeam}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-blue-400 font-bold">{t.toTeam}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 font-mono">
                  <span className="font-bold text-emerald-400">{t.fee}</span>
                  <span className="text-[10px] text-slate-500">{t.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Live / Matches Layout: Matches Column + Detailed Match Inspector */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Matches List (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>{activeTab} Matches ({filteredMatches.length})</span>
              <span className="text-[10px] text-slate-500 font-mono">Click to inspect fixture</span>
            </h4>

            {filteredMatches.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 text-xs">
                No fixtures found for this filter category.
              </div>
            ) : (
              filteredMatches.map((m) => {
                const isSelected = selectedMatchId === m.id;

                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMatchId(m.id)}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'bg-slate-900 border-blue-500/80 shadow-2xl ring-1 ring-blue-500/30'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-semibold">{m.competition}</span>
                      {m.status === 'LIVE' ? (
                        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-mono font-bold text-[10px] animate-pulse border border-rose-500/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span>LIVE {m.minute}'</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[10px]">{m.startTime}</span>
                      )}
                    </div>

                    {/* Clubs & Scores */}
                    <div className="space-y-1.5 text-sm font-bold">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow"
                            style={{ backgroundColor: m.homeColor }}
                          />
                          <span className="text-white truncate max-w-[190px]">{m.homeTeam}</span>
                        </div>
                        <span className="font-mono text-base font-black text-white">
                          {m.status !== 'UPCOMING' ? m.homeScore : '-'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow"
                            style={{ backgroundColor: m.awayColor }}
                          />
                          <span className="text-white truncate max-w-[190px]">{m.awayTeam}</span>
                        </div>
                        <span className="font-mono text-base font-black text-white">
                          {m.status !== 'UPCOMING' ? m.awayScore : '-'}
                        </span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 truncate pt-1 border-t border-slate-800/60 font-mono">
                      📍 {m.venue}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Detailed Match Inspector & Timeline (7 Cols) */}
          <div className="lg:col-span-7">
            {selectedMatch ? (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-6 shadow-2xl sticky top-20">
                {/* Header Scoreboard */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-center space-y-2">
                  <span className="text-xs text-blue-400 font-bold tracking-wide">
                    {selectedMatch.competition} • {selectedMatch.venue}
                  </span>

                  <div className="flex items-center justify-around">
                    <div className="text-center w-5/12">
                      <div
                        className="w-12 h-12 rounded-2xl mx-auto mb-1.5 flex items-center justify-center font-black text-white text-xs border border-white/20 shadow-lg"
                        style={{ backgroundColor: selectedMatch.homeColor }}
                      >
                        {selectedMatch.homeTeam.slice(0, 3).toUpperCase()}
                      </div>
                      <h4 className="font-black text-white text-sm truncate">{selectedMatch.homeTeam}</h4>
                    </div>

                    <div className="text-center w-2/12">
                      {selectedMatch.status === 'UPCOMING' ? (
                        <div className="text-xs font-mono text-slate-400 font-bold bg-slate-900 py-1.5 px-2.5 rounded-xl border border-slate-800">
                          VS
                        </div>
                      ) : (
                        <div>
                          <div className="text-3xl font-black font-mono text-white tracking-wider">
                            {selectedMatch.homeScore} : {selectedMatch.awayScore}
                          </div>
                          <span className="text-[10px] font-mono font-bold text-rose-400 animate-pulse block mt-0.5">
                            {selectedMatch.status === 'LIVE' ? `${selectedMatch.minute}' MIN` : 'FULL TIME'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-center w-5/12">
                      <div
                        className="w-12 h-12 rounded-2xl mx-auto mb-1.5 flex items-center justify-center font-black text-white text-xs border border-white/20 shadow-lg"
                        style={{ backgroundColor: selectedMatch.awayColor }}
                      >
                        {selectedMatch.awayTeam.slice(0, 3).toUpperCase()}
                      </div>
                      <h4 className="font-black text-white text-sm truncate">{selectedMatch.awayTeam}</h4>
                    </div>
                  </div>
                </div>

                {/* Sub-tabs for Match Inspector */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setInspectorSubTab('timeline')}
                    className={`flex-1 py-1.5 font-bold rounded-lg transition ${
                      inspectorSubTab === 'timeline' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Timeline & VAR
                  </button>
                  <button
                    onClick={() => setInspectorSubTab('stats')}
                    className={`flex-1 py-1.5 font-bold rounded-lg transition ${
                      inspectorSubTab === 'stats' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Match Stats
                  </button>
                  <button
                    onClick={() => setInspectorSubTab('lineups')}
                    className={`flex-1 py-1.5 font-bold rounded-lg transition ${
                      inspectorSubTab === 'lineups' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Lineups
                  </button>
                  <button
                    onClick={() => setInspectorSubTab('player_stats')}
                    className={`flex-1 py-1.5 font-bold rounded-lg transition ${
                      inspectorSubTab === 'player_stats' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Player Ratings
                  </button>
                </div>

                {/* Sub-tab 1: Timeline & VAR Events */}
                {inspectorSubTab === 'timeline' && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 block">Official Match Events & VAR Feed</span>
                    {selectedMatch.events.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-4 text-center">No match events recorded yet.</p>
                    ) : (
                      <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
                        {selectedMatch.events.map((ev, idx) => (
                          <div
                            key={idx}
                            className={`flex items-start gap-3 text-xs p-2.5 rounded-xl border ${
                              ev.type === 'VarDecision'
                                ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                                : ev.type === 'Goal'
                                ? 'bg-emerald-950/40 border-emerald-500/40'
                                : 'bg-slate-950/70 border-slate-800/80'
                            }`}
                          >
                            <span className="font-mono font-black text-emerald-400 w-8 shrink-0">{ev.minute}'</span>
                            <span className="text-sm shrink-0">
                              {ev.type === 'Goal'
                                ? '⚽'
                                : ev.type === 'VarDecision'
                                ? '📺'
                                : ev.type === 'YellowCard'
                                ? '🟨'
                                : ev.type === 'RedCard'
                                ? '🟥'
                                : '🔄'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <span className="font-bold text-white mr-1.5">{ev.player}</span>
                              <span className="text-slate-300 text-[11px] block mt-0.5 leading-snug">{ev.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-tab 2: Match Stats Comparison */}
                {inspectorSubTab === 'stats' && selectedMatch.stats && (
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60 space-y-3 text-xs">
                    <span className="text-xs font-bold text-slate-300 block mb-1">Live Match Statistics Comparison</span>

                    {/* Possession */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-semibold text-slate-300">
                        <span>{selectedMatch.stats.possessionHome}%</span>
                        <span className="text-slate-400">Possession</span>
                        <span>{selectedMatch.stats.possessionAway}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full flex overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{ width: `${selectedMatch.stats.possessionHome}%` }} />
                        <div className="bg-amber-400 h-full" style={{ width: `${selectedMatch.stats.possessionAway}%` }} />
                      </div>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                      <span className="font-bold text-white">{selectedMatch.stats.shotsHome}</span>
                      <span className="text-slate-400">Total Shots</span>
                      <span className="font-bold text-white">{selectedMatch.stats.shotsAway}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                      <span className="font-bold text-blue-400">{selectedMatch.stats.shotsOnTargetHome}</span>
                      <span className="text-slate-400">Shots on Target</span>
                      <span className="font-bold text-amber-400">{selectedMatch.stats.shotsOnTargetAway}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                      <span className="font-bold text-white">{selectedMatch.stats.cornersHome}</span>
                      <span className="text-slate-400">Corners</span>
                      <span className="font-bold text-white">{selectedMatch.stats.cornersAway}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                      <span className="font-bold text-white">{selectedMatch.stats.foulsHome}</span>
                      <span className="text-slate-400">Fouls Conceded</span>
                      <span className="font-bold text-white">{selectedMatch.stats.foulsAway}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                      <span className="font-bold text-white">{selectedMatch.stats.offsidesHome}</span>
                      <span className="text-slate-400">Offsides</span>
                      <span className="font-bold text-white">{selectedMatch.stats.offsidesAway}</span>
                    </div>

                    {selectedMatch.stats.passAccuracyHome && (
                      <div className="flex justify-between py-1.5">
                        <span className="font-bold text-emerald-400">{selectedMatch.stats.passAccuracyHome}%</span>
                        <span className="text-slate-400">Passing Accuracy</span>
                        <span className="font-bold text-emerald-400">{selectedMatch.stats.passAccuracyAway}%</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-tab 3: Starting Lineups */}
                {inspectorSubTab === 'lineups' && (
                  <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                      <span className="font-bold text-white block mb-2">{selectedMatch.homeTeam} XI</span>
                      <ul className="text-[11px] text-slate-300 space-y-1">
                        {selectedMatch.homeLineup?.map((p, i) => (
                          <li key={i} className="truncate flex items-center gap-1.5">
                            <span className="text-slate-500 font-mono text-[10px] w-4">{i + 1}.</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                      <span className="font-bold text-white block mb-2">{selectedMatch.awayTeam} XI</span>
                      <ul className="text-[11px] text-slate-300 space-y-1">
                        {selectedMatch.awayLineup?.map((p, i) => (
                          <li key={i} className="truncate flex items-center gap-1.5">
                            <span className="text-slate-500 font-mono text-[10px] w-4">{i + 1}.</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Sub-tab 4: Individual Player Ratings & Stats */}
                {inspectorSubTab === 'player_stats' && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-300 block">Verified Match Performance Ratings</span>
                    {selectedMatch.playerStats && selectedMatch.playerStats.length > 0 ? (
                      <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar">
                        {selectedMatch.playerStats.map((ps, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                                  ps.team === 'home' ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {ps.position || 'MID'}
                              </span>
                              <span className="font-bold text-white truncate">{ps.player}</span>
                            </div>
                            <div className="flex items-center gap-3 text-right shrink-0">
                              <div className="text-[10px] text-slate-400 font-mono">
                                {ps.goals > 0 && <span className="text-emerald-400 mr-1.5">⚽ {ps.goals}</span>}
                                {ps.assists > 0 && <span className="text-blue-400 mr-1.5">🎯 {ps.assists}</span>}
                                <span>KP: {ps.keyPasses}</span>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded-lg font-mono font-black text-xs ${
                                  ps.rating >= 8.5
                                    ? 'bg-emerald-500 text-black'
                                    : ps.rating >= 7.5
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                ⭐ {ps.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic py-4 text-center">
                        Player performance ratings will be finalized upon match conclusion.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                Select a fixture from the list to inspect live statistics, lineups, and match events.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
