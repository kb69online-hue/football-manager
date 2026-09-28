import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { askAiAssistant } from '../../services/aiService';
import { Bot, X, Send, Sparkles, Trophy, Shield, Users, ArrowRight } from 'lucide-react';

export const AssistantModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state } = useGame();
  const userClub = state.clubs[state.userClubId];
  const [messages, setMessages] = useState<
    { sender: 'user' | 'assistant'; text: string; source?: string }[]
  >([
    {
      sender: 'assistant',
      text: `Greetings Boss. I am your Senior Tactical Analyst and Assistant Manager. I've audited our current squad depth and tactical setup for ${userClub?.name}. How can I assist with our tactical preparations today?`,
      source: 'tactical-director',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendPrompt = async (promptText: string, topic: 'tactics' | 'squad' | 'opponent' | 'post_match' | 'general' = 'general') => {
    if (!promptText.trim()) return;

    const userMsg = { sender: 'user' as const, text: promptText };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    const oppFixture = state.fixtures.find(
      (f) => !f.played && (f.homeClubId === state.userClubId || f.awayClubId === state.userClubId)
    );
    const oppClubId = oppFixture?.homeClubId === state.userClubId ? oppFixture?.awayClubId : oppFixture?.homeClubId;
    const oppClub = oppClubId ? state.clubs[oppClubId] : null;

    const result = await askAiAssistant({
      topic,
      context: {
        clubName: userClub?.name || 'Club',
        formation: state.tactics.formation,
        mentality: state.tactics.mentality,
        opponentName: oppClub?.name || 'Upcoming Rival',
        squadSummary: `${userClub?.name} currently has ${Object.values(state.players).filter((p) => p.clubId === state.userClubId).length} registered players.`,
      },
      prompt: promptText,
    });

    setMessages((prev) => [
      ...prev,
      {
        sender: 'assistant',
        text: result.analysis,
        source: result.source,
      },
    ]);
    setIsLoading(false);
  };

  const quickPrompts = [
    { label: 'Tactical Optimization', prompt: 'Analyze our current formation and suggest tactical improvements.', topic: 'tactics' as const },
    { label: 'Scout Next Opponent', prompt: 'Provide a tactical briefing on our upcoming fixture opponent.', topic: 'opponent' as const },
    { label: 'Squad Depth Audit', prompt: 'Where are our biggest positional vulnerabilities and squad gaps?', topic: 'squad' as const },
    { label: 'Wonderkid Recruitment', prompt: 'Recommend which player profile we should prioritize scouting next.', topic: 'squad' as const },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Assistant Manager AI</h3>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 font-bold">
                  Gemini Powered
                </span>
              </div>
              <span className="text-xs text-slate-400">Tactical Strategy, Scouting & Matchday Advice</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(qp.prompt, qp.topic)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-medium whitespace-nowrap transition"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-500 text-black font-semibold'
                    : 'bg-slate-800/80 border border-slate-700/80 text-slate-200 shadow-md'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
              </div>
              {msg.source && (
                <span className="text-[9px] text-slate-500 mt-1 px-1 font-mono">
                  Source: {msg.source}
                </span>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 py-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>Tactical director analyzing dataset...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(inputQuery);
          }}
          className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3"
        >
          <input
            type="text"
            placeholder="Ask your assistant coach about tactics, opponents, scouting..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
