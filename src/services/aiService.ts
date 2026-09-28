export interface AiAssistantRequest {
  topic: 'tactics' | 'squad' | 'opponent' | 'post_match' | 'general';
  context: {
    clubName: string;
    formation: string;
    mentality?: string;
    opponentName?: string;
    squadSummary?: string;
    lastMatchResult?: string;
    tablePosition?: number;
  };
  prompt?: string;
}

export async function askAiAssistant(req: AiAssistantRequest): Promise<{ analysis: string; source: string }> {
  try {
    const response = await fetch('/api/ai/assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.analysis) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Network call to AI assistant endpoint failed, utilizing client-side fallback:', err);
  }

  // Graceful client fallback
  return {
    source: 'tactical-heuristics',
    analysis: generateClientTacticalAdvice(req),
  };
}

function generateClientTacticalAdvice(req: AiAssistantRequest): string {
  const { topic, context } = req;
  const club = context.clubName || 'the squad';
  const formation = context.formation || '4-3-3';
  const opponent = context.opponentName || 'the opponent';

  switch (topic) {
    case 'tactics':
      return `### Assistant Tactical Analysis (${formation})\n\n` +
        `* **Tactical Identity**: Our ${formation} structure provides strong vertical progression corridors through the half-spaces.\n` +
        `* **Defensive Transition**: When our full-backs overlap, ensure our holding midfielder drops between the center-backs to maintain a 3-2 rest defense.\n` +
        `* **Pressing Triggers**: Force opposition build-up wide toward the touchlines, then suffocate their passing angles with an aggressive counter-press.`;
    case 'opponent':
      return `### Opposition Scouting Report: ${opponent}\n\n` +
        `* **Tactical Setup**: ${opponent} deploy a structured block and look to break quickly using direct wing channels.\n` +
        `* **Key Danger**: Monitor their primary attacking outlet. Tight marking in the opening 20 minutes will disrupt their game plan.\n` +
        `* **Exploitation Point**: Their full-backs push high, leaving space behind them that our inside forwards can exploit on transition.`;
    case 'post_match':
      return `### Post-Match Tactical Review\n\n` +
        `* **Possession & Control**: We dominated passing lanes and created high-value scoring chances.\n` +
        `* **Defensive Focus**: Aerial duel success was solid, keeping opposition set-pieces under control.\n` +
        `* **Manager Action**: Rotate tired starters in the upcoming cup fixture to preserve fitness levels for the league run-in.`;
    case 'squad':
      return `### Squad Audit & Depth Analysis\n\n` +
        `* **Core Strengths**: First XI central midfield and attacking trident possess elite technical and creative capability.\n` +
        `* **Transfer Priority**: Consider signing a backup full-back and a high-potential center-forward to future-proof the squad.\n` +
        `* **Youth Development**: Promote standout academy talents during fixture congestion to accelerate their development curves.`;
    default:
      return `### Assistant Manager Strategic Note\n\n` +
        `* **Team Morale**: Squad cohesion is high. Continue rewarding consistent training performances with starting berths.\n` +
        `* **Next Fixture Preparation**: Maintain disciplined tactical training focusing on set-piece routines and defensive shape.`;
  }
}
