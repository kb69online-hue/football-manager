export type Position =
  | 'GK'
  | 'CB'
  | 'LB'
  | 'RB'
  | 'LWB'
  | 'RWB'
  | 'CDM'
  | 'CM'
  | 'CAM'
  | 'LM'
  | 'RM'
  | 'LW'
  | 'RW'
  | 'ST'
  | 'CF';

export type PlayerRole =
  // Goalkeepers
  | 'Goalkeeper'
  | 'Sweeper Keeper'
  | 'Shot Stopper'
  | 'Ball-Playing Goalkeeper'
  // Defenders
  | 'Central Defender'
  | 'Ball-Playing Defender'
  | 'Ball-playing Defender'
  | 'Stopper'
  | 'Cover Defender'
  | 'Full Back'
  | 'Wing Back'
  | 'Inverted Full Back'
  | 'Defensive Full Back'
  | 'Inverted Wing Back'
  // Midfielders
  | 'Defensive Midfielder'
  | 'Anchor'
  | 'Deep-Lying Playmaker'
  | 'Ball-Winning Midfielder'
  | 'Central Midfielder'
  | 'Box-to-Box Midfielder'
  | 'Advanced Playmaker'
  | 'Mezzala'
  | 'Roaming Playmaker'
  // Wide players
  | 'Winger'
  | 'Inverted Winger'
  | 'Inside Forward'
  | 'Wide Playmaker'
  // Attackers
  | 'Advanced Forward'
  | 'Complete Forward'
  | 'Target Forward'
  | 'Pressing Forward'
  | 'Poacher'
  | 'False Nine'
  | 'Deep-Lying Forward';

export type Formation =
  | '4-3-3'
  | '4-2-3-1'
  | '4-4-2'
  | '3-5-2'
  | '3-4-3'
  | '5-3-2'
  | '4-1-4-1'
  | '4-4-1-1'
  | 'Custom';

export type TeamMentality =
  | 'Very Defensive'
  | 'Defensive'
  | 'Balanced'
  | 'Positive'
  | 'Attacking'
  | 'Very Attacking';

export type PassingStyle = 'Short' | 'Mixed' | 'Direct';
export type TempoStyle = 'Slow' | 'Standard' | 'High';
export type WidthStyle = 'Narrow' | 'Balanced' | 'Wide';
export type DefensiveLineStyle = 'Deep' | 'Mid' | 'High';
export type PressingStyle = 'Low' | 'Balanced' | 'Urgent';
export type TacklingStyle = 'Stay On Feet' | 'Balanced' | 'Get Stuck In';
export type TransitionStyle = 'Counter' | 'Counter-Press' | 'Regroup';

export type PlayerPersonality =
  | 'Professional'
  | 'Ambitious'
  | 'Loyal'
  | 'Determined'
  | 'Leader'
  | 'Temperamental'
  | 'Reserved'
  | 'Team-oriented';

export type SquadCategory = 'First Team' | 'Senior' | 'Reserves' | 'U21' | 'Academy';

export interface PlayerAttributes {
  // Technical
  passing: number;
  firstTouch: number;
  dribbling: number;
  crossing: number;
  finishing: number;
  longShots: number;
  heading: number;
  tackling: number;
  marking: number;
  ballControl: number;
  technique: number;
  freeKicks: number;
  corners: number;
  penalties: number;

  // Mental
  decisions: number;
  concentration: number;
  composure: number;
  vision: number;
  positioning: number;
  anticipation: number;
  leadership: number;
  teamwork: number;
  workRate: number;
  determination: number;
  aggression: number;

  // Physical
  pace: number;
  acceleration: number;
  stamina: number;
  strength: number;
  agility: number;
  balance: number;
  jumping: number;
  fitness: number;

  // Goalkeeper
  reflexes: number;
  handling: number;
  gkPositioning: number;
  oneOnOne: number;
  diving: number;
  aerialAbility: number;
  distribution: number;
}

export interface PlayerContract {
  salaryWeekly: number; // e.g. 150000
  expiryYear: number; // e.g. 2029
  releaseClause?: number;
  appearanceBonus: number;
  goalBonus: number;
  cleanSheetBonus: number;
  loyaltyBonus: number;
}

export interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  avgRating: number;
  ratingsHistory: number[];
}

export interface PlayerInjury {
  type: string; // 'Hamstring Strain', 'Knee Ligament Sprain', etc.
  daysRemaining: number;
  severity: 'Minor' | 'Moderate' | 'Severe';
  expectedReturnWeeks?: number;
}

export interface PlayerSuspension {
  matchesRemaining: number;
  yellowCardAccumulation?: number;
  competitionId?: string;
  reason?: string;
}

export interface Player {
  id: string;
  name: string;
  fullName?: string;
  commonName?: string;
  dateOfBirth?: string;
  age: number;
  nationality: string;
  position: Position;
  secondaryPositions: Position[];
  preferredFoot: 'Left' | 'Right' | 'Both';
  heightCm: number;
  weightKg: number;
  clubId: string;
  squadCategory: SquadCategory;
  squadNumber: number;
  currentAbility: number; // 1-100
  potentialAbility: number; // 1-100
  marketValue: number; // in Euros
  contract: PlayerContract;
  attributes: PlayerAttributes;
  personality: PlayerPersonality;
  role: PlayerRole;
  morale: number; // 0-100
  condition: number; // 0-100 (fitness)
  sharpness: number; // 0-100 (match sharpness)
  stats: PlayerStats;
  injury?: PlayerInjury;
  suspension?: PlayerSuspension;
  isTransferListed?: boolean;
  isLoanListed?: boolean;
  trainingFocus?: string;
  trainingIntensity?: 'Low' | 'Medium' | 'High';
  previousClubs?: string[];
  internationalStats?: { caps: number; goals: number; debutYear?: number };
  careerHistory?: { season: string; club: string; apps: number; goals: number; assists: number; avgRating: number }[];
  awards?: string[];
  injuryHistory?: { date: string; injury: string; daysOut: number; status?: string }[];
  transferHistory?: { date: string; fromClub: string; toClub: string; fee: string }[];
  avatarUrl?: string;
}

export interface ClubObjectives {
  leagueTarget: 'Avoid Relegation' | 'Mid-Table' | 'Top 6' | 'Qualify for Champions Cup' | 'Title Contender' | 'Win the League';
  cupTarget: 'Round of 16' | 'Quarter-Finals' | 'Semi-Finals' | 'Reach the Final' | 'Win the Cup';
  youthTarget: 'Promote 2 Academy Players' | 'Develop Wonderkid' | 'Maintain High Facilities';
  financialTarget: 'Maintain Positive Balance' | 'Control Wage Bill' | 'Make Net Transfer Profit';
}

export interface Club {
  id: string;
  name: string;
  shortName: string;
  country: string;
  leagueId: string;
  primaryColor: string; // hex
  secondaryColor: string; // hex
  textColor: string;
  stadiumName: string;
  stadiumCapacity: number;
  ticketPrice: number;
  pitchCondition: number; // 1-100
  facilitiesLevel: number; // 1-10
  youthAcademyLevel: number; // 1-10
  trainingGroundLevel: number; // 1-10
  reputation: number; // 1-100
  transferBudget: number; // in Euros
  wageBudgetWeekly: number; // weekly wage cap
  currentBalance: number;
  boardConfidence: number; // 0-100
  fanConfidence: number; // 0-100
  rivalClubIds: string[];
  trophiesWon: { name: string; season: string }[];
  objectives: ClubObjectives;
  isCustom?: boolean;
  foundedYear?: number;
  historicalNames?: string[];
  historicalManagers?: { name: string; years: string; trophies: number }[];
  currentManagerName?: string;
  financialInfo?: {
    annualRevenue: number;
    wageBillAnnual: number;
    commercialIncome: number;
    matchdayIncome: number;
    debt: number;
  };
  historicalRecords?: {
    recordWin: string;
    recordDefeat: string;
    recordSigning: string;
    recordSale: string;
    mostAppearances: string;
    allTimeTopScorer: string;
    bestLeagueFinish: string;
  };
}

export interface ManagerAttributes {
  attacking: number;
  defending: number;
  tactical: number;
  fitnessTraining: number;
  mentalTraining: number;
  youthDevelopment: number;
  scouting: number;
  motivation: number;
  manManagement: number;
  setPieces: number;
  goalkeeping: number;
  technicalCoaching: number;
}

