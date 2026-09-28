import { CareerSaveSummary, CareerState } from '../types/football';

const LOCAL_STORAGE_KEY_PREFIX = 'apex_fm_save_';
const SAVES_INDEX_KEY = 'apex_fm_saves_index';

export function getLocalSavesIndex(): CareerSaveSummary[] {
  try {
    const raw = localStorage.getItem(SAVES_INDEX_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to read saves index:', err);
  }
  return [];
}

export function saveLocalCareer(state: CareerState, saveName?: string, isAutosave = false): CareerSaveSummary {
  const userClub = state.clubs[state.userClubId];
  const saveId = isAutosave ? 'autosave' : 'save_' + Date.now();
  const summary: CareerSaveSummary = {
    id: saveId,
    name: saveName || `${userClub?.name || 'Career'} - ${state.currentDate}`,
    clubName: userClub?.name || 'Club',
    managerName: state.manager.name,
    currentSeason: state.currentSeason,
    currentDate: state.currentDate,
    savedAt: new Date().toISOString(),
    isAutosave,
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + saveId, JSON.stringify(state));

    let index = getLocalSavesIndex();
    const existingIdx = index.findIndex((s) => s.id === saveId);
    if (existingIdx >= 0) {
      index[existingIdx] = summary;
    } else {
      index.unshift(summary);
    }
    // Limit to top 15 saves
    index = index.slice(0, 15);
    localStorage.setItem(SAVES_INDEX_KEY, JSON.stringify(index));

    // Also attempt background sync with backend /api/saves
    syncSaveToServer(summary, state);
  } catch (err) {
    console.error('Failed to save career locally:', err);
  }

  return summary;
}

export function loadLocalCareer(saveId: string): CareerState | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + saveId);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(`Failed to load save ${saveId}:`, err);
  }
  return null;
}

export function deleteLocalSave(saveId: string): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + saveId);
    const index = getLocalSavesIndex().filter((s) => s.id !== saveId);
    localStorage.setItem(SAVES_INDEX_KEY, JSON.stringify(index));
  } catch (err) {
    console.error(`Failed to delete save ${saveId}:`, err);
  }
}

export function exportSaveToJson(state: CareerState): void {
  const userClub = state.clubs[state.userClubId];
  const fileName = `ApexFM_${(userClub?.shortName || 'Career')}_${state.currentDate}.json`;
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importSaveFromJson(file: File): Promise<CareerState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const state = JSON.parse(e.target?.result as string);
        if (state && state.manager && state.clubs && state.players) {
          resolve(state);
        } else {
          reject(new Error('Invalid career save file format'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

async function syncSaveToServer(summary: CareerSaveSummary, state: CareerState) {
  try {
    await fetch('/api/saves', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'manager_session',
      },
      body: JSON.stringify({
        id: summary.id,
        name: summary.name,
        clubName: summary.clubName,
        managerName: summary.managerName,
        currentSeason: summary.currentSeason,
        currentDate: summary.currentDate,
        isAutosave: summary.isAutosave,
        state,
      }),
    });
  } catch (e) {
    // Non-blocking background sync
  }
}
