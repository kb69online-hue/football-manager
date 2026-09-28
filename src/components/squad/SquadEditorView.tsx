import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Player, Position, PlayerRole, SquadCategory } from '../../types/football';
import { DETAILED_PLAYER_ROLES } from '../../data/roleSystemData';
import { formatMoney } from '../../services/currencyService';
import {
  Users,
  Edit,
  Shield,
  Award,
  AlertTriangle,
  Activity,
  Search,
  Filter,
  Check,
  X,
  Plus,
  Trash2,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const SquadEditorView: React.FC = () => {
  const { state, updatePlayerInSquad, updateTactics, setSelectedPlayer } = useGame();
  const userClub = state.clubs[state.userClubId];
  const squad = Object.values(state.players).filter((p) => p.clubId === state.userClubId);

  const [categoryFilter, setCategoryFilter] = useState<SquadCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);

  // Edit form state
  const [editSquadNumber, setEditSquadNumber] = useState<number>(1);
  const [editPosition, setEditPosition] = useState<Position>('ST');
  const [editRole, setEditRole] = useState<PlayerRole>('Advanced Forward');
  const [editCategory, setEditCategory] = useState<SquadCategory>('Senior');
  const [editCurrentAbility, setEditCurrentAbility] = useState<number>(75);
  const [editPotentialAbility, setEditPotentialAbility] = useState<number>(85);
  const [editSalaryWeekly, setEditSalaryWeekly] = useState<number>(50000);
  const [editIsTransferListed, setEditIsTransferListed] = useState<boolean>(false);
  const [editIsLoanListed, setEditIsLoanListed] = useState<boolean>(false);

  const filteredSquad = squad.filter((p) => {
    if (categoryFilter !== 'ALL' && p.squadCategory !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.position.toLowerCase().includes(q);
    }
    return true;
  });

  const handleStartEdit = (player: Player) => {
    setEditingPlayerId(player.id);
    setEditSquadNumber(player.squadNumber || 1);
    setEditPosition(player.position);
    setEditRole(player.role);
    setEditCategory(player.squadCategory || 'Senior');
    setEditCurrentAbility(player.currentAbility);
    setEditPotentialAbility(player.potentialAbility);
    setEditSalaryWeekly(player.contract.salaryWeekly);
    setEditIsTransferListed(!!player.isTransferListed);
    setEditIsLoanListed(!!player.isLoanListed);
  };

  const handleSaveEdit = (playerId: string) => {
    updatePlayerInSquad(playerId, {
      squadNumber: Number(editSquadNumber),
      position: editPosition,
      role: editRole,
      squadCategory: editCategory,
      currentAbility: Number(editCurrentAbility),
      potentialAbility: Number(editPotentialAbility),
      isTransferListed: editIsTransferListed,
      isLoanListed: editIsLoanListed,
      contract: {
        ...state.players[playerId].contract,
        salaryWeekly: Number(editSalaryWeekly),
      },
    });
    setEditingPlayerId(null);
  };

  const handleToggleCaptain = (playerId: string) => {
    const isCap = state.tactics.captainPlayerId === playerId;
    updateTactics({ captainPlayerId: isCap ? undefined : playerId });
  };

  const handleToggleInjury = (player: Player) => {
    if (player.injury) {
      updatePlayerInSquad(player.id, { injury: undefined, condition: 95 });
    } else {
      updatePlayerInSquad(player.id, {
        injury: {
          type: 'Hamstring Strain',
          severity: 'Moderate',
          daysRemaining: 21,
          expectedReturnWeeks: 3,
        },
        condition: 40,
      });
    }
  };

  const handleToggleSuspension = (player: Player) => {
    if (player.suspension) {
      updatePlayerInSquad(player.id, { suspension: undefined });
    } else {
      updatePlayerInSquad(player.id, {
        suspension: {
          competitionId: 'comp_premier_div',
          matchesRemaining: 1,
          reason: 'Accumulation of Yellow Cards',
        },
      });
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-black text-white tracking-tight">Advanced Squad Editor</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Full managerial authority: modify squad hierarchy, roles, numbers, contracts, injuries, and suspensions.
          </p>
        </div>

        {/* Squad Breakdown Counters */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            Total Squad: {squad.length}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            First Team: {squad.filter((p) => p.squadCategory === 'Senior').length}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            Academy / U21: {squad.filter((p) => p.squadCategory === 'Academy').length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search squad player..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Squad Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['ALL', 'Senior', 'Reserve', 'U21', 'U19', 'Academy'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 border ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-black border-amber-400 shadow'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {cat === 'Senior' ? 'First Team' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Squad Table / Editor Roster */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-3 w-12 text-center">No.</th>
                <th className="py-3 px-4">Player & Role</th>
                <th className="py-3 px-3 text-center">Pos</th>
                <th className="py-3 px-3 text-center">Tier</th>
                <th className="py-3 px-3 text-center">CA / PA</th>
                <th className="py-3 px-3 text-center">Weekly Wage</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Captain</th>
                <th className="py-3 px-3 text-center">Discipline / Med</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSquad.map((player) => {
                const isEditing = editingPlayerId === player.id;
                const isCaptain = state.tactics.captainPlayerId === player.id;

                if (isEditing) {
                  return (
                    <tr key={player.id} className="bg-slate-800/60 text-xs">
                      {/* Edit Squad Number */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={editSquadNumber}
                          onChange={(e) => setEditSquadNumber(Number(e.target.value))}
                          className="w-12 bg-slate-950 border border-slate-700 rounded px-1.5 py-1 text-center font-bold text-white focus:outline-none"
                        />
                      </td>

                      {/* Edit Name & Role */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white mb-1">{player.name}</div>
                        <select
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value as PlayerRole)}
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-emerald-400 font-bold text-xs"
                        >
                          {Object.keys(DETAILED_PLAYER_ROLES).map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Edit Position */}
                      <td className="py-3 px-3 text-center">
                        <select
                          value={editPosition}
                          onChange={(e) => setEditPosition(e.target.value as Position)}
                          className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-bold"
                        >
                          {['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'].map((pos) => (
                            <option key={pos} value={pos}>
                              {pos}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Edit Tier */}
                      <td className="py-3 px-3 text-center">
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value as SquadCategory)}
                          className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                        >
                          <option value="Senior">First Team</option>
                          <option value="Reserve">Reserve</option>
                          <option value="U21">U21</option>
                          <option value="U19">U19</option>
                          <option value="Academy">Academy</option>
                        </select>
                      </td>

                      {/* Edit Ability & Potential */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min="40"
                            max="99"
                            value={editCurrentAbility}
                            onChange={(e) => setEditCurrentAbility(Number(e.target.value))}
                            className="w-10 bg-slate-950 border border-slate-700 rounded px-1 py-1 text-center font-bold text-emerald-400"
                          />
                          <span className="text-slate-500">/</span>
                          <input
                            type="number"
                            min="40"
                            max="99"
                            value={editPotentialAbility}
                            onChange={(e) => setEditPotentialAbility(Number(e.target.value))}
                            className="w-10 bg-slate-950 border border-slate-700 rounded px-1 py-1 text-center font-bold text-amber-400"
                          />
                        </div>
                      </td>

                      {/* Edit Weekly Wage */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          value={editSalaryWeekly}
                          onChange={(e) => setEditSalaryWeekly(Number(e.target.value))}
                          className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-center font-mono font-bold text-white"
                        />
                      </td>

                      {/* Transfer listing toggles */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex flex-col gap-1 text-[10px]">
                          <label className="flex items-center gap-1 text-slate-300">
                            <input
                              type="checkbox"
                              checked={editIsTransferListed}
                              onChange={(e) => setEditIsTransferListed(e.target.checked)}
                            />
                            <span>Listed</span>
                          </label>
                          <label className="flex items-center gap-1 text-slate-300">
                            <input
                              type="checkbox"
                              checked={editIsLoanListed}
                              onChange={(e) => setEditIsLoanListed(e.target.checked)}
                            />
                            <span>Loan</span>
                          </label>
                        </div>
                      </td>

                      <td colSpan={2} className="py-3 px-3 text-center text-slate-500 text-[10px]">
                        Save to apply changes
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSaveEdit(player.id)}
                            className="px-2.5 py-1 bg-emerald-500 text-black font-bold rounded-lg shadow"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPlayerId(null)}
                            className="px-2 py-1 bg-slate-700 text-slate-300 font-bold rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={player.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 text-center font-mono font-black text-slate-300">
                      {player.squadNumber || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div>
                          <span
                            onClick={() => setSelectedPlayer(player)}
                            className="font-bold text-white hover:text-emerald-400 cursor-pointer transition"
                          >
                            {player.name}
                          </span>
                          <span className="text-[11px] text-emerald-400 font-semibold block">
                            {player.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-300">
                      {player.position}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {player.squadCategory === 'Senior' ? 'First Team' : player.squadCategory}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span className="font-bold text-emerald-400">{player.currentAbility}</span>
                      <span className="text-slate-500"> / </span>
                      <span className="font-bold text-amber-400">{player.potentialAbility}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-300">
                      {formatMoney(player.contract.salaryWeekly, state.settings.currency, true)}/wk
                    </td>
                    <td className="py-3 px-3 text-center">
                      {player.isTransferListed ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                          TRANSFER
                        </span>
                      ) : player.isLoanListed ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40">
                          LOAN
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Active</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggleCaptain(player.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                          isCaptain
                            ? 'bg-amber-500 text-black shadow'
                            : 'bg-slate-800 text-slate-500 hover:text-amber-400'
                        }`}
                      >
                        {isCaptain ? 'CAPTAIN' : 'Make C'}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleToggleInjury(player)}
                          title="Toggle injury status"
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            player.injury
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : 'bg-slate-800 text-slate-500 hover:text-red-400'
                          }`}
                        >
                          {player.injury ? 'INJ' : '+Inj'}
                        </button>

                        <button
                          onClick={() => handleToggleSuspension(player)}
                          title="Toggle match suspension"
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            player.suspension
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : 'bg-slate-800 text-slate-500 hover:text-amber-400'
                          }`}
                        >
                          {player.suspension ? 'SUSP' : '+Susp'}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleStartEdit(player)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
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
