import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { MatchEvent, MatchFixture, MatchStats, Player } from '../../types/football';
import { simulateFullMatch } from '../../engine/matchEngine';
import { LiveMatchPitch } from './LiveMatchPitch';
import {
  Trophy,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Sparkles,
  Shield,
  Flame,
  Award,
  MessageSquare,
  ChevronRight,
  UserCheck,
  Clock,
  Target,
  AlertTriangle,
  Search,
  Filter,
  ArrowDown,
  Activity,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface LiveMatchModalProps {
  fixture: MatchFixture;
}

export const LiveMatchModal: React.FC<LiveMatchModalProps> = ({ fixture }) => {
  const { state, completeMatch } = useGame();

  const homeClub = state.clubs[fixture.homeClubId];
  const awayClub = state.clubs[fixture.awayClubId];
  const isUserHome = fixture.homeClubId === state.userClubId;

  // Prepare squads
  const homePlayers = Object.values(state.players).filter((p) => p.clubId === fixture.homeClubId);
  const awayPlayers = Object.values(state.players).filter((p) => p.clubId === fixture.awayClubId);

  // Pre-calculate full simulated match events and timeline
  const fullSimulationRef = useRef<ReturnType<typeof simulateFullMatch> | null>(null);
  if (!fullSimulationRef.current) {
    fullSimulationRef.current = simulateFullMatch(
      fixture,
      homeClub,
      awayClub,
      homePlayers,
      awayPlayers,
      isUserHome ? state.tactics : undefined
    );
  }

  const simResult = fullSimulationRef.current;

  // Live match playback state
  const [minute, setMinute] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 2 | 5>(2);
  const [currentMentality, setCurrentMentality] = useState(state.tactics.mentality);
  const [activeShout, setActiveShout] = useState<string | null>(null);
  const [postMatchStep, setPostMatchStep] = useState<'match' | 'report' | 'press'>('match');
  const [pressAnswersChosen, setPressAnswersChosen] = useState<number[]>([]);

  // Highlights feed state & filters
  const [highlightsFilter, setHighlightsFilter] = useState<'all' | 'goals_shots' | 'fouls_cards' | 'saves'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const highlightsBottomRef = useRef<HTMLDivElement>(null);
  const highlightsContainerRef = useRef<HTMLDivElement>(null);

  // Derived current state up to 'minute'
  const visibleEvents = simResult.events.filter((e) => e.minute <= minute);
  const homeGoals = visibleEvents.filter((e) => e.type === 'Goal' && e.clubId === homeClub.id).length;
  const awayGoals = visibleEvents.filter((e) => e.type === 'Goal' && e.clubId === awayClub.id).length;

  // Calculate scaled stats up to current minute
  const progressRatio = Math.max(0.05, Math.min(1, minute / 90));
  const currentStats: MatchStats = {
    ...simResult.stats,
    shotsHome: Math.max(homeGoals, Math.round(simResult.stats.shotsHome * progressRatio)),
    shotsAway: Math.max(awayGoals, Math.round(simResult.stats.shotsAway * progressRatio)),
    shotsOnTargetHome: Math.max(homeGoals, Math.round(simResult.stats.shotsOnTargetHome * progressRatio)),
    shotsOnTargetAway: Math.max(awayGoals, Math.round(simResult.stats.shotsOnTargetAway * progressRatio)),
    xGHome: Math.round(simResult.stats.xGHome * progressRatio * 100) / 100,
    xGAway: Math.round(simResult.stats.xGAway * progressRatio * 100) / 100,
    cornersHome: Math.round(simResult.stats.cornersHome * progressRatio),
    cornersAway: Math.round(simResult.stats.cornersAway * progressRatio),
    foulsHome: Math.round(simResult.stats.foulsHome * progressRatio),
    foulsAway: Math.round(simResult.stats.foulsAway * progressRatio),
  };

  // Highlights key counters
  const totalKeyMoments = visibleEvents.length;
  const countGoals = visibleEvents.filter((e) => e.type === 'Goal' || e.type === 'PenaltyGoal').length;
  const countShots = visibleEvents.filter((e) => e.type === 'Shot' || e.type === 'Woodwork' || e.type === 'KeySave' || e.type === 'Goal').length;
  const countFouls = visibleEvents.filter((e) => e.type === 'Foul' || e.type === 'YellowCard' || e.type === 'RedCard').length;
  const countSaves = visibleEvents.filter((e) => e.type === 'KeySave').length;

  // Filtered highlights for feed display
  const filteredEvents = visibleEvents.filter((ev) => {
    // Type filter
    if (highlightsFilter === 'goals_shots') {
      if (!['Goal', 'PenaltyGoal', 'Shot', 'Woodwork'].includes(ev.type)) return false;
    } else if (highlightsFilter === 'fouls_cards') {
      if (!['Foul', 'YellowCard', 'RedCard'].includes(ev.type)) return false;
    } else if (highlightsFilter === 'saves') {
      if (!['KeySave', 'VarDecision', 'Injury'].includes(ev.type)) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const p = ev.playerId ? state.players[ev.playerId] : null;
      const club = state.clubs[ev.clubId];
      const match =
        ev.description.toLowerCase().includes(q) ||
        ev.type.toLowerCase().includes(q) ||
        (p && p.name.toLowerCase().includes(q)) ||
        (club && club.name.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  // Auto-scroll to bottom of feed on new events
  useEffect(() => {
    if (autoScroll && highlightsBottomRef.current) {
      highlightsBottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [visibleEvents.length, autoScroll]);

  // Latest visible event for reactive updates
  const latestEvent = visibleEvents[visibleEvents.length - 1];

  // Animation interval for minute progression
  useEffect(() => {
    if (!isPlaying || minute >= 90) return;

    const intervalTime = Math.max(50, 400 / speedMultiplier);
    const timer = setInterval(() => {
      setMinute((prev) => {
        if (prev >= 90) {
          setIsPlaying(false);
          return 90;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, minute, speedMultiplier]);

  // Handle instant jump to full time
  const handleInstantSim = () => {
    setMinute(90);
    setIsPlaying(false);
  };

  // Manager Sideline Shouts
  const handleShout = (shoutName: string) => {
    setActiveShout(shoutName);
    setTimeout(() => setActiveShout(null), 3000);
  };

  // Complete match and finalize results
  const handleFinalize = () => {
    completeMatch(
      fixture.id,
      simResult.homeScore,
      simResult.awayScore,
      simResult.stats,
      simResult.events,
      simResult.playerRatings
    );
  };

  // Find Player of the Match
  let potmId = '';
  let highestRating = 0;
  Object.entries(simResult.playerRatings).forEach(([id, rating]) => {
    if (rating > highestRating) {
      highestRating = rating;
      potmId = id;
    }
  });
  const potmPlayer = state.players[potmId];

  // Helper function to format highlight badge metadata
  const getEventBadgeMeta = (type: MatchEvent['type']) => {
    switch (type) {
      case 'Goal':
      case 'PenaltyGoal':
        return {
          label: 'GOAL',
          icon: '⚽',
          badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-emerald-500/20',
          dotColor: 'bg-emerald-400',
          isMajor: true,
        };
      case 'Shot':
        return {
          label: 'SHOT',
          icon: '🎯',
          badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sky-500/10',
          dotColor: 'bg-sky-400',
          isMajor: false,
        };
      case 'Woodwork':
        return {
          label: 'WOODWORK',
          icon: '🪵',
          badgeClass: 'bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-amber-500/15',
          dotColor: 'bg-amber-400',
          isMajor: true,
        };
      case 'KeySave':
        return {
          label: 'KEY SAVE',
          icon: '🧤',
          badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-indigo-500/10',
          dotColor: 'bg-indigo-400',
          isMajor: false,
        };
      case 'Foul':
        return {
          label: 'FOUL',
          icon: '⚠️',
          badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-orange-500/10',
          dotColor: 'bg-orange-400',
          isMajor: false,
        };
      case 'YellowCard':
        return {
          label: 'YELLOW CARD',
          icon: '🟨',
          badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50 shadow-yellow-500/15',
          dotColor: 'bg-yellow-400',
          isMajor: true,
        };
      case 'RedCard':
        return {
          label: 'RED CARD',
          icon: '🟥',
          badgeClass: 'bg-rose-500/25 text-rose-300 border-rose-500/60 shadow-rose-500/20',
          dotColor: 'bg-rose-500',
          isMajor: true,
        };
      case 'VarDecision':
        return {
          label: 'VAR CHECK',
          icon: '🖥️',
          badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          dotColor: 'bg-cyan-400',
          isMajor: true,
        };
      case 'Injury':
        return {
          label: 'INJURY',
          icon: '🚑',
          badgeClass: 'bg-red-500/20 text-red-300 border-red-500/40',
          dotColor: 'bg-red-400',
          isMajor: true,
        };
      default:
        return {
          label: 'EVENT',
          icon: '📢',
          badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
          dotColor: 'bg-slate-400',
          isMajor: false,
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Scoreboard Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 p-4 md:p-6 flex items-center justify-between text-white relative">
          {/* Home Club */}
          <div className="flex items-center gap-3 w-1/3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-md border border-white/10 shrink-0"
              style={{ backgroundColor: homeClub?.primaryColor || '#10B981', color: homeClub?.textColor || '#FFF' }}
            >
              {homeClub?.shortName || 'HOM'}
            </div>
            <div>
              <h3 className="font-black text-sm md:text-base tracking-wide truncate">{homeClub?.name}</h3>
              <span className="text-[11px] text-slate-400">Home • {isUserHome ? 'You' : 'AI'}</span>
            </div>
          </div>

          {/* Center: Live Minute & Score */}
          <div className="text-center w-1/3">
            <div className="inline-block bg-slate-800/80 border border-slate-700/80 px-3 py-1 rounded-full text-[11px] font-mono font-bold text-emerald-400 mb-1">
              {minute === 0 ? 'KICK OFF' : minute >= 90 ? 'FULL TIME' : `${minute}' MIN`}
            </div>
            <div className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white flex items-center justify-center gap-3">
              <span>{homeGoals}</span>
              <span className="text-slate-600">:</span>
              <span>{awayGoals}</span>
            </div>
            <span className="text-[10px] text-slate-400 block font-medium">
              xG: {currentStats.xGHome.toFixed(2)} - {currentStats.xGAway.toFixed(2)}
            </span>
          </div>

          {/* Away Club */}
          <div className="flex items-center justify-end gap-3 w-1/3 text-right">
            <div>
              <h3 className="font-black text-sm md:text-base tracking-wide truncate">{awayClub?.name}</h3>
              <span className="text-[11px] text-slate-400">Away • {!isUserHome ? 'You' : 'AI'}</span>
            </div>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-md border border-white/10 shrink-0"
              style={{ backgroundColor: awayClub?.primaryColor || '#3B82F6', color: awayClub?.textColor || '#FFF' }}
            >
              {awayClub?.shortName || 'AWY'}
            </div>
          </div>
        </div>

        {/* Modal View State Toggle: Live Match vs Post-Match Analysis */}
        {postMatchStep === 'match' ? (
          <div className="p-4 md:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
            {/* 2D Animated Pitch Radar & Live Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Live Match Pitch View (8 Cols) */}
              <div className="lg:col-span-8">
                <LiveMatchPitch
                  homeClub={homeClub}
                  awayClub={awayClub}
                  homePlayers={homePlayers}
                  awayPlayers={awayPlayers}
                  homeTactics={isUserHome ? state.tactics : undefined}
                  awayTactics={!isUserHome ? state.tactics : undefined}
                  minute={minute}
                  simResult={simResult}
                  visibleEvents={visibleEvents}
                  latestEvent={latestEvent}
                  activeShout={activeShout}
                  speedMultiplier={speedMultiplier}
                />
              </div>

              {/* Live Match Stats & Shouts (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                {/* Live Stats Table */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2.5 text-xs">
                  <h4 className="font-bold text-slate-300 text-xs flex items-center justify-between border-b border-slate-700 pb-1.5">
                    <span>Live Match Statistics</span>
                    <span className="text-[10px] text-slate-400">Minute {minute}</span>
                  </h4>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-semibold text-slate-300">
                        <span>{currentStats.possessionHome}%</span>
                        <span className="text-slate-400">Possession</span>
                        <span>{currentStats.possessionAway}%</span>
                      </div>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full flex overflow-hidden">
                        <div className="bg-emerald-400 h-full" style={{ width: `${currentStats.possessionHome}%` }} />
                        <div className="bg-blue-400 h-full" style={{ width: `${currentStats.possessionAway}%` }} />
                      </div>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-700/40">
                      <span className="font-bold text-white">{currentStats.shotsHome}</span>
                      <span className="text-slate-400">Total Shots</span>
                      <span className="font-bold text-white">{currentStats.shotsAway}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-700/40">
                      <span className="font-bold text-emerald-400">{currentStats.shotsOnTargetHome}</span>
                      <span className="text-slate-400">Shots on Target</span>
                      <span className="font-bold text-blue-400">{currentStats.shotsOnTargetAway}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-700/40">
                      <span className="font-bold text-white">{currentStats.cornersHome}</span>
                      <span className="text-slate-400">Corners</span>
                      <span className="font-bold text-white">{currentStats.cornersAway}</span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="font-mono text-emerald-400">{currentStats.xGHome.toFixed(2)}</span>
                      <span className="text-slate-400 font-semibold">xG (Expected Goals)</span>
                      <span className="font-mono text-blue-400">{currentStats.xGAway.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* In-Game Sideline Shouts */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 space-y-2">
                  <span className="text-[11px] font-bold text-slate-300 block">Manager Sideline Shouts</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <button
                      onClick={() => handleShout('Demand More')}
                      className="py-1.5 px-2 rounded bg-slate-700 hover:bg-slate-600 font-semibold text-slate-200 transition"
                    >
                      🗣️ Demand More
                    </button>
                    <button
                      onClick={() => handleShout('Praise')}
                      className="py-1.5 px-2 rounded bg-slate-700 hover:bg-slate-600 font-semibold text-slate-200 transition"
                    >
                      👏 Praise Team
                    </button>
                    <button
                      onClick={() => handleShout('Focus')}
                      className="py-1.5 px-2 rounded bg-slate-700 hover:bg-slate-600 font-semibold text-slate-200 transition"
                    >
                      🧠 Stay Focused
                    </button>
                    <button
                      onClick={() => handleShout('Fire Up')}
                      className="py-1.5 px-2 rounded bg-slate-700 hover:bg-slate-600 font-semibold text-slate-200 transition"
                    >
                      🔥 Fire Up!
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Text-Based Highlights Feed (Key Moments) */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 md:p-5 space-y-4 shadow-xl">
              {/* Highlights Feed Header & Summary Counters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-black text-sm md:text-base text-white tracking-wide">
                      Live Match Highlights Feed
                    </h4>
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-900 border border-slate-700 text-slate-300">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          minute >= 90 ? 'bg-slate-500' : 'bg-emerald-400 animate-pulse'
                        }`}
                      />
                      {minute >= 90 ? 'FULL TIME' : 'SIMULATING'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Real-time text log of key moments: shots, goals, saves, fouls, and disciplinary actions.
                  </p>
                </div>

                {/* Quick Event Summary Counters */}
                <div className="flex items-center flex-wrap gap-2 text-[11px] font-mono font-bold">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                    <span>⚽</span>
                    <span>Goals: {countGoals}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center gap-1">
                    <span>🎯</span>
                    <span>Shots: {countShots}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>Fouls: {countFouls}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center gap-1">
                    <span>🧤</span>
                    <span>Saves: {countSaves}</span>
                  </span>
                </div>
              </div>

              {/* Filter Tabs & Search Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                {/* Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar text-xs">
                  <button
                    onClick={() => setHighlightsFilter('all')}
                    className={`px-3 py-1 rounded-lg font-bold transition shrink-0 flex items-center gap-1.5 ${
                      highlightsFilter === 'all'
                        ? 'bg-emerald-500 text-black shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>All Moments</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
                      {totalKeyMoments}
                    </span>
                  </button>

                  <button
                    onClick={() => setHighlightsFilter('goals_shots')}
                    className={`px-3 py-1 rounded-lg font-bold transition shrink-0 flex items-center gap-1.5 ${
                      highlightsFilter === 'goals_shots'
                        ? 'bg-sky-500 text-black shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>Goals & Shots</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
                      {countGoals + visibleEvents.filter((e) => e.type === 'Shot' || e.type === 'Woodwork').length}
                    </span>
                  </button>

                  <button
                    onClick={() => setHighlightsFilter('fouls_cards')}
                    className={`px-3 py-1 rounded-lg font-bold transition shrink-0 flex items-center gap-1.5 ${
                      highlightsFilter === 'fouls_cards'
                        ? 'bg-orange-500 text-black shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>Fouls & Cards</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
                      {countFouls}
                    </span>
                  </button>

                  <button
                    onClick={() => setHighlightsFilter('saves')}
                    className={`px-3 py-1 rounded-lg font-bold transition shrink-0 flex items-center gap-1.5 ${
                      highlightsFilter === 'saves'
                        ? 'bg-indigo-500 text-white shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>Saves</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
                      {countSaves}
                    </span>
                  </button>
                </div>

                {/* Search & Auto-Scroll Toggle */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search player / moment..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      const next = !autoScroll;
                      setAutoScroll(next);
                      if (next && highlightsBottomRef.current) {
                        highlightsBottomRef.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    title="Toggle auto-scroll to newest highlight"
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition shrink-0 flex items-center gap-1 ${
                      autoScroll
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <ArrowDown className={`w-3 h-3 ${autoScroll ? 'animate-bounce' : ''}`} />
                    <span>Auto-scroll</span>
                  </button>
                </div>
              </div>

              {/* Feed Stream Content */}
              <div
                ref={highlightsContainerRef}
                className="space-y-2 max-h-72 md:max-h-80 overflow-y-auto pr-1 custom-scrollbar rounded-xl bg-slate-950/60 p-2 border border-slate-900"
              >
                {/* Match Kick-off Marker */}
                <div className="flex items-center gap-3 py-1 px-2 text-[11px] text-slate-500 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
                  <span>00' • MATCH KICK-OFF — The referee starts the fixture!</span>
                  <div className="flex-1 h-px bg-slate-800/80" />
                </div>

                {filteredEvents.length === 0 ? (
                  <div className="text-center py-8 px-4 text-slate-500">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
                    <p className="text-xs font-semibold">
                      {visibleEvents.length === 0
                        ? 'Awaiting match action... Highlights will generate in real time as shots, goals, and fouls occur.'
                        : 'No key moments match the selected filter or search term.'}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-1">
                      {visibleEvents.length === 0 ? 'Simulation running at ' + speedMultiplier + 'x speed.' : 'Try changing or clearing the filters above.'}
                    </p>
                  </div>
                ) : (
                  filteredEvents.map((ev, idx) => {
                    const badgeMeta = getEventBadgeMeta(ev.type);
                    const eventClub = state.clubs[ev.clubId];
                    const isLatest = idx === filteredEvents.length - 1 && isPlaying;
                    const eventPlayer = ev.playerId ? state.players[ev.playerId] : null;

                    // Show half-time interval divider right after 45'
                    const showHalfTimeDivider =
                      ev.minute >= 45 &&
                      (idx === 0 || filteredEvents[idx - 1].minute < 45);

                    return (
                      <React.Fragment key={idx}>
                        {showHalfTimeDivider && (
                          <div className="flex items-center gap-3 py-1.5 px-2 text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg my-1">
                            <span>⏸️</span>
                            <span>45' • HALF TIME INTERVAL</span>
                            <div className="flex-1 h-px bg-amber-500/30" />
                            <span className="text-[10px] text-slate-400 font-normal">
                              Score: {visibleEvents.filter((e) => e.type === 'Goal' && e.minute <= 45 && e.clubId === homeClub.id).length} - {visibleEvents.filter((e) => e.type === 'Goal' && e.minute <= 45 && e.clubId === awayClub.id).length}
                            </span>
                          </div>
                        )}

                        <div
                          className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                            isLatest
                              ? 'bg-slate-900/90 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                              : badgeMeta.isMajor
                              ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                              : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/60'
                          }`}
                        >
                          {/* Timestamp Marker */}
                          <div className="flex flex-col items-center shrink-0">
                            <div className="flex items-center gap-1 font-mono font-black text-xs px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-emerald-400 shadow-inner">
                              <Clock className="w-3 h-3 text-emerald-400" />
                              <span>{ev.minute}'</span>
                            </div>
                            {isLatest && (
                              <span className="text-[9px] font-mono font-black text-emerald-400 uppercase tracking-tighter mt-1 animate-pulse">
                                NEW
                              </span>
                            )}
                          </div>

                          {/* Event Content */}
                          <div className="flex-1 min-w-0 space-y-1.5">
                            {/* Badges line: Category + Club + Player */}
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Event Category Badge */}
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 ${badgeMeta.badgeClass}`}
                              >
                                <span>{badgeMeta.icon}</span>
                                <span>{badgeMeta.label}</span>
                              </span>

                              {/* Club Crest Badge */}
                              {eventClub && (
                                <span
                                  className="px-2 py-0.5 rounded text-[10px] font-bold border border-white/10 shrink-0"
                                  style={{
                                    backgroundColor: eventClub.primaryColor || '#334155',
                                    color: eventClub.textColor || '#FFFFFF',
                                  }}
                                >
                                  {eventClub.shortName || eventClub.name}
                                </span>
                              )}

                              {/* Player Name Pill if attached */}
                              {eventPlayer && (
                                <span className="text-[11px] font-semibold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60 truncate">
                                  {eventPlayer.name} ({eventPlayer.position})
                                </span>
                              )}
                            </div>

                            {/* Narrative Commentary Text */}
                            <p className="text-xs text-slate-200 leading-relaxed font-medium">
                              {ev.description}
                            </p>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                )}

                {/* Match Full-time Marker */}
                {minute >= 90 && (
                  <div className="flex items-center gap-3 py-1.5 px-2 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mt-2">
                    <span>🏁</span>
                    <span>90' • FULL TIME WHISTLE — Match concluded!</span>
                    <div className="flex-1 h-px bg-emerald-500/30" />
                    <span className="text-[10px] text-white">
                      Final: {homeGoals} - {awayGoals}
                    </span>
                  </div>
                )}

                {/* Auto-scroll anchor */}
                <div ref={highlightsBottomRef} />
              </div>
            </div>
          </div>
        ) : (
          /* Post-Match Report & Player Ratings View */
          <div className="p-4 md:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
            {/* Player of the Match Banner */}
            {potmPlayer && (
              <div className="bg-gradient-to-r from-amber-500/20 via-slate-800 to-amber-500/20 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                      Player of the Match
                    </span>
                    <h4 className="font-black text-base text-white">{potmPlayer.name}</h4>
                    <span className="text-xs text-slate-400">
                      {potmPlayer.position} • {state.clubs[potmPlayer.clubId]?.name}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {simResult.playerRatings[potmId]?.toFixed(1)}
                  </span>
                  <span className="block text-[10px] text-slate-400">Match Rating</span>
                </div>
              </div>
            )}

            {/* Player Ratings Grid */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="font-bold text-sm text-slate-200">Starting XI Performance Ratings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {homePlayers.slice(0, 11).map((p) => {
                  const rating = simResult.playerRatings[p.id] || 6.5;
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-400 text-[10px]">{p.position}</span>
                        <span className="font-semibold text-white">{p.name}</span>
                      </div>
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded ${
                          rating >= 7.5
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : rating >= 6.5
                            ? 'bg-slate-800 text-slate-200'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {rating.toFixed(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Footer Playback & Complete Actions */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3">
          {postMatchStep === 'match' ? (
            <>
              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
                  {([1, 2, 5] as (1 | 2 | 5)[]).map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setSpeedMultiplier(spd)}
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        speedMultiplier === spd ? 'bg-emerald-500 text-black' : 'text-slate-400'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleInstantSim}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1 transition"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  <span>Instant Sim</span>
                </button>
              </div>

              {/* Advance to Post-Match when finished */}
              {minute >= 90 && (
                <button
                  onClick={() => setPostMatchStep('report')}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition active:scale-95 animate-bounce"
                >
                  <span>Post-Match Debrief</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-400 font-medium">Match ratified into championship record.</span>
              <button
                onClick={handleFinalize}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider shadow-lg transition active:scale-95"
              >
                Return to Manager Office
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
