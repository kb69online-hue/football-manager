import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { HISTORICAL_SEASONS_ARCHIVE, generateFutureSeasonData } from '../../data/historicalData';
import { HistoricalSeason } from '../../types/football';
import {
  Calendar,
  Trophy,
  History,
  Sparkles,
  Award,
  ArrowRight,
  TrendingUp,
  Layers,
  Flame,
  CheckCircle,
  Play,
  Plus,
  X,
} from 'lucide-react';

export const HistoricalView: React.FC = () => {
  const { startNewCareer } = useGame();
  const [seasons, setSeasons] = useState<HistoricalSeason[]>(HISTORICAL_SEASONS_ARCHIVE);
  const [selectedSeasonYear, setSelectedSeasonYear] = useState<number>(2004);
  const [generationFilter, setGenerationFilter] = useState<string>('ALL');
  const [confirmingEra, setConfirmingEra] = useState<HistoricalSeason | null>(null);

  const selectedSeason =
    seasons.find((s) => s.year === selectedSeasonYear) || seasons[0];

  const filteredSeasons = seasons.filter((s) => {
    if (generationFilter !== 'ALL' && s.generation !== generationFilter) return false;
    return true;
  });

  const handleGenerateNextSeason = () => {
    const maxYear = Math.max(...seasons.map((s) => s.year));
    const nextYear = maxYear + 1;
    const newSeason = generateFutureSeasonData(nextYear);
    setSeasons((prev) => [...prev, newSeason]);
    setSelectedSeasonYear(nextYear);
  };

  const handleConfirmStart = () => {
    if (confirmingEra) {
      startNewCareer('club_london_fc');
      setConfirmingEra(null);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-black text-white tracking-tight">Historical Football Archive & Generations</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Explore legendary football eras beginning from 2000 onward through future campaigns. Relive iconic teams, transfers, and Ballon d’Or triumphs.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Generation Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs bg-slate-900 p-1 rounded-2xl border border-slate-800">
            {['ALL', '2000s Generation', '2010s Generation', '2020s Generation', 'Future Generation'].map((gen) => (
              <button
                key={gen}
                onClick={() => setGenerationFilter(gen)}
                className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                  generationFilter === gen
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {gen}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerateNextSeason}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 shadow"
            title="Generate future season dynamically without application rebuild"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Next Season</span>
          </button>
        </div>
      </div>

      {/* Eras Timeline Selector Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
        {filteredSeasons.map((season) => {
          const isSelected = selectedSeasonYear === season.year;
          return (
            <div
              key={season.year}
              onClick={() => setSelectedSeasonYear(season.year)}
              className={`p-3 rounded-2xl border text-center transition cursor-pointer space-y-1 ${
                isSelected
                  ? 'bg-amber-500 text-black border-amber-400 font-black shadow-lg scale-105'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className={`text-[10px] uppercase font-mono block ${isSelected ? 'text-black/80' : 'text-slate-500'}`}>
                {season.year}
              </span>
              <span className="font-black text-sm block leading-tight truncate">
                {season.seasonLabel.split('—')[0].trim()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Selected Era Detailed Dossier */}
      {selectedSeason && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          {/* Era Hero Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {selectedSeason.generation}
                </span>
                <span className="text-xs font-mono text-slate-400">Archived Universe State</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white">{selectedSeason.seasonLabel}</h3>
              <p className="text-xs text-slate-300 mt-2 max-w-3xl leading-relaxed">
                {selectedSeason.summary}
              </p>
            </div>

            <button
              onClick={() => setConfirmingEra(selectedSeason)}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition flex items-center gap-2 shadow-lg shrink-0 self-start md:self-auto"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Launch Career in {selectedSeason.year}</span>
            </button>
          </div>

          {/* Key Facts & Champions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Champions Cabinet */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
              <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase text-[11px]">
                <Trophy className="w-4 h-4" />
                <span>Champions of the Season</span>
              </span>
              <div className="space-y-1.5 font-mono">
                {selectedSeason.champions.map((c, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-slate-900 last:border-0">
                    <span className="text-slate-400 truncate max-w-[140px]">{c.competition}:</span>
                    <span className="font-bold text-white text-right">{c.winner}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Honors: Ballon d'Or & Record Transfer */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
              <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase text-[11px]">
                <Award className="w-4 h-4" />
                <span>Ballon d'Or & Major Transfers</span>
              </span>
              <div className="space-y-2 font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Ballon d'Or Recipient:</span>
                  <span className="font-black text-amber-300 text-sm">{selectedSeason.ballonDorWinner.name}</span>
                  <span className="text-[10px] text-slate-400 block font-sans">
                    ({selectedSeason.ballonDorWinner.club} • {selectedSeason.ballonDorWinner.nationality})
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Record Transfer:</span>
                  <span className="font-bold text-emerald-400 text-xs">{selectedSeason.recordTransfer.player}</span>
                  <span className="text-[10px] text-slate-400 block font-sans">
                    {selectedSeason.recordTransfer.fee} ({selectedSeason.recordTransfer.from} → {selectedSeason.recordTransfer.to})
                  </span>
                </div>
              </div>
            </div>

            {/* Leading Goalscorers */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
              <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase text-[11px]">
                <Flame className="w-4 h-4" />
                <span>Top Goalscorers</span>
              </span>
              <div className="space-y-1.5 font-mono">
                {selectedSeason.topScorers.map((s, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-slate-900 last:border-0">
                    <span className="text-white font-bold">{s.name} ({s.club})</span>
                    <span className="font-black text-emerald-400">{s.goals} Goals</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Super Clubs in this Era */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Dominant Clubs of the {selectedSeason.year} Era</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {selectedSeason.keyClubs.map((club, idx) => (
                <div key={idx} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1 text-xs font-mono">
                  <h5 className="font-black text-white text-sm">{club.name}</h5>
                  <div className="text-[11px] text-slate-400">Coach: <strong className="text-slate-200">{club.manager}</strong></div>
                  <div className="text-[11px] text-slate-400">Star: <strong className="text-amber-300">{club.starPlayer}</strong></div>
                  <div className="text-[10px] text-emerald-400 font-bold mt-1">Reputation: {club.reputation}/100</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* In-App Career Initialization Confirmation Modal (Zero window.confirm) */}
      {confirmingEra && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-lg flex items-center gap-2">
                <Play className="w-5 h-5 text-emerald-400" />
                <span>Initialize Career in {confirmingEra.year}</span>
              </h3>
              <button onClick={() => setConfirmingEra(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to initialize a new career starting in the{' '}
              <strong className="text-white font-bold">{confirmingEra.seasonLabel}</strong>? This will configure the football universe to that era’s landscape.
            </p>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Era:</span>
                <span className="font-bold text-amber-300">{confirmingEra.generation}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Ballon d'Or:</span>
                <span className="font-bold text-white">{confirmingEra.ballonDorWinner.name}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setConfirmingEra(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStart}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs"
              >
                Confirm & Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