export interface Manager {
  id: string;
  name: string;
  age: number;
  nationality: string;
  avatar: string;
  reputation: number; // 1-100
  experience: number; // XP points
  level: number;
  philosophy: 'Attacking Tiki-Taka' | 'Gegenpressing' | 'Solid Counter-Attack' | 'Direct Physical' | 'Fluid Possession';
  preferredFormation: Formation;
  attributes: ManagerAttributes;
  careerStats: {
    matches: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    trophies: number;
    awards: string[];
  };
}

export interface PitchSlot {
  slotIndex: number;
  position: Position;
  role: PlayerRole;
  x: number; // percentage from left 0 - 100
  y: number; // percentage from top 0 - 100
  playerId?: string;
}

export interface TeamTactics {
  formation: Formation;
  mentality: TeamMentality;
  passingStyle: PassingStyle;
  tempo: TempoStyle;
  width: WidthStyle;
  defensiveLine: DefensiveLineStyle;
  pressingIntensity: PressingStyle;
  tackling: TacklingStyle;
  offsideTrap: boolean;
  transition: TransitionStyle;
  slots: PitchSlot[]; // 11 pitch coordinates
  substitutePlayerIds: string[]; // up to 7
  captainPlayerId?: string;
  viceCaptainPlayerId?: string;
  penaltyTakerId?: string;
  freeKickTakerId?: string;
  leftCornerTakerId?: string;
  rightCornerTakerId?: string;
}

export interface MatchEvent {
  minute: number;
  type:
    | 'Goal'
    | 'OwnGoal'
    | 'PenaltyGoal'
    | 'MissedPenalty'
    | 'YellowCard'
    | 'RedCard'
    | 'Substitution'
    | 'Injury'
    | 'VarDecision'
    | 'KeySave'
    | 'Woodwork'
    | 'Shot'
    | 'Foul'
    | 'Offside';
  clubId: string;
  playerId?: string;
  assistPlayerId?: string;
  subInPlayerId?: string;
  subOutPlayerId?: string;
  description: string;
}

export interface MatchStats {
  possessionHome: number; // %
  possessionAway: number;
  shotsHome: number;
  shotsAway: number;
  shotsOnTargetHome: number;
  shotsOnTargetAway: number;
  xGHome: number;
  xGAway: number;
  cornersHome: number;
  cornersAway: number;
  foulsHome: number;
  foulsAway: number;
  yellowCardsHome: number;
  yellowCardsAway: number;
  redCardsHome: number;
  redCardsAway: number;
  passesHome: number;
  passesAway: number;
  passAccuracyHome: number;
  passAccuracyAway: number;
  tacklesHome: number;
  tacklesAway: number;
}

export interface MatchFixture {
  id: string;
  competitionId: string;
  season: string;
  gameweek: number;
  date: string;
  homeClubId: string;
  awayClubId: string;
  played: boolean;
  homeScore?: number;
  awayScore?: number;
  attendance?: number;
  stats?: MatchStats;
  events?: MatchEvent[];
  playerRatings?: Record<string, number>; // playerId -> rating 1.0 - 10.0
}

