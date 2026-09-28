import { Club, MatchEvent, MatchFixture, MatchStats, Player, TeamTactics } from '../types/football';

export interface LiveMatchSnapshot {
  minute: number;
  period: '1st Half' | 'Half Time' | '2nd Half' | 'Full Time';
  homeScore: number;
  awayScore: number;
  stats: MatchStats;
  events: MatchEvent[];
  latestCommentary: string;
  momentumHome: number; // -100 to +100 (positive favors home, negative favors away)
  ballPosition: { x: number; y: number }; // 0-100 on pitch
  isHighlight: boolean;
  highlightText?: string;
  playerRatings: Record<string, number>;
  injuredPlayerIds: string[];
}

export function calculateTeamRatings(players: Player[], tactics?: TeamTactics) {
  if (!players || players.length === 0) {
    return { attack: 75, midfield: 75, defense: 75, gk: 75, stamina: 90 };
  }

  let totalAtt = 0;
  let totalMid = 0;
  let totalDef = 0;
  let gkRating = 75;
  let totalStamina = 0;

  players.forEach((p) => {
    const a = p.attributes;
    const condFactor = (p.condition || 90) / 100;

    if (p.position === 'GK') {
      gkRating = (a.reflexes * 0.3 + a.handling * 0.25 + a.oneOnOne * 0.25 + a.diving * 0.2) * condFactor;
    } else if (['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p.position)) {
      const defVal = (a.tackling * 0.3 + a.marking * 0.25 + a.heading * 0.2 + a.pace * 0.15 + a.positioning * 0.1) * condFactor;
      totalDef += defVal;
    } else if (['ST', 'CF'].includes(p.position)) {
      const attVal = (a.finishing * 0.35 + a.composure * 0.2 + a.pace * 0.2 + a.positioning * 0.15 + a.heading * 0.1) * condFactor;
      totalAtt += attVal;
    } else if (['LW', 'RW', 'LM', 'RM'].includes(p.position)) {
      const attVal = (a.dribbling * 0.3 + a.pace * 0.3 + a.crossing * 0.2 + a.finishing * 0.1 + a.passing * 0.1) * condFactor;
      totalAtt += attVal * 0.8;
      totalMid += attVal * 0.2;
    } else {
      // CDM, CM, CAM
      const midVal = (a.passing * 0.3 + a.vision * 0.25 + a.workRate * 0.15 + a.decisions * 0.15 + a.tackling * 0.15) * condFactor;
      totalMid += midVal;
    }
    totalStamina += p.condition;
  });

  return {
    attack: Math.max(50, Math.round(totalAtt || 75)),
    midfield: Math.max(50, Math.round(totalMid || 75)),
    defense: Math.max(50, Math.round(totalDef || 75)),
    gk: Math.max(50, Math.round(gkRating || 75)),
    stamina: Math.round(totalStamina / players.length),
  };
}

export function simulateFullMatch(
  fixture: MatchFixture,
  homeClub: Club,
  awayClub: Club,
  homePlayers: Player[],
  awayPlayers: Player[],
  homeTactics?: TeamTactics,
  awayTactics?: TeamTactics
): {
  homeScore: number;
  awayScore: number;
  stats: MatchStats;
  events: MatchEvent[];
  playerRatings: Record<string, number>;
} {
  const homeRatings = calculateTeamRatings(homePlayers, homeTactics);
  const awayRatings = calculateTeamRatings(awayPlayers, awayTactics);

  // Mentality modifiers
  const homeMentality = homeTactics?.mentality || 'Positive';
  const awayMentality = awayTactics?.mentality || 'Balanced';

  let homeAttMod = 1.0;
  let homeDefMod = 1.0;
  if (homeMentality === 'Very Attacking') {
    homeAttMod = 1.25;
    homeDefMod = 0.85;
  } else if (homeMentality === 'Attacking') {
    homeAttMod = 1.15;
    homeDefMod = 0.92;
  } else if (homeMentality === 'Defensive') {
    homeAttMod = 0.88;
    homeDefMod = 1.15;
  } else if (homeMentality === 'Very Defensive') {
    homeAttMod = 0.75;
    homeDefMod = 1.25;
  }

  // Home advantage
  const homeAdv = 1.05;

  const homeStrength = (homeRatings.midfield * 1.0 + homeRatings.attack * 1.1 * homeAttMod) * homeAdv;
  const awayStrength = awayRatings.midfield * 1.0 + awayRatings.attack * 1.1;

  const totalStrength = homeStrength + awayStrength;
  const possessionHome = Math.round(Math.min(75, Math.max(25, (homeStrength / totalStrength) * 100)));
  const possessionAway = 100 - possessionHome;

  const events: MatchEvent[] = [];
  const playerRatings: Record<string, number> = {};

  [...homePlayers, ...awayPlayers].forEach((p) => {
    playerRatings[p.id] = 6.4 + Math.round((Math.random() * 0.8 - 0.4) * 10) / 10;
  });

  let homeScore = 0;
  let awayScore = 0;
  let shotsHome = 0;
  let shotsAway = 0;
  let shotsOnTargetHome = 0;
  let shotsOnTargetAway = 0;
  let xGHome = 0;
  let xGAway = 0;
  let cornersHome = 0;
  let cornersAway = 0;
  let foulsHome = 0;
  let foulsAway = 0;
  let yellowCardsHome = 0;
  let yellowCardsAway = 0;
  let redCardsHome = 0;
  let redCardsAway = 0;
  let tacklesHome = 12 + Math.floor(Math.random() * 8);
  let tacklesAway = 12 + Math.floor(Math.random() * 8);

  const homeAttackers = homePlayers.filter((p) => ['ST', 'CF', 'LW', 'RW', 'CAM'].includes(p.position));
  const awayAttackers = awayPlayers.filter((p) => ['ST', 'CF', 'LW', 'RW', 'CAM'].includes(p.position));
  const homeMidfielders = homePlayers.filter((p) => ['CM', 'CDM', 'CAM'].includes(p.position));
  const awayMidfielders = awayPlayers.filter((p) => ['CM', 'CDM', 'CAM'].includes(p.position));
  const homeGK = homePlayers.find((p) => p.position === 'GK');
  const awayGK = awayPlayers.find((p) => p.position === 'GK');

  // Minute by minute probability checks
  for (let min = 1; min <= 90; min++) {
    // Chance generation
    const chanceRoll = Math.random();

    // Home chance
    if (chanceRoll < 0.12 * (possessionHome / 50)) {
      shotsHome++;
      cornersHome += Math.random() < 0.3 ? 1 : 0;
      const isDangerous = Math.random() < 0.55;
      const shotXg = isDangerous ? 0.25 + Math.random() * 0.4 : 0.04 + Math.random() * 0.12;
      xGHome += shotXg;

      const shooter = homeAttackers.length > 0 ? homeAttackers[Math.floor(Math.random() * homeAttackers.length)] : homePlayers[0];
      const assister = homeMidfielders.length > 0 ? homeMidfielders[Math.floor(Math.random() * homeMidfielders.length)] : undefined;

      if (isDangerous) {
        shotsOnTargetHome++;
        // Save vs Goal vs Woodwork check
        const finishRating = shooter?.attributes.finishing || 75;
        const gkReflexes = awayGK?.attributes.reflexes || 75;
        const goalProb = (finishRating / (finishRating + gkReflexes)) * 0.7;
        const shotOutcomeRoll = Math.random();

        if (shotOutcomeRoll < goalProb) {
          homeScore++;
          events.push({
            minute: min,
            type: 'Goal',
            clubId: homeClub.id,
            playerId: shooter?.id,
            assistPlayerId: assister?.id,
            description: `GOAL! ${shooter?.name} unleashes a devastating strike into the net! Assisted by ${assister?.name || 'quick teamwork'}.`,
          });
          if (shooter) playerRatings[shooter.id] = Math.min(10, (playerRatings[shooter.id] || 6.5) + 1.2);
          if (assister) playerRatings[assister.id] = Math.min(10, (playerRatings[assister.id] || 6.5) + 0.6);
        } else if (shotOutcomeRoll < goalProb + 0.08) {
          // Hits woodwork!
          events.push({
            minute: min,
            type: 'Woodwork',
            clubId: homeClub.id,
            playerId: shooter?.id,
            description: `Woodwork! Spectacular thunderbolt from ${shooter?.name} shakes the crossbar! So close!`,
          });
          if (shooter) playerRatings[shooter.id] = Math.min(10, (playerRatings[shooter.id] || 6.5) + 0.3);
        } else {
          events.push({
            minute: min,
            type: 'KeySave',
            clubId: awayClub.id,
            playerId: awayGK?.id,
            description: `Superb reflex save! ${awayGK?.name || 'The goalkeeper'} dives full stretch to deny ${shooter?.name}!`,
          });
          if (awayGK) playerRatings[awayGK.id] = Math.min(10, (playerRatings[awayGK.id] || 6.5) + 0.3);
        }
      } else {
        // Off-target or blocked shot highlight
        const missDescriptions = [
          `${shooter?.name} cuts inside with quick feet and curls a powerful shot just inches wide of the far post.`,
          `${shooter?.name} strikes cleanly on the half-volley from 20 yards, but it sails just over the crossbar.`,
          `${shooter?.name} rises above the defense for a header, directing it narrowly past the upright.`,
          `Ambitious long-range drive by ${shooter?.name} is bravely blocked away by the defense.`,
        ];
        events.push({
          minute: min,
          type: 'Shot',
          clubId: homeClub.id,
          playerId: shooter?.id,
          description: `Shot! ${missDescriptions[Math.floor(Math.random() * missDescriptions.length)]}`,
        });
      }
    }

    // Away chance
    if (chanceRoll > 0.88 * (50 / possessionAway)) {
      shotsAway++;
      cornersAway += Math.random() < 0.3 ? 1 : 0;
      const isDangerous = Math.random() < 0.52;
      const shotXg = isDangerous ? 0.22 + Math.random() * 0.38 : 0.03 + Math.random() * 0.11;
      xGAway += shotXg;

      const shooter = awayAttackers.length > 0 ? awayAttackers[Math.floor(Math.random() * awayAttackers.length)] : awayPlayers[0];
      const assister = awayMidfielders.length > 0 ? awayMidfielders[Math.floor(Math.random() * awayMidfielders.length)] : undefined;

      if (isDangerous) {
        shotsOnTargetAway++;
        const finishRating = shooter?.attributes.finishing || 75;
        const gkReflexes = homeGK?.attributes.reflexes || 75;
        const goalProb = (finishRating / (finishRating + gkReflexes)) * 0.68;
        const shotOutcomeRoll = Math.random();

        if (shotOutcomeRoll < goalProb) {
          awayScore++;
          events.push({
            minute: min,
            type: 'Goal',
            clubId: awayClub.id,
            playerId: shooter?.id,
            assistPlayerId: assister?.id,
            description: `GOAL! ${shooter?.name} breaks through the defensive line and calmly slots it home!`,
          });
          if (shooter) playerRatings[shooter.id] = Math.min(10, (playerRatings[shooter.id] || 6.5) + 1.2);
          if (assister) playerRatings[assister.id] = Math.min(10, (playerRatings[assister.id] || 6.5) + 0.6);
        } else if (shotOutcomeRoll < goalProb + 0.08) {
          events.push({
            minute: min,
            type: 'Woodwork',
            clubId: awayClub.id,
            playerId: shooter?.id,
            description: `Off the post! ${shooter?.name}'s low drilled effort bounces off the foot of the upright!`,
          });
          if (shooter) playerRatings[shooter.id] = Math.min(10, (playerRatings[shooter.id] || 6.5) + 0.3);
        } else {
          events.push({
            minute: min,
            type: 'KeySave',
            clubId: homeClub.id,
            playerId: homeGK?.id,
            description: `Vital intervention! ${homeGK?.name || 'The keeper'} tips ${shooter?.name}'s shot around the post!`,
          });
          if (homeGK) playerRatings[homeGK.id] = Math.min(10, (playerRatings[homeGK.id] || 6.5) + 0.3);
        }
      } else {
        const missDescriptions = [
          `${shooter?.name} finds space on the edge of the area and takes aim, but drags the shot wide.`,
          `Fierce strike by ${shooter?.name} from distance deflects off a defender and flies behind for a corner.`,
          `${shooter?.name} leaps for a contested header at the far post, sending it into the side netting.`,
        ];
        events.push({
          minute: min,
          type: 'Shot',
          clubId: awayClub.id,
          playerId: shooter?.id,
          description: `Shot! ${missDescriptions[Math.floor(Math.random() * missDescriptions.length)]}`,
        });
      }
    }

    // Foul & Card check
    if (Math.random() < 0.06) {
      const isHomeFoul = Math.random() < 0.5;
      if (isHomeFoul) {
        foulsHome++;
        const fouledPlayer = homePlayers[Math.floor(Math.random() * homePlayers.length)];
        const cardRoll = Math.random();

        if (cardRoll < 0.02) {
          // Straight Red Card
          redCardsHome++;
          events.push({
            minute: min,
            type: 'RedCard',
            clubId: homeClub.id,
            playerId: fouledPlayer?.id,
            description: `RED CARD! Straight sending off for ${fouledPlayer?.name} after a reckless high tackle! Down to 10 men!`,
          });
          if (fouledPlayer) playerRatings[fouledPlayer.id] = Math.max(3.5, (playerRatings[fouledPlayer.id] || 6.5) - 1.8);
        } else if (cardRoll < 0.28) {
          // Yellow Card
          yellowCardsHome++;
          events.push({
            minute: min,
            type: 'YellowCard',
            clubId: homeClub.id,
            playerId: fouledPlayer?.id,
            description: `Yellow Card shown to ${fouledPlayer?.name} for a cynical tactical trip halting a counter.`,
          });
          if (fouledPlayer) playerRatings[fouledPlayer.id] = Math.max(4.0, (playerRatings[fouledPlayer.id] || 6.5) - 0.3);
        } else {
          // Standard / Key Foul
          const foulTexts = [
            `Foul by ${fouledPlayer?.name}: late sliding tackle in the defensive third gives away a dangerous set-piece.`,
            `Whistle blown! ${fouledPlayer?.name} is penalised for persistent shirt-tugging in midfield.`,
            `Foul called against ${fouledPlayer?.name} for an aggressive push while contesting an aerial ball.`,
          ];
          events.push({
            minute: min,
            type: 'Foul',
            clubId: homeClub.id,
            playerId: fouledPlayer?.id,
            description: foulTexts[Math.floor(Math.random() * foulTexts.length)],
          });
        }
      } else {
        foulsAway++;
        const fouledPlayer = awayPlayers[Math.floor(Math.random() * awayPlayers.length)];
        const cardRoll = Math.random();

        if (cardRoll < 0.02) {
          redCardsAway++;
          events.push({
            minute: min,
            type: 'RedCard',
            clubId: awayClub.id,
            playerId: fouledPlayer?.id,
            description: `RED CARD! ${fouledPlayer?.name} is sent off for denying an obvious goalscoring opportunity with a foul!`,
          });
          if (fouledPlayer) playerRatings[fouledPlayer.id] = Math.max(3.5, (playerRatings[fouledPlayer.id] || 6.5) - 1.8);
        } else if (cardRoll < 0.28) {
          yellowCardsAway++;
          events.push({
            minute: min,
            type: 'YellowCard',
            clubId: awayClub.id,
            playerId: fouledPlayer?.id,
            description: `Yellow Card shown to ${fouledPlayer?.name} after an aggressive late challenge.`,
          });
          if (fouledPlayer) playerRatings[fouledPlayer.id] = Math.max(4.0, (playerRatings[fouledPlayer.id] || 6.5) - 0.3);
        } else {
          const foulTexts = [
            `Foul conceded by ${fouledPlayer?.name}: clumsy tackle on the turn brings down the attacking midfielder.`,
            `Referee awards a free-kick! ${fouledPlayer?.name} commits a tactical foul to break up play.`,
            `Foul whistled: ${fouledPlayer?.name} catches the opponent with a late mistimed challenge.`,
          ];
          events.push({
            minute: min,
            type: 'Foul',
            clubId: awayClub.id,
            playerId: fouledPlayer?.id,
            description: foulTexts[Math.floor(Math.random() * foulTexts.length)],
          });
        }
      }
    }

    // Rare VAR Review (Section 16/18)
    if (Math.random() < 0.005) {
      events.push({
        minute: min,
        type: 'VarDecision',
        clubId: Math.random() < 0.5 ? homeClub.id : awayClub.id,
        description: `VAR Check! Referee consults the monitor for potential penalty... Decision stands: No penalty.`,
      });
    }

    // Rare Injury check
    if (Math.random() < 0.004) {
      const isHomeInjury = Math.random() < 0.5;
      const injuredPlayer = isHomeInjury
        ? homePlayers[Math.floor(Math.random() * homePlayers.length)]
        : awayPlayers[Math.floor(Math.random() * awayPlayers.length)];

      if (injuredPlayer) {
        events.push({
          minute: min,
          type: 'Injury',
          clubId: isHomeInjury ? homeClub.id : awayClub.id,
          playerId: injuredPlayer.id,
          description: `Injury blow! ${injuredPlayer.name} is down holding their hamstring and receives medical attention.`,
        });
      }
    }
  }

  // Calculate passes
  const basePasses = 420;
  const passesHome = Math.round(basePasses * (possessionHome / 50) + Math.random() * 40);
  const passesAway = Math.round(basePasses * (possessionAway / 50) + Math.random() * 40);
  const passAccuracyHome = Math.min(94, Math.max(74, Math.round(82 + (possessionHome - 50) * 0.2)));
  const passAccuracyAway = Math.min(94, Math.max(74, Math.round(82 + (possessionAway - 50) * 0.2)));

  const stats: MatchStats = {
    possessionHome,
    possessionAway,
    shotsHome: Math.max(shotsHome, homeScore),
    shotsAway: Math.max(shotsAway, awayScore),
    shotsOnTargetHome: Math.max(shotsOnTargetHome, homeScore),
    shotsOnTargetAway: Math.max(shotsOnTargetAway, awayScore),
    xGHome: Math.round(xGHome * 100) / 100,
    xGAway: Math.round(xGAway * 100) / 100,
    cornersHome,
    cornersAway,
    foulsHome,
    foulsAway,
    yellowCardsHome,
    yellowCardsAway,
    redCardsHome,
    redCardsAway,
    passesHome,
    passesAway,
    passAccuracyHome,
    passAccuracyAway,
    tacklesHome,
    tacklesAway,
  };

  // Sort events chronologically
  events.sort((a, b) => a.minute - b.minute);

  return {
    homeScore,
    awayScore,
    stats,
    events,
    playerRatings,
  };
}
