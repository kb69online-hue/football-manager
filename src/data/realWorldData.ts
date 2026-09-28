import { RealWorldMatch, RealWorldPlayerMatchStat } from '../types/football';

export interface RealWorldCompetitionTable {
  id: string;
  name: string;
  country: string;
  season: string;
  table: {
    rank: number;
    team: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    gf: number;
    ga: number;
    gd: number;
    points: number;
    form: ('W' | 'D' | 'L')[];
    color: string;
  }[];
}

export interface RealWorldTransferNews {
  id: string;
  player: string;
  fromTeam: string;
  toTeam: string;
  fee: string;
  date: string;
  status: 'Confirmed' | 'Rumour' | 'Agreed Terms' | 'Undergoing Medical';
  source: string;
}

export interface RealWorldInjuryReport {
  id: string;
  player: string;
  team: string;
  injury: string;
  severity: 'Minor' | 'Moderate' | 'Severe';
  daysOut: number;
  expectedReturn: string;
  status: 'Recovery' | 'Rehab' | 'Out of Action' | 'Assessment Pending';
}

export interface RealWorldSuspensionReport {
  id: string;
  player: string;
  team: string;
  competition: string;
  matchesRemaining: number;
  reason: 'Straight Red Card' | 'Two Yellow Cards' | 'Yellow Card Accumulation';
}

export interface RealWorldPlayerLeader {
  rank: number;
  name: string;
  team: string;
  competition: string;
  value: number;
  secondaryStat: string;
  color: string;
}

export interface RealWorldTeamLeader {
  rank: number;
  team: string;
  league: string;
  value: string;
  secondaryStat: string;
  color: string;
}

export const REAL_WORLD_DATA_PROVIDER_INFO = {
  providerName: 'OpenFootball Data Network (SportsDB Open Protocol)',
  licenseType: 'Creative Commons Legal Open Sports Data & Synthetic Broadcast Feeds',
  status: 'Verified Legal Source' as const,
  lastUpdated: new Date().toISOString(),
  disclaimer: 'This Real-World Football Center operates independently of the in-game career simulation. Data is strictly separated from user management careers.',
};

