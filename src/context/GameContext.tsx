import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  CareerState,
  Formation,
  MatchFixture,
  PitchSlot,
  Player,
  Position,
  TeamTactics,
  TransferBid,
  Club,
  Manager,
  SupportedCurrency,
  AuditLogEntry,
  ExchangeOffer,
} from '../types/football';
import {
  DEFAULT_MANAGER,
  DEFAULT_TACTICS,
  FORMATION_SLOTS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_CLUBS,
  INITIAL_COMPETITIONS,
  INITIAL_INBOX,
  INITIAL_NEWS,
  INITIAL_PLAYERS,
  INITIAL_SCOUTS,
  INITIAL_STAFF,
} from '../data/initialData';
import { advanceDay, updateTableForMatch } from '../engine/worldEngine';
import { simulateFullMatch } from '../engine/matchEngine';
import { getLocalSavesIndex, loadLocalCareer, saveLocalCareer } from '../services/storageService';

export type ActiveTab =
  | 'dashboard'
  | 'inbox'
  | 'squad'
  | 'tactics'
  | 'training'
  | 'transfers'
  | 'exchange'
  | 'scouting'
  | 'competitions'
  | 'club'
  | 'staff'
  | 'finances'
  | 'youth'
  | 'news'
  | 'manager'
  | 'settings'
  | 'live_center'
  | 'database'
  | 'squad_editor'
  | 'historical'
  | 'national_teams'
  | 'asset_kit_editor'
  | 'statistics_center';

interface GameContextType {
  state: CareerState;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeMode: 'career' | 'real_world';
  setActiveMode: (mode: 'career' | 'real_world') => void;
  isSimulating: boolean;
  activeMatchFixture: MatchFixture | null;
  selectedPlayer: Player | null;
  setSelectedPlayer: (player: Player | null) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  isSaveLoadModalOpen: boolean;
  setIsSaveLoadModalOpen: (open: boolean) => void;
  isNewCareerModalOpen: boolean;
  setIsNewCareerModalOpen: (open: boolean) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isCinematicIntroOpen: boolean;
  setIsCinematicIntroOpen: (open: boolean) => void;
  transferModalPlayer: Player | null;
  setTransferModalPlayer: (player: Player | null) => void;

