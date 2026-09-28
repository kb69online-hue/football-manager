import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Club, Formation, Manager } from '../../types/football';
import { formatMoney } from '../../services/currencyService';
import { soundService } from '../../services/soundService';
import {
  X,
  Trophy,
  PlusCircle,
  Check,
  Shield,
  User,
  Calendar,
  Globe,
  Award,
  Zap,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Sliders,
  Play,
} from 'lucide-react';

const NATIONALITIES = [
  { name: 'Tanzania', flag: '🇹🇿' },
  { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'Argentina', flag: '🇦🇷' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'Kenya', flag: '🇰🇪' },
  { name: 'Nigeria', flag: '🇳🇬' },
  { name: 'South Africa', flag: '🇿🇦' },
  { name: 'United States', flag: '🇺🇸' },
];

const GAME_MODES = [
  { id: 'career', name: 'Career Mode', desc: 'Long-term club building across decades', icon: Trophy },
  { id: 'quick', name: 'Quick Start', desc: 'Jump straight into matchday action', icon: Zap },
  { id: 'custom_club', name: 'Custom Club', desc: 'Create your own club from scratch', icon: Shield },
  { id: 'historical', name: 'Historical Career', desc: 'Start from 2000 onward eras', icon: Calendar },
  { id: 'challenge', name: 'Challenge Mode', desc: 'Survival, transfer bans & youth only', icon: Award },
  { id: 'sandbox', name: 'Sandbox Mode', desc: 'Unlimited budgets and custom rules', icon: Sparkles },
  { id: 'real_world', name: 'Real World Mode', desc: 'Synchronized with real football fixtures', icon: Globe },
  { id: 'offline', name: 'Offline Career', desc: 'Play anywhere without internet', icon: Sliders },
];

const STARTING_YEARS = [2000, 2004, 2008, 2011, 2015, 2018, 2020, 2022, 2024, 2026, 2027];