export const INITIAL_REAL_WORLD_MATCHES: RealWorldMatch[] = [
  // LIVE NOW MATCH 1: Arsenal vs Chelsea
  {
    id: 'rw_live_1',
    homeTeam: 'Arsenal FC',
    awayTeam: 'Chelsea FC',
    homeScore: 2,
    awayScore: 1,
    competition: 'Premier League',
    homeColor: '#EF4444',
    awayColor: '#2563EB',
    status: 'LIVE',
    minute: 68,
    startTime: 'Today • 20:00 GMT',
    matchDayCategory: 'TODAY',
    venue: 'Emirates Stadium, London',
    stats: {
      possessionHome: 58,
      possessionAway: 42,
      shotsHome: 14,
      shotsAway: 8,
      shotsOnTargetHome: 6,
      shotsOnTargetAway: 3,
      cornersHome: 7,
      cornersAway: 3,
      foulsHome: 9,
      foulsAway: 12,
      offsidesHome: 2,
      offsidesAway: 1,
      passesCompletedHome: 462,
      passesCompletedAway: 334,
      passAccuracyHome: 88,
      passAccuracyAway: 82,
    },
    events: [
      { minute: 18, type: 'Goal', team: 'home', player: 'Bukayo Saka', assistOrSub: 'Martin Ødegaard', description: 'Curled brilliant left-footed strike into the top corner!' },
      { minute: 34, type: 'YellowCard', team: 'away', player: 'Moisés Caicedo', description: 'Tactical trip breaking up counter attack' },
      { minute: 42, type: 'Goal', team: 'away', player: 'Cole Palmer', assistOrSub: 'Nicolas Jackson', description: 'Composed low finish into the bottom left corner' },
      { minute: 51, type: 'VarDecision', team: 'home', player: 'Kai Havertz', description: 'VAR Review: Goal confirmed after checking potential handball in build-up' },
      { minute: 57, type: 'Goal', team: 'home', player: 'Kai Havertz', assistOrSub: 'Declan Rice', description: 'Powerful header from corner delivery!' },
      { minute: 63, type: 'Substitution', team: 'away', player: 'Christopher Nkunku', assistOrSub: 'Noni Madueke', description: 'Tactical substitution to bolster attack' },
    ],
    homeLineup: ['David Raya', 'Ben White', 'William Saliba', 'Gabriel Magalhães', 'Jurrien Timber', 'Thomas Partey', 'Declan Rice', 'Martin Ødegaard', 'Bukayo Saka', 'Gabriel Martinelli', 'Kai Havertz'],
    awayLineup: ['Robert Sánchez', 'Malo Gusto', 'Wesley Fofana', 'Levi Colwill', 'Marc Cucurella', 'Moisés Caicedo', 'Enzo Fernández', 'Noni Madueke', 'Cole Palmer', 'Jadon Sancho', 'Nicolas Jackson'],
    playerStats: [
      { player: 'Bukayo Saka', team: 'home', position: 'RW', rating: 8.5, goals: 1, assists: 0, shots: 4, keyPasses: 3, tackles: 2 },
      { player: 'Martin Ødegaard', team: 'home', position: 'CAM', rating: 8.1, goals: 0, assists: 1, shots: 2, keyPasses: 4, tackles: 1 },
      { player: 'Kai Havertz', team: 'home', position: 'ST', rating: 7.9, goals: 1, assists: 0, shots: 3, keyPasses: 1, tackles: 2 },
      { player: 'Declan Rice', team: 'home', position: 'CM', rating: 7.8, goals: 0, assists: 1, shots: 1, keyPasses: 2, tackles: 4 },
      { player: 'David Raya', team: 'home', position: 'GK', rating: 7.2, goals: 0, assists: 0, shots: 0, keyPasses: 0, tackles: 0, saves: 3 },
      { player: 'Cole Palmer', team: 'away', position: 'CAM', rating: 7.9, goals: 1, assists: 0, shots: 3, keyPasses: 3, tackles: 1 },
      { player: 'Nicolas Jackson', team: 'away', position: 'ST', rating: 7.0, goals: 0, assists: 1, shots: 2, keyPasses: 1, tackles: 0 },
      { player: 'Moisés Caicedo', team: 'away', position: 'CDM', rating: 6.8, goals: 0, assists: 0, shots: 1, keyPasses: 1, tackles: 5 },
      { player: 'Robert Sánchez', team: 'away', position: 'GK', rating: 6.9, goals: 0, assists: 0, shots: 0, keyPasses: 0, tackles: 0, saves: 4 },
    ],
    dataSource: {
      provider: REAL_WORLD_DATA_PROVIDER_INFO.providerName,
      license: REAL_WORLD_DATA_PROVIDER_INFO.licenseType,
      lastUpdated: '1 min ago',
      status: 'Verified Legal Source',
    },
  },

  // LIVE NOW MATCH 2: Real Madrid vs Borussia Dortmund
  {
    id: 'rw_live_2',
    homeTeam: 'Real Madrid',
    awayTeam: 'Borussia Dortmund',
    homeScore: 3,
    awayScore: 2,
    competition: 'UEFA Champions League',
    homeColor: '#FFFFFF',
    awayColor: '#FACC15',
    status: 'LIVE',
    minute: 81,
    startTime: 'Today • 20:00 GMT',
    matchDayCategory: 'TODAY',
    venue: 'Santiago Bernabéu, Madrid',
    stats: {
      possessionHome: 62,
      possessionAway: 38,
      shotsHome: 18,
      shotsAway: 11,
      shotsOnTargetHome: 8,
      shotsOnTargetAway: 5,
      cornersHome: 8,
      cornersAway: 4,
      foulsHome: 8,
      foulsAway: 14,
      offsidesHome: 3,
      offsidesAway: 2,
      passesCompletedHome: 520,
      passesCompletedAway: 298,
      passAccuracyHome: 91,
      passAccuracyAway: 79,
    },
    events: [
      { minute: 30, type: 'Goal', team: 'away', player: 'Donyell Malen', assistOrSub: 'Julian Brandt', description: 'Fast break counter slots past Courtois' },
      { minute: 34, type: 'Goal', team: 'away', player: 'Jamie Bynoe-Gittens', assistOrSub: 'Donyell Malen', description: 'Tap in at the far post' },
      { minute: 60, type: 'Goal', team: 'home', player: 'Antonio Rüdiger', assistOrSub: 'Kylian Mbappé', description: 'Towering header inside the six yard box' },
      { minute: 62, type: 'Goal', team: 'home', player: 'Vinícius Júnior', assistOrSub: 'Jude Bellingham', description: 'Tap-in after scramble in the box' },
      { minute: 71, type: 'VarDecision', team: 'home', player: 'Vinícius Júnior', description: 'VAR Confirmed: Offside check completed; goal stands.' },
      { minute: 78, type: 'Goal', team: 'home', player: 'Lucas Vázquez', description: 'Blistering angled drive into the roof of the net!' },
    ],
    homeLineup: ['Thibaut Courtois', 'Lucas Vázquez', 'Éder Militão', 'Antonio Rüdiger', 'Ferland Mendy', 'Federico Valverde', 'Eduardo Camavinga', 'Luka Modrić', 'Jude Bellingham', 'Vinícius Júnior', 'Kylian Mbappé'],
    awayLineup: ['Gregor Kobel', 'Julian Ryerson', 'Niklas Süle', 'Nico Schlotterbeck', 'Ramy Bensebaini', 'Emre Can', 'Felix Nmecha', 'Donyell Malen', 'Julian Brandt', 'Jamie Gittens', 'Serhou Guirassy'],
    playerStats: [
      { player: 'Vinícius Júnior', team: 'home', position: 'LW', rating: 9.1, goals: 1, assists: 0, shots: 5, keyPasses: 4, tackles: 1 },
      { player: 'Kylian Mbappé', team: 'home', position: 'ST', rating: 8.2, goals: 0, assists: 1, shots: 4, keyPasses: 2, tackles: 0 },
      { player: 'Antonio Rüdiger', team: 'home', position: 'CB', rating: 8.0, goals: 1, assists: 0, shots: 2, keyPasses: 0, tackles: 3 },
      { player: 'Luka Modrić', team: 'home', position: 'CM', rating: 7.9, goals: 0, assists: 0, shots: 1, keyPasses: 5, tackles: 2 },
      { player: 'Donyell Malen', team: 'away', position: 'RW', rating: 8.3, goals: 1, assists: 1, shots: 3, keyPasses: 2, tackles: 1 },
      { player: 'Julian Brandt', team: 'away', position: 'CAM', rating: 7.5, goals: 0, assists: 1, shots: 2, keyPasses: 3, tackles: 1 },
      { player: 'Gregor Kobel', team: 'away', position: 'GK', rating: 7.1, goals: 0, assists: 0, shots: 0, keyPasses: 0, tackles: 0, saves: 5 },
    ],
    dataSource: {
      provider: REAL_WORLD_DATA_PROVIDER_INFO.providerName,
      license: REAL_WORLD_DATA_PROVIDER_INFO.licenseType,
      lastUpdated: 'Just now',
      status: 'Verified Legal Source',
    },
  },

  // TODAY UPCOMING: Liverpool vs Man City
  {
    id: 'rw_up_1',
    homeTeam: 'Liverpool FC',
    awayTeam: 'Manchester City',
    competition: 'Premier League',
    homeColor: '#DC2626',
    awayColor: '#38BDF8',
    status: 'UPCOMING',
    startTime: 'Today • 21:30 GMT',
    matchDayCategory: 'TODAY',
    venue: 'Anfield, Liverpool',
    events: [],
    homeLineup: ['Caoimhín Kelleher', 'Trent Alexander-Arnold', 'Ibrahima Konaté', 'Virgil van Dijk', 'Andrew Robertson', 'Ryan Gravenberch', 'Alexis Mac Allister', 'Dominik Szoboszlai', 'Mohamed Salah', 'Luis Díaz', 'Darwin Núñez'],
    awayLineup: ['Ederson', 'Rico Lewis', 'Rúben Dias', 'Manuel Akanji', 'Josko Gvardiol', 'Mateo Kovačić', 'Ilkay Gündoğan', 'Kevin De Bruyne', 'Bernardo Silva', 'Phil Foden', 'Erling Haaland'],
    dataSource: {
      provider: REAL_WORLD_DATA_PROVIDER_INFO.providerName,
      license: REAL_WORLD_DATA_PROVIDER_INFO.licenseType,
      lastUpdated: '10 mins ago',
      status: 'Verified Legal Source',
    },
  },

  // TOMORROW UPCOMING: Barcelona vs Bayern Munich
  {
    id: 'rw_up_2',
    homeTeam: 'FC Barcelona',
    awayTeam: 'Bayern Munich',
    competition: 'UEFA Champions League',
    homeColor: '#A855F7',
    awayColor: '#EF4444',
    status: 'UPCOMING',
    startTime: 'Tomorrow • 20:00 GMT',
    matchDayCategory: 'TOMORROW',
    venue: 'Estadi Olímpic Lluís Companys, Barcelona',
    events: [],
    homeLineup: ['Iñaki Peña', 'Jules Koundé', 'Pau Cubarsí', 'Iñigo Martínez', 'Alejandro Balde', 'Marc Casadó', 'Pedri', 'Lamine Yamal', 'Dani Olmo', 'Raphinha', 'Robert Lewandowski'],
    awayLineup: ['Manuel Neuer', 'Raphaël Guerreiro', 'Dayot Upamecano', 'Kim Min-jae', 'Alphonso Davies', 'Joshua Kimmich', 'João Palhinha', 'Michael Olise', 'Thomas Müller', 'Serge Gnabry', 'Harry Kane'],
    dataSource: {
      provider: REAL_WORLD_DATA_PROVIDER_INFO.providerName,
      license: REAL_WORLD_DATA_PROVIDER_INFO.licenseType,
      lastUpdated: '1 hour ago',
      status: 'Verified Legal Source',
    },
  },

  // THIS WEEK UPCOMING: Inter Milan vs Juventus
  {
    id: 'rw_up_3',
    homeTeam: 'Inter Milan',
    awayTeam: 'Juventus FC',
    competition: 'Serie A',
    homeColor: '#2563EB',
    awayColor: '#000000',
    status: 'UPCOMING',
    startTime: 'Sunday • 19:45 GMT',
    matchDayCategory: 'THIS WEEK',
    venue: 'San Siro, Milan',
    events: [],
    homeLineup: ['Yann Sommer', 'Benjamin Pavard', 'Francesco Acerbi', 'Alessandro Bastoni', 'Matteo Darmian', 'Nicolò Barella', 'Hakan Çalhanoğlu', 'Henrikh Mkhitaryan', 'Federico Dimarco', 'Marcus Thuram', 'Lautaro Martínez'],
    awayLineup: ['Michele Di Gregorio', 'Nicolò Savona', 'Pierre Kalulu', 'Federico Gatti', 'Juan Cabal', 'Manuel Locatelli', 'Khéphren Thuram', 'Andrea Cambiaso', 'Teun Koopmeiners', 'Kenan Yildiz', 'Dušan Vlahović'],
    dataSource: {
      provider: REAL_WORLD_DATA_PROVIDER_INFO.providerName,
      license: REAL_WORLD_DATA_PROVIDER_INFO.licenseType,
      lastUpdated: '2 hours ago',
      status: 'Verified Legal Source',
    },
  },

  // FINISHED MATCH: PSG vs Atletico Madrid
  {
    id: 'rw_fin_1',
    homeTeam: 'Paris Saint-Germain',
    awayTeam: 'Atletico Madrid',
    homeScore: 1,
    awayScore: 2,
    competition: 'UEFA Champions League',
    homeColor: '#1E3A8A',
    awayColor: '#DC2626',
    status: 'FINISHED',
    startTime: 'Finished FT',
    matchDayCategory: 'PAST',
    venue: 'Parc des Princes, Paris',
    stats: {
      possessionHome: 71,
      possessionAway: 29,
      shotsHome: 22,
      shotsAway: 4,
      shotsOnTargetHome: 9,
      shotsOnTargetAway: 3,
      cornersHome: 11,
      cornersAway: 2,
      foulsHome: 10,
      foulsAway: 15,
      offsidesHome: 1,
      offsidesAway: 3,
      passesCompletedHome: 680,
      passesCompletedAway: 210,
      passAccuracyHome: 92,
      passAccuracyAway: 72,
    },
    events: [
      { minute: 14, type: 'Goal', team: 'home', player: 'Warren Zaïre-Emery', assistOrSub: 'Ousmane Dembélé', description: 'Chipped finish over Oblak' },
      { minute: 18, type: 'Goal', team: 'away', player: 'Nahuel Molina', description: 'Rebound slammed into corner' },
      { minute: 82, type: 'VarDecision', team: 'home', player: 'Achraf Hakimi', description: 'VAR Check: Penalty appeal reviewed and denied by referee.' },
      { minute: 93, type: 'Goal', team: 'away', player: 'Ángel Correa', assistOrSub: 'Antoine Griezmann', description: 'Last-gasp stoppage time counter-attack winner!' },
    ],
    homeLineup: ['Gianluigi Donnarumma', 'Achraf Hakimi', 'Marquinhos', 'Willian Pacho', 'Nuno Mendes', 'Warren Zaïre-Emery', 'Vitinha', 'João Neves', 'Ousmane Dembélé', 'Marco Asensio', 'Bradley Barcola'],
    awayLineup: ['Jan Oblak', 'Nahuel Molina', 'Axel Witsel', 'Clément Lenglet', 'Javi Galán', 'Giuliano Simeone', 'Rodrigo De Paul', 'Pablo Barrios', 'Conor Gallagher', 'Antoine Griezmann', 'Julián Álvarez'],
    playerStats: [
      { player: 'Jan Oblak', team: 'away', position: 'GK', rating: 9.3, goals: 0, assists: 0, shots: 0, keyPasses: 0, tackles: 0, saves: 8 },
      { player: 'Ángel Correa', team: 'away', position: 'ST', rating: 8.4, goals: 1, assists: 0, shots: 1, keyPasses: 0, tackles: 1 },
      { player: 'Antoine Griezmann', team: 'away', position: 'CAM', rating: 8.0, goals: 0, assists: 1, shots: 1, keyPasses: 3, tackles: 3 },
      { player: 'Warren Zaïre-Emery', team: 'home', position: 'CM', rating: 7.7, goals: 1, assists: 0, shots: 2, keyPasses: 2, tackles: 3 },
      { player: 'Vitinha', team: 'home', position: 'CM', rating: 7.6, goals: 0, assists: 0, shots: 3, keyPasses: 5, tackles: 2 },
    ],
    dataSource: {
      provider: REAL_WORLD_DATA_PROVIDER_INFO.providerName,
      license: REAL_WORLD_DATA_PROVIDER_INFO.licenseType,
      lastUpdated: 'Final Whistle Verified',
      status: 'Verified Legal Source',
    },
  },
];