export interface LeagueTableRow {
  clubId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface Competition {
  id: string;
  name: string;
  shortName: string;
  country: string;
  type: 'League' | 'DomesticCup' | 'ContinentalCup' | 'SuperCup';
  reputation: number;
  table?: LeagueTableRow[];
  fixtures: MatchFixture[];
  currentGameweek: number;
  totalGameweeks: number;
}

export interface Scout {
  id: string;
  name: string;
  nationality: string;
  scoutingAbility: number; // 1-20
  potentialJudging: number; // 1-20
  currentAssignment?: {
    region: string;
    position?: Position;
    minPotential?: number;
    maxAge?: number;
  };
}

export interface ScoutReport {
  playerId: string;
  scoutId: string;
  date: string;
  currentAbilityStars: number; // 1 to 5
  potentialAbilityStars: number; // 1 to 5
  estimatedValueMin: number;
  estimatedValueMax: number;
  estimatedWage: number;
  strengths: string[];
  weaknesses: string[];
  personalityReport: string;
  recommendation: 'Must Sign' | 'Strongly Consider' | 'Backup Option' | 'Do Not Sign';
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Assistant Manager' | 'Head Scout' | 'Chief Physio' | 'Fitness Coach' | 'Youth Director';
  nationality: string;
  age: number;
  salaryWeekly: number;
  rating: number; // 1-100
  specialty: string;
}

export interface TransferBid {
  id: string;
  playerId: string;
  fromClubId: string;
  toClubId: string;
  fee: number;
  wageOffer: number;
  contractYears: number;
  status: 'Pending' | 'Negotiating' | 'Accepted' | 'Rejected' | 'Completed' | 'Failed';
  clauseSellOnPercentage?: number;
  date: string;
}

export interface InboxItem {
  id: string;
  date: string;
  sender: string;
  senderRole: string;
  subject: string;
  body: string;
  category: 'Match' | 'Transfer' | 'Injury' | 'Board' | 'Scout' | 'Youth' | 'Media';
  read: boolean;
  actionRequired?: boolean;
  actions?: {
    label: string;
    actionType: 'accept_transfer' | 'reject_transfer' | 'attend_press' | 'board_reply' | 'renew_contract';
    payload?: any;
  }[];
}

export interface NewsItem {
  id: string;
  date: string;
  headline: string;
  content: string;
  category: 'Transfer' | 'Match' | 'Injury' | 'Board' | 'Award' | 'Rumor';
  relatedClubId?: string;
  relatedPlayerId?: string;
}

export interface PressQuestion {
  id: string;
  journalist: string;
  outlet: string;
  question: string;
  answers: {
    text: string;
    moraleEffect: number; // -10 to +10
    fanEffect: number;
    boardEffect: number;
  }[];
}

export interface PressConference {
  id: string;
  matchId?: string;
  title: string;
  questions: PressQuestion[];
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: string;
  iconName: string;
}

export interface CareerSaveSummary {
  id: string;
  name: string;
  clubName: string;
  managerName: string;
  currentSeason: string;
  currentDate: string;
  savedAt: string;
  isAutosave: boolean;
}

export type SupportedCurrency = 'EUR' | 'USD' | 'GBP' | 'TZS' | 'KES' | 'NGN' | 'ZAR';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  rateToEur: number;
}

export type PlayerCareerGoal =
  | 'Become a Club Legend'
  | 'Play for National Team'
  | 'Win Trophies'
  | 'Become Captain'
  | 'Become a Top Scorer'
  | 'Become a Professional Coach'
  | 'Move to a Bigger Club'
  | 'Become Financially Successful'
  | 'Develop into a World-Class Player';

export interface PlayerVocation {
  careerGoal: PlayerCareerGoal;
  loyalty: number; // 1-100
  ambition: number; // 1-100
  adaptability: number; // 1-100
  leadershipPotential: number; // 1-100
  coachingInterest: number; // 1-100
}

export interface RealWorldEvent {
  minute: number;
  type: 'Goal' | 'YellowCard' | 'RedCard' | 'Substitution' | 'VarDecision' | 'Penalty';
  team: 'home' | 'away';
  player: string;
  assistOrSub?: string;
  description: string;
}

export interface RealWorldPlayerMatchStat {
  player: string;
  team: 'home' | 'away';
  position?: string;
  rating: number; // e.g. 7.6
  goals: number;
  assists: number;
  shots: number;
  keyPasses: number;
  tackles: number;
  saves?: number;
}

export interface RealWorldMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  competition: string;
  competitionLogo?: string;
  homeBadge?: string;
  awayBadge?: string;
  homeColor: string;
  awayColor: string;
  status: 'LIVE' | 'UPCOMING' | 'FINISHED';
  minute?: number;
  startTime: string; // e.g. "2026-09-28T19:45:00Z" or "19:45"
  matchDayCategory: 'TODAY' | 'TOMORROW' | 'THIS WEEK' | 'PAST';
  venue: string;
  stats?: {
    possessionHome: number;
    possessionAway: number;
    shotsHome: number;
    shotsAway: number;
    shotsOnTargetHome: number;
    shotsOnTargetAway: number;
    cornersHome: number;
    cornersAway: number;
    foulsHome: number;
    foulsAway: number;
    offsidesHome: number;
    offsidesAway: number;
    passesCompletedHome?: number;
    passesCompletedAway?: number;
    passAccuracyHome?: number;
    passAccuracyAway?: number;
  };
  events: RealWorldEvent[];
  homeLineup?: string[];
  awayLineup?: string[];
  playerStats?: RealWorldPlayerMatchStat[];
  dataSource: {
    provider: string;
    license: string;
    lastUpdated: string;
    status: 'Verified Legal Source' | 'Public Open Domain' | 'Original Synthetic Simulation';
  };
}

