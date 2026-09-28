import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { SquadView } from './components/squad/SquadView';
import { TacticsView } from './components/tactics/TacticsView';
import { TrainingView } from './components/training/TrainingView';
import { TransfersView } from './components/transfers/TransfersView';
import { ScoutingView } from './components/scouting/ScoutingView';
import { CompetitionsView } from './components/competitions/CompetitionsView';
import { ClubView } from './components/club/ClubView';
import { StaffView } from './components/staff/StaffView';
import { FinancesView } from './components/finances/FinancesView';
import { YouthAcademyView } from './components/youth/YouthAcademyView';
import { InboxView } from './components/inbox/InboxView';
import { NewsView } from './components/news/NewsView';
import { ManagerProfileView } from './components/manager/ManagerProfileView';
import { SettingsView } from './components/settings/SettingsView';

import { LiveMatchModal } from './components/match/LiveMatchModal';
import { PlayerModal } from './components/modals/PlayerModal';
import { AssistantModal } from './components/ai/AssistantModal';
import { CareerSetupModal } from './components/modals/CareerSetupModal';
import { SaveLoadModal } from './components/modals/SaveLoadModal';
import { AdminModal } from './components/admin/AdminModal';

import { LiveCenterView } from './components/live/LiveCenterView';
import { DatabaseView } from './components/database/DatabaseView';
import { SquadEditorView } from './components/squad/SquadEditorView';
import { ExchangeView } from './components/transfers/ExchangeView';
import { HistoricalView } from './components/historical/HistoricalView';
import { NationalTeamsView } from './components/national/NationalTeamsView';
import { AssetKitEditorView } from './components/editor/AssetKitEditorView';
import { StatisticsCenterView } from './components/stats/StatisticsCenterView';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { CinematicOpening } from './components/cinematic/CinematicOpening';

const MainContent: React.FC = () => {
  const {
    activeTab,
    activeMatchFixture,
    selectedPlayer,
    setSelectedPlayer,
    isAiModalOpen,
    setIsAiModalOpen,
    isNewCareerModalOpen,
    setIsNewCareerModalOpen,
    isSaveLoadModalOpen,
    setIsSaveLoadModalOpen,
    isAdminModalOpen,
    setIsAdminModalOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    isCinematicIntroOpen,
    setIsCinematicIntroOpen,
  } = useGame();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'inbox':
        return <InboxView />;
      case 'squad':
        return <SquadView />;
      case 'tactics':
        return <TacticsView />;
      case 'training':
        return <TrainingView />;
      case 'transfers':
        return <TransfersView />;
      case 'exchange':
        return <ExchangeView />;
      case 'scouting':
        return <ScoutingView />;
      case 'competitions':
        return <CompetitionsView />;
      case 'club':
        return <ClubView />;
      case 'staff':
        return <StaffView />;
      case 'finances':
        return <FinancesView />;
      case 'youth':
        return <YouthAcademyView />;
      case 'news':
        return <NewsView />;
      case 'manager':
        return <ManagerProfileView />;
      case 'settings':
        return <SettingsView />;
      case 'live_center':
        return <LiveCenterView />;
      case 'database':
        return <DatabaseView />;
      case 'squad_editor':
        return <SquadEditorView />;
      case 'historical':
        return <HistoricalView />;
      case 'national_teams':
        return <NationalTeamsView />;
      case 'asset_kit_editor':
        return <AssetKitEditorView />;
      case 'statistics_center':
        return <StatisticsCenterView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto max-h-[calc(100vh-57px)] custom-scrollbar bg-slate-950">
          {renderActiveView()}
        </main>
      </div>

      {/* Modals */}
      {activeMatchFixture && <LiveMatchModal fixture={activeMatchFixture} />}

      {selectedPlayer && (
        <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
      )}

      {isAiModalOpen && <AssistantModal onClose={() => setIsAiModalOpen(false)} />}

      {isNewCareerModalOpen && (
        <CareerSetupModal onClose={() => setIsNewCareerModalOpen(false)} />
      )}

      {isSaveLoadModalOpen && (
        <SaveLoadModal onClose={() => setIsSaveLoadModalOpen(false)} />
      )}

      {isAdminModalOpen && <AdminModal onClose={() => setIsAdminModalOpen(false)} />}

      {isSearchModalOpen && <GlobalSearchModal onClose={() => setIsSearchModalOpen(false)} />}

      {isCinematicIntroOpen && (
        <CinematicOpening onEnterGame={() => setIsCinematicIntroOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainContent />
    </GameProvider>
  );
}
