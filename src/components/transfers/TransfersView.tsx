import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Player, Position } from '../../types/football';
import {
  Search,
  Filter,
  ArrowRightLeft,
  Coins,
  Shield,
  Sparkles,
  UserPlus,
  Flame,
  CheckCircle,
} from 'lucide-react';

export const TransfersView: React.FC = () => {
  const {
    state,
    submitTransferOffer,
    signFreeAgent,
    setSelectedPlayer,
    transferModalPlayer,
    setTransferModalPlayer,
  } = useGame();

  const userClub = state.clubs[state.userClubId];
  const allPlayers = Object.values(state.players);

  // Tabs: Search Market, Free Agents, Shortlist, Transfer Bids
  const [activeTab, setActiveTab] = useState<'market' | 'free_agents' | 'shortlist' | 'bids'>('market');
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('All');
  const [maxAge, setMaxAge] = useState<number>(35);
  const [minAbility, setMinAbility] = useState<number>(70);

  // Transfer negotiation modal state
  const [negotiatingPlayer, setNegotiatingPlayer] = useState<Player | null>(null);
  const [bidFee, setBidFee] = useState<number>(20000000);
  const [bidWage, setBidWage] = useState<number>(100000);
  const [contractYears, setContractYears] = useState<number>(4);

  // Filter players based on tab
  const filteredPlayers = allPlayers.filter((p) => {
    if (activeTab === 'free_agents') {
      if (p.clubId !== '') return false;
    } else if (activeTab === 'shortlist') {
      if (!state.shortlistPlayerIds.includes(p.id)) return false;
    } else {
      // Market tab - exclude user club players
      if (p.clubId === state.userClubId || p.clubId === '') return false;
    }

    if (positionFilter !== 'All' && p.position !== positionFilter) return false;
    if (p.age > maxAge) return false;
    if (p.currentAbility < minAbility) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    return true;
  });

  const handleOpenNegotiation = (player: Player) => {
    setNegotiatingPlayer(player);
    setBidFee(Math.max(1000000, Math.round(player.marketValue * 1.05)));
    setBidWage(Math.max(20000, Math.round((player.contract?.salaryWeekly || 50000) * 1.15)));
    setContractYears(4);
  };

  const handleConfirmBid = () => {
    if (!negotiatingPlayer) return;
    if (negotiatingPlayer.clubId === '') {
      // Free agent
      signFreeAgent(negotiatingPlayer.id, bidWage, contractYears);
    } else {
      submitTransferOffer(negotiatingPlayer.id, bidFee, bidWage, contractYears);
    }
    setNegotiatingPlayer(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Finances & Transfer Window Status */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
              {state.isTransferWindowOpen ? 'Summer Window Open' : 'Window Closed'}
            </span>
            <span className="text-xs text-slate-400">Apex Global Transfer Network</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Transfer Operations</h2>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px]">Available Budget</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              €{((userClub?.transferBudget || 0) / 1000000).toFixed(1)}M
            </span>
          </div>
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[10px]">Weekly Wage Limit</span>
            <span className="font-mono font-bold text-amber-400 text-sm">
              €{((userClub?.wageBudgetWeekly || 0) / 1000).toFixed(0)}k/wk
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          {(
            [
              { id: 'market', label: 'All Players' },
              { id: 'free_agents', label: 'Free Agents' },
              { id: 'shortlist', label: `Shortlist (${state.shortlistPlayerIds.length})` },
              { id: 'bids', label: `Submitted Bids (${state.transferBids.length})` },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === t.id ? 'bg-emerald-500 text-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search player name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 w-44"
            />
          </div>

          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
          >
            <option value="All">All Positions</option>
            {['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'].map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Players List */}
      {activeTab === 'bids' ? (
        /* Submitted Bids Table */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <h3 className="font-bold text-sm text-slate-200 mb-3">Submitted Transfer Proposals</h3>
          {state.transferBids.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4">No active transfer negotiations at present.</p>
          ) : (
            <div className="space-y-2">
              {state.transferBids.map((bid) => {
                const player = state.players[bid.playerId];
                const fromClub = state.clubs[bid.fromClubId];
                return (
                  <div
                    key={bid.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white text-sm block">{player?.name || 'Player'}</span>
                      <span className="text-slate-400 text-[11px]">
                        Offered Fee: €{(bid.fee / 1000000).toFixed(1)}M • Wage: €{(bid.wageOffer / 1000).toFixed(0)}k/wk
                      </span>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded text-xs border border-emerald-500/30">
                      {bid.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Players Table */
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-700/60">
                <tr>
                  <th className="py-3 px-3">Pos</th>
                  <th className="py-3 px-3">Player</th>
                  <th className="py-3 px-3">Current Club</th>
                  <th className="py-3 px-3 text-center">Age</th>
                  <th className="py-3 px-3 text-center">OVR</th>
                  <th className="py-3 px-3 text-center">POT</th>
                  <th className="py-3 px-3 text-right">Market Value</th>
                  <th className="py-3 px-3 text-right">Wage</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredPlayers.slice(0, 30).map((player) => {
                  const club = state.clubs[player.clubId];
                  const isWonderkid = player.potentialAbility >= 88 && player.age <= 21;

                  return (
                    <tr key={player.id} className="hover:bg-slate-800/50 transition text-slate-200">
                      <td className="py-2.5 px-3">
                        <span className="inline-block font-bold text-[10px] px-2 py-0.5 rounded text-white bg-slate-700">
                          {player.position}
                        </span>
                      </td>
                      <td
                        onClick={() => setSelectedPlayer(player)}
                        className="py-2.5 px-3 font-bold text-white hover:text-emerald-400 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{player.name}</span>
                        {isWonderkid && (
                          <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 rounded border border-purple-500/30">
                            ★ Wonderkid
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {club ? club.name : <span className="text-emerald-400 font-semibold">Free Agent</span>}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-300">{player.age}</td>
                      <td className="py-2.5 px-3 text-center font-black text-emerald-400 text-sm">
                        {player.currentAbility}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-purple-400">
                        {player.potentialAbility}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-300">
                        {player.clubId === '' ? (
                          <span className="text-emerald-400 font-bold">FREE</span>
                        ) : (
                          `€${(player.marketValue / 1000000).toFixed(1)}M`
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                        €{(player.contract?.salaryWeekly / 1000 || 0).toFixed(0)}k/wk
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleOpenNegotiation(player)}
                          className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition"
                        >
                          {player.clubId === '' ? 'Offer Contract' : 'Make Offer'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transfer Bid Negotiation Modal */}
      {negotiatingPlayer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                {negotiatingPlayer.clubId === '' ? 'Free Agent Signing' : 'Transfer Bid Negotiation'}
              </span>
              <h3 className="text-xl font-black text-white">{negotiatingPlayer.name}</h3>
              <span className="text-xs text-slate-400">
                {negotiatingPlayer.position} • Overall {negotiatingPlayer.currentAbility} • Age {negotiatingPlayer.age}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {negotiatingPlayer.clubId !== '' && (
                <div>
                  <div className="flex justify-between font-semibold mb-1 text-slate-300">
                    <span>Transfer Fee Offer:</span>
                    <span className="font-mono text-emerald-400">€{(bidFee / 1000000).toFixed(1)}M</span>
                  </div>
                  <input
                    type="range"
                    min="1000000"
                    max="150000000"
                    step="1000000"
                    value={bidFee}
                    onChange={(e) => setBidFee(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              )}

              <div>
                <div className="flex justify-between font-semibold mb-1 text-slate-300">
                  <span>Weekly Wage Offer:</span>
                  <span className="font-mono text-amber-400">€{(bidWage / 1000).toFixed(0)}k/week</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="450000"
                  step="5000"
                  value={bidWage}
                  onChange={(e) => setBidWage(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1 text-slate-300">
                  <span>Contract Length:</span>
                  <span className="font-bold text-white">{contractYears} Years</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setContractYears(yr)}
                      className={`flex-1 py-1.5 rounded-lg font-bold border transition ${
                        contractYears === yr
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {yr}Y
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setNegotiatingPlayer(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBid}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                Submit Proposal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