export const CareerSetupModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state, startNewCareer } = useGame();

  const [step, setStep] = useState<number>(1); // 1 to 7

  // Step 1: Manager Name
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Michael');
  const [displayName, setDisplayName] = useState('John Michael');

  // Step 2: Starting Year
  const [startingYear, setStartingYear] = useState<number>(2026);

  // Step 3: Nationality
  const [selectedNationality, setSelectedNationality] = useState('Tanzania');

  // Step 4: Based Team
  const [clubType, setClubType] = useState<'existing' | 'custom'>('existing');
  const [selectedClubId, setSelectedClubId] = useState<string>('club_london_fc');
  const [customClubName, setCustomClubName] = useState('Kilimanjaro Stars FC');
  const [customShortName, setCustomShortName] = useState('KIL');
  const [customStadium, setCustomStadium] = useState('Uhuru Stadium');
  const [customColor, setCustomColor] = useState('#10B981');
  const [customBudget, setCustomBudget] = useState(85000000); // Base EUR, displayed in TZS

  // Step 5: Manager Profile
  const [managerAge, setManagerAge] = useState(42);
  const [preferredFormation, setPreferredFormation] = useState<Formation>('4-3-3');
  const [tacticalPhilosophy, setTacticalPhilosophy] = useState<Manager['philosophy']>('Gegenpressing');
  const [coachingFocus, setCoachingFocus] = useState('Tactical & Youth Development');

  // Step 6: Difficulty
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Normal' | 'Hard' | 'Expert' | 'Simulation'>('Normal');

  // Step 7: Game Mode
  const [selectedMode, setSelectedMode] = useState<string>('career');

  const handleNext = () => {
    soundService.playClick();
    if (step < 7) {
      setStep(step + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    soundService.playClick();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinalSubmit = () => {
    soundService.playWhistle();
    if (clubType === 'existing') {
      startNewCareer(selectedClubId, {
        name: displayName || `${firstName} ${lastName}`.trim(),
        age: managerAge,
        nationality: selectedNationality,
        philosophy: tacticalPhilosophy,
        preferredFormation,
      });
    } else {
      startNewCareer(
        'club_custom',
        {
          name: displayName || `${firstName} ${lastName}`.trim(),
          age: managerAge,
          nationality: selectedNationality,
          philosophy: tacticalPhilosophy,
          preferredFormation,
        },
        true,
        {
          name: customClubName,
          shortName: customShortName,
          country: selectedNationality,
          stadiumName: customStadium,
          primaryColor: customColor,
          transferBudget: customBudget,
        }
      );
    }
    onClose();
  };

  const currentClub = state.clubs[selectedClubId];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto font-sans">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Step Progress */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider font-mono">
                STEP {step} OF 7 • MANAGER WIZARD
              </span>
              <span className="text-[10px] font-mono text-slate-400">All Finances in TZS</span>
            </div>
            <h3 className="text-xl font-black text-white">
              {step === 1 && 'Step 1 — Manager Identity'}
              {step === 2 && 'Step 2 — Starting Year & Era'}
              {step === 3 && 'Step 3 — Nationality Selection'}
              {step === 4 && 'Step 4 — Choose or Create Club'}
              {step === 5 && 'Step 5 — Coaching Profile & Style'}
              {step === 6 && 'Step 6 — Game Difficulty'}
              {step === 7 && 'Step 7 — Game Mode & Launch'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center gap-1.5 px-6 pt-3 bg-slate-950/40">
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-emerald-400' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Main Step Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* STEP 1: Manager Name */}
          {step === 1 && (
            <div className="space-y-4 max-w-lg mx-auto py-4">
              <div className="space-y-1.5">
                <label className="font-bold text-xs text-slate-300">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setDisplayName(`${e.target.value} ${lastName}`);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-xs text-slate-300">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setDisplayName(`${firstName} ${e.target.value}`);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-xs text-slate-300">Display Name on Broadcast & Press</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-emerald-400 font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Starting Year */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Select your starting historical football era. Starting in 2004 or 2011 initializes the historical football landscape with accurate squads and legends.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {STARTING_YEARS.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => {
                      soundService.playClick();
                      setStartingYear(yr);
                    }}
                    className={`p-4 rounded-2xl border text-center transition ${
                      startingYear === yr
                        ? 'bg-emerald-500 text-black border-emerald-400 font-black shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-mono text-xs block opacity-80">Season</span>
                    <span className="text-xl font-black block">{yr}</span>
                    <span className="text-[10px] block opacity-70">
                      {yr === 2026 ? 'Current In-Game' : yr > 2026 ? 'Next-Gen Era' : 'Historical Era'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Nationality */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">Choose manager nationality and cultural background:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {NATIONALITIES.map((n) => (
                  <button
                    key={n.name}
                    onClick={() => {
                      soundService.playClick();
                      setSelectedNationality(n.name);
                    }}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition ${
                      selectedNationality === n.name
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{n.flag}</span>
                    <span className="font-bold text-xs truncate">{n.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Based Team */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 text-xs font-bold">
                <button
                  onClick={() => setClubType('existing')}
                  className={`flex-1 py-2.5 rounded-2xl border transition ${
                    clubType === 'existing'
                      ? 'bg-emerald-500 text-black border-emerald-500 shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Choose Real / Official Club
                </button>
                <button
                  onClick={() => setClubType('custom')}
                  className={`flex-1 py-2.5 rounded-2xl border transition ${
                    clubType === 'custom'
                      ? 'bg-emerald-500 text-black border-emerald-500 shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Create Custom Club
                </button>
              </div>

              {clubType === 'existing' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto custom-scrollbar">
                  {Object.values(state.clubs).map((club) => {
                    const isSelected = selectedClubId === club.id;
                    return (
                      <div
                        key={club.id}
                        onClick={() => {
                          soundService.playClick();
                          setSelectedClubId(club.id);
                        }}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-slate-950 border-emerald-500 ring-1 ring-emerald-500 shadow-lg'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-xs border border-white/20 shrink-0"
                            style={{ backgroundColor: club.primaryColor }}
                          >
                            {club.shortName}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-xs truncate">{club.name}</h4>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              Budget: {formatMoney(club.transferBudget, 'TZS', true)}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {club.reputation}% REP
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3 bg-slate-950 p-4 rounded-3xl border border-slate-800 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-300">Custom Club Name</label>
                      <input
                        type="text"
                        value={customClubName}
                        onChange={(e) => setCustomClubName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-300">Short Code</label>
                      <input
                        type="text"
                        maxLength={4}
                        value={customShortName}
                        onChange={(e) => setCustomShortName(e.target.value.toUpperCase())}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-300">Stadium Name</label>
                      <input
                        type="text"
                        value={customStadium}
                        onChange={(e) => setCustomStadium(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-300">Primary Color</label>
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-full h-9 rounded-xl bg-transparent border border-slate-700 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">
                      Starting Transfer Budget: {formatMoney(customBudget, 'TZS', false)}
                    </label>
                    <input
                      type="range"
                      min="20000000"
                      max="200000000"
                      step="5000000"
                      value={customBudget}
                      onChange={(e) => setCustomBudget(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Manager Profile */}
          {step === 5 && (
            <div className="space-y-4 max-w-lg mx-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Manager Age</label>
                  <input
                    type="number"
                    min="28"
                    max="75"
                    value={managerAge}
                    onChange={(e) => setManagerAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Preferred Formation</label>
                  <select
                    value={preferredFormation}
                    onChange={(e) => setPreferredFormation(e.target.value as Formation)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {['4-3-3', '4-2-3-1', '4-4-2', '3-5-2', '3-4-3', '5-3-2', '4-1-4-1'].map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Tactical Philosophy</label>
                <select
                  value={tacticalPhilosophy}
                  onChange={(e) => setTacticalPhilosophy(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Gegenpressing">Gegenpressing (High Press & Fast Transition)</option>
                  <option value="Attacking Tiki-Taka">Attacking Tiki-Taka (Fluid Short Passing)</option>
                  <option value="Solid Counter-Attack">Solid Counter-Attack (Resolute Low Block)</option>
                  <option value="Fluid Possession">Fluid Possession (Position Interchange)</option>
                  <option value="Direct Physical">Direct Physical (Target Man & Fast Wingers)</option>
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Coaching Strengths:</span>
                  <span className="text-emerald-400 font-bold">Tactical & Man Management</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Youth Nurturing:</span>
                  <span className="text-blue-400 font-bold">+15% Academy Growth Bonus</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Difficulty */}
          {step === 6 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">Select gameplay realism and board scrutiny:</p>
              {(['Beginner', 'Normal', 'Hard', 'Expert', 'Simulation'] as const).map((diff) => (
                <div
                  key={diff}
                  onClick={() => {
                    soundService.playClick();
                    setDifficulty(diff);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    difficulty === diff
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow ring-1 ring-emerald-500'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h4 className="font-black text-sm text-white">{diff}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {diff === 'Beginner' && 'Forgiving board, abundant transfer funds, easy player negotiations.'}
                      {diff === 'Normal' && 'Balanced authentic football management experience.'}
                      {diff === 'Hard' && 'Strict wage caps, tough player contracts, higher injury risks.'}
                      {diff === 'Expert' && 'Ruthless board expectations, realistic scouting delays.'}
                      {diff === 'Simulation' && 'Maximum tactical depth, true-to-life financial fair play constraints.'}
                    </p>
                  </div>
                  {difficulty === diff && <Check className="w-5 h-5 text-emerald-400" />}
                </div>
              ))}
            </div>
          )}

          {/* STEP 7: Game Mode & Launch */}
          {step === 7 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">Choose mode and launch your dynasty:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto custom-scrollbar">
                {GAME_MODES.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = selectedMode === mode.id;
                  return (
                    <div
                      key={mode.id}
                      onClick={() => {
                        soundService.playClick();
                        setSelectedMode(mode.id);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500 text-white shadow ring-1 ring-emerald-500'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-xs text-white">{mode.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{mode.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              step === 1
                ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600'
                : 'border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              Step {step} of 7
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <span>{step === 7 ? 'Start Football Career' : 'Next Step'}</span>
              {step === 7 ? <Play className="w-4 h-4 fill-black" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
