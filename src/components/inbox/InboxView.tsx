import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Mail, CheckCircle2, ChevronRight, AlertCircle, Bot } from 'lucide-react';

export const InboxView: React.FC = () => {
  const { state, markInboxRead, setActiveTab, setIsAiModalOpen } = useGame();
  const [selectedMailId, setSelectedMailId] = useState<string>(state.inbox[0]?.id || '');

  const selectedMail = state.inbox.find((i) => i.id === selectedMailId) || state.inbox[0];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
              Managerial Office
            </span>
            <span className="text-xs text-slate-400">Official Club Communications</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Executive Inbox</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Email List (5 Cols) */}
        <div className="md:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
          {state.inbox.map((mail) => {
            const isSelected = selectedMail?.id === mail.id;
            return (
              <div
                key={mail.id}
                onClick={() => {
                  setSelectedMailId(mail.id);
                  markInboxRead(mail.id);
                }}
                className={`p-3.5 rounded-xl cursor-pointer transition border text-xs space-y-1 ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-white'
                    : mail.read
                    ? 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800/80'
                    : 'bg-slate-800 border-slate-700 font-bold text-slate-200 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-400 text-[11px] truncate max-w-[180px]">
                    {mail.sender}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{mail.date}</span>
                </div>
                <h4 className="font-bold text-slate-200 truncate">{mail.subject}</h4>
                <p className="text-[11px] text-slate-400 truncate">{mail.body}</p>
              </div>
            );
          })}
        </div>

        {/* Selected Email Reader (7 Cols) */}
        <div className="md:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          {selectedMail ? (
            <>
              <div className="border-b border-slate-800 pb-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500">{selectedMail.date}</span>
                  <span className="bg-slate-800 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-700">
                    {selectedMail.category}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">{selectedMail.subject}</h3>
                <div className="text-xs text-slate-400">
                  From: <strong className="text-slate-200">{selectedMail.sender}</strong> ({selectedMail.senderRole})
                </div>
              </div>

              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line py-2">
                {selectedMail.body}
              </div>

              {/* Action Buttons if available */}
              <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                <button
                  onClick={() => setIsAiModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Consult Assistant AI</span>
                </button>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500 italic">No message selected.</p>
          )}
        </div>
      </div>
    </div>
  );
};
