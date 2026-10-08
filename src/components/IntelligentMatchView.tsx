import React, { useState } from 'react';
import { UserProfile, ServiceRequest } from '../types/exchange';
import { computeMatchScore } from '../utils/matchingEngine';
import { 
  Sparkles, 
  MapPin, 
  Check, 
  ArrowUpRight, 
  Award 
} from 'lucide-react';

interface IntelligentMatchViewProps {
  currentUser: UserProfile;
  providers: UserProfile[];
  userRequests: ServiceRequest[];
  onSelectProviderForExchange: (provider: UserProfile, targetSkill: string) => void;
  onOpenPostRequest: () => void;
}

export const IntelligentMatchView: React.FC<IntelligentMatchViewProps> = ({
  currentUser,
  providers,
  userRequests,
  onSelectProviderForExchange,
  onOpenPostRequest,
}) => {
  const [selectedSkillQuery, setSelectedSkillQuery] = useState<string>(
    currentUser.skillsWanted[0] || 'Python Tutoring'
  );
  const [preferredMode, setPreferredMode] = useState<'Flexible' | 'In-Person' | 'Remote'>('Flexible');

  const rankedMatches = providers
    .filter((p) => p.id !== currentUser.id)
    .map((provider) => {
      const match = computeMatchScore(
        currentUser,
        provider,
        selectedSkillQuery,
        undefined,
        preferredMode
      );
      return {
        provider,
        match,
      };
    })
    .sort((a, b) => b.match.overallScore - a.match.overallScore);

  const topMatch = rankedMatches[0];
  const otherMatches = rankedMatches.slice(1);

  return (
    <div className="space-y-6">
      {/* Engine Overview Header */}
      <div className="bg-[#18181b] border border-zinc-800 rounded-[4px] p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              ALGORITHMIC_MATCHMAKER // CORE_V2
            </p>
            <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight mt-0.5">
              Intelligent Matching & Recommendation Engine
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Multi-factor heuristic: Skill Relevance (40%) + Geographic Proximity (25%) + Schedule Overlap (20%) + Trust Verification (15%).
            </p>
          </div>

          <button
            onClick={onOpenPostRequest}
            className="px-3.5 py-1.5 font-mono text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 rounded-[2px] transition-colors cursor-pointer whitespace-nowrap uppercase tracking-wider"
          >
            CUSTOM_REQUEST
          </button>
        </div>

        {/* Interactive Query Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="md:col-span-2 space-y-2">
            <label className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block">
              TARGET_SKILL_QUERY
            </label>
            <div className="flex flex-wrap gap-2">
              {currentUser.skillsWanted.map((skill) => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkillQuery(skill)}
                  className={`font-mono text-xs px-2.5 py-1 rounded-[2px] transition-colors cursor-pointer border ${
                    selectedSkillQuery === skill
                      ? 'bg-zinc-800 text-emerald-400 border-emerald-500/50 font-bold'
                      : 'bg-[#111113] text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
              <button
                onClick={() => setSelectedSkillQuery('Bicycle Maintenance & Brake Tuning')}
                className={`font-mono text-xs px-2.5 py-1 rounded-[2px] transition-colors cursor-pointer border ${
                  selectedSkillQuery.includes('Bicycle')
                    ? 'bg-zinc-800 text-emerald-400 border-emerald-500/50 font-bold'
                    : 'bg-[#111113] text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                Bicycle Maintenance
              </button>
              <button
                onClick={() => setSelectedSkillQuery('UI/UX Design & Figma Prototyping')}
                className={`font-mono text-xs px-2.5 py-1 rounded-[2px] transition-colors cursor-pointer border ${
                  selectedSkillQuery.includes('Figma')
                    ? 'bg-zinc-800 text-emerald-400 border-emerald-500/50 font-bold'
                    : 'bg-[#111113] text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                UI/UX Design
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block">
              LOCATION_MODE
            </label>
            <div className="flex items-center gap-1 bg-[#111113] p-1 border border-zinc-800 rounded-[2px]">
              {(['Flexible', 'In-Person', 'Remote'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPreferredMode(mode)}
                  className={`flex-1 py-1 font-mono text-[10px] font-semibold rounded-[2px] transition-colors cursor-pointer uppercase ${
                    preferredMode === mode
                      ? 'bg-zinc-800 text-emerald-400 font-bold'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Ranked Feature Spotlight */}
      {topMatch && (
        <div className="bg-[#141416] border-2 border-emerald-500/40 rounded-[4px] p-5 sm:p-6 space-y-5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-5 border-b border-zinc-800">
            {/* Provider Info */}
            <div className="flex items-start sm:items-center gap-4">
              <img
                src={topMatch.provider.avatar}
                alt={topMatch.provider.name}
                className="w-14 h-14 rounded-[3px] object-cover border border-zinc-700 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    OPTIMAL_RECOMMENDATION
                  </span>
                  {topMatch.match.isTwoWayBarter && (
                    <span className="font-mono text-[9px] font-semibold text-emerald-300 bg-emerald-500/15 px-1.5 py-0.2 rounded-[2px] border border-emerald-500/30">
                      TWO_WAY_BARTER_SYNERGY
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-zinc-100 mt-0.5">
                  {topMatch.provider.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {topMatch.provider.headline}
                </p>
                <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-zinc-400" />
                    {topMatch.provider.locationName.split('·')[0]} ({topMatch.match.distanceKm} KM)
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-zinc-300">
                    <Award className="w-3 h-3 text-amber-400" />
                    {topMatch.provider.reputationScore.toFixed(1)} ★ ({topMatch.provider.totalExchanges} SESSIONS)
                  </span>
                </div>
              </div>
            </div>

            {/* Score & CTA */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0">
              <div className="text-left sm:text-right">
                <span className="font-mono text-3xl font-black text-emerald-400 tabular-nums leading-none">
                  {topMatch.match.overallScore}%
                </span>
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mt-0.5">
                  AFFINITY_INDEX
                </span>
              </div>
              <button
                onClick={() => onSelectProviderForExchange(topMatch.provider, selectedSkillQuery)}
                className="px-4 py-2 font-mono text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black rounded-[2px] transition-colors cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
              >
                <span>PROPOSE_SESSION</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Breakdown Factor Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#111113] rounded-[2px] p-3 border border-zinc-800">
              <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                <span className="text-zinc-500">SKILL_FIT</span>
                <span className="font-bold text-zinc-200 tabular-nums">
                  {topMatch.match.skillFitScore}/40
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${(topMatch.match.skillFitScore / 40) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-[#111113] rounded-[2px] p-3 border border-zinc-800">
              <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                <span className="text-zinc-500">PROXIMITY</span>
                <span className="font-bold text-zinc-200 tabular-nums">
                  {topMatch.match.proximityScore}/25
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${(topMatch.match.proximityScore / 25) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-[#111113] rounded-[2px] p-3 border border-zinc-800">
              <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                <span className="text-zinc-500">AVAILABILITY</span>
                <span className="font-bold text-zinc-200 tabular-nums">
                  {topMatch.match.availabilityScore}/20
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${(topMatch.match.availabilityScore / 20) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-[#111113] rounded-[2px] p-3 border border-zinc-800">
              <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                <span className="text-zinc-500">TRUST_ID</span>
                <span className="font-bold text-zinc-200 tabular-nums">
                  {topMatch.match.trustReputationScore}/15
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${(topMatch.match.trustReputationScore / 15) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Match Rationale */}
          <div className="pt-3 border-t border-zinc-800">
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-2 font-semibold">
              COMPATIBILITY_RATIONALE
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {topMatch.match.reasons.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alternative Matches */}
      <div className="space-y-3">
        <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
          SECONDARY_MATCHED_CANDIDATES
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {otherMatches.map(({ provider, match }) => (
            <div
              key={provider.id}
              className="bg-[#18181b] border border-zinc-800 hover:border-zinc-700 rounded-[4px] p-4 flex flex-col justify-between transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={provider.avatar}
                      alt={provider.name}
                      className="w-9 h-9 rounded-[2px] object-cover border border-zinc-700"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-100">
                        {provider.name}
                      </h4>
                      <p className="font-mono text-[10px] text-zinc-500">
                        {provider.role} · {match.distanceKm} KM
                      </p>
                    </div>
                  </div>
                  <div className="font-mono text-sm font-bold text-zinc-300 tabular-nums">
                    {match.overallScore}%
                  </div>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2">
                  {provider.headline}
                </p>

                <div className="flex flex-wrap gap-1">
                  {provider.skillsOffered.map((s) => (
                    <span
                      key={s.id}
                      className="font-mono text-[10px] bg-[#111113] text-zinc-300 px-1.5 py-0.5 rounded-[2px] border border-zinc-800"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-zinc-800 flex items-center justify-between">
                <span className="font-mono text-[10px] text-zinc-400">
                  {provider.reputationScore.toFixed(1)} ★ ({provider.totalExchanges})
                </span>
                <button
                  onClick={() => onSelectProviderForExchange(provider, selectedSkillQuery)}
                  className="font-mono text-[10px] font-bold px-2.5 py-1 bg-[#111113] hover:bg-emerald-500 hover:text-black text-zinc-300 border border-zinc-700 rounded-[2px] transition-colors cursor-pointer uppercase"
                >
                  PROPOSE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