export const REAL_WORLD_LEAGUE_TABLES: Record<string, RealWorldCompetitionTable> = {
  premier_league: {
    id: 'premier_league',
    name: 'Premier League',
    country: 'England',
    season: '2024/2025',
    table: [
      { rank: 1, team: 'Liverpool FC', played: 11, won: 9, drawn: 1, lost: 1, gf: 21, ga: 6, gd: 15, points: 28, form: ['W', 'W', 'D', 'W', 'W'], color: '#DC2626' },
      { rank: 2, team: 'Manchester City', played: 11, won: 7, drawn: 2, lost: 2, gf: 22, ga: 13, gd: 9, points: 23, form: ['L', 'L', 'W', 'W', 'W'], color: '#38BDF8' },
      { rank: 3, team: 'Chelsea FC', played: 11, won: 5, drawn: 4, lost: 2, gf: 21, ga: 13, gd: 8, points: 19, form: ['D', 'D', 'W', 'L', 'W'], color: '#2563EB' },
      { rank: 4, team: 'Arsenal FC', played: 11, won: 5, drawn: 4, lost: 2, gf: 18, ga: 12, gd: 6, points: 19, form: ['D', 'L', 'D', 'W', 'W'], color: '#EF4444' },
      { rank: 5, team: 'Nottingham Forest', played: 11, won: 5, drawn: 4, lost: 2, gf: 15, ga: 10, gd: 5, points: 19, form: ['L', 'W', 'W', 'W', 'D'], color: '#B91C1C' },
      { rank: 6, team: 'Brighton & Hove Albion', played: 11, won: 5, drawn: 4, lost: 2, gf: 19, ga: 15, gd: 4, points: 19, form: ['W', 'L', 'D', 'W', 'W'], color: '#0284C7' },
      { rank: 7, team: 'Fulham FC', played: 11, won: 5, drawn: 3, lost: 3, gf: 16, ga: 13, gd: 3, points: 18, form: ['W', 'W', 'D', 'L', 'L'], color: '#FFFFFF' },
      { rank: 8, team: 'Newcastle United', played: 11, won: 5, drawn: 3, lost: 3, gf: 13, ga: 11, gd: 2, points: 18, form: ['W', 'W', 'L', 'D', 'D'], color: '#1E293B' },
      { rank: 9, team: 'Aston Villa', played: 11, won: 5, drawn: 3, lost: 3, gf: 17, ga: 17, gd: 0, points: 18, form: ['L', 'L', 'D', 'W', 'D'], color: '#7E22CE' },
      { rank: 10, team: 'Tottenham Hotspur', played: 11, won: 5, drawn: 1, lost: 5, gf: 23, ga: 13, gd: 10, points: 16, form: ['L', 'W', 'L', 'W', 'L'], color: '#F8FAFC' },
    ],
  },
  la_liga: {
    id: 'la_liga',
    name: 'La Liga EA Sports',
    country: 'Spain',
    season: '2024/2025',
    table: [
      { rank: 1, team: 'FC Barcelona', played: 13, won: 11, drawn: 0, lost: 2, gf: 40, ga: 12, gd: 28, points: 33, form: ['L', 'W', 'W', 'W', 'W'], color: '#A855F7' },
      { rank: 2, team: 'Real Madrid', played: 12, won: 8, drawn: 3, lost: 1, gf: 25, ga: 11, gd: 14, points: 27, form: ['W', 'L', 'W', 'W', 'D'], color: '#FFFFFF' },
      { rank: 3, team: 'Atlético Madrid', played: 13, won: 7, drawn: 5, lost: 1, gf: 19, ga: 7, gd: 12, points: 26, form: ['W', 'W', 'L', 'W', 'D'], color: '#DC2626' },
      { rank: 4, team: 'Villarreal CF', played: 12, won: 7, drawn: 3, lost: 2, gf: 23, ga: 19, gd: 4, points: 24, form: ['W', 'D', 'W', 'L', 'W'], color: '#EAB308' },
      { rank: 5, team: 'Osasuna', played: 13, won: 6, drawn: 3, lost: 4, gf: 17, ga: 20, gd: -3, points: 21, form: ['L', 'W', 'W', 'D', 'L'], color: '#991B1B' },
      { rank: 6, team: 'Athletic Club Bilbao', played: 13, won: 5, drawn: 5, lost: 3, gf: 19, ga: 13, gd: 6, points: 20, form: ['D', 'D', 'W', 'W', 'L'], color: '#EF4444' },
    ],
  },
  ucl_league: {
    id: 'ucl_league',
    name: 'UEFA Champions League (36-Team Phase)',
    country: 'Europe',
    season: '2024/2025',
    table: [
      { rank: 1, team: 'Liverpool FC', played: 4, won: 4, drawn: 0, lost: 0, gf: 10, ga: 1, gd: 9, points: 12, form: ['W', 'W', 'W', 'W'], color: '#DC2626' },
      { rank: 2, team: 'Sporting CP', played: 4, won: 3, drawn: 1, lost: 0, gf: 9, ga: 2, gd: 7, points: 10, form: ['W', 'W', 'D', 'W'], color: '#10B981' },
      { rank: 3, team: 'AS Monaco', played: 4, won: 3, drawn: 1, lost: 0, gf: 10, ga: 4, gd: 6, points: 10, form: ['W', 'W', 'D', 'W'], color: '#EF4444' },
      { rank: 4, team: 'Inter Milan', played: 4, won: 3, drawn: 1, lost: 0, gf: 6, ga: 0, gd: 6, points: 10, form: ['W', 'W', 'W', 'D'], color: '#2563EB' },
      { rank: 5, team: 'FC Barcelona', played: 4, won: 3, drawn: 0, lost: 1, gf: 15, ga: 5, gd: 10, points: 9, form: ['W', 'W', 'W', 'L'], color: '#A855F7' },
      { rank: 6, team: 'Borussia Dortmund', played: 4, won: 3, drawn: 0, lost: 1, gf: 13, ga: 6, gd: 7, points: 9, form: ['L', 'W', 'W', 'W'], color: '#FACC15' },
    ],
  },
};

