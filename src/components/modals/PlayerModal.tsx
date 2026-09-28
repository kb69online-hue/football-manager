import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Player, Position } from '../../types/football';
import { DETAILED_PLAYER_ROLES } from '../../data/roleSystemData';
import { formatMoney } from '../../services/currencyService';
import { generatePersonAvatarSvg } from '../../services/assetService';
import {
  X,
  Sparkles,
  Shield,
  Trophy,
  Activity,
  Award,
  Calendar,
  Globe,
  TrendingUp,
  AlertCircle,
  Clock,
  Compass,
  Zap,
} from 'lucide-react';

interface PlayerModalProps {
  player: Player;
  onClose: () => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({ player, onClose }) => {
  const { state } = useGame();
  const club = state.clubs[player.clubId];
  const [activeTab, setActiveTab] = useState<
    'attributes' | 'contract' | 'career' | 'international_awards' | 'injuries_transfers' | 'role_tactics'
  >('attributes');

  const a = player.attributes;
  const isGK = player.position === 'GK';
  const roleDef = DETAILED_PLAYER_ROLES[player.role];

  const avatarSvg = generatePersonAvatarSvg(
    player.name,
    '#18181B',
    '#D89564',
    club?.primaryColor || '#10B981'
  );

  const renderAttributeRow = (label: string, value: number) => (
    <div key={label} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/40">
      <span className="text-slate-400">{label}</span>
      <span
        className={`font-mono font-bold ${
          value >= 85
            ? 'text-emerald-400 font-black'
            : value >= 75
            ? 'text-teal-400'
            : value >= 65
            ? 'text-amber-400'
            : 'text-slate-400'
        }`}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Generated Original Avatar & Club Badge */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {/* Generated Original Avatar Fallback */}
            <div
              className="w-16 h-16 rounded-2xl overflow-hidden border border-white/20 shadow-xl shrink-0 bg-slate-950 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: avatarSvg }}
            />

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-black text-white truncate">{player.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-bold border border-slate-700">
                  #{player.squadNumber || 99}
                </span>
                {player.potentialAbility >= 88 && player.age <= 21 && (
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 flex items-center gap-1 font-bold">
                    <Sparkles className="w-3 h-3" /> Wonderkid
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
                <span className="font-bold text-white">{player.position}</span>
                {player.secondaryPositions && player.secondaryPositions.length > 0 && (
                  <span className="text-slate-500">({player.secondaryPositions.join(', ')})</span>
                )}
                <span>•</span>
                <span>{player.nationality}</span>
                <span>•</span>
                <span>{player.age} yrs ({player.dateOfBirth || '2003-05-18'})</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">{club ? club.name : 'Free Agent'}</span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                <span>Foot: <strong className="text-slate-200">{player.preferredFoot}</strong></span>
                <span>Height: <strong className="text-slate-200">{player.heightCm || 182} cm</strong></span>
                <span>Weight: <strong className="text-slate-200">{player.weightKg || 76} kg</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-slate-400 block font-mono">Ability / Potential</span>
              <span className="font-mono font-black text-lg text-emerald-400">
                CA {player.currentAbility}{' '}
                <span className="text-slate-500 font-light">/</span>{' '}
                <span className="text-purple-400">PA {player.potentialAbility}</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-1 px-5 pt-2.5 border-b border-slate-800 text-xs overflow-x-auto custom-scrollbar">
          {[
            { id: 'attributes', label: 'Attributes & Skills' },
            { id: 'contract', label: 'Contract & Value' },
            { id: 'career', label: 'Career Statistics' },
            { id: 'international_awards', label: 'International & Honors' },
            { id: 'injuries_transfers', label: 'Injuries & Transfers' },
            { id: 'role_tactics', label: `Role: ${player.role}` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 px-3 font-bold capitalize transition border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* TAB 1: Attributes */}
          {activeTab === 'attributes' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Technical / Goalkeeper */}
              <div className="bg-slate-950/70 p-4 rounded-3xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider">
                  {isGK ? 'Goalkeeping Attributes' : 'Technical Attributes'}
                </h4>
                {isGK
                  ? [
                      ['Reflexes', a.reflexes],
                      ['Handling', a.handling],
                      ['Positioning', a.gkPositioning],
                      ['One-on-One', a.oneOnOne],
                      ['Diving', a.diving],
                      ['Aerial Ability', a.aerialAbility],
                      ['Distribution', a.distribution],
                    ].map(([l, v]) => renderAttributeRow(l as string, v as number))
                  : [
                      ['Finishing', a.finishing],
                      ['Passing', a.passing],
                      ['First Touch', a.firstTouch],
                      ['Dribbling', a.dribbling],
                      ['Crossing', a.crossing],
                      ['Tackling', a.tackling],
                      ['Heading', a.heading],
                      ['Long Shots', a.longShots],
                      ['Technique', a.technique],
                      ['Penalties', a.penalties],
                    ].map(([l, v]) => renderAttributeRow(l as string, v as number))}
              </div>

              {/* Mental */}
              <div className="bg-slate-950/70 p-4 rounded-3xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-xs text-indigo-400 uppercase tracking-wider">Mental Attributes</h4>
                {[
                  ['Composure', a.composure],
                  ['Decisions', a.decisions],
                  ['Vision', a.vision],
                  ['Positioning', a.positioning],
                  ['Anticipation', a.anticipation],
                  ['Concentration', a.concentration],
                  ['Work Rate', a.workRate],
                  ['Determination', a.determination],
                  ['Leadership', a.leadership],
                  ['Teamwork', a.teamwork],
                ].map(([l, v]) => renderAttributeRow(l as string, v as number))}
              </div>

              {/* Physical */}
              <div className="bg-slate-950/70 p-4 rounded-3xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-xs text-amber-400 uppercase tracking-wider">Physical Attributes</h4>
                {[
                  ['Pace', a.pace],
                  ['Acceleration', a.acceleration],
                  ['Stamina', a.stamina],
                  ['Strength', a.strength],
                  ['Agility', a.agility],
                  ['Balance', a.balance],
                  ['Jumping Reach', a.jumping],
                  ['Condition (Fitness)', player.condition],
                  ['Match Sharpness', player.sharpness],
                ].map(([l, v]) => renderAttributeRow(l as string, v as number))}
              </div>
            </div>
          )}

          {/* TAB 2: Contract & Valuation */}
          {activeTab === 'contract' && (
            <div className="bg-slate-950/70 p-5 rounded-3xl border border-slate-800 space-y-4 text-xs">
              <h4 className="font-bold text-sm text-white">Contractual Terms & Market Status</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Weekly Salary</span>
                  <span className="font-mono font-bold text-base text-emerald-400">
                    {formatMoney(player.contract?.salaryWeekly || 50000, state.settings.currency, true)}/wk
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Contract Expiry</span>
                  <span className="font-mono font-bold text-base text-white">
                    June {player.contract?.expiryYear || 2028}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Market Valuation</span>
                  <span className="font-mono font-bold text-base text-amber-400">
                    {formatMoney(player.marketValue, state.settings.currency, true)}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Personality Trait</span>
                  <span className="font-bold text-base text-purple-400">{player.personality}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 font-mono">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block">Appearance Bonus</span>
                  <span className="font-bold text-slate-200">
                    {formatMoney(player.contract?.appearanceBonus || 2500, state.settings.currency, true)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block">Goal Bonus</span>
                  <span className="font-bold text-slate-200">
                    {formatMoney(player.contract?.goalBonus || 5000, state.settings.currency, true)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] block">Loyalty Bonus</span>
                  <span className="font-bold text-slate-200">
                    {formatMoney(player.contract?.loyaltyBonus || 100000, state.settings.currency, true)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Career Statistics */}
          {activeTab === 'career' && (
            <div className="bg-slate-950/70 p-5 rounded-3xl border border-slate-800 space-y-4 text-xs">
              <h4 className="font-bold text-sm text-white">Season by Season Career Record</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Season</th>
                      <th className="py-2.5 px-3">Club</th>
                      <th className="py-2.5 px-3 text-center">Apps</th>
                      <th className="py-2.5 px-3 text-center">Goals</th>
                      <th className="py-2.5 px-3 text-center">Assists</th>
                      <th className="py-2.5 px-3 text-center">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    <tr className="hover:bg-slate-900/40">
                      <td className="py-2.5 px-3 font-bold text-white">2026/27 (Current)</td>
                      <td className="py-2.5 px-3 text-emerald-400">{club ? club.name : 'Free Agent'}</td>
                      <td className="py-2.5 px-3 text-center">{player.stats.appearances}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-white">{player.stats.goals}</td>
                      <td className="py-2.5 px-3 text-center text-blue-400">{player.stats.assists}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-400">
                        {player.stats.avgRating.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/40 text-slate-400">
                      <td className="py-2.5 px-3">2025/26</td>
                      <td className="py-2.5 px-3">{club ? club.name : 'Senior Squad'}</td>
                      <td className="py-2.5 px-3 text-center">36</td>
                      <td className="py-2.5 px-3 text-center">14</td>
                      <td className="py-2.5 px-3 text-center">8</td>
                      <td className="py-2.5 px-3 text-center">7.34</td>
                    </tr>
                    <tr className="hover:bg-slate-900/40 text-slate-400">
                      <td className="py-2.5 px-3">2024/25</td>
                      <td className="py-2.5 px-3">{club ? club.name : 'Youth Academy'}</td>
                      <td className="py-2.5 px-3 text-center">28</td>
                      <td className="py-2.5 px-3 text-center">9</td>
                      <td className="py-2.5 px-3 text-center">5</td>
                      <td className="py-2.5 px-3 text-center">7.18</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: International & Awards */}
          {activeTab === 'international_awards' && (
            <div className="bg-slate-950/70 p-5 rounded-3xl border border-slate-800 space-y-4 text-xs">
              <h4 className="font-bold text-sm text-white">International Honors & Career Awards</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-slate-400 font-bold block flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span>National Team Dossier</span>
                  </span>
                  <div className="font-mono text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Nation:</span>
                      <span className="font-bold text-white">{player.nationality}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">International Caps:</span>
                      <span className="font-bold text-emerald-400">
                        {player.internationalStats?.caps || Math.max(0, player.currentAbility - 65)} caps
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">International Goals:</span>
                      <span className="font-bold text-white">
                        {player.internationalStats?.goals || Math.floor((player.currentAbility - 65) / 3)} goals
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-slate-400 font-bold block flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Trophies & Individual Honors</span>
                  </span>
                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Domestic Division Championship (2024/25)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Player of the Month Award (October 2025)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Injuries & Transfers */}
          {activeTab === 'injuries_transfers' && (
            <div className="bg-slate-950/70 p-5 rounded-3xl border border-slate-800 space-y-4 text-xs">
              <h4 className="font-bold text-sm text-white">Medical Record & Historical Transfers</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-slate-400 font-bold block flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Injury History</span>
                  </span>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                      <div className="flex justify-between text-white font-bold">
                        <span>Ankle Sprain</span>
                        <span className="text-emerald-400">Recovered</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">14 days out • 2025-11-04</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                      <div className="flex justify-between text-white font-bold">
                        <span>Hamstring Strain</span>
                        <span className="text-emerald-400">Recovered</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">21 days out • 2024-03-12</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-slate-400 font-bold block flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Transfer Record</span>
                  </span>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-white font-bold block">Joined {club?.name || 'Club'}</span>
                      <span className="text-emerald-400 text-xs block">
                        Fee: {formatMoney(player.marketValue * 0.9, state.settings.currency, true)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">2024-07-15</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Role & Tactical Directives */}
          {activeTab === 'role_tactics' && roleDef && (
            <div className="bg-slate-950/70 p-5 rounded-3xl border border-slate-800 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 block">
                    Assigned Tactical Role
                  </span>
                  <h4 className="text-base font-black text-white">{roleDef.role}</h4>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs">
                  Category: {roleDef.category}
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed">{roleDef.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800 font-mono text-[11px]">
                <div>
                  <span className="text-slate-500 block">Duty:</span>
                  <span className="font-bold text-white">{roleDef.tacticalDirectives.duty}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Pressing:</span>
                  <span className="font-bold text-amber-300">{roleDef.tacticalDirectives.pressing}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Passing:</span>
                  <span className="font-bold text-blue-300">{roleDef.tacticalDirectives.passingStyle}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Freedom:</span>
                  <span className="font-bold text-emerald-300">{roleDef.tacticalDirectives.positioningFreedom}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                <span className="text-[11px] font-bold text-emerald-400 block">Performance Impact</span>
                <p className="text-xs text-emerald-200/90 mt-0.5">{roleDef.performanceEffects}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            ID: {player.id} • Verified Player Dossier
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
