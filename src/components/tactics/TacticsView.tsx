import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  Formation,
  PassingStyle,
  PlayerRole,
  PressingStyle,
  TeamMentality,
  TempoStyle,
} from '../../types/football';
import { Trophy, Shield, Zap, RefreshCw, Users, Flame, Check } from 'lucide-react';

const AVAILABLE_FORMATIONS: Formation[] = [
  '4-3-3',
  '4-2-3-1',
  '4-4-2',
  '3-5-2',
  '3-4-3',
  '5-3-2',
  '4-1-4-1',
  '4-4-1-1',
];

const MENTALITY_OPTIONS: TeamMentality[] = [
  'Very Defensive',
  'Defensive',
  'Balanced',
  'Positive',
  'Attacking',
  'Very Attacking',
];

const POSITION_ROLES: Record<string, PlayerRole[]> = {
  GK: ['Goalkeeper', 'Sweeper Keeper'],
  CB: ['Central Defender', 'Ball-playing Defender', 'Stopper', 'Cover Defender'],
  LB: ['Full Back', 'Wing Back', 'Inverted Wing Back'],
  RB: ['Full Back', 'Wing Back', 'Inverted Wing Back'],
  LWB: ['Wing Back', 'Inverted Wing Back'],
  RWB: ['Wing Back', 'Inverted Wing Back'],
  CDM: ['Defensive Midfielder', 'Deep-Lying Playmaker', 'Ball-Winning Midfielder'],
  CM: ['Central Midfielder', 'Box-to-Box Midfielder', 'Advanced Playmaker', 'Mezzala'],
  CAM: ['Advanced Playmaker', 'Inside Forward'],
  LM: ['Winger', 'Inverted Winger'],
  RM: ['Winger', 'Inverted Winger'],
  LW: ['Winger', 'Inside Forward', 'Inverted Winger'],
  RW: ['Winger', 'Inside Forward', 'Inverted Winger'],
  ST: ['Advanced Forward', 'Pressing Forward', 'Target Forward', 'Complete Forward', 'Poacher'],
  CF: ['Complete Forward', 'Advanced Forward'],
};