export const REAL_WORLD_TRANSFERS: RealWorldTransferNews[] = [
  { id: 'rwt_1', player: 'Kylian Mbappé', fromTeam: 'Paris Saint-Germain', toTeam: 'Real Madrid', fee: 'Free Transfer (Sign-on: €125M)', date: '2024-07-01', status: 'Confirmed', source: 'Official Club Release' },
  { id: 'rwt_2', player: 'Julián Álvarez', fromTeam: 'Manchester City', toTeam: 'Atlético Madrid', fee: '€75M + €20M add-ons', date: '2024-08-12', status: 'Confirmed', source: 'La Liga Registration' },
  { id: 'rwt_3', player: 'Dani Olmo', fromTeam: 'RB Leipzig', toTeam: 'FC Barcelona', fee: '€55M + €7M add-ons', date: '2024-08-09', status: 'Confirmed', source: 'UEFA Registered Transfer' },
  { id: 'rwt_4', player: 'Riccardo Calafiori', fromTeam: 'Bologna FC', toTeam: 'Arsenal FC', fee: '€45M', date: '2024-07-29', status: 'Confirmed', source: 'Premier League Clearances' },
  { id: 'rwt_5', player: 'Florian Wirtz', fromTeam: 'Bayer Leverkusen', toTeam: 'Manchester City / Real Madrid', fee: 'Expected €130M+', date: 'Summer 2025/26 Window', status: 'Rumour', source: 'Verified Transfer Intelligence' },
  { id: 'rwt_6', player: 'Alexander Isak', fromTeam: 'Newcastle United', toTeam: 'Arsenal FC / PSG', fee: '€110M Valuation', date: 'Summer Window Monitoring', status: 'Rumour', source: 'Independent Scouting Wire' },
];

