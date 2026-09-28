import { CareerState, Competition, LeagueTableRow, MatchFixture, Player } from '../types/football';
import { simulateFullMatch } from './matchEngine';

export function advanceDay(state: CareerState): CareerState {
  const nextDate = new Date(state.currentDate);
  nextDate.setDate(nextDate.getDate() + 1);
  const nextDateStr = nextDate.toISOString().split('T')[0];

  const updatedPlayers = { ...state.players };
  const updatedCompetitions = { ...state.competitions };
  const updatedInbox = [...state.inbox];
  const updatedNews = [...state.news];
  const updatedAchievements = [...state.achievements];
  const updatedClubs = { ...state.clubs };

  // 1. Recover player fitness and heal injuries
  Object.keys(updatedPlayers).forEach((pId) => {
    const p = { ...updatedPlayers[pId] };

    // Condition recovery
    if (p.condition < 100) {
      p.condition = Math.min(100, p.condition + 4);
    }

    // Injury recovery
    if (p.injury) {
      p.injury = { ...p.injury, daysRemaining: p.injury.daysRemaining - 1 };
      if (p.injury.daysRemaining <= 0) {
        delete p.injury;
        if (p.clubId === state.userClubId) {
          updatedInbox.unshift({
            id: 'inbox_inj_rec_' + Date.now() + '_' + p.id,
            date: nextDateStr,
            sender: 'Dr. Elena Rostova',
            senderRole: 'Chief Physio',
            subject: `Medical Update: ${p.name} Returns to Full Training`,
            body: `${p.name} has completed their rehabilitation program and is passed 100% fit for upcoming match selections.`,
            category: 'Injury',
            read: false,
          });
        }
      }
    }

    // Natural youth development & aging progression (Section 6)
    if (Math.random() < 0.05) {
      if (p.age < 23 && p.currentAbility < p.potentialAbility) {
        p.currentAbility = Math.min(p.potentialAbility, p.currentAbility + 1);
      } else if (p.age > 33 && p.currentAbility > 65) {
        p.currentAbility = Math.max(65, p.currentAbility - 1);
      }
    }

    updatedPlayers[pId] = p;
  });

  // 2. Check for AI vs AI fixtures occurring on nextDate
  Object.keys(updatedCompetitions).forEach((compId) => {
    const comp = { ...updatedCompetitions[compId] };
    const fixturesToSimulate = comp.fixtures.filter(
      (f) => f.date === nextDateStr && !f.played && f.homeClubId !== state.userClubId && f.awayClubId !== state.userClubId
    );

    fixturesToSimulate.forEach((fixture) => {
      const homeClub = updatedClubs[fixture.homeClubId];
      const awayClub = updatedClubs[fixture.awayClubId];
      if (!homeClub || !awayClub) return;

      const homePlayers = Object.values(updatedPlayers).filter((p) => p.clubId === homeClub.id);
      const awayPlayers = Object.values(updatedPlayers).filter((p) => p.clubId === awayClub.id);

      const simResult = simulateFullMatch(fixture, homeClub, awayClub, homePlayers, awayPlayers);
      fixture.played = true;
      fixture.homeScore = simResult.homeScore;
      fixture.awayScore = simResult.awayScore;
      fixture.stats = simResult.stats;
      fixture.events = simResult.events;
      fixture.playerRatings = simResult.playerRatings;

      // Update league table
      if (comp.table) {
        updateTableForMatch(comp.table, fixture.homeClubId, fixture.awayClubId, simResult.homeScore, simResult.awayScore);
      }
    });

    updatedCompetitions[compId] = comp;
  });

  // 3. Dynamic Events Engine: AI Transfer Rumors & Bids (Sections 36, 52)
  if (Math.random() < 0.15) {
    const targetPlayer = Object.values(updatedPlayers).find((p) => p.currentAbility >= 84 && Math.random() < 0.1);
    if (targetPlayer) {
      const buyerClubs = Object.values(updatedClubs).filter((c) => c.id !== targetPlayer.clubId);
      const randomBuyer = buyerClubs[Math.floor(Math.random() * buyerClubs.length)];
      if (randomBuyer) {
        updatedNews.unshift({
          id: 'news_rumor_' + Date.now(),
          date: nextDateStr,
          headline: `Transfer Buzz: ${randomBuyer.name} Preparing €${Math.round(targetPlayer.marketValue * 1.1 / 1000000)}M Swoop for ${targetPlayer.name}`,
          content: `Reports emerging from the continent suggest that ${randomBuyer.name} are closely monitoring ${targetPlayer.name}'s contractual situation ahead of the transfer deadline.`,
          category: 'Rumor',
          relatedClubId: randomBuyer.id,
          relatedPlayerId: targetPlayer.id,
        });
      }
    }
  }

  // 4. Monthly Finances check on day 1 of month
  const prevDate = new Date(state.currentDate);
  if (nextDate.getMonth() !== prevDate.getMonth()) {
    const userClub = { ...updatedClubs[state.userClubId] };
    const monthlyIncome = Math.round(userClub.stadiumCapacity * userClub.ticketPrice * 2.2 + 8500000);
    const monthlyWages = userClub.wageBudgetWeekly * 4.3;
    const monthlyMaintenance = 1200000;
    const net = monthlyIncome - (monthlyWages + monthlyMaintenance);

    userClub.currentBalance += net;
    updatedClubs[state.userClubId] = userClub;

    state.financesHistory.unshift({
      month: `${nextDate.toLocaleString('default', { month: 'short' })} ${nextDate.getFullYear()}`,
      income: monthlyIncome,
      expenses: Math.round(monthlyWages + monthlyMaintenance),
      net,
    });

    updatedInbox.unshift({
      id: 'inbox_fin_' + Date.now(),
      date: nextDateStr,
      sender: 'Finance Department',
      senderRole: 'Chief Financial Officer',
      subject: `Monthly Financial Statement: ${net >= 0 ? 'Surplus' : 'Deficit'} of €${Math.abs(Math.round(net / 1000000))}M`,
      body: `Monthly broadcast rights and ticket receipts have been settled. Our total club balance currently stands at €${Math.round(userClub.currentBalance / 1000000)}M.`,
      category: 'Board',
      read: false,
    });
  }

  return {
    ...state,
    currentDate: nextDateStr,
    players: updatedPlayers,
    competitions: updatedCompetitions,
    clubs: updatedClubs,
    inbox: updatedInbox,
    news: updatedNews,
    achievements: updatedAchievements,
  };
}

