import React from 'react';
import { ActiveTab, useGame } from '../../context/GameContext';
import {
  LayoutDashboard,
  Inbox,
  Users,
  Trophy,
  Compass,
  ArrowLeftRight,
  Binoculars,
  Calendar,
  Building2,
  UserCheck,
  CircleDollarSign,
  GraduationCap,
  Newspaper,
  User,
  Sliders,
  ShieldAlert,
  Activity,
  Database,
  History,
  Palette,
  Globe,
  BarChart3,
  Search,
} from 'lucide-react';

interface NavSection {
  title: string;
  items: {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    isRealWorld?: boolean;
  }[];
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    state,
    setIsAdminModalOpen,
    activeMode,
    setActiveMode,
    setIsSearchModalOpen,
  } = useGame();

  const unreadInbox = state.inbox.filter((item) => !item.read).length;

  const sections: NavSection[] = [
    {
      title: 'LIVE FOOTBALL',
      items: [
        {
          id: 'live_center',
          label: 'Live Match Center',
          icon: Activity,
          isRealWorld: true,
        },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'inbox', label: 'Inbox & Mail', icon: Inbox, badge: unreadInbox },
        { id: 'squad', label: 'Squad Roster', icon: Users },
        { id: 'tactics', label: 'Tactics & Shape', icon: Trophy },
        { id: 'training', label: 'Training Drills', icon: Compass },
        { id: 'transfers', label: 'Transfers Market', icon: ArrowLeftRight },
        { id: 'exchange', label: 'Player Swap / Deal', icon: ArrowLeftRight },
        { id: 'scouting', label: 'Global Scouting', icon: Binoculars },
        { id: 'competitions', label: 'Fixtures & Tables', icon: Calendar },
        { id: 'finances', label: 'Club Finances', icon: CircleDollarSign },
        { id: 'youth', label: 'Youth Academy', icon: GraduationCap },
        { id: 'club', label: 'Club Facilities', icon: Building2 },
        { id: 'staff', label: 'Coaching Staff', icon: UserCheck },
      ],
    },
    {
      title: 'DATABASE & ARCHIVE',
      items: [
        { id: 'database', label: 'Football Database', icon: Database },
        { id: 'historical', label: 'Historical Eras (2000+)', icon: History },
      ],
    },
    {
      title: 'EDITORS & ASSETS',
      items: [
        { id: 'squad_editor', label: 'Squad Editor', icon: Sliders },
        { id: 'asset_kit_editor', label: 'Kit & Badge Designer', icon: Palette },
      ],
    },
    {
      title: 'CAREER & STATS',
      items: [
        { id: 'manager', label: 'Manager Profile', icon: User },
        { id: 'national_teams', label: 'National Teams', icon: Globe },
        { id: 'statistics_center', label: 'Statistics Center', icon: BarChart3 },
        { id: 'news', label: 'Media & News', icon: Newspaper },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings & Currencies', icon: Sliders },
      ],
    },
  ];

  return (
    <aside className="w-60 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between py-3 select-none shrink-0 h-[calc(100vh-57px)] sticky top-[57px]">
      <div className="space-y-4 px-3 overflow-y-auto custom-scrollbar flex-1">
        {/* Quick Search Button */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition text-xs font-semibold"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>Search World DB...</span>
          </div>
          <span className="text-[10px] font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
            Ctrl+K
          </span>
        </button>

        {/* Real-World vs Simulation Mode Indicator Tag */}
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold">
            <span className="text-slate-400">ACTIVE MODE:</span>
            <span
              className={
                activeTab === 'live_center'
                  ? 'text-blue-400 font-black'
                  : 'text-emerald-400 font-black'
              }
            >
              {activeTab === 'live_center' ? 'REAL FOOTBALL' : 'CAREER SIM'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[10px] font-bold">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setActiveMode('career');
              }}
              className={`py-1 rounded-lg transition ${
                activeTab !== 'live_center'
                  ? 'bg-emerald-500 text-black shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Career Sim
            </button>

            <button
              onClick={() => {
                setActiveTab('live_center');
                setActiveMode('real_world');
              }}
              className={`py-1 rounded-lg transition ${
                activeTab === 'live_center'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Live Real
            </button>
          </div>
        </div>

        {/* Categorized Navigation Sections */}
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            <span className="px-2 text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono block">
              {section.title}
            </span>

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? item.isRealWorld
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? item.isRealWorld
                            ? 'text-blue-400'
                            : 'text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Admin Panel Quick Trigger at bottom */}
      <div className="px-3 pt-3 border-t border-slate-800/80">
        <button
          onClick={() => setIsAdminModalOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-amber-400/80 hover:text-amber-300 hover:bg-amber-400/10 border border-amber-500/20 transition"
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Admin Data Editor</span>
        </button>
      </div>
    </aside>
  );
};

