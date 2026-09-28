import { HistoricalSeason } from '../types/football';

export const HISTORICAL_SEASONS_ARCHIVE: HistoricalSeason[] = [
  {
    year: 2000,
    seasonLabel: '2000/01 — The Millennium Dawn',
    generation: '2000s Generation',
    summary: 'Real Madrid won the Champions League led by Raúl and Redondo. Manchester United captured the Premier League under Sir Alex Ferguson, while AS Roma claimed the Scudetto led by Francesco Totti.',
    champions: [
      { competition: 'Premier League', winner: 'Manchester United', runnerUp: 'Arsenal FC' },
      { competition: 'La Liga', winner: 'Real Madrid', runnerUp: 'Deportivo La Coruña' },
      { competition: 'Serie A', winner: 'AS Roma', runnerUp: 'Juventus FC' },
      { competition: 'UEFA Champions League', winner: 'Bayern Munich', runnerUp: 'Valencia CF' },
    ],
    topScorers: [
      { name: 'Jimmy Floyd Hasselbaink', club: 'Chelsea FC', goals: 23 },
      { name: 'Raúl González', club: 'Real Madrid', goals: 24 },
      { name: 'Hernán Crespo', club: 'SS Lazio', goals: 26 },
    ],
    ballonDorWinner: { name: 'Luís Figo', club: 'Real Madrid / Barcelona', nationality: 'Portugal' },
    recordTransfer: { player: 'Luís Figo', from: 'FC Barcelona', to: 'Real Madrid', fee: '€62.0M (World Record)' },
    keyClubs: [
      { name: 'Manchester United', manager: 'Sir Alex Ferguson', starPlayer: 'David Beckham', reputation: 96 },
      { name: 'Real Madrid', manager: 'Vicente del Bosque', starPlayer: 'Raúl', reputation: 95 },
      { name: 'Arsenal FC', manager: 'Arsène Wenger', starPlayer: 'Thierry Henry', reputation: 92 },
      { name: 'Juventus FC', manager: 'Carlo Ancelotti', starPlayer: 'Zinedine Zidane', reputation: 94 },
    ],
  },
  {
    year: 2004,
    seasonLabel: '2004/05 — The Invincibles & Mourinho Arrival',
    generation: '2000s Generation',
    summary: 'Arsène Wenger’s Arsenal completed the legendary unbeaten 49-game run. Jose Mourinho arrived at Chelsea claiming the Premier League with a record 15 goals conceded. Liverpool pulled off the Miracle of Istanbul.',
    champions: [
      { competition: 'Premier League', winner: 'Chelsea FC', runnerUp: 'Arsenal FC' },
      { competition: 'La Liga', winner: 'FC Barcelona', runnerUp: 'Real Madrid' },
      { competition: 'Serie A', winner: 'Juventus FC', runnerUp: 'AC Milan' },
      { competition: 'UEFA Champions League', winner: 'Liverpool FC', runnerUp: 'AC Milan' },
    ],
    topScorers: [
      { name: 'Thierry Henry', club: 'Arsenal FC', goals: 25 },
      { name: 'Diego Forlán', club: 'Villarreal CF', goals: 25 },
      { name: 'Cristiano Lucarelli', club: 'Livorno', goals: 24 },
    ],
    ballonDorWinner: { name: 'Andriy Shevchenko', club: 'AC Milan', nationality: 'Ukraine' },
    recordTransfer: { player: 'Wayne Rooney', from: 'Everton FC', to: 'Manchester United', fee: '€37.0M' },
    keyClubs: [
      { name: 'Chelsea FC', manager: 'José Mourinho', starPlayer: 'Frank Lampard', reputation: 94 },
      { name: 'Arsenal FC', manager: 'Arsène Wenger', starPlayer: 'Thierry Henry', reputation: 95 },
      { name: 'FC Barcelona', manager: 'Frank Rijkaard', starPlayer: 'Ronaldinho', reputation: 95 },
      { name: 'AC Milan', manager: 'Carlo Ancelotti', starPlayer: 'Kaka', reputation: 96 },
    ],
  },
  {
    year: 2008,
    seasonLabel: '2008/09 — Pep Guardiola Sextuple & Ronaldo Ballon d’Or',
    generation: '2000s Generation',
    summary: 'Pep Guardiola took charge of FC Barcelona and pioneered modern tiki-taka, winning an unprecedented sextuple. Cristiano Ronaldo inspired Manchester United to domestic dominance and Champions League glory.',
    champions: [
      { competition: 'Premier League', winner: 'Manchester United', runnerUp: 'Liverpool FC' },
      { competition: 'La Liga', winner: 'FC Barcelona', runnerUp: 'Real Madrid' },
      { competition: 'Serie A', winner: 'Inter Milan', runnerUp: 'Juventus FC' },
      { competition: 'UEFA Champions League', winner: 'FC Barcelona', runnerUp: 'Manchester United' },
    ],
    topScorers: [
      { name: 'Nicolas Anelka', club: 'Chelsea FC', goals: 19 },
      { name: 'Diego Forlán', club: 'Atlético Madrid', goals: 32 },
      { name: 'Samuel Eto’o', club: 'FC Barcelona', goals: 30 },
    ],
    ballonDorWinner: { name: 'Cristiano Ronaldo', club: 'Manchester United', nationality: 'Portugal' },
    recordTransfer: { player: 'Robinho', from: 'Real Madrid', to: 'Manchester City', fee: '€43.0M' },
    keyClubs: [
      { name: 'FC Barcelona', manager: 'Pep Guardiola', starPlayer: 'Lionel Messi', reputation: 98 },
      { name: 'Manchester United', manager: 'Sir Alex Ferguson', starPlayer: 'Cristiano Ronaldo', reputation: 97 },
      { name: 'Chelsea FC', manager: 'Guus Hiddink', starPlayer: 'Didier Drogba', reputation: 93 },
      { name: 'Liverpool FC', manager: 'Rafael Benítez', starPlayer: 'Steven Gerrard', reputation: 93 },
    ],
  },
  {
    year: 2011,
    seasonLabel: '2011/12 — The 93:20 Aguero Drama & Messi 73 Goals',
    generation: '2010s Generation',
    summary: 'Sergio Agüero scored in the 93:20 minute to win Manchester City’s first title in 44 years. Lionel Messi scored an unbelievable 73 goals across all competitions. Chelsea stunned Bayern Munich at the Allianz Arena.',
    champions: [
      { competition: 'Premier League', winner: 'Manchester City', runnerUp: 'Manchester United' },
      { competition: 'La Liga', winner: 'Real Madrid (100 pts)', runnerUp: 'FC Barcelona' },
      { competition: 'Bundesliga', winner: 'Borussia Dortmund', runnerUp: 'Bayern Munich' },
      { competition: 'UEFA Champions League', winner: 'Chelsea FC', runnerUp: 'Bayern Munich' },
    ],
    topScorers: [
      { name: 'Robin van Persie', club: 'Arsenal FC', goals: 30 },
      { name: 'Lionel Messi', club: 'FC Barcelona', goals: 50 },
      { name: 'Cristiano Ronaldo', club: 'Real Madrid', goals: 46 },
    ],
    ballonDorWinner: { name: 'Lionel Messi', club: 'FC Barcelona', nationality: 'Argentina' },
    recordTransfer: { player: 'Javier Pastore', from: 'Palermo', to: 'Paris Saint-Germain', fee: '€42.0M' },
    keyClubs: [
      { name: 'FC Barcelona', manager: 'Pep Guardiola', starPlayer: 'Lionel Messi', reputation: 98 },
      { name: 'Real Madrid', manager: 'José Mourinho', starPlayer: 'Cristiano Ronaldo', reputation: 97 },
      { name: 'Manchester City', manager: 'Roberto Mancini', starPlayer: 'Sergio Agüero', reputation: 93 },
      { name: 'Borussia Dortmund', manager: 'Jürgen Klopp', starPlayer: 'Robert Lewandowski', reputation: 91 },
    ],
  },
  {
    year: 2015,
    seasonLabel: '2015/16 — The Leicester City 5000-1 Miracle',
    generation: '2010s Generation',
    summary: 'Claudio Ranieri’s Leicester City shocked the sports universe by winning the Premier League at 5000-1 odds. Real Madrid won the first of their three consecutive Champions Leagues under Zinedine Zidane.',
    champions: [
      { competition: 'Premier League', winner: 'Leicester City', runnerUp: 'Arsenal FC' },
      { competition: 'La Liga', winner: 'FC Barcelona', runnerUp: 'Real Madrid' },
      { competition: 'Serie A', winner: 'Juventus FC', runnerUp: 'SSC Napoli' },
      { competition: 'UEFA Champions League', winner: 'Real Madrid', runnerUp: 'Atlético Madrid' },
    ],
    topScorers: [
      { name: 'Harry Kane', club: 'Tottenham Hotspur', goals: 25 },
      { name: 'Luis Suárez', club: 'FC Barcelona', goals: 40 },
      { name: 'Gonzalo Higuaín', club: 'SSC Napoli', goals: 36 },
    ],
    ballonDorWinner: { name: 'Cristiano Ronaldo', club: 'Real Madrid', nationality: 'Portugal' },
    recordTransfer: { player: 'Kevin De Bruyne', from: 'VfL Wolfsburg', to: 'Manchester City', fee: '€76.0M' },
    keyClubs: [
      { name: 'Leicester City', manager: 'Claudio Ranieri', starPlayer: 'Jamie Vardy', reputation: 88 },
      { name: 'Real Madrid', manager: 'Zinedine Zidane', starPlayer: 'Cristiano Ronaldo', reputation: 98 },
      { name: 'FC Barcelona', manager: 'Luis Enrique', starPlayer: 'MSN Trio', reputation: 98 },
      { name: 'Bayern Munich', manager: 'Pep Guardiola', starPlayer: 'Robert Lewandowski', reputation: 96 },
    ],
  },
  {
    year: 2018,
    seasonLabel: '2018/19 — Klopp’s European Glory & 98-Point Title Race',
    generation: '2010s Generation',
    summary: 'Manchester City and Liverpool engaged in the highest-quality title race in English history, finishing on 98 and 97 points respectively. Jürgen Klopp’s Reds conquered Europe with the famous 4-0 comeback against Barcelona.',
    champions: [
      { competition: 'Premier League', winner: 'Manchester City (98 pts)', runnerUp: 'Liverpool FC (97 pts)' },
      { competition: 'La Liga', winner: 'FC Barcelona', runnerUp: 'Atlético Madrid' },
      { competition: 'Serie A', winner: 'Juventus FC', runnerUp: 'SSC Napoli' },
      { competition: 'UEFA Champions League', winner: 'Liverpool FC', runnerUp: 'Tottenham Hotspur' },
    ],
    topScorers: [
      { name: 'Mohamed Salah', club: 'Liverpool FC', goals: 22 },
      { name: 'Sadio Mané', club: 'Liverpool FC', goals: 22 },
      { name: 'Pierre-Emerick Aubameyang', club: 'Arsenal FC', goals: 22 },
    ],
    ballonDorWinner: { name: 'Luka Modrić', club: 'Real Madrid', nationality: 'Croatia' },
    recordTransfer: { player: 'Kylian Mbappé', from: 'AS Monaco', to: 'PSG', fee: '€180.0M' },
    keyClubs: [
      { name: 'Manchester City', manager: 'Pep Guardiola', starPlayer: 'Bernardo Silva', reputation: 97 },
      { name: 'Liverpool FC', manager: 'Jürgen Klopp', starPlayer: 'Virgil van Dijk', reputation: 97 },
      { name: 'Ajax Amsterdam', manager: 'Erik ten Hag', starPlayer: 'Frenkie de Jong', reputation: 92 },
      { name: 'FC Barcelona', manager: 'Ernesto Valverde', starPlayer: 'Lionel Messi', reputation: 96 },
    ],
  },
  {
    year: 2020,
    seasonLabel: '2020/21 — The Pandemic Season & Chelsea European Triumph',
    generation: '2020s Generation',
    summary: 'Matches were held in empty stadiums with intense congested schedules. Manchester City won the Premier League, Atletico Madrid won La Liga, and Thomas Tuchel guided Chelsea to Champions League victory over Man City in Porto.',
    champions: [
      { competition: 'Premier League', winner: 'Manchester City', runnerUp: 'Manchester United' },
      { competition: 'La Liga', winner: 'Atlético Madrid', runnerUp: 'Real Madrid' },
      { competition: 'Serie A', winner: 'Inter Milan', runnerUp: 'AC Milan' },
      { competition: 'UEFA Champions League', winner: 'Chelsea FC', runnerUp: 'Manchester City' },
    ],
    topScorers: [
      { name: 'Harry Kane', club: 'Tottenham Hotspur', goals: 23 },
      { name: 'Lionel Messi', club: 'FC Barcelona', goals: 30 },
      { name: 'Robert Lewandowski', club: 'Bayern Munich', goals: 41 },
    ],
    ballonDorWinner: { name: 'Robert Lewandowski (FIFA The Best)', club: 'Bayern Munich', nationality: 'Poland' },
    recordTransfer: { player: 'Kai Havertz', from: 'Bayer Leverkusen', to: 'Chelsea FC', fee: '€80.0M' },
    keyClubs: [
      { name: 'Manchester City', manager: 'Pep Guardiola', starPlayer: 'Kevin De Bruyne', reputation: 97 },
      { name: 'Bayern Munich', manager: 'Hansi Flick', starPlayer: 'Robert Lewandowski', reputation: 98 },
      { name: 'Chelsea FC', manager: 'Thomas Tuchel', starPlayer: 'N’Golo Kanté', reputation: 94 },
    ],
  },
  {
    year: 2022,
    seasonLabel: '2022/23 — The Treble & Messi World Cup Glory',
    generation: '2020s Generation',
    summary: 'Pep Guardiola’s Manchester City completed the historic European Treble powered by Erling Haaland’s 52 goals. Lionel Messi led Argentina to World Cup immortality in Qatar.',
    champions: [
      { competition: 'Premier League', winner: 'Manchester City', runnerUp: 'Arsenal FC' },
      { competition: 'La Liga', winner: 'FC Barcelona', runnerUp: 'Real Madrid' },
      { competition: 'Serie A', winner: 'SSC Napoli', runnerUp: 'SS Lazio' },
      { competition: 'UEFA Champions League', winner: 'Manchester City', runnerUp: 'Inter Milan' },
    ],
    topScorers: [
      { name: 'Erling Haaland', club: 'Manchester City', goals: 36 },
      { name: 'Harry Kane', club: 'Tottenham Hotspur', goals: 30 },
      { name: 'Victor Osimhen', club: 'SSC Napoli', goals: 26 },
    ],
    ballonDorWinner: { name: 'Lionel Messi', club: 'PSG / Inter Miami', nationality: 'Argentina' },
    recordTransfer: { player: 'Enzo Fernández', from: 'Benfica', to: 'Chelsea FC', fee: '€121.0M' },
    keyClubs: [
      { name: 'Manchester City', manager: 'Pep Guardiola', starPlayer: 'Erling Haaland', reputation: 99 },
      { name: 'Arsenal FC', manager: 'Mikel Arteta', starPlayer: 'Martin Ødegaard', reputation: 94 },
      { name: 'SSC Napoli', manager: 'Luciano Spalletti', starPlayer: 'Khvicha Kvaratskhelia', reputation: 93 },
      { name: 'Real Madrid', manager: 'Carlo Ancelotti', starPlayer: 'Vinícius Júnior', reputation: 98 },
    ],
  },
  {
    year: 2024,
    seasonLabel: '2024/25 — Leverkusen Invincible & Real Madrid 15th UCL',
    generation: '2020s Generation',
    summary: 'Xabi Alonso guided Bayer Leverkusen to an unbeaten domestic double. Carlo Ancelotti and Real Madrid captured their 15th European Cup at Wembley, while Manchester City won an unprecedented fourth consecutive Premier League title.',
    champions: [
      { competition: 'Premier League', winner: 'Manchester City', runnerUp: 'Arsenal FC' },
      { competition: 'La Liga', winner: 'Real Madrid', runnerUp: 'FC Barcelona' },
      { competition: 'Bundesliga', winner: 'Bayer Leverkusen (Unbeaten)', runnerUp: 'VfB Stuttgart' },
      { competition: 'UEFA Champions League', winner: 'Real Madrid', runnerUp: 'Borussia Dortmund' },
    ],
    topScorers: [
      { name: 'Erling Haaland', club: 'Manchester City', goals: 27 },
      { name: 'Harry Kane', club: 'Bayern Munich', goals: 36 },
      { name: 'Artem Dovbyk', club: 'Girona FC', goals: 24 },
    ],
    ballonDorWinner: { name: 'Rodri', club: 'Manchester City', nationality: 'Spain' },
    recordTransfer: { player: 'Julián Álvarez', from: 'Manchester City', to: 'Atlético Madrid', fee: '€95.0M' },
    keyClubs: [
      { name: 'Real Madrid', manager: 'Carlo Ancelotti', starPlayer: 'Vinícius Júnior', reputation: 99 },
      { name: 'Bayer Leverkusen', manager: 'Xabi Alonso', starPlayer: 'Florian Wirtz', reputation: 95 },
      { name: 'Manchester City', manager: 'Pep Guardiola', starPlayer: 'Rodri', reputation: 99 },
      { name: 'Arsenal FC', manager: 'Mikel Arteta', starPlayer: 'Bukayo Saka', reputation: 95 },
    ],
  },
  {
    year: 2025,
    seasonLabel: '2025/26 — Modern Super-Leagues & New UCL Format',
    generation: '2020s Generation',
    summary: 'The revolutionary 36-team single league phase in the UEFA Champions League. Kylian Mbappé leads Real Madrid’s new Galácticos while Mikel Arteta’s Arsenal and Arne Slot’s Liverpool battle for the Premier League crown.',
    champions: [
      { competition: 'Premier League', winner: 'Liverpool FC / Arsenal FC', runnerUp: 'Manchester City' },
      { competition: 'La Liga', winner: 'FC Barcelona', runnerUp: 'Real Madrid' },
      { competition: 'Bundesliga', winner: 'Bayern Munich', runnerUp: 'Bayer Leverkusen' },
      { competition: 'UEFA Champions League', winner: 'Real Madrid', runnerUp: 'Arsenal FC' },
    ],
    topScorers: [
      { name: 'Erling Haaland', club: 'Manchester City', goals: 29 },
      { name: 'Kylian Mbappé', club: 'Real Madrid', goals: 31 },
      { name: 'Robert Lewandowski', club: 'FC Barcelona', goals: 25 },
    ],
    ballonDorWinner: { name: 'Vinícius Júnior / Rodri', club: 'European Superstars', nationality: 'International' },
    recordTransfer: { player: 'Florian Wirtz', from: 'Bayer Leverkusen', to: 'European Giant', fee: '€135.0M' },
    keyClubs: [
      { name: 'Real Madrid', manager: 'Carlo Ancelotti', starPlayer: 'Kylian Mbappé', reputation: 99 },
      { name: 'Manchester City', manager: 'Pep Guardiola', starPlayer: 'Erling Haaland', reputation: 99 },
      { name: 'Arsenal FC', manager: 'Mikel Arteta', starPlayer: 'Bukayo Saka', reputation: 95 },
      { name: 'FC Barcelona', manager: 'Hansi Flick', starPlayer: 'Lamine Yamal', reputation: 96 },
    ],
  },
  {
    year: 2026,
    seasonLabel: '2026/27 — Next-Gen Horizons & World Cup Apex',
    generation: 'Future Generation',
    summary: 'The dawn of the 2026/27 campaign following the 48-team FIFA World Cup in North America. Tactical paradigms shift towards fluid pressing, hybrid inverted backs, and high-frequency athletic conditioning.',
    champions: [
      { competition: 'Premier League', winner: 'TBD (Current In-Game Season)', runnerUp: 'TBD' },
      { competition: 'La Liga', winner: 'TBD', runnerUp: 'TBD' },
      { competition: 'UEFA Champions League', winner: 'TBD', runnerUp: 'TBD' },
    ],
    topScorers: [
      { name: 'Lamine Yamal', club: 'FC Barcelona', goals: 16 },
      { name: 'Erling Haaland', club: 'Manchester City', goals: 22 },
    ],
    ballonDorWinner: { name: 'Next Global Prodigy', club: 'World Superstars', nationality: 'International' },
    recordTransfer: { player: 'Next Global Wonderkid', from: 'Academy Prodigy', to: 'European Giant', fee: '€140M+' },
    keyClubs: [
      { name: 'Real Madrid', manager: 'Carlo Ancelotti', starPlayer: 'Jude Bellingham', reputation: 99 },
      { name: 'Manchester City', manager: 'Pep Guardiola', starPlayer: 'Erling Haaland', reputation: 99 },
      { name: 'Arsenal FC', manager: 'Mikel Arteta', starPlayer: 'Bukayo Saka', reputation: 95 },
    ],
  },
];

