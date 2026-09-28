import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Player, Club, Manager, Position, PlayerRole, Formation } from '../../types/football';
import { DETAILED_PLAYER_ROLES } from '../../data/roleSystemData';
import { formatMoney } from '../../services/currencyService';
import { generateClubBadgeSvg, generatePersonAvatarSvg } from '../../services/assetService';
import {
  Database,
  Users,
  Building2,
  UserCheck,
  Search,
  Filter,
  Plus,
  Trophy,
  Award,
  Sparkles,
  Shield,
  Star,
  Activity,
  CheckCircle,
  Clock,
  Layers,
  Edit3,
  Compass,
  ArrowRight,
  TrendingUp,
  X,
} from 'lucide-react';

export const DatabaseView: React.FC = () => {
  const {
    state,
    setSelectedPlayer,
    createNewPlayer,
    createNewCoach,
    createNewClub,
    updateClub,
    updatePlayerInSquad,
  } = useGame();

  const [activeTab, setActiveTab] = useState<'players' | 'clubs' | 'coaches' | 'roles'>('players');
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('ALL');
  const [clubFilter, setClubFilter] = useState<string>('ALL');
  const [roleCategoryFilter, setRoleCategoryFilter] = useState<string>('ALL');

  // Modals state
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isClubModalOpen, setIsClubModalOpen] = useState(false);
  const [isCoachModalOpen, setIsCoachModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);

  // New / Edit Player Form State
  const [playerFormName, setPlayerFormName] = useState('');
  const [playerFormAge, setPlayerFormAge] = useState(21);
  const [playerFormNationality, setPlayerFormNationality] = useState('England');
  const [playerFormPos, setPlayerFormPos] = useState<Position>('ST');
  const [playerFormRole, setPlayerFormRole] = useState<PlayerRole>('Advanced Forward');
  const [playerFormClub, setPlayerFormClub] = useState(state.userClubId);
  const [playerFormAbility, setPlayerFormAbility] = useState(76);
  const [playerFormPotential, setPlayerFormPotential] = useState(88);
  const [playerFormValue, setPlayerFormValue] = useState(15000000);

  // New / Edit Club Form State
  const [clubFormName, setClubFormName] = useState('');
  const [clubFormShortName, setClubFormShortName] = useState('');
  const [clubFormCountry, setClubFormCountry] = useState('England');
  const [clubFormStadium, setClubFormStadium] = useState('');
  const [clubFormCapacity, setClubFormCapacity] = useState(50000);
  const [clubFormFounded, setClubFormFounded] = useState(1900);
  const [clubFormReputation, setClubFormReputation] = useState(82);
  const [clubFormBudget, setClubFormBudget] = useState(60000000);
  const [clubFormPrimaryColor, setClubFormPrimaryColor] = useState('#2563EB');
  const [clubFormSecondaryColor, setClubFormSecondaryColor] = useState('#FFFFFF');
  const [clubFormManager, setClubFormManager] = useState('Head Coach');
  const [clubFormRecordWin, setClubFormRecordWin] = useState('8-0 vs Rivals');
  const [clubFormRecordSigning, setClubFormRecordSigning] = useState('€85.0M for World Star');

  // New Coach Form State
  const [coachFormName, setCoachFormName] = useState('');
  const [coachFormAge, setCoachFormAge] = useState(48);
  const [coachFormNationality, setCoachFormNationality] = useState('Spain');
  const [coachFormPhilosophy, setCoachFormPhilosophy] = useState<'Attacking Tiki-Taka' | 'Gegenpressing' | 'Solid Counter-Attack' | 'Direct Physical' | 'Fluid Possession'>('Gegenpressing');
  const [coachFormFormation, setCoachFormFormation] = useState<Formation>('4-3-3');
  const [coachFormReputation, setCoachFormReputation] = useState(85);

  const playersList = Object.values(state.players);
  const clubsList = Object.values(state.clubs);
  const rolesList = Object.values(DETAILED_PLAYER_ROLES);

  // Filtered Players
  const filteredPlayers = playersList.filter((p) => {
    if (positionFilter !== 'ALL' && p.position !== positionFilter) return false;
    if (clubFilter !== 'ALL' && p.clubId !== clubFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const club = state.clubs[p.clubId];
      const match =
        p.name.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q) ||
        p.nationality.toLowerCase().includes(q) ||
        (club && club.name.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Filtered Clubs
  const filteredClubs = clubsList.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.stadiumName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered Roles
  const filteredRoles = rolesList.filter((r) => {
    if (roleCategoryFilter !== 'ALL' && r.category !== roleCategoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.role.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.keyAttributes.some((a) => a.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenNewClub = () => {
    setEditingClub(null);
    setClubFormName('');
    setClubFormShortName('');
    setClubFormCountry('England');
    setClubFormStadium('Metropolitan Arena');
    setClubFormCapacity(52000);
    setClubFormFounded(1904);
    setClubFormReputation(80);
    setClubFormBudget(50000000);
    setClubFormPrimaryColor('#1D4ED8');
    setClubFormSecondaryColor('#FFFFFF');
    setClubFormManager('Chief Tactician');
    setClubFormRecordWin('9-0 (1995)');
    setClubFormRecordSigning('€75M Star Striker');
    setIsClubModalOpen(true);
  };

  const handleOpenEditClub = (club: Club) => {
    setEditingClub(club);
    setClubFormName(club.name);
    setClubFormShortName(club.shortName);
    setClubFormCountry(club.country);
    setClubFormStadium(club.stadiumName);
    setClubFormCapacity(club.stadiumCapacity);
    setClubFormFounded(club.foundedYear || 1900);
    setClubFormReputation(club.reputation);
    setClubFormBudget(club.transferBudget);
    setClubFormPrimaryColor(club.primaryColor);
    setClubFormSecondaryColor(club.secondaryColor);
    setClubFormManager(club.currentManagerName || 'Head Coach');
    setClubFormRecordWin(club.historicalRecords?.recordWin || '8-0 (1998)');
    setClubFormRecordSigning(club.historicalRecords?.recordSigning || '€60M Record Transfer');
    setIsClubModalOpen(true);
  };

  const handleClubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubFormName.trim()) return;

    if (editingClub) {
      updateClub(editingClub.id, {
        name: clubFormName,
        shortName: clubFormShortName || clubFormName.slice(0, 3).toUpperCase(),
        country: clubFormCountry,
        stadiumName: clubFormStadium,
        stadiumCapacity: Number(clubFormCapacity),
        foundedYear: Number(clubFormFounded),
        reputation: Number(clubFormReputation),
        transferBudget: Number(clubFormBudget),
        primaryColor: clubFormPrimaryColor,
        secondaryColor: clubFormSecondaryColor,
        currentManagerName: clubFormManager,
        historicalRecords: {
          ...(editingClub.historicalRecords || {
            recordDefeat: '0-6 vs Champions',
            recordSale: '€90M Academy Product',
            mostAppearances: 'Legendary Captain (590 apps)',
            allTimeTopScorer: 'Iconic Striker (210 goals)',
            bestLeagueFinish: 'Champions (2018)',
          }),
          recordWin: clubFormRecordWin,
          recordSigning: clubFormRecordSigning,
        },
      });
    } else {
      createNewClub({
        name: clubFormName,
        shortName: clubFormShortName || clubFormName.slice(0, 3).toUpperCase(),
        country: clubFormCountry,
        stadiumName: clubFormStadium,
        stadiumCapacity: Number(clubFormCapacity),
        foundedYear: Number(clubFormFounded),
        reputation: Number(clubFormReputation),
        transferBudget: Number(clubFormBudget),
        primaryColor: clubFormPrimaryColor,
        secondaryColor: clubFormSecondaryColor,
        currentManagerName: clubFormManager,
        historicalRecords: {
          recordWin: clubFormRecordWin,
          recordDefeat: '0-5 vs Elite Team',
          recordSigning: clubFormRecordSigning,
          recordSale: '€70M World Transfer',
          mostAppearances: 'Club Stalwart (520 apps)',
          allTimeTopScorer: 'Legend Forward (185 goals)',
          bestLeagueFinish: 'Winners',
        },
      });
    }
    setIsClubModalOpen(false);
  };

  const handlePlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerFormName.trim()) return;

    createNewPlayer({
      name: playerFormName,
      age: Number(playerFormAge),
      nationality: playerFormNationality,
      position: playerFormPos,
      role: playerFormRole,
      clubId: playerFormClub,
      currentAbility: Number(playerFormAbility),
      potentialAbility: Number(playerFormPotential),
      marketValue: Number(playerFormValue),
    });

    setIsPlayerModalOpen(false);
    setPlayerFormName('');
  };

  const handleCoachSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachFormName.trim()) return;

    createNewCoach({
      name: coachFormName,
      age: Number(coachFormAge),
      nationality: coachFormNationality,
      philosophy: coachFormPhilosophy,
      preferredFormation: coachFormFormation,
      reputation: Number(coachFormReputation),
    });

    setIsCoachModalOpen(false);
    setCoachFormName('');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Database Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-black text-white tracking-tight">Real & Synthetic Football Database</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Encyclopedic database supporting real teams, players, tactical roles, and coaches. Add, edit, or configure any entity.
          </p>
        </div>

        {/* Database Category Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-2xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('players')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                activeTab === 'players' ? 'bg-emerald-500 text-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Players ({playersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('clubs')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                activeTab === 'clubs' ? 'bg-emerald-500 text-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Clubs ({clubsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('coaches')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                activeTab === 'coaches' ? 'bg-emerald-500 text-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Coaches & Staff</span>
            </button>

            <button
              onClick={() => setActiveTab('roles')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                activeTab === 'roles' ? 'bg-emerald-500 text-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Tactical Roles (28+)</span>
            </button>
          </div>

          {activeTab === 'players' && (
            <button
              onClick={() => setIsPlayerModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>New Player</span>
            </button>
          )}

          {activeTab === 'clubs' && (
            <button
              onClick={handleOpenNewClub}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>New Club</span>
            </button>
          )}

          {activeTab === 'coaches' && (
            <button
              onClick={() => setIsCoachModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>New Coach</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'players'
                ? 'Search players by name, nationality, club...'
                : activeTab === 'clubs'
                ? 'Search clubs by name, country, stadium...'
                : activeTab === 'roles'
                ? 'Search tactical roles by name or attribute (e.g. Sweeper, Vision, Pressing)...'
                : 'Search managers by philosophy or nationality...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
          />
        </div>

        {activeTab === 'players' && (
          <div className="flex items-center gap-2">
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-300 font-semibold focus:outline-none"
            >
              <option value="ALL">All Positions</option>
              <option value="GK">Goalkeepers (GK)</option>
              <option value="CB">Center Backs (CB)</option>
              <option value="LB">Left Backs (LB)</option>
              <option value="RB">Right Backs (RB)</option>
              <option value="CDM">Defensive Mid (CDM)</option>
              <option value="CM">Central Mid (CM)</option>
              <option value="CAM">Attacking Mid (CAM)</option>
              <option value="LW">Left Wingers (LW)</option>
              <option value="RW">Right Wingers (RW)</option>
              <option value="ST">Strikers (ST)</option>
            </select>

            <select
              value={clubFilter}
              onChange={(e) => setClubFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-300 font-semibold focus:outline-none max-w-[160px]"
            >
              <option value="ALL">All Clubs</option>
              {clubsList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="flex items-center gap-2">
            <select
              value={roleCategoryFilter}
              onChange={(e) => setRoleCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-300 font-semibold focus:outline-none"
            >
              <option value="ALL">All Role Categories</option>
              <option value="Goalkeeper">Goalkeepers</option>
              <option value="Defenders">Defenders</option>
              <option value="Midfielders">Midfielders</option>
              <option value="Wide Players">Wide Players</option>
              <option value="Attackers">Attackers</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeTab === 'players' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlayers.map((player) => {
            const club = state.clubs[player.clubId];

            return (
              <div
                key={player.id}
                onClick={() => setSelectedPlayer(player)}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 hover:border-emerald-500/60 transition cursor-pointer group shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm text-white shadow shrink-0"
                        style={{ backgroundColor: club?.primaryColor || '#10B981' }}
                      >
                        {player.squadNumber || player.position}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-white text-sm truncate group-hover:text-emerald-400 transition">
                          {player.name}
                        </h4>
                        <span className="text-[11px] text-slate-400 block truncate">
                          {player.position} • {player.nationality} • {player.age} yrs
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-black text-xs text-emerald-400 block">
                        CA {player.currentAbility}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        PA {player.potentialAbility}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 bg-slate-950/70 rounded-2xl border border-slate-800/80 text-[11px] space-y-1 font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Club:</span>
                      <span className="text-slate-200 font-bold truncate max-w-[130px]">{club ? club.name : 'Free Agent'}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Role:</span>
                      <span className="text-blue-400 font-bold truncate max-w-[130px]">{player.role}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Valuation:</span>
                      <span className="text-emerald-400 font-bold">{formatMoney(player.marketValue, state.settings.currency, true)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Preferred Foot:</span>
                      <span className="text-slate-300 font-bold">{player.preferredFoot}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Rating: ⭐ {player.stats.avgRating.toFixed(1)}</span>
                  <span className="text-emerald-400 font-bold group-hover:underline">View Full Profile →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'clubs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClubs.map((club) => {
            const squad = playersList.filter((p) => p.clubId === club.id);
            const totalVal = squad.reduce((sum, p) => sum + p.marketValue, 0);

            return (
              <div
                key={club.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-md border border-white/20 shrink-0"
                        style={{ backgroundColor: club.primaryColor }}
                      >
                        {club.shortName}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-white text-base truncate">{club.name}</h4>
                        <span className="text-xs text-slate-400 block">
                          {club.country} • Est. {club.foundedYear || 1900} • Rep {club.reputation}%
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenEditClub(club)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                      title="Edit Club Information"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950 p-3 rounded-2xl border border-slate-800/80 font-mono">
                    <div>
                      <span className="text-slate-500 block">Stadium:</span>
                      <span className="font-bold text-white truncate block">{club.stadiumName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Capacity:</span>
                      <span className="font-bold text-white">{club.stadiumCapacity.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Transfer Budget:</span>
                      <span className="font-bold text-emerald-400">{formatMoney(club.transferBudget, state.settings.currency, true)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Squad Value:</span>
                      <span className="font-bold text-white">{formatMoney(totalVal, state.settings.currency, true)}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-900">
                      <span className="text-slate-500 block">Manager:</span>
                      <span className="font-bold text-blue-400 truncate block">{club.currentManagerName || 'Head Coach'}</span>
                    </div>
                  </div>

                  {club.historicalRecords && (
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[10px] space-y-1 font-mono">
                      <div className="flex justify-between text-slate-400">
                        <span>Record Win:</span>
                        <span className="text-slate-200">{club.historicalRecords.recordWin}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Record Signing:</span>
                        <span className="text-emerald-400">{club.historicalRecords.recordSigning}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                  <span className="text-slate-400 text-[11px]">
                    Facilities: {club.facilitiesLevel}/10 • Youth: {club.youthAcademyLevel}/10
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-emerald-400">
                    {squad.length} Players
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'coaches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* User Manager Card */}
          <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center font-black text-xl text-black">
                  {state.manager.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-white text-base">{state.manager.name}</h4>
                    <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">YOU</span>
                  </div>
                  <span className="text-xs text-slate-400">{state.manager.nationality} • {state.manager.age} yrs</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Club:</span>
                <span className="font-bold text-white">{state.clubs[state.userClubId]?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Philosophy:</span>
                <span className="font-bold text-emerald-400">{state.manager.philosophy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Formation:</span>
                <span className="font-bold text-white">{state.tactics.formation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Matches:</span>
                <span className="font-bold text-white">
                  {state.manager.careerStats.matches} (W: {state.manager.careerStats.wins})
                </span>
              </div>
            </div>
          </div>

          {/* AI & Real Managers */}
          {clubsList
            .filter((c) => c.id !== state.userClubId)
            .map((c) => (
              <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow"
                      style={{ backgroundColor: c.primaryColor || '#3B82F6' }}
                    >
                      {c.name[0]}
                    </div>
                    <div>
                      <h4 className="font-black text-white text-base">{c.currentManagerName || `Coach of ${c.shortName}`}</h4>
                      <span className="text-xs text-slate-400">{c.country} • Tactician</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">{c.reputation} REP</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Managing:</span>
                    <span className="font-bold text-white">{c.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tactical Shape:</span>
                    <span className="font-bold text-blue-400">4-2-3-1 High Press</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Coaching Focus:</span>
                    <span className="font-bold text-slate-300">Modern Counter-Pressing</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Tab 4: Tactical Role System (28+ Roles) */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>Complete Tactical Role System ({filteredRoles.length} Roles)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Full behavioral instructions, duty directives, and attribute matrices
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRoles.map((roleDef) => (
              <div
                key={roleDef.role}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          roleDef.category === 'Goalkeeper'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : roleDef.category === 'Defenders'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : roleDef.category === 'Midfielders'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : roleDef.category === 'Wide Players'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {roleDef.category}
                      </span>
                      <h4 className="font-black text-white text-base mt-1">{roleDef.role}</h4>
                    </div>

                    <div className="flex items-center gap-1">
                      {roleDef.suitablePositions.map((pos) => (
                        <span
                          key={pos}
                          className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 font-mono font-bold text-[10px] border border-slate-800"
                        >
                          {pos}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{roleDef.description}</p>

                  {/* Tactical Directives */}
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-[11px] font-mono space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Duty:</span>
                      <span className="font-bold text-white">{roleDef.tacticalDirectives.duty}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Pressing Style:</span>
                      <span className="text-amber-300">{roleDef.tacticalDirectives.pressing}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Passing Style:</span>
                      <span className="text-blue-300">{roleDef.tacticalDirectives.passingStyle}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Freedom:</span>
                      <span className="text-emerald-300">{roleDef.tacticalDirectives.positioningFreedom}</span>
                    </div>
                  </div>

                  {/* Key Required Attributes */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block">
                      Required Key Attributes:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {roleDef.keyAttributes.map((attr) => (
                        <span
                          key={attr}
                          className="px-2 py-0.5 rounded-md bg-slate-800/80 text-emerald-300 text-[10px] font-semibold border border-emerald-500/20"
                        >
                          {attr}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                  <span className="text-emerald-400 font-bold block mb-0.5">Effect:</span>
                  <span>{roleDef.performanceEffects}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal 1: Create New Player */}
      {isPlayerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>Create New Player</span>
              </h3>
              <button onClick={() => setIsPlayerModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlayerSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Player Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leo Fernandez"
                  value={playerFormName}
                  onChange={(e) => setPlayerFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Age</label>
                  <input
                    type="number"
                    min="15"
                    max="42"
                    value={playerFormAge}
                    onChange={(e) => setPlayerFormAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Nationality</label>
                  <input
                    type="text"
                    value={playerFormNationality}
                    onChange={(e) => setPlayerFormNationality(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Position</label>
                  <select
                    value={playerFormPos}
                    onChange={(e) => setPlayerFormPos(e.target.value as Position)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST'].map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Club Assignment</label>
                  <select
                    value={playerFormClub}
                    onChange={(e) => setPlayerFormClub(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {clubsList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Ability (CA)</label>
                  <input
                    type="number"
                    min="40"
                    max="99"
                    value={playerFormAbility}
                    onChange={(e) => setPlayerFormAbility(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Potential (PA)</label>
                  <input
                    type="number"
                    min="40"
                    max="99"
                    value={playerFormPotential}
                    onChange={(e) => setPlayerFormPotential(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Market Value (€)</label>
                  <input
                    type="number"
                    step="500000"
                    value={playerFormValue}
                    onChange={(e) => setPlayerFormValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPlayerModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400"
                >
                  Save Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Create / Edit Club */}
      {isClubModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-xl w-full space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                <span>{editingClub ? `Edit Club: ${editingClub.name}` : 'Create New Club in Database'}</span>
              </h3>
              <button onClick={() => setIsClubModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleClubSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Club Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Madrid FC"
                    value={clubFormName}
                    onChange={(e) => setClubFormName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Short Name / Code</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. RMA"
                    value={clubFormShortName}
                    onChange={(e) => setClubFormShortName(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Country</label>
                  <input
                    type="text"
                    value={clubFormCountry}
                    onChange={(e) => setClubFormCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Founded Year</label>
                  <input
                    type="number"
                    value={clubFormFounded}
                    onChange={(e) => setClubFormFounded(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Club Reputation (1-100)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={clubFormReputation}
                    onChange={(e) => setClubFormReputation(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Stadium Name</label>
                  <input
                    type="text"
                    value={clubFormStadium}
                    onChange={(e) => setClubFormStadium(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Stadium Capacity</label>
                  <input
                    type="number"
                    step="1000"
                    value={clubFormCapacity}
                    onChange={(e) => setClubFormCapacity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Transfer Budget (€)</label>
                  <input
                    type="number"
                    step="5000000"
                    value={clubFormBudget}
                    onChange={(e) => setClubFormBudget(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Current Head Coach</label>
                  <input
                    type="text"
                    value={clubFormManager}
                    onChange={(e) => setClubFormManager(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={clubFormPrimaryColor}
                      onChange={(e) => setClubFormPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={clubFormPrimaryColor}
                      onChange={(e) => setClubFormPrimaryColor(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Secondary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={clubFormSecondaryColor}
                      onChange={(e) => setClubFormSecondaryColor(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={clubFormSecondaryColor}
                      onChange={(e) => setClubFormSecondaryColor(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Record Win</label>
                  <input
                    type="text"
                    value={clubFormRecordWin}
                    onChange={(e) => setClubFormRecordWin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Record Signing</label>
                  <input
                    type="text"
                    value={clubFormRecordSigning}
                    onChange={(e) => setClubFormRecordSigning(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsClubModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  {editingClub ? 'Update Club' : 'Create Club'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Create New Coach */}
      {isCoachModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-lg flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <span>Create Head Coach Profile</span>
              </h3>
              <button onClick={() => setIsCoachModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCoachSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Manager Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pep Alcantara"
                  value={coachFormName}
                  onChange={(e) => setCoachFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Age</label>
                  <input
                    type="number"
                    min="30"
                    max="80"
                    value={coachFormAge}
                    onChange={(e) => setCoachFormAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Nationality</label>
                  <input
                    type="text"
                    value={coachFormNationality}
                    onChange={(e) => setCoachFormNationality(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Philosophy</label>
                  <select
                    value={coachFormPhilosophy}
                    onChange={(e) => setCoachFormPhilosophy(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Attacking Tiki-Taka">Attacking Tiki-Taka</option>
                    <option value="Gegenpressing">Gegenpressing</option>
                    <option value="Solid Counter-Attack">Solid Counter-Attack</option>
                    <option value="Direct Physical">Direct Physical</option>
                    <option value="Fluid Possession">Fluid Possession</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Preferred Formation</label>
                  <select
                    value={coachFormFormation}
                    onChange={(e) => setCoachFormFormation(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="4-3-3">4-3-3</option>
                    <option value="4-2-3-1">4-2-3-1</option>
                    <option value="4-4-2">4-4-2</option>
                    <option value="3-5-2">3-5-2</option>
                    <option value="3-4-3">3-4-3</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Reputation (1-100)</label>
                <input
                  type="number"
                  min="40"
                  max="99"
                  value={coachFormReputation}
                  onChange={(e) => setCoachFormReputation(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCoachModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400"
                >
                  Save Coach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
