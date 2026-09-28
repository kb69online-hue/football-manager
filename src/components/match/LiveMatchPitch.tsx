import React, { useState, useMemo } from 'react';
import {
  Club,
  Formation,
  MatchEvent,
  MatchStats,
  PitchSlot,
  Player,
  TeamTactics,
} from '../../types/football';
import { FORMATION_SLOTS } from '../../data/initialData';
import {
  Shield,
  Activity,
  Award,
  Zap,
  Target,
  AlertTriangle,
  Compass,
  Eye,
  EyeOff,
  Flame,
} from 'lucide-react';

interface LiveMatchPitchProps {
  homeClub: Club;
  awayClub: Club;
  homePlayers: Player[];
  awayPlayers: Player[];
  homeTactics?: TeamTactics;
  awayTactics?: TeamTactics;
  minute: number;
  simResult: {
    homeScore: number;
    awayScore: number;
    stats: MatchStats;
    events: MatchEvent[];
    playerRatings: Record<string, number>;
  };
  visibleEvents: MatchEvent[];
  latestEvent?: MatchEvent;
  activeShout?: string | null;
  speedMultiplier: number;
}

interface PitchPlayerState {
  player: Player;
  slot: PitchSlot;
  isHome: boolean;
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  isGoalkeeper: boolean;
  isActive: boolean; // currently on ball or involved in latest event
  hasYellowCard: boolean;
  hasRedCard: boolean;
  rating: number;
  goals: number;
  assists: number;
  actionText?: string;
}