export const TacticsView: React.FC = () => {
  const { state, setFormation, updateTactics, swapPlayers, assignPlayerToSlot, setSelectedPlayer } = useGame();
  const tactics = state.tactics;
  const userClub = state.clubs[state.userClubId];
  const allUserPlayers = Object.values(state.players).filter((p) => p.clubId === state.userClubId);

  const [activeInstructionTab, setActiveInstructionTab] = useState<'possession' | 'transition' | 'defense' | 'setpieces'>('possession');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  const selectedSlot = selectedSlotIndex !== null ? tactics.slots[selectedSlotIndex] : null;
  const selectedSlotPlayer = selectedSlot?.playerId ? state.players[selectedSlot.playerId] : null;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Tactical Command Center</h2>
          <p className="text-xs text-slate-400">
            Current Shape: <strong className="text-emerald-400">{tactics.formation}</strong> • Philosophy: {state.manager.philosophy}
          </p>
        </div>

        {/* Formation dropdown & Mentality slider */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-xl">
            <span className="text-[11px] text-slate-400 font-semibold">Formation:</span>
            <select
              value={tactics.formation}
              onChange={(e) => setFormation(e.target.value as Formation)}
              className="bg-transparent text-emerald-400 font-black text-xs focus:outline-none cursor-pointer"
            >
              {AVAILABLE_FORMATIONS.map((f) => (
                <option key={f} value={f} className="bg-slate-900 text-slate-200">
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-xl">
            <span className="text-[11px] text-slate-400 font-semibold">Mentality:</span>
            <select
              value={tactics.mentality}
              onChange={(e) => updateTactics({ mentality: e.target.value as TeamMentality })}
              className="bg-transparent text-amber-400 font-black text-xs focus:outline-none cursor-pointer"
            >
              {MENTALITY_OPTIONS.map((m) => (
                <option key={m} value={m} className="bg-slate-900 text-slate-200">
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: 2D Pitch on Left, Instructions & Bench on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pitch Container (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl relative">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-emerald-400" /> Starting XI Field View
            </span>
            <span className="text-slate-500 text-[11px]">Click player badge to reassign or adjust role</span>
          </div>

          {/* Realistic 2D Pitch Canvas */}
          <div className="relative w-full aspect-[3/4] max-h-[580px] bg-emerald-900/80 rounded-2xl border-4 border-emerald-600/50 overflow-hidden shadow-inner flex flex-col justify-between p-4">
            {/* Field Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 border-2 border-white/40 border-t-0 rounded-b-xl pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-8 border-2 border-white/40 border-t-0 pointer-events-none" />
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/40 -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/40 rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-20 border-2 border-white/40 border-b-0 rounded-t-xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-8 border-2 border-white/40 border-b-0 pointer-events-none" />

            {/* 11 Players Nodes positioned at slot coordinates */}
            {tactics.slots.map((slot) => {
              const player = slot.playerId ? state.players[slot.playerId] : null;
              const isSelected = selectedSlotIndex === slot.slotIndex;

              return (
                <div
                  key={slot.slotIndex}
                  onClick={() => setSelectedSlotIndex(slot.slotIndex)}
                  style={{
                    left: `${slot.x}%`,
                    top: `${slot.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute flex flex-col items-center cursor-pointer group transition-transform ${
                    isSelected ? 'scale-110 z-30' : 'hover:scale-105 z-20'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shadow-lg border-2 transition ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500 text-black shadow-amber-500/50'
                        : 'border-white bg-slate-900 text-white shadow-black/60 group-hover:border-emerald-400'
                    }`}
                  >
                    {player?.squadNumber || slot.position}
                  </div>
                  <div className="bg-slate-950/85 backdrop-blur-sm border border-slate-700/80 px-2 py-0.5 rounded text-[10px] text-center font-bold text-white max-w-[85px] truncate mt-1 shadow">
                    {player?.name ? player.name.split(' ').pop() : 'Empty'}
                  </div>
                  <div className="text-[9px] font-semibold text-emerald-300 drop-shadow">
                    {slot.role.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Slot Editor (when slot is selected) */}
          {selectedSlot && (
            <div className="mt-4 p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-amber-400">
                  Slot #{selectedSlot.slotIndex + 1} ({selectedSlot.position}):
                </span>
                <span className="text-white font-semibold">{selectedSlotPlayer?.name || 'Unassigned'}</span>
                <span className="text-slate-400">Role:</span>
                <select
                  value={selectedSlot.role}
                  onChange={(e) => {
                    const newSlots = [...tactics.slots];
                    newSlots[selectedSlot.slotIndex].role = e.target.value as PlayerRole;
                    updateTactics({ slots: newSlots });
                  }}
                  className="bg-slate-900 text-emerald-400 font-bold px-2 py-1 rounded border border-slate-700 focus:outline-none"
                >
                  {(POSITION_ROLES[selectedSlot.position] || ['Central Midfielder']).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {selectedSlotPlayer && (
                <button
                  onClick={() => setSelectedPlayer(selectedSlotPlayer)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  View Profile & Attributes →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tactical Instructions & Bench (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Instructions Tabs */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-200">Tactical Directives</h3>
            </div>

            <div className="flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl text-xs">
              {(['possession', 'transition', 'defense', 'setpieces'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveInstructionTab(tab)}
                  className={`flex-1 py-1.5 rounded-lg font-bold capitalize transition ${
                    activeInstructionTab === tab
                      ? 'bg-emerald-500 text-black shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* In Possession */}
            {activeInstructionTab === 'possession' && (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-semibold text-slate-300">
                    <span>Passing Directness</span>
                    <span className="text-emerald-400">{tactics.passingStyle}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Short', 'Mixed', 'Direct'] as PassingStyle[]).map((style) => (
                      <button
                        key={style}
                        onClick={() => updateTactics({ passingStyle: style })}
                        className={`py-1.5 rounded-lg border text-center font-bold ${
                          tactics.passingStyle === style
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-semibold text-slate-300">
                    <span>Attacking Tempo</span>
                    <span className="text-amber-400">{tactics.tempo}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Slow', 'Standard', 'High'] as TempoStyle[]).map((tempo) => (
                      <button
                        key={tempo}
                        onClick={() => updateTactics({ tempo: tempo })}
                        className={`py-1.5 rounded-lg border text-center font-bold ${
                          tactics.tempo === tempo
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {tempo}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* In Transition */}
            {activeInstructionTab === 'transition' && (
              <div className="space-y-3 text-xs">
                <span className="text-slate-400 block font-semibold">Transition Behavior</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Counter', 'Counter-Press', 'Regroup'] as const).map((trans) => (
                    <button
                      key={trans}
                      onClick={() => updateTactics({ transition: trans })}
                      className={`py-2 rounded-lg border text-center font-bold ${
                        tactics.transition === trans
                          ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {trans}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 italic pt-2">
                  Counter-pressing forces high turnovers in the opponent's final third, but increases physical fatigue.
                </p>
              </div>
            )}

            {/* Out of Possession (Defense) */}
            {activeInstructionTab === 'defense' && (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-semibold text-slate-300">
                    <span>Pressing Urgency</span>
                    <span className="text-rose-400">{tactics.pressingIntensity}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Low', 'Balanced', 'Urgent'] as PressingStyle[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => updateTactics({ pressingIntensity: p })}
                        className={`py-1.5 rounded-lg border text-center font-bold ${
                          tactics.pressingIntensity === p
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="font-semibold text-slate-300">Offside Trap</span>
                  <button
                    onClick={() => updateTactics({ offsideTrap: !tactics.offsideTrap })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      tactics.offsideTrap ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tactics.offsideTrap ? 'Active' : 'Off'}
                  </button>
                </div>
              </div>
            )}

            {/* Set Pieces */}
            {activeInstructionTab === 'setpieces' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Team Captain:</span>
                  <select
                    value={tactics.captainPlayerId || ''}
                    onChange={(e) => updateTactics({ captainPlayerId: e.target.value })}
                    className="bg-slate-800 text-slate-200 p-1.5 rounded border border-slate-700 font-bold"
                  >
                    {allUserPlayers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.position})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Penalty Taker:</span>
                  <select
                    value={tactics.penaltyTakerId || ''}
                    onChange={(e) => updateTactics({ penaltyTakerId: e.target.value })}
                    className="bg-slate-800 text-slate-200 p-1.5 rounded border border-slate-700 font-bold"
                  >
                    {allUserPlayers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Pen: {p.attributes.penalties})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Substitutes Bench */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Substitutes Bench (7 max)</span>
            </h3>

            <div className="space-y-1.5">
              {tactics.substitutePlayerIds.map((subId, idx) => {
                const subPlayer = state.players[subId];
                if (!subPlayer) return null;

                return (
                  <div
                    key={subId}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 w-4">{idx + 1}</span>
                      <span className="font-bold text-emerald-400 text-[10px] w-6">{subPlayer.position}</span>
                      <span className="font-medium text-white">{subPlayer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">OVR {subPlayer.currentAbility}</span>
                      <span className="text-emerald-400 font-semibold">{subPlayer.condition}%</span>
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