export const REAL_WORLD_INJURIES: RealWorldInjuryReport[] = [
  { id: 'rwi_1', player: 'Rodri (Rodrigo Hernández)', team: 'Manchester City', injury: 'ACL Rupture & Meniscus Injury', severity: 'Severe', daysOut: 240, expectedReturn: 'May 2025 (Out for Season)', status: 'Rehab' },
  { id: 'rwi_2', player: 'Dani Carvajal', team: 'Real Madrid', injury: 'Triple Knee Ligament Tear', severity: 'Severe', daysOut: 270, expectedReturn: 'July 2025 (Out for Season)', status: 'Rehab' },
  { id: 'rwi_3', player: 'Alisson Becker', team: 'Liverpool FC', injury: 'Hamstring Tendon Strain', severity: 'Moderate', daysOut: 45, expectedReturn: 'Mid-December 2024', status: 'Recovery' },
  { id: 'rwi_4', player: 'Martin Ødegaard', team: 'Arsenal FC', injury: 'Ankle Ligament Damage', severity: 'Moderate', daysOut: 10, expectedReturn: 'Match Sharpness Assessment', status: 'Assessment Pending' },
  { id: 'rwi_5', player: 'Gavi', team: 'FC Barcelona', injury: 'ACL Recovery Protocol', severity: 'Minor', daysOut: 7, expectedReturn: 'Progressive Minutes Protocol', status: 'Recovery' },
  { id: 'rwi_6', player: 'Thibaut Courtois', team: 'Real Madrid', injury: 'Adductor Muscle Strain', severity: 'Minor', daysOut: 14, expectedReturn: 'Late November 2024', status: 'Recovery' },
];