export const LiveMatchPitch: React.FC<LiveMatchPitchProps> = ({
  homeClub,
  awayClub,
  homePlayers,
  awayPlayers,
  homeTactics,
  awayTactics,
  minute,
  simResult,
  visibleEvents,
  latestEvent,
  activeShout,
  speedMultiplier,
}) => {
  // Pitch View Display Controls
  const [showNames, setShowNames] = useState(true);
  const [showTacticalZones, setShowTacticalZones] = useState(false);
  const [showPassLines, setShowPassLines] = useState(true);
  const [hoveredPlayerId, setHoveredPlayerId] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  // 1. Determine Starting 11 for Home and Away
  const homeStarting11 = useMemo(() => {
    const formation: Formation = homeTactics?.formation || '4-3-3';
    const slots = homeTactics?.slots?.length === 11 ? homeTactics.slots : FORMATION_SLOTS[formation] || FORMATION_SLOTS['4-3-3'];
    const usedIds = new Set<string>();

    return slots.map((slot, index) => {
      let player: Player | undefined;
      if (slot.playerId) {
        player = homePlayers.find((p) => p.id === slot.playerId);
      }
      if (!player) {
        // Pick best available player matching position or general category
        const available = homePlayers.filter((p) => !usedIds.has(p.id));
        player = available.find((p) => p.position === slot.position) || available[0];
      }
      if (player) usedIds.add(player.id);
      return {
        slot,
        player: player || {
          id: `h_temp_${index}`,
          name: `Home ${slot.position}`,
          position: slot.position,
          squadNumber: index + 1,
          clubId: homeClub.id,
          attributes: {} as any,
          condition: 95,
          currentAbility: 75,
        } as unknown as Player,
      };
    });
  }, [homePlayers, homeTactics, homeClub.id]);

  const awayStarting11 = useMemo(() => {
    const formation: Formation = awayTactics?.formation || '4-2-3-1';
    const slots = awayTactics?.slots?.length === 11 ? awayTactics.slots : FORMATION_SLOTS[formation] || FORMATION_SLOTS['4-2-3-1'];
    const usedIds = new Set<string>();

    return slots.map((slot, index) => {
      let player: Player | undefined;
      if (slot.playerId) {
        player = awayPlayers.find((p) => p.id === slot.playerId);
      }
      if (!player) {
        const available = awayPlayers.filter((p) => !usedIds.has(p.id));
        player = available.find((p) => p.position === slot.position) || available[0];
      }
      if (player) usedIds.add(player.id);
      return {
        slot,
        player: player || {
          id: `a_temp_${index}`,
          name: `Away ${slot.position}`,
          position: slot.position,
          squadNumber: index + 1,
          clubId: awayClub.id,
          attributes: {} as any,
          condition: 95,
          currentAbility: 75,
        } as unknown as Player,
      };
    });
  }, [awayPlayers, awayTactics, awayClub.id]);

  // 2. Disciplinary Tracking from visible events
  const yellowCardPlayerIds = useMemo(() => {
    return new Set(
      visibleEvents
        .filter((e) => e.type === 'YellowCard' && e.playerId)
        .map((e) => e.playerId as string)
    );
  }, [visibleEvents]);

  const redCardPlayerIds = useMemo(() => {
    return new Set(
      visibleEvents
        .filter((e) => e.type === 'RedCard' && e.playerId)
        .map((e) => e.playerId as string)
    );
  }, [visibleEvents]);

  // 3. Current Simulation Engine Phase & Territorial Momentum
  const isRecentHighlight = latestEvent && (latestEvent.minute === minute || minute - latestEvent.minute <= 1);
  const isHomeAction = latestEvent?.clubId === homeClub.id;

  // Base phase wave (oscillates between attack, midfield battle, and counters)
  const matchOscillation = Math.sin(minute * 0.42);
  const possessionDelta = (simResult.stats.possessionHome - 50) / 50; // -1 to +1
  const homeTerritoryAdvantage = isRecentHighlight
    ? isHomeAction ? 0.75 : -0.75
    : matchOscillation * 0.4 + possessionDelta * 0.5;

  // 4. Calculate Dynamic Ball Coordinates based on current match simulation state
  const ballState = useMemo(() => {
    if (minute === 0) {
      return { x: 50, y: 50, tag: 'Kick-Off', isSpecial: false };
    }
    if (minute >= 90) {
      return { x: 50, y: 50, tag: 'Full Time', isSpecial: false };
    }

    if (isRecentHighlight && latestEvent) {
      switch (latestEvent.type) {
        case 'Goal':
        case 'PenaltyGoal':
          return {
            x: isHomeAction ? 96.5 : 3.5,
            y: 47 + Math.sin(minute * 1.5) * 8,
            tag: '⚽ GOAL!',
            isSpecial: true,
          };
        case 'Woodwork':
          return {
            x: isHomeAction ? 95 : 5,
            y: 38 + ((minute * 11) % 24),
            tag: '🪵 WOODWORK!',
            isSpecial: true,
          };
        case 'KeySave':
          return {
            x: isHomeAction ? 92.5 : 7.5,
            y: 45 + ((minute * 7) % 15),
            tag: '🧤 VITAL SAVE!',
            isSpecial: true,
          };
        case 'Shot':
          return {
            x: isHomeAction ? 91.5 : 8.5,
            y: 35 + ((minute * 13) % 30),
            tag: '🎯 SHOT!',
            isSpecial: true,
          };
        case 'Foul':
        case 'YellowCard':
        case 'RedCard':
          return {
            x: isHomeAction ? 45 + ((minute * 3) % 20) : 55 - ((minute * 3) % 20),
            y: 30 + ((minute * 9) % 40),
            tag: latestEvent.type === 'RedCard' ? '🟥 RED CARD!' : latestEvent.type === 'YellowCard' ? '🟨 CARD' : '⚠️ FOUL',
            isSpecial: true,
          };
        default:
          break;
      }
    }

    // Default In-Play Ball Movement (Fluid passing and circulation between players)
    // Ball x shifts between 30% and 70% based on territorial momentum
    const targetX = 50 + homeTerritoryAdvantage * 32 + Math.cos(minute * 0.9) * 8;
    // Ball y sweeps from flank to flank (30% to 70%)
    const targetY = 50 + Math.sin(minute * 0.65) * 28;

    return {
      x: Math.max(12, Math.min(88, targetX)),
      y: Math.max(15, Math.min(85, targetY)),
      tag: homeTerritoryAdvantage > 0.2 ? 'Home Attacking' : homeTerritoryAdvantage < -0.2 ? 'Away Attacking' : 'Midfield Play',
      isSpecial: false,
    };
  }, [minute, isRecentHighlight, latestEvent, isHomeAction, homeTerritoryAdvantage]);

  // 5. Calculate Real-Time Player Coordinates based on simulation engine state
  const pitchPlayers: PitchPlayerState[] = useMemo(() => {
    const list: PitchPlayerState[] = [];

    // Helper: Map vertical tactical slot (x:15-85, y:16-88) to horizontal pitch
    // Home attacks left to right (x: 5% to 70%), Away attacks right to left (x: 95% to 30%)
    const calculateHomePlayerPos = (slot: PitchSlot, player: Player, index: number): PitchPlayerState => {
      const isGK = slot.position === 'GK';
      const isRed = redCardPlayerIds.has(player.id);
      const isYellow = yellowCardPlayerIds.has(player.id);
      const rating = simResult.playerRatings[player.id] || 6.5;

      const goalsScored = visibleEvents.filter((e) => e.type === 'Goal' && e.playerId === player.id).length;
      const assistsMade = visibleEvents.filter((e) => e.type === 'Goal' && e.assistPlayerId === player.id).length;

      // Base coordinate from formation
      // slot.y (88=GK, 72=CB, 54=CDM, 42=CM, 22=Wing, 16=ST)
      // Depth along x:
      const depthRatio = Math.max(0, (88 - slot.y) / 72); // 0 (GK) to 1.0 (ST)
      let baseX = 6 + depthRatio * 58; // 6% to 64%
      let baseY = slot.x; // 15% to 85%

      // Dynamic Territorial Shift:
      if (!isGK && !isRed) {
        if (homeTerritoryAdvantage > 0) {
          // Home pressing high / attacking
          const pushX = (depthRatio * 20 + 6) * homeTerritoryAdvantage;
          baseX += pushX;
        } else {
          // Home retreating / compact defense
          const dropX = (depthRatio * 15 + 4) * Math.abs(homeTerritoryAdvantage);
          baseX -= dropX;
        }

        // Small organic micro-movement based on minute
        const microX = Math.sin(minute * 0.7 + index) * 2;
        const microY = Math.cos(minute * 0.5 + index * 1.5) * 3;
        baseX += microX;
        baseY += microY;
      }

      // If active highlight matches this player:
      let isActive = false;
      let actionText: string | undefined;

      if (isRecentHighlight && latestEvent) {
        if (latestEvent.playerId === player.id) {
          isActive = true;
          if (latestEvent.type === 'Goal' || latestEvent.type === 'Shot' || latestEvent.type === 'Woodwork') {
            baseX = 82 + Math.sin(minute) * 3;
            baseY = 48 + Math.cos(minute) * 6;
            actionText = latestEvent.type === 'Goal' ? 'Scorer!' : 'Shooting';
          } else if (latestEvent.type === 'KeySave') {
            baseX = 8;
            baseY = ballState.y;
            actionText = 'Vital Save!';
          } else if (latestEvent.type === 'Foul' || latestEvent.type === 'YellowCard' || latestEvent.type === 'RedCard') {
            baseX = ballState.x + 2;
            baseY = ballState.y;
            actionText = 'Foul';
          }
        } else if (latestEvent.assistPlayerId === player.id) {
          isActive = true;
          baseX = 74;
          baseY = baseY < 50 ? 25 : 75;
          actionText = 'Assist Cross';
        }
      }

      // If GK, track ball angle slightly
      if (isGK) {
        baseX = 6;
        baseY = 50 + (ballState.y - 50) * 0.25;
      }

      // If Red carded: place off pitch on bottom sideline
      if (isRed) {
        baseX = 20 + index * 4;
        baseY = 96;
      }

      return {
        player,
        slot,
        isHome: true,
        x: Math.max(3, Math.min(97, baseX)),
        y: Math.max(5, Math.min(95, baseY)),
        isGoalkeeper: isGK,
        isActive,
        hasYellowCard: isYellow,
        hasRedCard: isRed,
        rating,
        goals: goalsScored,
        assists: assistsMade,
        actionText,
      };
    };

    const calculateAwayPlayerPos = (slot: PitchSlot, player: Player, index: number): PitchPlayerState => {
      const isGK = slot.position === 'GK';
      const isRed = redCardPlayerIds.has(player.id);
      const isYellow = yellowCardPlayerIds.has(player.id);
      const rating = simResult.playerRatings[player.id] || 6.5;

      const goalsScored = visibleEvents.filter((e) => e.type === 'Goal' && e.playerId === player.id).length;
      const assistsMade = visibleEvents.filter((e) => e.type === 'Goal' && e.assistPlayerId === player.id).length;

      const depthRatio = Math.max(0, (88 - slot.y) / 72);
      // Away attacks from right to left
      let baseX = 100 - (6 + depthRatio * 58); // 94% down to 36%
      let baseY = 100 - slot.x; // mirrored width

      if (!isGK && !isRed) {
        if (homeTerritoryAdvantage < 0) {
          // Away attacking: push forward (to the left)
          const pushX = (depthRatio * 20 + 6) * Math.abs(homeTerritoryAdvantage);
          baseX -= pushX;
        } else {
          // Away retreating (to the right into their box)
          const dropX = (depthRatio * 15 + 4) * homeTerritoryAdvantage;
          baseX += dropX;
        }

        const microX = Math.sin(minute * 0.7 + index * 2) * 2;
        const microY = Math.cos(minute * 0.5 + index) * 3;
        baseX += microX;
        baseY += microY;
      }

      let isActive = false;
      let actionText: string | undefined;

      if (isRecentHighlight && latestEvent) {
        if (latestEvent.playerId === player.id) {
          isActive = true;
          if (latestEvent.type === 'Goal' || latestEvent.type === 'Shot' || latestEvent.type === 'Woodwork') {
            baseX = 18 - Math.sin(minute) * 3;
            baseY = 48 + Math.cos(minute) * 6;
            actionText = latestEvent.type === 'Goal' ? 'Scorer!' : 'Shooting';
          } else if (latestEvent.type === 'KeySave') {
            baseX = 92;
            baseY = ballState.y;
            actionText = 'Vital Save!';
          } else if (latestEvent.type === 'Foul' || latestEvent.type === 'YellowCard' || latestEvent.type === 'RedCard') {
            baseX = ballState.x - 2;
            baseY = ballState.y;
            actionText = 'Foul';
          }
        } else if (latestEvent.assistPlayerId === player.id) {
          isActive = true;
          baseX = 26;
          baseY = baseY < 50 ? 25 : 75;
          actionText = 'Assist Cross';
        }
      }

      if (isGK) {
        baseX = 94;
        baseY = 50 + (ballState.y - 50) * 0.25;
      }

      if (isRed) {
        baseX = 80 - index * 4;
        baseY = 96;
      }

      return {
        player,
        slot,
        isHome: false,
        x: Math.max(3, Math.min(97, baseX)),
        y: Math.max(5, Math.min(95, baseY)),
        isGoalkeeper: isGK,
        isActive,
        hasYellowCard: isYellow,
        hasRedCard: isRed,
        rating,
        goals: goalsScored,
        assists: assistsMade,
        actionText,
      };
    };

    homeStarting11.forEach(({ slot, player }, idx) => {
      list.push(calculateHomePlayerPos(slot, player, idx));
    });

    awayStarting11.forEach(({ slot, player }, idx) => {
      list.push(calculateAwayPlayerPos(slot, player, idx));
    });

    return list;
  }, [
    homeStarting11,
    awayStarting11,
    homeTerritoryAdvantage,
    minute,
    isRecentHighlight,
    latestEvent,
    ballState.x,
    ballState.y,
    redCardPlayerIds,
    yellowCardPlayerIds,
    simResult.playerRatings,
    visibleEvents,
  ]);

  // Find the active player closest to the ball or event hero
  const activeCarrier = useMemo(() => {
    const active = pitchPlayers.find((p) => p.isActive);
    if (active) return active;

    // Find nearest outfield player to ball
    let nearest: PitchPlayerState | null = null;
    let minDist = Infinity;
    pitchPlayers.forEach((p) => {
      if (p.isGoalkeeper || p.hasRedCard) return;
      const dist = Math.hypot(p.x - ballState.x, p.y - ballState.y);
      if (dist < minDist) {
        minDist = dist;
        nearest = p;
      }
    });
    return nearest;
  }, [pitchPlayers, ballState.x, ballState.y]);

  const activeHoverOrSelectedPlayer = pitchPlayers.find(
    (p) => p.player.id === (selectedPlayerId || hoveredPlayerId)
  );

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col select-none">
      {/* Top Pitch Controls Header */}
      <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-2 border-b border-slate-800 flex items-center justify-between text-xs flex-wrap gap-2 z-30">
        {/* Team Matchup Crests & Attack Directions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold">
            <span
              className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm shrink-0"
              style={{ backgroundColor: homeClub.primaryColor || '#DC2626' }}
            />
            <span className="text-white text-[11px] truncate max-w-[90px] md:max-w-none">{homeClub.shortName || homeClub.name}</span>
            <span className="text-emerald-400 text-[10px] font-mono">➔</span>
          </div>

          <span className="text-slate-600 text-[10px] font-mono">VS</span>

          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-sky-400 text-[10px] font-mono">⬅</span>
            <span className="text-white text-[11px] truncate max-w-[90px] md:max-w-none">{awayClub.shortName || awayClub.name}</span>
            <span
              className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm shrink-0"
              style={{ backgroundColor: awayClub.primaryColor || '#2563EB' }}
            />
          </div>
        </div>

        {/* Live Match Phase Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-700/80 text-[10px] font-mono font-bold text-slate-300">
          <span
            className={`w-2 h-2 rounded-full ${
              ballState.isSpecial
                ? 'bg-amber-400 animate-ping'
                : homeTerritoryAdvantage > 0.2
                ? 'bg-emerald-400 animate-pulse'
                : homeTerritoryAdvantage < -0.2
                ? 'bg-blue-400 animate-pulse'
                : 'bg-slate-400'
            }`}
          />
          <span className="text-white">{ballState.tag}</span>
        </div>

        {/* Pitch Display Toggles */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            onClick={() => setShowNames((v) => !v)}
            title="Toggle player names under icons"
            className={`px-2 py-1 rounded-lg font-bold border transition flex items-center gap-1 ${
              showNames
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            {showNames ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span className="hidden sm:inline">Names</span>
          </button>

          <button
            onClick={() => setShowTacticalZones((v) => !v)}
            title="Toggle pitch tactical zones"
            className={`px-2 py-1 rounded-lg font-bold border transition flex items-center gap-1 ${
              showTacticalZones
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3 h-3" />
            <span className="hidden sm:inline">Zones</span>
          </button>

          <button
            onClick={() => setShowPassLines((v) => !v)}
            title="Toggle ball trajectory vector"
            className={`px-2 py-1 rounded-lg font-bold border transition flex items-center gap-1 ${
              showPassLines
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span className="hidden sm:inline">Vectors</span>
          </button>
        </div>
      </div>

      {/* Main Pitch Field Canvas */}
      <div
        className="relative w-full aspect-[16/10] overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at center, #065f46 0%, #064e3b 50%, #022c22 100%)',
        }}
        onClick={() => setSelectedPlayerId(null)}
      >
        {/* Realistic Mowed Grass Striping (Alternating vertical green bands) */}
        <div className="absolute inset-0 pointer-events-none flex opacity-40">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-full ${i % 2 === 0 ? 'bg-black/10' : 'bg-white/5'}`}
            />
          ))}
        </div>

        {/* Pitch Lines (Crisp white field markings) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1000 625"
          preserveAspectRatio="none"
        >
          {/* Outer Boundary Touchlines */}
          <rect
            x="20"
            y="20"
            width="960"
            height="585"
            fill="none"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="2.5"
            rx="4"
          />

          {/* Halfway Line */}
          <line
            x1="500"
            y1="20"
            x2="500"
            y2="605"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="2.5"
          />

          {/* Center Circle & Center Spot */}
          <circle
            cx="500"
            cy="312.5"
            r="80"
            fill="none"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="2.5"
          />
          <circle cx="500" cy="312.5" r="4" fill="rgba(255, 255, 255, 0.75)" />

          {/* Home (Left) Penalty Area (18-yard box) */}
          <rect
            x="20"
            y="140"
            width="160"
            height="345"
            fill="none"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="2.5"
          />
          {/* Home (Left) Goal Area (6-yard box) */}
          <rect
            x="20"
            y="225"
            width="58"
            height="175"
            fill="none"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="2.5"
          />
          {/* Home Penalty Spot */}
          <circle cx="130" cy="312.5" r="3.5" fill="rgba(255, 255, 255, 0.75)" />
          {/* Home Penalty Arc (D) */}
          <path
            d="M 180 255 A 80 80 0 0 1 180 370"
            fill="none"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="2.5"
          />
          {/* Home Goal Net Frame */}
          <rect
            x="5"
            y="265"
            width="15"
            height="95"
            fill="rgba(255, 255, 255, 0.08)"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="2"
          />

          {/* Away (Right) Penalty Area (18-yard box) */}
          <rect
            x="820"
            y="140"
            width="160"
            height="345"
            fill="none"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="2.5"
          />
          {/* Away (Right) Goal Area (6-yard box) */}
          <rect
            x="922"
            y="225"
            width="58"
            height="175"
            fill="none"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="2.5"
          />
          {/* Away Penalty Spot */}
          <circle cx="870" cy="312.5" r="3.5" fill="rgba(255, 255, 255, 0.75)" />
          {/* Away Penalty Arc (D) */}
          <path
            d="M 820 255 A 80 80 0 0 0 820 370"
            fill="none"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="2.5"
          />
          {/* Away Goal Net Frame */}
          <rect
            x="980"
            y="265"
            width="15"
            height="95"
            fill="rgba(255, 255, 255, 0.08)"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="2"
          />

          {/* Corner Arcs */}
          <path d="M 20 40 A 20 20 0 0 0 40 20" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
          <path d="M 40 605 A 20 20 0 0 0 20 585" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
          <path d="M 960 20 A 20 20 0 0 0 980 40" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
          <path d="M 980 585 A 20 20 0 0 0 960 605" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />

          {/* Optional Tactical Zones (Defensive, Midfield, Attacking Thirds) */}
          {showTacticalZones && (
            <>
              <line x1="333" y1="20" x2="333" y2="605" stroke="rgba(56, 189, 248, 0.3)" strokeDasharray="6 6" strokeWidth="1.5" />
              <line x1="666" y1="20" x2="666" y2="605" stroke="rgba(56, 189, 248, 0.3)" strokeDasharray="6 6" strokeWidth="1.5" />
              <text x="175" y="45" fill="rgba(56, 189, 248, 0.5)" fontSize="14" fontWeight="bold" textAnchor="middle">
                Home Defensive Third
              </text>
              <text x="500" y="45" fill="rgba(56, 189, 248, 0.5)" fontSize="14" fontWeight="bold" textAnchor="middle">
                Central Tactical Third
              </text>
              <text x="825" y="45" fill="rgba(56, 189, 248, 0.5)" fontSize="14" fontWeight="bold" textAnchor="middle">
                Away Defensive Third
              </text>
            </>
          )}

          {/* Optional Ball Trajectory / Passing Vector */}
          {showPassLines && activeCarrier && (
            <line
              x1={`${activeCarrier.x * 10}`}
              y1={`${activeCarrier.y * 6.25}`}
              x2={`${ballState.x * 10}`}
              y2={`${ballState.y * 6.25}`}
              stroke="rgba(250, 204, 21, 0.75)"
              strokeWidth="2.5"
              strokeDasharray="5 5"
              className="animate-pulse"
            />
          )}
        </svg>

        {/* Sideline Manager Shout Banner */}
        {activeShout && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black font-black text-xs px-3.5 py-1 rounded-full shadow-lg shadow-amber-500/40 animate-bounce z-40 flex items-center gap-1.5 border border-amber-300">
            <Zap className="w-3.5 h-3.5" />
            <span>Sideline Shout: {activeShout}! Morale Boosted!</span>
          </div>
        )}

        {/* 22 On-Pitch Player Icons */}
        {pitchPlayers.map((pState) => {
          const isSelected = selectedPlayerId === pState.player.id;
          const isHovered = hoveredPlayerId === pState.player.id;
          const surname = pState.player.name.split(' ').pop() || pState.player.name;

          // Colors
          const teamColor = pState.isHome
            ? pState.isGoalkeeper
              ? '#10B981' // Electric Emerald for Home GK
              : homeClub.primaryColor || '#DC2626'
            : pState.isGoalkeeper
            ? '#F59E0B' // Electric Amber for Away GK
            : awayClub.primaryColor || '#2563EB';

          const textColor = '#FFFFFF';

          return (
            <div
              key={pState.player.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPlayerId(pState.player.id);
              }}
              onMouseEnter={() => setHoveredPlayerId(pState.player.id)}
              onMouseLeave={() => setHoveredPlayerId(null)}
              style={{
                left: `${pState.x}%`,
                top: `${pState.y}%`,
                transform: 'translate(-50%, -50%)',
                transition: `all ${Math.max(300, 700 / speedMultiplier)}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
              }}
              className={`absolute cursor-pointer flex flex-col items-center group ${
                pState.isActive ? 'z-30' : isSelected || isHovered ? 'z-35' : 'z-20'
              } ${pState.hasRedCard ? 'opacity-40' : ''}`}
            >
              {/* Highlight / Possession Aura */}
              {pState.isActive && (
                <div className="absolute -inset-2 rounded-full bg-amber-400/40 animate-ping pointer-events-none" />
              )}

              {/* Action tooltip above active player */}
              {pState.actionText && (
                <div className="absolute -top-6 whitespace-nowrap bg-black/90 text-amber-300 text-[9px] font-black font-mono px-1.5 py-0.5 rounded shadow border border-amber-400/50 animate-bounce">
                  {pState.actionText}
                </div>
              )}

              {/* Player Jersey Circle */}
              <div
                className={`relative w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-black text-[10px] sm:text-xs shadow-md border-2 transition-transform duration-200 ${
                  pState.isActive
                    ? 'ring-2 ring-amber-400 scale-110 shadow-amber-400/50'
                    : isSelected || isHovered
                    ? 'ring-2 ring-white scale-125'
                    : 'hover:scale-115'
                }`}
                style={{
                  backgroundColor: teamColor,
                  color: textColor,
                  borderColor: pState.isHome ? '#FFFFFF' : '#E2E8F0',
                }}
              >
                <span>{pState.player.squadNumber || pState.slot.position}</span>

                {/* Disciplinary Card Dot */}
                {pState.hasRedCard ? (
                  <span className="absolute -top-1 -right-1 w-2.5 h-3 bg-rose-600 rounded-[1px] border border-white shadow-sm" />
                ) : pState.hasYellowCard ? (
                  <span className="absolute -top-1 -right-1 w-2.5 h-3 bg-amber-400 rounded-[1px] border border-white shadow-sm" />
                ) : null}
              </div>

              {/* Player Surname Label */}
              {showNames && (
                <div
                  className={`mt-0.5 px-1 py-0.2 rounded text-[9px] font-bold text-center truncate max-w-[65px] transition shadow-sm pointer-events-none ${
                    pState.isHome
                      ? 'bg-slate-950/85 text-emerald-200 border border-emerald-500/30'
                      : 'bg-slate-950/85 text-sky-200 border border-sky-500/30'
                  }`}
                >
                  {surname}
                </div>
              )}
            </div>
          );
        })}

        {/* Dynamic Animated Match Ball */}
        <div
          style={{
            left: `${ballState.x}%`,
            top: `${ballState.y}%`,
            transform: 'translate(-50%, -50%)',
            transition: `all ${Math.max(250, 600 / speedMultiplier)}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
          }}
          className="absolute z-40 pointer-events-none flex flex-col items-center"
        >
          {/* Action Callout Tag hovering above ball during special moments */}
          {ballState.isSpecial && (
            <div className="absolute -top-7 whitespace-nowrap bg-black/95 text-amber-300 text-[10px] font-black font-mono px-2 py-0.5 rounded-full border border-amber-400/80 shadow-lg shadow-amber-400/20 animate-pulse">
              {ballState.tag}
            </div>
          )}

          {/* 3D Ball Rendering with textured seams & shadow */}
          <div className="relative w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white shadow-xl shadow-black/80 flex items-center justify-center border border-slate-300 ring-1 ring-black/40">
            <div className="w-1.5 h-1.5 rounded-full bg-black/90" />
            {/* Speed pulse during rapid attacks */}
            {ballState.isSpecial && (
              <div className="absolute inset-0 rounded-full bg-yellow-400/30 animate-ping" />
            )}
          </div>
          {/* Ball Shadow on the turf */}
          <div className="w-3.5 h-1.5 rounded-full bg-black/50 blur-[1px] mt-0.5" />
        </div>

        {/* Selected or Hovered Player Popover Card */}
        {activeHoverOrSelectedPlayer && (
          <div className="absolute bottom-3 left-3 z-50 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-2xl text-xs max-w-xs pointer-events-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs text-white shadow"
                  style={{
                    backgroundColor: activeHoverOrSelectedPlayer.isHome
                      ? homeClub.primaryColor || '#DC2626'
                      : awayClub.primaryColor || '#2563EB',
                  }}
                >
                  {activeHoverOrSelectedPlayer.player.squadNumber || activeHoverOrSelectedPlayer.slot.position}
                </div>
                <div>
                  <h5 className="font-black text-white text-xs leading-tight">
                    {activeHoverOrSelectedPlayer.player.name}
                  </h5>
                  <span className="text-[10px] text-slate-400">
                    {activeHoverOrSelectedPlayer.slot.position} • {activeHoverOrSelectedPlayer.isHome ? homeClub.shortName : awayClub.shortName}
                  </span>
                </div>
              </div>

              {/* Match Rating */}
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 font-mono">Live Rating</span>
                <span className="text-xs font-black font-mono text-emerald-400">
                  ⭐ {activeHoverOrSelectedPlayer.rating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* In-Match Stats & Condition */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] bg-slate-950/80 p-1.5 rounded-lg border border-slate-800/80 font-mono mb-2">
              <div>
                <span className="text-slate-400 block">Goals</span>
                <span className="font-black text-emerald-400">{activeHoverOrSelectedPlayer.goals}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Assists</span>
                <span className="font-black text-sky-400">{activeHoverOrSelectedPlayer.assists}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Cards</span>
                <span className="font-black text-amber-400">
                  {activeHoverOrSelectedPlayer.hasRedCard ? '🟥 Red' : activeHoverOrSelectedPlayer.hasYellowCard ? '🟨 Yel' : 'None'}
                </span>
              </div>
            </div>

            {/* Condition Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Stamina / Condition</span>
                <span className="font-bold text-white">{activeHoverOrSelectedPlayer.player.condition || 90}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${activeHoverOrSelectedPlayer.player.condition || 90}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Commentary & Action Ticker below Pitch */}
      <div className="bg-slate-900 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono font-black text-emerald-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] shrink-0">
            {minute}'
          </span>
          <p className="text-slate-200 text-xs font-medium truncate">
            {latestEvent?.description ||
              (minute <= 5
                ? 'Kick-off! Both teams are feeling each other out in the opening minutes.'
                : homeTerritoryAdvantage > 0.3
                ? `${homeClub.name} are pinning ${awayClub.name} deep in their defensive third.`
                : homeTerritoryAdvantage < -0.3
                ? `${awayClub.name} mount a threatening attack down the flanks.`
                : 'Both sides are locked in an intense midfield tactical duel.')}
          </p>
        </div>

        {/* Active carrier indicator if exists */}
        {activeCarrier && (
          <div className="hidden md:flex items-center gap-1.5 shrink-0 text-[10px] text-slate-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>On Ball: <strong className="text-white">{activeCarrier.player.name.split(' ').pop()}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
};