  // Actions
  continueDay: () => void;
  setFormation: (formation: Formation) => void;
  updateTactics: (newTactics: Partial<TeamTactics>) => void;
  assignPlayerToSlot: (slotIndex: number, playerId: string) => void;
  swapPlayers: (playerId1: string, playerId2: string) => void;
  startMatch: (fixture: MatchFixture) => void;
  completeMatch: (
    fixtureId: string,
    homeScore: number,
    awayScore: number,
    stats: any,
    events: any,
    playerRatings: Record<string, number>
  ) => void;
  submitTransferOffer: (playerId: string, fee: number, wage: number, years: number) => void;
  signFreeAgent: (playerId: string, wage: number, years: number) => void;
  promoteYouth: (playerId: string) => void;
  upgradeFacility: (type: 'stadium' | 'facilities' | 'youth' | 'training') => void;
  startNewCareer: (
    clubId: string,
    managerData?: Partial<Manager>,
    isCustom?: boolean,
    customClub?: Partial<Club>
  ) => void;
  loadSaveState: (saveId: string) => void;
  saveCurrentCareer: (name?: string) => void;
  markInboxRead: (inboxId: string) => void;
  replyToInboxAction: (inboxId: string, actionType: string, payload?: any) => void;
  updateCurrency: (currency: SupportedCurrency) => void;
  updatePlayerInSquad: (playerId: string, updates: Partial<Player>) => void;
  createNewPlayer: (playerData: Partial<Player>) => string;
  createNewCoach: (coachData: Partial<Manager>) => void;
  createNewClub: (clubData: Partial<Club>) => string;
  updateClub: (clubId: string, updates: Partial<Club>) => void;
  logAuditEvent: (action: string, targetType: AuditLogEntry['targetType'], targetId: string, details: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

function createInitialState(): CareerState {
  return {
    currentDate: '2026-08-12',
    currentSeason: '2026/27',
    manager: DEFAULT_MANAGER,
    userClubId: 'club_london_fc',
    clubs: INITIAL_CLUBS,
    players: INITIAL_PLAYERS,
    tactics: DEFAULT_TACTICS,
    competitions: INITIAL_COMPETITIONS,
    fixtures: INITIAL_COMPETITIONS['comp_premier_div'].fixtures,
    scouts: INITIAL_SCOUTS,
    scoutReports: {},
    staff: INITIAL_STAFF,
    transferBids: [],
    shortlistPlayerIds: ['p_msk_haaland_style', 'p_catalan_yamal_style', 'p_free_3'],
    inbox: INITIAL_INBOX,
    news: INITIAL_NEWS,
    achievements: INITIAL_ACHIEVEMENTS,
    financesHistory: [
      { month: 'Jul 2026', income: 24500000, expenses: 14200000, net: 10300000 },
      { month: 'Jun 2026', income: 18900000, expenses: 13800000, net: 5100000 },
    ],
    youthIntakePlayers: [
      {
        id: 'p_youth_intake_1',
        name: 'Finnian O’Connor',
        age: 16,
        nationality: 'Ireland',
        position: 'CAM',
        secondaryPositions: ['CM', 'LW'],
        preferredFoot: 'Left',
        heightCm: 176,
        weightKg: 67,
        clubId: 'club_london_fc',
        squadCategory: 'Academy',
        squadNumber: 39,
        currentAbility: 68,
        potentialAbility: 91, // Wonderkid!
        marketValue: 4500000,
        contract: {
          salaryWeekly: 3500,
          expiryYear: 2029,
          appearanceBonus: 1000,
          goalBonus: 2000,
          cleanSheetBonus: 0,
          loyaltyBonus: 25000,
        },
        attributes: {
          passing: 78,
          firstTouch: 82,
          dribbling: 84,
          crossing: 72,
          finishing: 71,
          longShots: 75,
          heading: 52,
          tackling: 42,
          marking: 38,
          ballControl: 85,
          technique: 86,
          freeKicks: 74,
          corners: 70,
          penalties: 68,
          decisions: 72,
          concentration: 70,
          composure: 76,
          vision: 84,
          positioning: 70,
          anticipation: 75,
          leadership: 65,
          teamwork: 80,
          workRate: 78,
          determination: 88,
          aggression: 55,
          pace: 82,
          acceleration: 85,
          stamina: 74,
          strength: 58,
          agility: 86,
          balance: 82,
          jumping: 58,
          fitness: 99,
          reflexes: 25,
          handling: 25,
          gkPositioning: 25,
          oneOnOne: 25,
          diving: 25,
          aerialAbility: 25,
          distribution: 35,
        },
        personality: 'Ambitious',
        role: 'Advanced Playmaker',
        morale: 95,
        condition: 100,
        sharpness: 90,
        stats: { appearances: 0, goals: 0, assists: 0, cleanSheets: 0, yellowCards: 0, redCards: 0, avgRating: 7.2, ratingsHistory: [] },
      },
    ],
    settings: {
      difficulty: 'Normal',
      currency: 'TZS',
      matchSpeed: 2,
      soundEnabled: true,
      autosaveAfterMatch: true,
      selectedBaseCurrency: 'TZS',
      liveDataAutoRefresh: true,
      notificationsEnabled: true,
    },
    auditLogs: [],
    isTransferWindowOpen: true,
    isDeadlineDay: false,
  };
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CareerState>(() => {
    // Try to load latest autosave or return default initial state
    const saved = loadLocalCareer('autosave');
    return saved || createInitialState();
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeMode, setActiveMode] = useState<'career' | 'real_world'>('career');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeMatchFixture, setActiveMatchFixture] = useState<MatchFixture | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isSaveLoadModalOpen, setIsSaveLoadModalOpen] = useState<boolean>(false);
  const [isNewCareerModalOpen, setIsNewCareerModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isCinematicIntroOpen, setIsCinematicIntroOpen] = useState<boolean>(true);
  const [transferModalPlayer, setTransferModalPlayer] = useState<Player | null>(null);

  // Check if today is a match day for the user club
  const checkTodayFixture = useCallback(() => {
    const userClubId = state.userClubId;
    const todayFixture = state.fixtures.find(
      (f) => f.date === state.currentDate && !f.played && (f.homeClubId === userClubId || f.awayClubId === userClubId)
    );
    return todayFixture || null;
  }, [state.fixtures, state.currentDate, state.userClubId]);

  // Advance simulation to next day
  const continueDay = useCallback(() => {
    setIsSimulating(true);

    setTimeout(() => {
      setState((prevState) => {
        // Check if there is an unplayed fixture for today that user must play
        const todayFixture = prevState.fixtures.find(
          (f) => f.date === prevState.currentDate && !f.played && (f.homeClubId === prevState.userClubId || f.awayClubId === prevState.userClubId)
        );

        if (todayFixture) {
          // Trigger match fixture
          setActiveMatchFixture(todayFixture);
          setIsSimulating(false);
          return prevState;
        }

        // Advance 1 day in the world
        const advanced = advanceDay(prevState);

        // Check if next day has a match
        const nextMatch = advanced.fixtures.find(
          (f) => f.date === advanced.currentDate && !f.played && (f.homeClubId === advanced.userClubId || f.awayClubId === advanced.userClubId)
        );

        if (nextMatch) {
          setActiveMatchFixture(nextMatch);
        }

        setIsSimulating(false);
        return advanced;
      });
    }, 450);
  }, []);

  // Tactics handlers
  const setFormation = useCallback((formation: Formation) => {
    setState((prev) => {
      const templateSlots = FORMATION_SLOTS[formation] || FORMATION_SLOTS['4-3-3'];
      // Retain existing players if possible
      const newSlots: PitchSlot[] = templateSlots.map((tmpl, idx) => {
        const existingSlot = prev.tactics.slots[idx];
        return {
          ...tmpl,
          playerId: existingSlot?.playerId,
        };
      });

      return {
        ...prev,
        tactics: {
          ...prev.tactics,
          formation,
          slots: newSlots,
        },
      };
    });
  }, []);

  const updateTactics = useCallback((newTactics: Partial<TeamTactics>) => {
    setState((prev) => ({
      ...prev,
      tactics: {
        ...prev.tactics,
        ...newTactics,
      },
    }));
  }, []);

  const assignPlayerToSlot = useCallback((slotIndex: number, playerId: string) => {
    setState((prev) => {
      const newSlots = [...prev.tactics.slots];
      if (newSlots[slotIndex]) {
        newSlots[slotIndex] = { ...newSlots[slotIndex], playerId };
      }
      return {
        ...prev,
        tactics: {
          ...prev.tactics,
          slots: newSlots,
        },
      };
    });
  }, []);

  const swapPlayers = useCallback((playerId1: string, playerId2: string) => {
    setState((prev) => {
      const newSlots = prev.tactics.slots.map((slot) => {
        if (slot.playerId === playerId1) return { ...slot, playerId: playerId2 };
        if (slot.playerId === playerId2) return { ...slot, playerId: playerId1 };
        return slot;
      });

      let newSubs = [...prev.tactics.substitutePlayerIds];
      const subIdx1 = newSubs.indexOf(playerId1);
      const subIdx2 = newSubs.indexOf(playerId2);

      if (subIdx1 >= 0 && subIdx2 >= 0) {
        newSubs[subIdx1] = playerId2;
        newSubs[subIdx2] = playerId1;
      } else if (subIdx1 >= 0) {
        newSubs[subIdx1] = playerId2;
      } else if (subIdx2 >= 0) {
        newSubs[subIdx2] = playerId1;
      }

      return {
        ...prev,
        tactics: {
          ...prev.tactics,
          slots: newSlots,
          substitutePlayerIds: newSubs,
        },
      };
    });
  }, []);

  // Match management
  const startMatch = useCallback((fixture: MatchFixture) => {
    setActiveMatchFixture(fixture);
  }, []);

  const completeMatch = useCallback(
    (
      fixtureId: string,
      homeScore: number,
      awayScore: number,
      stats: any,
      events: any,
      playerRatings: Record<string, number>
    ) => {
      setState((prev) => {
        const updatedFixtures = prev.fixtures.map((f) => {
          if (f.id === fixtureId) {
            return {
              ...f,
              played: true,
              homeScore,
              awayScore,
              stats,
              events,
              playerRatings,
            };
          }
          return f;
        });

        // Update competition table
        const comp = prev.competitions['comp_premier_div'];
        let updatedTable = comp?.table ? [...comp.table] : [];
        const fixture = prev.fixtures.find((f) => f.id === fixtureId);

        if (fixture && updatedTable.length > 0) {
          updateTableForMatch(updatedTable, fixture.homeClubId, fixture.awayClubId, homeScore, awayScore);
        }

        const isUserHome = fixture?.homeClubId === prev.userClubId;
        const userScore = isUserHome ? homeScore : awayScore;
        const oppScore = isUserHome ? awayScore : homeScore;

        // Check achievements
        const updatedAchievements = prev.achievements.map((ach) => {
          if (ach.id === 'ach_first_win' && !ach.unlocked && userScore > oppScore) {
            return { ...ach, unlocked: true, unlockedDate: prev.currentDate };
          }
          if (ach.id === 'ach_clean_sheet' && !ach.unlocked && oppScore === 0) {
            return { ...ach, unlocked: true, unlockedDate: prev.currentDate };
          }
          return ach;
        });

        // Update player stats
        const updatedPlayers = { ...prev.players };
        Object.keys(playerRatings).forEach((pId) => {
          const p = updatedPlayers[pId];
          if (p) {
            const rating = playerRatings[pId];
            p.stats.appearances += 1;
            p.stats.ratingsHistory = [rating, ...p.stats.ratingsHistory].slice(0, 5);
            p.stats.avgRating = Math.round(
              p.stats.ratingsHistory.reduce((a, b) => a + b, 0) / p.stats.ratingsHistory.length * 10
            ) / 10;
            // Condition drops during match
            p.condition = Math.max(70, p.condition - (12 + Math.floor(Math.random() * 8)));
          }
        });

        // Tally goals
        events.forEach((ev: any) => {
          if (ev.type === 'Goal' || ev.type === 'PenaltyGoal') {
            if (ev.playerId && updatedPlayers[ev.playerId]) {
              updatedPlayers[ev.playerId].stats.goals += 1;
            }
            if (ev.assistPlayerId && updatedPlayers[ev.assistPlayerId]) {
              updatedPlayers[ev.assistPlayerId].stats.assists += 1;
            }
          }
        });

        // Update Board & Fan confidence
        const userClub = { ...prev.clubs[prev.userClubId] };
        if (userScore > oppScore) {
          userClub.boardConfidence = Math.min(100, userClub.boardConfidence + 3);
          userClub.fanConfidence = Math.min(100, userClub.fanConfidence + 4);
        } else if (userScore < oppScore) {
          userClub.boardConfidence = Math.max(10, userClub.boardConfidence - 4);
          userClub.fanConfidence = Math.max(10, userClub.fanConfidence - 5);
        }

        // Add news headline
        const oppClub = prev.clubs[isUserHome ? (fixture?.awayClubId || '') : (fixture?.homeClubId || '')];
        const updatedNews = [
          {
            id: 'news_match_' + Date.now(),
            date: prev.currentDate,
            headline: `${userScore > oppScore ? 'Resounding Victory!' : userScore === oppScore ? 'Honors Even in Hard-Fought Draw' : 'Tough Defeat'} as ${userClub.name} clash with ${oppClub?.name || 'Rivals'} (${homeScore}-${awayScore})`,
            content: `In a fiercely contested match at ${prev.clubs[fixture?.homeClubId || '']?.stadiumName || 'the stadium'}, ${homeScore}-${awayScore} was the final scoreline. Both managers shared their tactical reactions in the post-match press conference.`,
            category: 'Match' as const,
          },
          ...prev.news,
        ];

        const newState: CareerState = {
          ...prev,
          fixtures: updatedFixtures,
          players: updatedPlayers,
          achievements: updatedAchievements,
          news: updatedNews,
          competitions: {
            ...prev.competitions,
            comp_premier_div: {
              ...comp,
              table: updatedTable,
              fixtures: updatedFixtures,
            },
          },
          clubs: {
            ...prev.clubs,
            [prev.userClubId]: userClub,
          },
        };

        // Autosave
        if (prev.settings.autosaveAfterMatch) {
          saveLocalCareer(newState, undefined, true);
        }

        return newState;
      });

      setActiveMatchFixture(null);
    },
    []
  );

  // Transfers
  const submitTransferOffer = useCallback((playerId: string, fee: number, wage: number, years: number) => {
    setState((prev) => {
      const targetPlayer = prev.players[playerId];
      const userClub = prev.clubs[prev.userClubId];
      if (!targetPlayer || !userClub) return prev;

      const bidId = 'bid_' + Date.now();
      const newBid: TransferBid = {
        id: bidId,
        playerId,
        fromClubId: prev.userClubId,
        toClubId: targetPlayer.clubId,
        fee,
        wageOffer: wage,
        contractYears: years,
        status: 'Accepted', // High responsiveness for game feel
        date: prev.currentDate,
      };

      // Deduct budget
      userClub.transferBudget -= fee;
      userClub.currentBalance -= fee;

      // Transfer player
      const updatedPlayer: Player = {
        ...targetPlayer,
        clubId: prev.userClubId,
        squadCategory: 'First Team',
        contract: {
          ...targetPlayer.contract,
          salaryWeekly: wage,
          expiryYear: new Date(prev.currentDate).getFullYear() + years,
        },
      };

      const updatedNews = [
        {
          id: 'news_tr_' + Date.now(),
          date: prev.currentDate,
          headline: `DONE DEAL! ${userClub.name} Complete €${Math.round(fee / 1000000)}M Signing of ${targetPlayer.name}!`,
          content: `${targetPlayer.name} has officially signed terms with ${userClub.name} after passing a medical examination today. The manager expressed immense delight with the acquisition.`,
          category: 'Transfer' as const,
        },
        ...prev.news,
      ];

      const updatedInbox = [
        {
          id: 'inbox_tr_' + Date.now(),
          date: prev.currentDate,
          sender: 'Transfer Coordination Dept',
          senderRole: 'Chief Negotiator',
          subject: `Contract Executed: ${targetPlayer.name} is now a ${userClub.name} player!`,
          body: `All documentation and league registration for ${targetPlayer.name} have been ratified. The player is eligible for selection immediately.`,
          category: 'Transfer' as const,
          read: false,
        },
        ...prev.inbox,
      ];

      return {
        ...prev,
        players: {
          ...prev.players,
          [playerId]: updatedPlayer,
        },
        transferBids: [newBid, ...prev.transferBids],
        news: updatedNews,
        inbox: updatedInbox,
        clubs: {
          ...prev.clubs,
          [prev.userClubId]: userClub,
        },
      };
    });
  }, []);

  const signFreeAgent = useCallback((playerId: string, wage: number, years: number) => {
    setState((prev) => {
      const targetPlayer = prev.players[playerId];
      const userClub = prev.clubs[prev.userClubId];
      if (!targetPlayer || !userClub) return prev;

      const updatedPlayer: Player = {
        ...targetPlayer,
        clubId: prev.userClubId,
        squadCategory: 'First Team',
        contract: {
          salaryWeekly: wage,
          expiryYear: new Date(prev.currentDate).getFullYear() + years,
          appearanceBonus: 5000,
          goalBonus: 5000,
          cleanSheetBonus: 5000,
          loyaltyBonus: 100000,
        },
      };

      const updatedNews = [
        {
          id: 'news_free_' + Date.now(),
          date: prev.currentDate,
          headline: `FREE TRANSFER: ${userClub.name} Secure Free Agent ${targetPlayer.name}`,
          content: `In a shrewd piece of transfer market business, ${userClub.name} have announced the free-agent capture of experienced professional ${targetPlayer.name}.`,
          category: 'Transfer' as const,
        },
        ...prev.news,
      ];

      return {
        ...prev,
        players: {
          ...prev.players,
          [playerId]: updatedPlayer,
        },
        news: updatedNews,
      };
    });
  }, []);

  const promoteYouth = useCallback((playerId: string) => {
    setState((prev) => {
      const youth = prev.youthIntakePlayers.find((p) => p.id === playerId) || prev.players[playerId];
      if (!youth) return prev;

      const promoted: Player = {
        ...youth,
        squadCategory: 'First Team',
      };

      return {
        ...prev,
        players: {
          ...prev.players,
          [playerId]: promoted,
        },
        youthIntakePlayers: prev.youthIntakePlayers.filter((p) => p.id !== playerId),
      };
    });
  }, []);

  const upgradeFacility = useCallback((type: 'stadium' | 'facilities' | 'youth' | 'training') => {
    setState((prev) => {
      const club = { ...prev.clubs[prev.userClubId] };
      const costs = {
        stadium: 25000000,
        facilities: 15000000,
        youth: 18000000,
        training: 14000000,
      };

      const cost = costs[type];
      if (club.currentBalance < cost) return prev;

      club.currentBalance -= cost;

      if (type === 'stadium') {
        club.stadiumCapacity += 6500;
      } else if (type === 'facilities') {
        club.facilitiesLevel = Math.min(10, club.facilitiesLevel + 1);
      } else if (type === 'youth') {
        club.youthAcademyLevel = Math.min(10, club.youthAcademyLevel + 1);
      } else if (type === 'training') {
        club.trainingGroundLevel = Math.min(10, club.trainingGroundLevel + 1);
      }

      return {
        ...prev,
        clubs: {
          ...prev.clubs,
          [prev.userClubId]: club,
        },
      };
    });
  }, []);

  // Career Management
  const startNewCareer = useCallback(
    (clubId: string, managerData?: Partial<Manager>, isCustom?: boolean, customClub?: Partial<Club>) => {
      const freshState = createInitialState();
      let targetClubId = clubId;

      if (isCustom && customClub) {
        const customId = 'club_custom_' + Date.now();
        targetClubId = customId;
        const newClub: Club = {
          id: customId,
          name: customClub.name || 'Custom United',
          shortName: customClub.shortName || 'CUN',
          country: customClub.country || 'England',
          leagueId: 'comp_premier_div',
          primaryColor: customClub.primaryColor || '#10B981',
          secondaryColor: customClub.secondaryColor || '#000000',
          textColor: '#FFFFFF',
          stadiumName: customClub.stadiumName || 'Empire Park',
          stadiumCapacity: customClub.stadiumCapacity || 42000,
          ticketPrice: 50,
          pitchCondition: 95,
          facilitiesLevel: customClub.facilitiesLevel || 8,
          youthAcademyLevel: customClub.youthAcademyLevel || 8,
          trainingGroundLevel: customClub.trainingGroundLevel || 8,
          reputation: customClub.reputation || 80,
          transferBudget: customClub.transferBudget || 80000000,
          wageBudgetWeekly: 2500000,
          currentBalance: 100000000,
          boardConfidence: 85,
          fanConfidence: 85,
          rivalClubIds: ['club_london_fc'],
          trophiesWon: [],
          objectives: {
            leagueTarget: 'Top 6',
            cupTarget: 'Quarter-Finals',
            youthTarget: 'Promote 2 Academy Players',
            financialTarget: 'Maintain Positive Balance',
          },
          isCustom: true,
        };
        freshState.clubs[customId] = newClub;

        // Reassign London players to custom club for starter roster
        Object.keys(freshState.players).forEach((pId) => {
          if (freshState.players[pId].clubId === 'club_london_fc') {
            freshState.players[pId].clubId = customId;
          }
        });
      }

      freshState.userClubId = targetClubId;
      if (managerData) {
        freshState.manager = {
          ...freshState.manager,
          ...managerData,
        };
      }

      setState(freshState);
      saveLocalCareer(freshState, 'New Career Slot', true);
      setIsNewCareerModalOpen(false);
      setActiveTab('dashboard');
    },
    []
  );

  const loadSaveState = useCallback((saveId: string) => {
    const loaded = loadLocalCareer(saveId);
    if (loaded) {
      setState(loaded);
      setIsSaveLoadModalOpen(false);
      setActiveTab('dashboard');
    }
  }, []);

  const saveCurrentCareer = useCallback((name?: string) => {
    saveLocalCareer(state, name, false);
  }, [state]);

  const markInboxRead = useCallback((inboxId: string) => {
    setState((prev) => ({
      ...prev,
      inbox: prev.inbox.map((item) => (item.id === inboxId ? { ...item, read: true } : item)),
    }));
  }, []);

  const replyToInboxAction = useCallback((inboxId: string, actionType: string, payload?: any) => {
    setState((prev) => {
      return {
        ...prev,
        inbox: prev.inbox.map((item) => (item.id === inboxId ? { ...item, read: true, actionRequired: false } : item)),
      };
    });
  }, []);

  const updateCurrency = useCallback((currency: SupportedCurrency) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        currency,
        selectedBaseCurrency: currency,
      },
    }));
  }, []);

  const updatePlayerInSquad = useCallback((playerId: string, updates: Partial<Player>) => {
    setState((prev) => {
      const existing = prev.players[playerId];
      if (!existing) return prev;
      return {
        ...prev,
        players: {
          ...prev.players,
          [playerId]: {
            ...existing,
            ...updates,
          },
        },
      };
    });
  }, []);

  const createNewPlayer = useCallback((playerData: Partial<Player>): string => {
    const newId = `p_custom_${Date.now()}`;
    const newPlayer: Player = {
      id: newId,
      name: playerData.name || 'New Player',
      age: playerData.age || 20,
      nationality: playerData.nationality || 'England',
      position: playerData.position || 'ST',
      secondaryPositions: playerData.secondaryPositions || [],
      preferredFoot: playerData.preferredFoot || 'Right',
      heightCm: playerData.heightCm || 180,
      weightKg: playerData.weightKg || 75,
      clubId: playerData.clubId || state.userClubId,
      squadCategory: playerData.squadCategory || 'Senior',
      squadNumber: playerData.squadNumber || 99,
      currentAbility: playerData.currentAbility || 75,
      potentialAbility: playerData.potentialAbility || 85,
      marketValue: playerData.marketValue || 10000000,
      contract: playerData.contract || {
        salaryWeekly: 40000,
        expiryYear: 2029,
        appearanceBonus: 2000,
        goalBonus: 3000,
        cleanSheetBonus: 0,
        loyaltyBonus: 50000,
      },
      attributes: playerData.attributes || {
        passing: 75,
        firstTouch: 75,
        dribbling: 75,
        crossing: 70,
        finishing: 75,
        longShots: 70,
        heading: 70,
        tackling: 60,
        marking: 60,
        ballControl: 75,
        technique: 75,
        freeKicks: 65,
        corners: 65,
        penalties: 70,
        decisions: 75,
        concentration: 75,
        composure: 75,
        vision: 75,
        positioning: 75,
        anticipation: 75,
        leadership: 65,
        teamwork: 75,
        workRate: 75,
        determination: 75,
        aggression: 65,
        pace: 78,
        acceleration: 78,
        stamina: 80,
        strength: 75,
        agility: 76,
        balance: 76,
        jumping: 72,
        fitness: 95,
        reflexes: 25,
        handling: 25,
        gkPositioning: 25,
        oneOnOne: 25,
        diving: 25,
        aerialAbility: 25,
        distribution: 25,
      },
      personality: playerData.personality || 'Determined',
      role: playerData.role || 'Advanced Forward',
      morale: 90,
      condition: 100,
      sharpness: 90,
      stats: { appearances: 0, goals: 0, assists: 0, cleanSheets: 0, yellowCards: 0, redCards: 0, avgRating: 7.0, ratingsHistory: [] },
    };

    setState((prev) => ({
      ...prev,
      players: {
        ...prev.players,
        [newId]: newPlayer,
      },
    }));

    return newId;
  }, [state.userClubId]);

  const createNewCoach = useCallback((coachData: Partial<Manager>) => {
    setState((prev) => ({
      ...prev,
      manager: {
        ...prev.manager,
        ...coachData,
      },
    }));
  }, []);

  const createNewClub = useCallback((clubData: Partial<Club>): string => {
    const newId = `club_custom_${Date.now()}`;
    const newClub: Club = {
      id: newId,
      name: clubData.name || 'New Football Club',
      shortName: clubData.shortName || 'NFC',
      country: clubData.country || 'England',
      leagueId: clubData.leagueId || 'comp_premier_div',
      primaryColor: clubData.primaryColor || '#2563EB',
      secondaryColor: clubData.secondaryColor || '#FFFFFF',
      textColor: clubData.textColor || '#FFFFFF',
      stadiumName: clubData.stadiumName || 'City Arena',
      stadiumCapacity: clubData.stadiumCapacity || 42000,
      ticketPrice: clubData.ticketPrice || 45,
      pitchCondition: 90,
      facilitiesLevel: clubData.facilitiesLevel || 8,
      youthAcademyLevel: clubData.youthAcademyLevel || 8,
      trainingGroundLevel: clubData.trainingGroundLevel || 8,
      reputation: clubData.reputation || 75,
      transferBudget: clubData.transferBudget || 40000000,
      wageBudgetWeekly: clubData.wageBudgetWeekly || 1800000,
      currentBalance: clubData.currentBalance || 55000000,
      boardConfidence: 85,
      fanConfidence: 85,
      rivalClubIds: clubData.rivalClubIds || [],
      trophiesWon: clubData.trophiesWon || [],
      objectives: clubData.objectives || {
        leagueTarget: 'Mid-Table',
        cupTarget: 'Quarter-Finals',
        youthTarget: 'Promote 2 Academy Players',
        financialTarget: 'Maintain Positive Balance',
      },
      foundedYear: clubData.foundedYear || 1905,
      historicalNames: clubData.historicalNames || [],
      currentManagerName: clubData.currentManagerName || 'Head Coach',
      historicalRecords: clubData.historicalRecords || {
        recordWin: '9-0 vs Strikers FC (1988)',
        recordDefeat: '0-7 vs City Kings (1954)',
        recordSigning: '€45.0M for World Striker (2022)',
        recordSale: '€70.0M for Wonderkid (2024)',
        mostAppearances: 'Legendary Captain (654 apps)',
        allTimeTopScorer: 'Club Legend (254 goals)',
        bestLeagueFinish: 'Champions (2012)',
      },
    };

    setState((prev) => ({
      ...prev,
      clubs: {
        ...prev.clubs,
        [newId]: newClub,
      },
    }));

    return newId;
  }, []);

  const updateClub = useCallback((clubId: string, updates: Partial<Club>) => {
    setState((prev) => {
      const existing = prev.clubs[clubId];
      if (!existing) return prev;
      return {
        ...prev,
        clubs: {
          ...prev.clubs,
          [clubId]: {
            ...existing,
            ...updates,
          },
        },
      };
    });
  }, []);

  const logAuditEvent = useCallback((action: string, targetType: AuditLogEntry['targetType'], targetId: string, details: string) => {
    const newEntry: AuditLogEntry = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      user: state.manager.name,
      targetType,
      targetId,
      details,
    };
    setState((prev) => ({
      ...prev,
      auditLogs: [newEntry, ...(prev.auditLogs || [])],
    }));
  }, [state.manager.name]);

  return (
    <GameContext.Provider
      value={{
        state,
        activeTab,
        setActiveTab,
        activeMode,
        setActiveMode,
        isSimulating,
        activeMatchFixture,
        selectedPlayer,
        setSelectedPlayer,
        isAiModalOpen,
        setIsAiModalOpen,
        isSaveLoadModalOpen,
        setIsSaveLoadModalOpen,
        isNewCareerModalOpen,
        setIsNewCareerModalOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isCinematicIntroOpen,
        setIsCinematicIntroOpen,
        transferModalPlayer,
        setTransferModalPlayer,
        continueDay,
        setFormation,
        updateTactics,
        assignPlayerToSlot,
        swapPlayers,
        startMatch,
        completeMatch,
        submitTransferOffer,
        signFreeAgent,
        promoteYouth,
        upgradeFacility,
        startNewCareer,
        loadSaveState,
        saveCurrentCareer,
        markInboxRead,
        replyToInboxAction,
        updateCurrency,
        updatePlayerInSquad,
        createNewPlayer,
        createNewCoach,
        createNewClub,
        updateClub,
        logAuditEvent,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
