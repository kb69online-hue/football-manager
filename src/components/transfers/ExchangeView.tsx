import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Player, Club } from '../../types/football';
import { formatMoney } from '../../services/currencyService';
import {
  ArrowLeftRight,
  Shield,
  CircleDollarSign,
  CheckCircle,
  XCircle,
  Percent,
  Plus,
  Trash2,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const ExchangeView: React.FC = () => {
  const { state, submitTransferOffer, updatePlayerInSquad } = useGame();
  const userClub = state.clubs[state.userClubId];
  const userPlayers = Object.values(state.players).filter((p) => p.clubId === state.userClubId);
  const otherPlayers = Object.values(state.players).filter((p) => p.clubId !== state.userClubId);

  // Selected Target Player (The player you want to acquire)
  const [targetPlayerId, setTargetPlayerId] = useState<string>(otherPlayers[0]?.id || '');
  // Selected Offered Player IDs (The players from your club you offer)
  const [offeredPlayerIds, setOfferedPlayerIds] = useState<string[]>([]);
  // Cash adjustment: positive means user pays additional cash, negative means user demands cash from other club
  const [cashAdjustment, setCashAdjustment] = useState<number>(5000000);
  const [sellOnPercentage, setSellOnPercentage] = useState<number>(15);
  const [buyBackClause, setBuyBackClause] = useState<boolean>(false);
  const [loanToBuy, setLoanToBuy] = useState<boolean>(false);

  // Proposal Feedback / Negotiation Result
  const [proposalResult, setProposalResult] = useState<{
    status: 'Accepted' | 'Rejected' | 'Countered';
    message: string;
    counterDemand?: string;
  } | null>(null);

  const targetPlayer = state.players[targetPlayerId] || otherPlayers[0];
  const targetClub = targetPlayer ? state.clubs[targetPlayer.clubId] : null;

  const totalOfferedValue = offeredPlayerIds.reduce((sum, id) => {
    return sum + (state.players[id]?.marketValue || 0);
  }, 0);

  const netPackageValue = totalOfferedValue + cashAdjustment;
  const targetPlayerValue = targetPlayer?.marketValue || 0;

  const handleToggleOfferedPlayer = (playerId: string) => {
    setOfferedPlayerIds((prev) =>
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]
    );
  };

  const handleEvaluateExchange = () => {
    if (!targetPlayer || !targetClub) return;

    if (offeredPlayerIds.length === 0 && cashAdjustment <= 0) {
      setProposalResult({
        status: 'Rejected',
        message: 'You must offer at least one player or positive cash adjustment to propose an exchange deal.',
      });
      return;
    }

    // AI Evaluation formula
    const valueRatio = netPackageValue / Math.max(1, targetPlayerValue);
    const hasPositionMatch = offeredPlayerIds.some(
      (id) => state.players[id]?.position === targetPlayer.position
    );

    if (valueRatio >= 1.15 || (valueRatio >= 0.95 && hasPositionMatch)) {
      setProposalResult({
        status: 'Accepted',
        message: `${targetClub.name} have ACCEPTED your player exchange package! ${targetPlayer.name} will sign for ${userClub.name}.`,
      });

      // Complete exchange in simulation
      setTimeout(() => {
        // Transfer target player to user club
        updatePlayerInSquad(targetPlayer.id, { clubId: state.userClubId });
        // Transfer offered players to target club
        offeredPlayerIds.forEach((id) => {
          updatePlayerInSquad(id, { clubId: targetClub.id });
        });
      }, 1500);
    } else if (valueRatio >= 0.75) {
      const demandedExtra = Math.round((targetPlayerValue * 1.1 - netPackageValue) / 1000000) * 1000000;
      setProposalResult({
        status: 'Countered',
        message: `${targetClub.name} are interested but find the current valuation insufficient.`,
        counterDemand: `They demand an additional ${formatMoney(Math.max(2000000, demandedExtra), state.settings.currency, true)} cash or an extra squad player.`,
      });
    } else {
      setProposalResult({
        status: 'Rejected',
        message: `${targetClub.name} have flatly rejected this exchange. They value ${targetPlayer.name} far higher than the offered assets.`,
      });
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-black text-white tracking-tight">Player Exchange & Swap Market</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Construct complex player-for-player deals, player + cash packages, sell-on percentages, and buy-back clauses.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            Available Budget: {formatMoney(userClub?.transferBudget || 0, state.settings.currency, true)}
          </span>
        </div>
      </div>

      {/* Main Deal Construction Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: You Offer (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>You Offer ({userClub?.name})</span>
            </h3>
            <span className="font-mono text-xs font-bold text-emerald-400">
              Total: {formatMoney(totalOfferedValue, state.settings.currency, true)}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              Select Player(s) to Include in Swap:
            </label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar p-1">
              {userPlayers.map((player) => {
                const isSelected = offeredPlayerIds.includes(player.id);
                return (
                  <div
                    key={player.id}
                    onClick={() => handleToggleOfferedPlayer(player.id)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                        : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono font-black text-emerald-400">{player.position}</span>
                      <span className="font-bold truncate">{player.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 font-mono">
                      <span className="text-slate-400">{formatMoney(player.marketValue, state.settings.currency, true)}</span>
                      <span className={`w-4 h-4 rounded flex items-center justify-center text-xs ${
                        isSelected ? 'bg-emerald-500 text-black' : 'border border-slate-700'
                      }`}>
                        {isSelected ? '✓' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cash Adjustment Slider */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span className="text-slate-300">Cash Included in Deal:</span>
              <span className="font-mono text-emerald-400">
                {formatMoney(cashAdjustment, state.settings.currency)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={userClub?.transferBudget || 50000000}
              step="500000"
              value={cashAdjustment}
              onChange={(e) => setCashAdjustment(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Clauses & Extras */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">Sell-On Clause</span>
              <div className="flex items-center justify-between font-mono font-bold">
                <span className="text-white">{sellOnPercentage}%</span>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={sellOnPercentage}
                  onChange={(e) => setSellOnPercentage(Number(e.target.value))}
                  className="w-20 accent-emerald-500"
                />
              </div>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={buyBackClause}
                  onChange={(e) => setBuyBackClause(e.target.checked)}
                />
                <span className="text-[11px] font-bold">Buy-Back Clause</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 mt-1">
                <input
                  type="checkbox"
                  checked={loanToBuy}
                  onChange={(e) => setLoanToBuy(e.target.checked)}
                />
                <span className="text-[11px] font-bold">Loan-to-Buy Option</span>
              </label>
            </div>
          </div>
        </div>

        {/* Center: Deal Evaluator & Package Summary (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-4">
          <ArrowLeftRight className="w-8 h-8 text-emerald-400 animate-pulse" />
          <div>
            <span className="text-[10px] text-slate-500 font-mono block">Package Valuation</span>
            <span className="text-lg font-black font-mono text-emerald-400 block">
              {formatMoney(netPackageValue, state.settings.currency, true)}
            </span>
          </div>

          <button
            onClick={handleEvaluateExchange}
            className="w-full py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl shadow-lg transition"
          >
            Submit Proposal
          </button>
        </div>

        {/* Right Side: You Receive (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span>You Receive ({targetClub?.name || 'Target Club'})</span>
            </h3>
            <span className="font-mono text-xs font-bold text-blue-400">
              Value: {formatMoney(targetPlayerValue, state.settings.currency, true)}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              Select Target Player to Acquire:
            </label>
            <select
              value={targetPlayerId}
              onChange={(e) => setTargetPlayerId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold focus:outline-none"
            >
              {otherPlayers.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name} ({player.position} - {state.clubs[player.clubId]?.shortName}) • {formatMoney(player.marketValue, state.settings.currency, true)}
                </option>
              ))}
            </select>
          </div>

          {targetPlayer && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-white text-base">{targetPlayer.name}</h4>
                  <span className="text-slate-400 text-[11px] block">
                    {targetPlayer.position} • {targetPlayer.role} • {targetPlayer.age} yrs
                  </span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-emerald-400 font-bold block">CA: {targetPlayer.currentAbility}</span>
                  <span className="text-amber-400 text-[10px]">PA: {targetPlayer.potentialAbility}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800/80 font-mono">
                <div>
                  <span className="text-slate-500">Current Club:</span>
                  <span className="font-bold text-white block">{targetClub?.name}</span>
                </div>
                <div>
                  <span className="text-slate-500">Weekly Salary:</span>
                  <span className="font-bold text-white block">
                    {formatMoney(targetPlayer.contract.salaryWeekly, state.settings.currency, true)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Proposal Feedback Toast / Status Box */}
      {proposalResult && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
            proposalResult.status === 'Accepted'
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
              : proposalResult.status === 'Countered'
              ? 'bg-amber-950/80 border-amber-500 text-amber-200'
              : 'bg-rose-950/80 border-rose-500 text-rose-200'
          }`}
        >
          {proposalResult.status === 'Accepted' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <div className="space-y-1 text-xs">
            <h5 className="font-black text-sm uppercase">Deal Status: {proposalResult.status}</h5>
            <p>{proposalResult.message}</p>
            {proposalResult.counterDemand && (
              <p className="font-bold text-white mt-1">{proposalResult.counterDemand}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
