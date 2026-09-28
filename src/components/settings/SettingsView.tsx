import React from 'react';
import { useGame } from '../../context/GameContext';
import { Sliders, Save, ShieldAlert, RotateCcw, Volume2, Database } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { state, setIsSaveLoadModalOpen, setIsAdminModalOpen, setIsNewCareerModalOpen } = useGame();
  const settings = state.settings;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
              System Configuration
            </span>
            <span className="text-xs text-slate-400">Simulation Dynamics & Gameplay Preferences</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Game Settings</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Simulation Settings */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Gameplay & Simulation Tuning</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div>
                <span className="font-bold text-white block">Difficulty Level</span>
                <span className="text-slate-400 text-[11px]">Affects transfer negotiating leverage & board patience</span>
              </div>
              <span className="font-bold text-emerald-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                {settings.difficulty}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div>
                <span className="font-bold text-white block">Default Match Speed</span>
                <span className="text-slate-400 text-[11px]">Multiplier during live radar simulation</span>
              </div>
              <span className="font-bold text-amber-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                {settings.matchSpeed}x Realtime
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div>
                <span className="font-bold text-white block">Autosave After Matches</span>
                <span className="text-slate-400 text-[11px]">Automatically writes to local career backup</span>
              </div>
              <span className="font-bold text-emerald-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                Enabled
              </span>
            </div>
          </div>
        </div>

        {/* Career Actions & Backups */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            <span>Save Management & Career Backups</span>
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => setIsSaveLoadModalOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white transition"
            >
              <div className="flex items-center gap-2.5">
                <Save className="w-4 h-4 text-emerald-400" />
                <span>Save / Load Career Slots</span>
              </div>
              <span className="text-slate-400 text-[11px]">Manage Saves →</span>
            </button>

            <button
              onClick={() => setIsNewCareerModalOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white transition"
            >
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-purple-400" />
                <span>Start New Career / Create Custom Club</span>
              </div>
              <span className="text-slate-400 text-[11px]">New Career →</span>
            </button>

            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-300 transition"
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Admin Diagnostics & Game Owner Controls</span>
              </div>
              <span className="text-amber-400 text-[11px]">Admin Console →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