export interface HistoricalSeason {
  year: number;
  seasonLabel: string;
  generation: '2000s Generation' | '2010s Generation' | '2020s Generation' | 'Future Generation';
  summary: string;
  champions: { competition: string; winner: string; runnerUp: string }[];
  topScorers: { name: string; club: string; goals: number }[];
  ballonDorWinner: { name: string; club: string; nationality: string };
  recordTransfer: { player: string; from: string; to: string; fee: string };
  keyClubs: { name: string; manager: string; starPlayer: string; reputation: number }[];
}

export interface ExchangeOffer {
  id: string;
  fromClubId: string;
  toClubId: string;
  offeredPlayerIds: string[];
  targetPlayerId: string;
  cashAdjustment: number; // positive = giving cash, negative = demanding cash
  sellOnPercentage: number; // 0-50%
  buyBackClauseAmount?: number;
  loanToBuy: boolean;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Countered';
  counterDemand?: string;
}

export interface NationalTeam {
  id: string;
  name: string;
  code: string;
  confederation: 'UEFA' | 'CONMEBOL' | 'CAF' | 'CONCACAF' | 'AFC' | 'OFC';
  ranking: number;
  managerName: string;
  primaryColor: string;
  secondaryColor: string;
  trophies: { name: string; year: number }[];
  squadPlayerIds: string[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  targetType: 'Player' | 'Club' | 'Coach' | 'Competition' | 'Settings';
  targetId: string;
  details: string;
}

export interface AssetItem {
  id: string;
  type: 'badge' | 'avatar' | 'stadium' | 'kit' | 'trophy';
  name: string;
  license: 'Licensed' | 'User-Uploaded' | 'Original Generated' | 'Public Domain';
  source: string;
  createdAt: string;
  content: string; // SVG or data URL
}

export interface KitDesign {
  type: 'home' | 'away' | 'third' | 'gk';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  pattern: 'solid' | 'stripes' | 'hoops' | 'sash' | 'halves';
  collarStyle: 'round' | 'v-neck' | 'polo';
  shortColor: string;
  sockColor: string;
  numberColor: string;
}

export interface GameSettings {
  difficulty: 'Beginner' | 'Normal' | 'Hard' | 'Realistic';
  currency: SupportedCurrency;
  matchSpeed: 1 | 2 | 5;
  soundEnabled: boolean;
  autosaveAfterMatch: boolean;
  selectedBaseCurrency: SupportedCurrency;
  liveDataAutoRefresh: boolean;
  notificationsEnabled: boolean;
}

export interface CareerState {
  currentDate: string; // YYYY-MM-DD
  currentSeason: string; // e.g. "2026/27"
  manager: Manager;
  userClubId: string;
  clubs: Record<string, Club>;
  players: Record<string, Player>;
  tactics: TeamTactics;
  competitions: Record<string, Competition>;
  fixtures: MatchFixture[];
  scouts: Scout[];
  scoutReports: Record<string, ScoutReport>;
  staff: StaffMember[];
  transferBids: TransferBid[];
  exchangeOffers?: ExchangeOffer[];
  shortlistPlayerIds: string[];
  inbox: InboxItem[];
  news: NewsItem[];
  achievements: Achievement[];
  pressConference?: PressConference;
  financesHistory: {
    month: string;
    income: number;
    expenses: number;
    net: number;
  }[];
  youthIntakePlayers: Player[];
  settings: GameSettings;
  isTransferWindowOpen: boolean;
  isDeadlineDay: boolean;
  auditLogs?: AuditLogEntry[];
}