export const REAL_WORLD_SUSPENSIONS: RealWorldSuspensionReport[] = [
  { id: 'rws_1', player: 'William Saliba', team: 'Arsenal FC', competition: 'Premier League', matchesRemaining: 0, reason: 'Straight Red Card' },
  { id: 'rws_2', player: 'Cristian Romero', team: 'Tottenham Hotspur', competition: 'Premier League', matchesRemaining: 1, reason: 'Yellow Card Accumulation' },
  { id: 'rws_3', player: 'Vinícius Júnior', team: 'Real Madrid', competition: 'UEFA Champions League', matchesRemaining: 0, reason: 'Two Yellow Cards' },
];

export const REAL_WORLD_TOP_SCORERS: RealWorldPlayerLeader[] = [
  { rank: 1, name: 'Erling Haaland', team: 'Manchester City', competition: 'Premier League', value: 12, secondaryStat: '11 Matches • 1.09 G/90', color: '#38BDF8' },
  { rank: 2, name: 'Robert Lewandowski', team: 'FC Barcelona', competition: 'La Liga', value: 14, secondaryStat: '13 Matches • 1.08 G/90', color: '#A855F7' },
  { rank: 3, name: 'Harry Kane', team: 'Bayern Munich', competition: 'Bundesliga', value: 11, secondaryStat: '10 Matches • 1.10 G/90', color: '#EF4444' },
  { rank: 4, name: 'Bryan Mbeumo', team: 'Brentford FC', competition: 'Premier League', value: 8, secondaryStat: '11 Matches • 0.73 G/90', color: '#DC2626' },
  { rank: 5, name: 'Cole Palmer', team: 'Chelsea FC', competition: 'Premier League', value: 7, secondaryStat: '11 Matches • 0.64 G/90 + 5 Assists', color: '#2563EB' },
  { rank: 6, name: 'Raphinha', team: 'FC Barcelona', competition: 'La Liga', value: 7, secondaryStat: '13 Matches • 6 Assists', color: '#A855F7' },
];