/**
 * Architectural helper to dynamically generate future seasons (2027 onward)
 * allowing the user to progress endlessly without needing application rebuilds.
 */
export function generateFutureSeasonData(year: number): HistoricalSeason {
  const nextYear = (year + 1).toString().slice(-2);
  return {
    year,
    seasonLabel: `${year}/${nextYear} — Next-Gen Tactical Frontier`,
    generation: 'Future Generation',
    summary: `Simulation projected season for the ${year}/${nextYear} global campaign. Featuring next-generation academies, AI-driven tactical coaching models, and advanced biomechanical analytics.`,
    champions: [
      { competition: 'Premier League', winner: 'Elite Title Contender', runnerUp: 'Challenger FC' },
      { competition: 'La Liga', winner: 'Iberian Champions', runnerUp: 'Royal Contenders' },
      { competition: 'UEFA Champions League', winner: 'European Champions', runnerUp: 'Finalists' },
    ],
    topScorers: [
      { name: 'Prodigy Forward', club: 'Top Tier Club', goals: 24 + Math.floor(Math.random() * 8) },
      { name: 'Golden Boot Star', club: 'Continental Giant', goals: 22 + Math.floor(Math.random() * 6) },
    ],
    ballonDorWinner: { name: 'World Player of the Year', club: 'Continental Champions', nationality: 'Global' },
    recordTransfer: { player: 'Generational Talent', from: 'Emerging Giant', to: 'World Superclub', fee: `€${120 + (year - 2026) * 10}.0M` },
    keyClubs: [
      { name: 'Continental Kings', manager: 'Master Tactician', starPlayer: 'Franchise Wonderkid', reputation: 98 },
      { name: 'Dominant Dynamos', manager: 'Elite Head Coach', starPlayer: 'Dynamic Playmaker', reputation: 96 },
    ],
  };
}
