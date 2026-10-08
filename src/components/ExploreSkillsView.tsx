import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types/exchange';
import { computeMatchScore } from '../utils/matchingEngine';
import { 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Calendar, 
  ArrowRightLeft, 
  Sparkles, 
  Clock, 
  SlidersHorizontal 
} from 'lucide-react';

interface ExploreSkillsViewProps {
  currentUser: UserProfile;
  providers: UserProfile[];
  onSelectProvider: (provider: UserProfile, targetSkill?: string) => void;
  onOpenRadar: () => void;
}

export const ExploreSkillsView: React.FC<ExploreSkillsViewProps> = ({
  currentUser,
  providers,
  onSelectProvider,
  onOpenRadar,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(10);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<string>('All');

  const categories: string[] = [
    'All',
    'Tech & Programming',
    'Music & Arts',
    'Academic & STEM',
    'Creative & Design',
    'Practical & Repair',
    'Language & Culture'
  ];

  const days = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const filteredProviders = useMemo(() => {
    return providers
      .filter((p) => p.id !== currentUser.id)
      .map((provider) => {
        const matchData = computeMatchScore(
          currentUser,
          provider,
          searchQuery || (currentUser.skillsWanted[0] || 'tutoring')
        );

        return {
          provider,
          matchData,
        };
      })
      .filter(({ provider, matchData }) => {
        if (maxRadiusKm < 15 && matchData.distanceKm > maxRadiusKm) {
          return false;
        }

        if (onlyVerified && !provider.isIdVerified) {
          return false;
        }

        if (selectedDay !== 'All') {
          const hasDay = provider.availability.some((a) => a.day === selectedDay);
          if (!hasDay) return false;
        }

        if (selectedCategory !== 'All') {
          const hasCategory = provider.skillsOffered.some(
            (s) => s.category === selectedCategory
          );
          if (!hasCategory) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = provider.name.toLowerCase().includes(q);
          const matchesSkills = provider.skillsOffered.some((s) =>
            s.name.toLowerCase().includes(q)
          );
          const matchesBio = provider.bio.toLowerCase().includes(q);
          if (!matchesName && !matchesSkills && !matchesBio) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => b.matchData.overallScore - a.matchData.overallScore);
  }, [
    currentUser,
    providers,
    searchQuery,
    selectedCategory,
    maxRadiusKm,
    onlyVerified,
    selectedDay,
  ]);

  return (
    <div className="space-y-6">
      {/* Search and Control Bar */}
      <div className="bg-[#18181b] border border-zinc-800 rounded-[4px] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by skill (Python, Acoustic Guitar, Bicycle Repair, Figma, Spanish)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#111113] border border-zinc-800 text-zinc-200 rounded-[3px] focus:outline-none focus:border-emerald-500/80 transition-colors placeholder:text-zinc-600 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Quick Radar Map Shortcut */}
          <button
            onClick={onOpenRadar}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 font-mono text-xs font-semibold text-zinc-300 bg-[#111113] border border-zinc-800 hover:border-zinc-700 hover:text-white rounded-[3px] transition-colors cursor-pointer whitespace-nowrap"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>RADAR_VIEW</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-800/80 text-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-[2px] font-mono text-[11px] transition-colors whitespace-nowrap cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-zinc-800 text-emerald-400 border-emerald-500/50 font-bold'
                    : 'bg-[#111113] text-zinc-400 border-zinc-800/80 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Radius */}
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <SlidersHorizontal className="w-3 h-3 text-zinc-500" />
              <span className="text-zinc-500">RADIUS:</span>
              <select
                value={maxRadiusKm}
                onChange={(e) => setMaxRadiusKm(Number(e.target.value))}
                className="bg-[#111113] border border-zinc-800 rounded-[2px] px-2 py-0.5 text-zinc-300 cursor-pointer focus:outline-none"
              >
                <option value={1}>1 km (Campus Quad)</option>
                <option value={3}>3 km (Local Dorms)</option>
                <option value={5}>5 km (Local District)</option>
                <option value={10}>10 km (Metro)</option>
                <option value={15}>15+ km (All Available)</option>
              </select>
            </div>

            {/* Day */}
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <Calendar className="w-3 h-3 text-zinc-500" />
              <span className="text-zinc-500">DAY:</span>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="bg-[#111113] border border-zinc-800 rounded-[2px] px-2 py-0.5 text-zinc-300 cursor-pointer focus:outline-none"
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d === 'All' ? 'ANY_DAY' : d.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Verified toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer font-mono text-[11px] text-zinc-400 select-none">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="rounded-[2px] bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <span>VERIFIED_ONLY</span>
            </label>
          </div>
        </div>
      </div>

      {/* Meta Counter */}
      <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 px-1">
        <p>
          MATCHED_NODES: <span className="text-zinc-200 font-bold tabular-nums">{filteredProviders.length}</span> LOCAL PROVIDERS
        </p>
        <p className="hidden sm:block">
          RANKING_ALGORITHM: MULTI_FACTOR_V2
        </p>
      </div>

      {/* Cards Grid */}
      {filteredProviders.length === 0 ? (
        <div className="bg-[#18181b] border border-zinc-800 rounded-[4px] p-12 text-center space-y-3">
          <p className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
            NO_MATCHING_PROVIDERS_IN_RADIUS
          </p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Expand radar radius or reset filters to display more local skill nodes.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setMaxRadiusKm(15);
              setOnlyVerified(false);
              setSelectedDay('All');
            }}
            className="font-mono text-xs font-semibold px-4 py-1.5 bg-zinc-800 text-zinc-200 border border-zinc-700 hover:text-white rounded-[2px] cursor-pointer"
          >
            RESET_FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProviders.map(({ provider, matchData }) => {
            return (
              <div
                key={provider.id}
                className="bg-[#18181b] border border-zinc-800 hover:border-zinc-700 rounded-[4px] p-4 flex flex-col justify-between transition-all space-y-4"
              >
                <div className="space-y-3.5">
                  {/* Card Header: Avatar & Score */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={provider.avatar}
                        alt={provider.name}
                        className="w-11 h-11 rounded-[3px] object-cover border border-zinc-700 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-xs font-bold text-zinc-100 truncate">
                            {provider.name}
                          </h3>
                          {provider.isIdVerified && (
                            <span title="Verified Identity">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-[10px] text-zinc-500 uppercase truncate">
                          {provider.role}
                        </p>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="text-right shrink-0">
                      <div className="font-mono text-sm font-bold text-emerald-400 flex items-center justify-end gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{matchData.overallScore}%</span>
                      </div>
                      <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block">
                        COMPAT
                      </span>
                    </div>
                  </div>

                  {/* Headline & Distance */}
                  <div>
                    <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                      {provider.headline}
                    </p>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-500 mt-2">
                      <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span className="truncate">{provider.locationName.split('·')[0].trim()}</span>
                      <span>·</span>
                      <span className="text-zinc-400 tabular-nums">{matchData.distanceKm} KM</span>
                    </div>
                  </div>

                  {/* Two-Way Barter Reciprocal Banner */}
                  {matchData.isTwoWayBarter && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-[2px] p-2 flex items-center gap-2">
                      <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-mono text-[10px] text-emerald-300 leading-tight">
                        RECIPROCAL_MATCH: Seeker offers skill they seek!
                      </span>
                    </div>
                  )}

                  {/* Skills Offered List */}
                  <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                    <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">
                      SKILLS_OFFERED
                    </p>
                    <div className="space-y-1">
                      {provider.skillsOffered.map((sk) => (
                        <div
                          key={sk.id}
                          className="flex items-center justify-between text-xs bg-[#111113] px-2 py-1 rounded-[2px] border border-zinc-800/80"
                        >
                          <span className="font-medium text-zinc-200 truncate">
                            {sk.name}
                          </span>
                          <span className="font-mono text-[10px] text-zinc-500 shrink-0 ml-2">
                            {sk.level.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Looking For in Exchange */}
                  <div className="text-xs text-zinc-400">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-0.5 font-semibold">
                      SEEKING_EXCHANGE
                    </span>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {provider.skillsWanted.join(', ')}
                    </p>
                  </div>

                  {/* Ratings & Activity Stats */}
                  <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 pt-2 border-t border-zinc-800">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-zinc-200">
                        {provider.reputationScore.toFixed(1)}
                      </span>
                      <span>({provider.totalExchanges})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span>{provider.responseRatePct}% REPLY</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-2 border-t border-zinc-800">
                  <button
                    onClick={() => onSelectProvider(provider)}
                    className="w-full py-1.5 px-3 font-mono text-[11px] font-bold text-zinc-200 bg-[#111113] hover:bg-emerald-500 hover:text-black border border-zinc-700/80 hover:border-emerald-500 rounded-[2px] transition-colors cursor-pointer text-center uppercase tracking-wider"
                  >
                    PROPOSE_EXCHANGE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