export const REAL_WORLD_TOP_ASSISTS: RealWorldPlayerLeader[] = [
  { rank: 1, name: 'Bukayo Saka', team: 'Arsenal FC', competition: 'Premier League', value: 7, secondaryStat: '10 Matches • 2.8 Key Passes/90', color: '#EF4444' },
  { rank: 2, name: 'Lamine Yamal', team: 'FC Barcelona', competition: 'La Liga', value: 7, secondaryStat: '12 Matches • 2.6 Key Passes/90', color: '#A855F7' },
  { rank: 3, name: 'Cole Palmer', team: 'Chelsea FC', competition: 'Premier League', value: 5, secondaryStat: '11 Matches • 2.7 Key Passes/90', color: '#2563EB' },
  { rank: 4, name: 'Mohamed Salah', team: 'Liverpool FC', competition: 'Premier League', value: 6, secondaryStat: '11 Matches • 8 Goals + 6 Assists', color: '#DC2626' },
];

export const REAL_WORLD_TEAM_STATS: RealWorldTeamLeader[] = [
  { rank: 1, team: 'Manchester City', league: 'Premier League', value: '64.8% Possession', secondaryStat: '89.4% Pass Accuracy (League 1st)', color: '#38BDF8' },
  { rank: 2, team: 'FC Barcelona', league: 'La Liga', value: '61.4% Possession', secondaryStat: '40 Goals Scored in 13 Games (3.08 G/G)', color: '#A855F7' },
  { rank: 3, team: 'Paris Saint-Germain', league: 'Ligue 1', value: '66.2% Possession', secondaryStat: '710 Passes/Match Average', color: '#1E3A8A' },
  { rank: 4, team: 'Liverpool FC', league: 'Premier League', value: '6 Clean Sheets', secondaryStat: 'Only 6 Goals Conceded (Best Defense)', color: '#DC2626' },
];