export function updateTableForMatch(
  table: LeagueTableRow[],
  homeClubId: string,
  awayClubId: string,
  homeScore: number,
  awayScore: number
): void {
  const homeRow = table.find((r) => r.clubId === homeClubId);
  const awayRow = table.find((r) => r.clubId === awayClubId);
  if (!homeRow || !awayRow) return;

  homeRow.played += 1;
  awayRow.played += 1;
  homeRow.goalsFor += homeScore;
  homeRow.goalsAgainst += awayScore;
  homeRow.goalDifference = homeRow.goalsFor - homeRow.goalsAgainst;

  awayRow.goalsFor += awayScore;
  awayRow.goalsAgainst += homeScore;
  awayRow.goalDifference = awayRow.goalsFor - awayRow.goalsAgainst;

  if (homeScore > awayScore) {
    homeRow.won += 1;
    homeRow.points += 3;
    homeRow.form = (['W', ...homeRow.form].slice(0, 5)) as ('W' | 'D' | 'L')[];

    awayRow.lost += 1;
    awayRow.form = (['L', ...awayRow.form].slice(0, 5)) as ('W' | 'D' | 'L')[];
  } else if (homeScore < awayScore) {
    awayRow.won += 1;
    awayRow.points += 3;
    awayRow.form = (['W', ...awayRow.form].slice(0, 5)) as ('W' | 'D' | 'L')[];

    homeRow.lost += 1;
    homeRow.form = (['L', ...homeRow.form].slice(0, 5)) as ('W' | 'D' | 'L')[];
  } else {
    homeRow.drawn += 1;
    homeRow.points += 1;
    homeRow.form = (['D', ...homeRow.form].slice(0, 5)) as ('W' | 'D' | 'L')[];

    awayRow.drawn += 1;
    awayRow.points += 1;
    awayRow.form = (['D', ...awayRow.form].slice(0, 5)) as ('W' | 'D' | 'L')[];
  }

  // Sort table: points DESC, goalDifference DESC, goalsFor DESC
  table.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
}
