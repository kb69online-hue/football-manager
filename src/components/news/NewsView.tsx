import React from 'react';
import { useGame } from '../../context/GameContext';
import { Newspaper, MessageCircle, Heart, Share2, Sparkles, TrendingUp } from 'lucide-react';

export const NewsView: React.FC = () => {
  const { state } = useGame();
  const userClub = state.clubs[state.userClubId];

  const fanFeed = [
    {
      author: `@${userClub?.shortName.toLowerCase()}_faithful`,
      name: `${userClub?.name} Fan TV`,
      handle: 'Apex Fan Zone',
      time: '1h ago',
      content: `The tactical setup by our manager is looking sharp for this weekend! Really love the inverted wingers system! 🔥 #WeAre${userClub?.shortName}`,
      likes: 421,
      sentiment: 'positive',
    },
    {
      author: '@tactical_pundit',
      name: 'European Football Radar',
      handle: 'Analyst',
      time: '3h ago',
      content: `${userClub?.name} are generating high quality chances per 90. If their striker conversion remains clinical, a title push is realistic.`,
      likes: 890,
      sentiment: 'neutral',
    },
    {
      author: '@transfer_insider',
      name: 'The Transfer Dossier',
      handle: 'Breaking Football News',
      time: '5h ago',
      content: `EXCLUSIVE: Multiple top scouts were spotted watching wonderkids in the youth academy! Clubs preparing bids ahead of deadline day! 🚨`,
      likes: 1250,
      sentiment: 'positive',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
              Press & Media Hub
            </span>
            <span className="text-xs text-slate-400">Broadcasters, Pundits & Supporters Feed</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Football Wire & Fan Reactions</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main News Articles (7 Cols) */}
        <div className="md:col-span-7 space-y-4">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-emerald-400" />
            <span>Breaking Football Publications</span>
          </h3>

          <div className="space-y-3">
            {state.news.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500">{item.date}</span>
                  <span className="bg-slate-800 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">
                    {item.category}
                  </span>
                </div>
                <h4 className="font-bold text-base text-white hover:text-emerald-400 cursor-pointer transition">
                  {item.headline}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Fan Feed (5 Cols) */}
        <div className="md:col-span-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            <span>Fan Reactions & Social Ticker</span>
          </h3>

          <div className="space-y-3">
            {fanFeed.map((post, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">{post.name}</span>
                    <span className="text-[11px] text-slate-400">{post.author}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{post.time}</span>
                </div>

                <p className="text-slate-300 leading-normal">{post.content}</p>

                <div className="flex items-center gap-4 text-slate-400 text-[11px] pt-1">
                  <span className="flex items-center gap-1 hover:text-rose-400 cursor-pointer">
                    <Heart className="w-3.5 h-3.5" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1 hover:text-emerald-400 cursor-pointer">
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
