import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import {
  getLocalSavesIndex,
  exportSaveToJson,
  importSaveFromJson,
  deleteLocalSave,
} from '../../services/storageService';
import { CareerSaveSummary } from '../../types/football';
import { Save, Download, Upload, Trash2, X, Clock, Play } from 'lucide-react';

export const SaveLoadModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state, loadSaveState, saveCurrentCareer } = useGame();
  const [saves, setSaves] = useState<CareerSaveSummary[]>([]);
  const [newSaveName, setNewSaveName] = useState('');

  const refreshSaves = () => {
    setSaves(getLocalSavesIndex());
  };

  useEffect(() => {
    refreshSaves();
  }, []);

  const handleManualSave = () => {
    saveCurrentCareer(newSaveName.trim() || undefined);
    setNewSaveName('');
    refreshSaves();
  };

  const handleDelete = (id: string) => {
    deleteLocalSave(id);
    refreshSaves();
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imported = await importSaveFromJson(file);
        // Load it directly
        onClose();
        window.location.reload();
      } catch (err: any) {
        alert('Failed to import career save: ' + err.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 border border-slate-700">
              <Save className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Career Save Slots & Backups</h3>
              <span className="text-xs text-slate-400">Multiple Save Slots, Autosave & Cloud Sync</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create Manual Save */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Save slot name (e.g. Before Champions Cup Final)..."
            value={newSaveName}
            onChange={(e) => setNewSaveName(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleManualSave}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition"
          >
            Save Now
          </button>
        </div>

        {/* Saves List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
          {saves.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">No saved careers found.</p>
          ) : (
            saves.map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs hover:border-slate-600 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{s.name}</span>
                    {s.isAutosave && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                        Autosave
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{s.clubName}</span>
                    <span>•</span>
                    <span>{s.currentDate}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-500">{new Date(s.savedAt).toLocaleTimeString()}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadSaveState(s.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1 transition"
                  >
                    <Play className="w-3 h-3 fill-black" />
                    <span>Load</span>
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                    title="Delete Save"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Export / Import JSON */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportSaveToJson(state)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Save (.JSON)</span>
            </button>
            <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 cursor-pointer transition">
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span>Import Save</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-slate-400 hover:text-white font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
