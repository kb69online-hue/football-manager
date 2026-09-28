import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { soundService } from '../../services/soundService';
import {
  Trophy,
  Play,
  History,
  Activity,
  PlusCircle,
  Sliders,
  FolderOpen,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  Shield,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

const ADVICES = [
  'Build a balanced squad with a mix of veteran experience and athletic youth.',
  'Protect your club finances. Wage bills over 75% of revenue lead to sanctions.',
  'Develop young academy prospects to secure your club’s generational future.',
  'Always scout an opposition player thoroughly before submitting a transfer bid.',
  'Adapt your tactical shapes, passing lengths, and mentalities to counter your rivals.',
  'Player morale and dressing room chemistry can swing a cup tie in minutes.',
  'Upgrading youth and training facilities multiplies attribute development speed.',
  'Every transfer clause and sell-on percentage impacts long-term club wealth.',
];

interface CinematicOpeningProps {
  onEnterGame: () => void;
}

export const CinematicOpening: React.FC<CinematicOpeningProps> = ({ onEnterGame }) => {
  const {
    state,
    setActiveTab,
    setIsNewCareerModalOpen,
    setIsSaveLoadModalOpen,
  } = useGame();

  // Scene state: 1 (Black), 2 (Unity), 3 (Stadium Atmosphere), 4 (Title), 5 (Advice), 6 (Main Menu)
  const [scene, setScene] = useState<number>(1);
  const [adviceIndex, setAdviceIndex] = useState<number>(0);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  // Automatic scene progression
  useEffect(() => {
    let timer: any;
    if (scene === 1) {
      timer = setTimeout(() => {
        setScene(2);
      }, 1600);
    } else if (scene === 2) {
      timer = setTimeout(() => {
        setScene(3);
      }, 2600);
    } else if (scene === 3) {
      timer = setTimeout(() => {
        soundService.playWhistle();
        setScene(4);
      }, 3000);
    } else if (scene === 4) {
      timer = setTimeout(() => {
        setScene(5);
      }, 4200);
    }

    return () => clearTimeout(timer);
  }, [scene]);

  // Rotate advice every 3 seconds if on scene 5
  useEffect(() => {
    if (scene !== 5) return;
    const interval = setInterval(() => {
      setAdviceIndex((prev) => (prev + 1) % ADVICES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [scene]);

  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    soundService.setEnabled(!next);
  };

  const handleSkipToMenu = () => {
    soundService.playClick();
    setScene(6);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-slate-100 flex flex-col items-center justify-center overflow-hidden select-none font-sans">
      {/* Sound toggle in top right */}
      <button
        onClick={toggleSound}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white backdrop-blur-md transition shadow-lg"
        title={soundMuted ? 'Unmute Stadium Audio' : 'Mute Audio'}
      >
        {soundMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
      </button>

      {/* Skip button during intro scenes */}
      {scene < 6 && (
        <button
          onClick={handleSkipToMenu}
          className="absolute bottom-4 right-4 z-50 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-bold text-slate-400 hover:text-white backdrop-blur-md transition flex items-center gap-1.5"
        >
          <span>Skip Intro</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* SCENE 1: Black Screen & Subtle Atmosphere */}
      {scene === 1 && (
        <div className="flex flex-col items-center justify-center animate-pulse">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping mb-3" />
          <span className="text-[11px] tracking-widest uppercase font-mono text-slate-600">
            Initializing Stadium Systems...
          </span>
        </div>
      )}

      {/* SCENE 2: Unity Official Branding */}
      {scene === 2 && (
        <div className="text-center space-y-4 animate-fade-in transition-all duration-1000">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/20 flex items-center justify-center shadow-2xl p-3">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
              <path d="M 50,5 L 85,25 L 85,65 L 50,85 L 15,65 L 15,25 Z" fill="none" stroke="#FFFFFF" strokeWidth="6" />
              <polygon points="50,22 72,35 72,58 50,70 28,58 28,35" fill="#FFFFFF" opacity="0.9" />
              <circle cx="50" cy="46" r="8" fill="#000000" />
            </svg>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-widest text-white uppercase font-mono">
            MADE WITH UNITY
          </h2>
          <span className="text-[10px] text-slate-500 tracking-wider uppercase font-mono block">
            Official Powered Engine
          </span>
        </div>
      )}

      {/* SCENE 3: Stadium Atmosphere & Pitch Lighting */}
      {scene === 3 && (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          {/* Pitch Floodlights Simulation */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-slate-950 to-emerald-950/40" />
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute -top-32 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse" />

          {/* Pitch lines & ball rolling */}
          <div className="relative z-10 space-y-4 max-w-lg">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-950 border-2 border-emerald-400/80 flex items-center justify-center shadow-2xl animate-bounce">
              <span className="text-3xl">⚽</span>
            </div>
            <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-wider">
              The Floodlights Illuminate
            </h3>
            <p className="text-xs text-slate-300 font-mono">
              60,000 supporters gather. The pitch is primed. Your tactical journey begins.
            </p>
          </div>
        </div>
      )}

      {/* SCENE 4: Game Title Card */}
      {scene === 4 && (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950/30 to-slate-950" />
          <div className="relative z-10 space-y-5 max-w-2xl px-4 animate-scale-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ultimate Football Experience</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-2xl">
                KB69onlineAI
              </h1>
              <h2 className="text-2xl md:text-4xl font-black text-emerald-400 tracking-wider uppercase">
                FOOTBALL MANAGER
              </h2>
            </div>

            <p className="text-sm md:text-base font-bold text-slate-200 tracking-wide">
              Manage. Build. Compete. Become a Legend.
            </p>

            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Build your football career from the ground up. Manage players, tactics, transfers, finances in TZS, staff, competitions, and your club's future.
            </p>
          </div>
        </div>
      )}

      {/* SCENE 5: Rotating Advice Screen */}
      {scene === 5 && (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/40" />

          <div className="relative z-10 space-y-6 max-w-xl px-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Tactical Director Advice
            </span>

            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md min-h-[160px] flex flex-col justify-center">
              <p className="text-base md:text-lg font-bold text-white leading-relaxed italic">
                "{ADVICES[adviceIndex]}"
              </p>
            </div>

            <button
              onClick={() => {
                soundService.playClick();
                setScene(6);
              }}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm uppercase tracking-wider shadow-2xl shadow-emerald-500/30 transition transform hover:scale-105 flex items-center gap-2 mx-auto active:scale-95"
            >
              <span>Continue to Main Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SCENE 6: Grand Landscape Android Main Menu */}
      {scene === 6 && (
        <div className="relative w-full h-full flex flex-col justify-between p-4 md:p-8 overflow-y-auto custom-scrollbar">
          {/* Animated Stadium Atmosphere & Floodlights Backdrop */}
          <div className="absolute inset-0 bg-slate-950 pointer-events-none">
            <div className="absolute top-0 left-1/3 w-[600px] h-[350px] bg-emerald-600/15 rounded-full blur-[140px]" />
            <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-blue-600/15 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-emerald-950/20 to-transparent" />
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          </div>

          {/* Top Bar: Title & Telemetry HUD */}
          <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-black text-black text-lg shadow-lg shadow-emerald-500/20">
                KB
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-2">
                  <span>KB69onlineAI</span>
                  <span className="text-emerald-400">FOOTBALL MANAGER</span>
                </h1>
                <span className="text-[10px] text-slate-400 font-mono block">
                  Landscape Android Edition • Currency: Tanzanian Shillings (TZS)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300">Club: {state.clubs[state.userClubId]?.name || 'London FC'}</span>
              </div>
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-emerald-400 font-bold">TZS Economy</span>
              </div>
            </div>
          </div>

          {/* Center: Main Game Launchpad (Two-Column Gaming Dashboard) */}
          <div className="relative z-10 my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto w-full">
            {/* Left: Quick Launch CTA & Featured Career Hero (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                <Trophy className="w-3.5 h-3.5" />
                <span>SEASON {state.currentSeason} • LIVE MANAGER SIMULATION</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase">
                TAKE COMMAND OF THE PITCH
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                Guide your club to continental glory. Master transfer negotiations in Tanzanian Shillings, sculpt inverted tactical masterclasses, build state-of-the-art youth academies, and write your football legacy.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap pt-2">
                <button
                  onClick={() => {
                    soundService.playWhistle();
                    onEnterGame();
                  }}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-black font-black text-sm uppercase tracking-wider shadow-2xl shadow-emerald-500/30 transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>TAP TO START / CONTINUE</span>
                </button>

                <button
                  onClick={() => {
                    soundService.playClick();
                    setIsNewCareerModalOpen(true);
                  }}
                  className="px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 hover:border-slate-600 transition flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>NEW CAREER WIZARD</span>
                </button>
              </div>
            </div>

            {/* Right: Game Modes Quick Matrix (5 Cols) */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {[
                {
                  id: 'live_center',
                  title: 'LIVE FOOTBALL CENTER',
                  desc: 'Real-world live scores, timelines & VAR intelligence',
                  icon: Activity,
                  color: 'text-blue-400',
                  badge: 'VERIFIED DATA',
                  action: () => {
                    setActiveTab('live_center');
                    onEnterGame();
                  },
                },
                {
                  id: 'historical',
                  title: 'HISTORICAL ERAS (2000+)',
                  desc: 'Invincibles, Treble, Pep Sextuple & Future seasons',
                  icon: History,
                  color: 'text-amber-400',
                  badge: '2000 ONWARD',
                  action: () => {
                    setActiveTab('historical');
                    onEnterGame();
                  },
                },
                {
                  id: 'custom_club',
                  title: 'CUSTOM CLUB BUILDER',
                  desc: 'Design kits, stadiums, and colors from scratch',
                  icon: Shield,
                  color: 'text-purple-400',
                  badge: 'SANDBOX',
                  action: () => {
                    setIsNewCareerModalOpen(true);
                  },
                },
                {
                  id: 'save_load',
                  title: 'LOAD / BACKUP CAREER',
                  desc: 'Manage multiple save slots and cloud backups',
                  icon: FolderOpen,
                  color: 'text-emerald-400',
                  badge: 'OFFLINE/ONLINE',
                  action: () => {
                    setIsSaveLoadModalOpen(true);
                  },
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      soundService.playClick();
                      item.action();
                    }}
                    className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all cursor-pointer shadow-xl group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 group-hover:text-white transition">
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-white text-xs tracking-wider">{item.title}</h4>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Footer Bar */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-3 border-t border-slate-800/80 font-mono">
            <div className="flex items-center gap-4">
              <span>KB69onlineAI Engine v3.8</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">TZS Currency Active</span>
              <span>•</span>
              <span>Landscape 16:9</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setScene(3)}
                className="hover:text-slate-300 transition flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Replay Intro</span>
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  soundService.playClick();
                  setActiveTab('settings');
                  onEnterGame();
                }}
                className="hover:text-slate-300 transition flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
