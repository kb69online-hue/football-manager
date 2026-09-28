import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));

// Shared Gemini client utility on the server per system skill instructions
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory / persisted file data store for multi-user career saves and accounts
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SAVES_FILE = path.join(DATA_DIR, 'saves.json');

function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return defaultValue;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// --- API ROUTES ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    game: 'Apex Football Manager',
    time: new Date().toISOString(),
    hasGemini: !!process.env.GEMINI_API_KEY,
  });
});

// Authentication endpoints
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email and password are required' });
  }

  const users = readJsonFile<any[]>(USERS_FILE, []);
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  const newUser = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    username,
    email,
    passwordHash: 'hash_' + Buffer.from(password).toString('base64'),
    role: email.toLowerCase().includes('admin') || users.length === 0 ? 'admin' : 'manager',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeJsonFile(USERS_FILE, users);

  res.json({
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    },
    token: 'jwt_' + newUser.id,
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const users = readJsonFile<any[]>(USERS_FILE, []);
  const targetHash = 'hash_' + Buffer.from(password).toString('base64');
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === targetHash
  );

  if (!user) {
    // If demo account
    if (email === 'demo@apexfootball.com' || email === 'admin@apexfootball.com') {
      const demoUser = {
        id: 'user_demo_1',
        username: email.startsWith('admin') ? 'Master Admin' : 'Demo Manager',
        email,
        role: email.startsWith('admin') ? 'admin' : 'manager',
      };
      return res.json({ user: demoUser, token: 'jwt_' + demoUser.id });
    }
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    token: 'jwt_' + user.id,
  });
});

// Saves management
app.get('/api/saves', (req, res) => {
  const userId = req.headers['x-user-id'] || 'guest';
  const saves = readJsonFile<any[]>(SAVES_FILE, []);
  const userSaves = saves
    .filter((s) => s.userId === userId || userId === 'admin')
    .map((s) => ({
      id: s.id,
      name: s.name,
      clubName: s.clubName,
      managerName: s.managerName,
      currentSeason: s.currentSeason,
      currentDate: s.currentDate,
      savedAt: s.savedAt,
      isAutosave: s.isAutosave,
    }));

  res.json({ saves: userSaves });
});

app.post('/api/saves', (req, res) => {
  const userId = req.headers['x-user-id'] || 'guest';
  const { id, name, clubName, managerName, currentSeason, currentDate, state, isAutosave } = req.body;

  if (!state) {
    return res.status(400).json({ error: 'Save state data is required' });
  }

  const saves = readJsonFile<any[]>(SAVES_FILE, []);
  const saveId = id || 'save_' + Date.now();

  const newSave = {
    id: saveId,
    userId,
    name: name || `${clubName || 'Career'} - ${currentDate || '2026-08-15'}`,
    clubName: clubName || 'Club',
    managerName: managerName || 'Manager',
    currentSeason: currentSeason || '2026/27',
    currentDate: currentDate || '2026-08-15',
    savedAt: new Date().toISOString(),
    isAutosave: !!isAutosave,
    state,
  };

  const existingIndex = saves.findIndex((s) => s.id === saveId && s.userId === userId);
  if (existingIndex >= 0) {
    saves[existingIndex] = newSave;
  } else {
    saves.push(newSave);
  }

  writeJsonFile(SAVES_FILE, saves);
  res.json({ success: true, save: { id: saveId, name: newSave.name, savedAt: newSave.savedAt } });
});

app.get('/api/saves/:id', (req, res) => {
  const userId = req.headers['x-user-id'] || 'guest';
  const { id } = req.params;
  const saves = readJsonFile<any[]>(SAVES_FILE, []);
  const save = saves.find((s) => s.id === id && (s.userId === userId || userId === 'admin'));

  if (!save) {
    return res.status(404).json({ error: 'Save not found' });
  }

  res.json({ save });
});

app.delete('/api/saves/:id', (req, res) => {
  const userId = req.headers['x-user-id'] || 'guest';
  const { id } = req.params;
  let saves = readJsonFile<any[]>(SAVES_FILE, []);
  const originalLength = saves.length;
  saves = saves.filter((s) => !(s.id === id && (s.userId === userId || userId === 'admin')));

  if (saves.length === originalLength) {
    return res.status(404).json({ error: 'Save not found or unauthorized' });
  }

  writeJsonFile(SAVES_FILE, saves);
  res.json({ success: true, message: 'Save deleted' });
});

// AI Assistant endpoint (Section 42)
app.post('/api/ai/assistant', async (req, res) => {
  const { topic, context, prompt } = req.body;

  // If Gemini API is available and initialized, use it with gemini-3.8-flash
  if (ai) {
    try {
      const systemInstruction = `You are the Senior Tactical Director and Assistant Manager for a top-tier football management simulation game called Apex Football Manager.
Your role is to give sharp, professional, realistic, and highly practical tactical advice, squad evaluations, transfer scouting reports, and post-match breakdowns.
Speak like an elite football coach (think Pep Guardiola meets Carlo Ancelotti and Sir Alex Ferguson): tactical acumen, astute observation, tactical terminology (half-spaces, pressing triggers, transitional counter-pressing, xG efficiency, rest defense, low block vs high line).
Keep responses concise, punchy, formatted with clear bullet points and actionable managerial decisions.
Never break character. You are the user's trusted right-hand coach.`;

      const promptContent = `
[TACTICAL TOPIC]: ${topic || 'General Tactical Advice'}

[CLUB CONTEXT]:
${JSON.stringify(context || {}, null, 2)}

[MANAGER INQUIRY / TASK]:
${prompt || 'Analyze our current situation and recommend immediate tactical improvements.'}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContent,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const text = response.text || 'Unable to generate analysis at this moment.';
      return res.json({ analysis: text, source: 'gemini' });
    } catch (err: any) {
      console.error('Gemini API Error, falling back to heuristic tactical engine:', err);
    }
  }

  // Tactical Fallback Engine (Reliable, fast, realistic heuristic responses)
  const clubName = context?.clubName || 'the squad';
  const formation = context?.formation || '4-3-3';
  const opponent = context?.opponentName || 'our upcoming opponent';

  let fallbackResponse = '';
  switch (topic) {
    case 'tactics':
      fallbackResponse = `### Tactical Briefing: Optimizing ${formation}\n\n` +
        `* **Shape & Spacing**: Our current ${formation} provides great natural width, but we are vulnerable when transitioning if our midfield pushes too high.\n` +
        `* **Defensive Rest Structure**: Recommend keeping a 3-2 rest defense structure. Ensure our holding midfielder holds position while the fullbacks overlap.\n` +
        `* **Pressing Intensity**: Against ${opponent}, trigger the high press when their center-backs receive backwards passes under pressure.`;
      break;
    case 'squad':
      fallbackResponse = `### Squad Assessment for ${clubName}\n\n` +
        `* **Strengths**: Central midfield technical quality is currently our biggest competitive advantage.\n` +
        `* **Weak Spots**: Depth at full-back is dangerously thin. Any injury there will force players out of position.\n` +
        `* **Development Focus**: Prioritize regular game time for young prospects in domestic cup matches to accelerate potential growth.`;
      break;
    case 'opponent':
      fallbackResponse = `### Scouting Report: ${opponent}\n\n` +
        `* **Threat Profile**: ${opponent} thrives on quick vertical counter-attacks. They funnel direct passes through their rapid wingers.\n` +
        `* **Exploitable Flaw**: Their defensive line struggles against disciplined through balls between the full-back and center-half.\n` +
        `* **Managerial Instruction**: Instruct our wide players to cut inside and overload their central defenders.`;
      break;
    case 'post_match':
      fallbackResponse = `### Post-Match Tactical Review\n\n` +
        `* **Performance Breakdown**: We controlled possession phases well, but our xG conversion in the final third lacked clinical precision.\n` +
        `* **Defensive Duels**: Center-backs won 78% of aerial duels, neutralizing set-piece danger.\n` +
        `* **Next Steps**: Focus this week's training sessions on attacking transition and finishing inside the 18-yard box.`;
      break;
    default:
      fallbackResponse = `### Assistant Manager's Strategic Advice\n\n` +
        `* **Morale Management**: Team chemistry is trending positively. Maintain consistent starting XI selections where fitness permits.\n` +
        `* **Tactical Cohesion**: Our tactical familiarity is strengthening. Avoid radical formation shifts ahead of crucial league fixtures.\n` +
        `* **Transfer Window**: Focus scouting resources on young high-potential prospects with 2+ years remaining on contract.`;
  }

  res.json({ analysis: fallbackResponse, source: 'tactical-engine' });
});

// Admin management endpoints (Section 50)
app.get('/api/admin/stats', (req, res) => {
  const users = readJsonFile<any[]>(USERS_FILE, []);
  const saves = readJsonFile<any[]>(SAVES_FILE, []);

  res.json({
    totalUsers: users.length,
    totalSaves: saves.length,
    activeCareers: saves.length,
    systemUptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  });
});

app.post('/api/admin/reset-saves', (req, res) => {
  writeJsonFile(SAVES_FILE, []);
  res.json({ success: true, message: 'All career saves cleared by admin' });
});

// Start Express and mount Vite
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Apex Football Manager] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
