import React, { useState } from 'react';
import { ExchangeProposal, UserProfile } from '../types/exchange';
import { 
  CheckCircle2, 
  CheckCheck, 
  Star, 
  X, 
  ArrowRightLeft, 
  MessageSquare, 
  Sparkles 
} from 'lucide-react';

interface ExchangeManagerViewProps {
  currentUser: UserProfile;
  proposals: ExchangeProposal[];
  onAcceptProposal: (proposalId: string) => void;
  onDeclineProposal: (proposalId: string) => void;
  onMarkCompleted: (proposalId: string) => void;
  onOpenRateModal: (proposal: ExchangeProposal) => void;
}

export const ExchangeManagerView: React.FC<ExchangeManagerViewProps> = ({
  currentUser,
  proposals,
  onAcceptProposal,
  onDeclineProposal,
  onMarkCompleted,
  onOpenRateModal,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'active' | 'completed'>('all');

  // Filter proposals relevant to current user
  const myProposals = proposals.filter(
    (p) => p.seekerId === currentUser.id || p.providerId === currentUser.id
  );

  const filteredProposals = myProposals.filter((p) => {
    if (filterTab === 'pending') return p.status === 'pending';
    if (filterTab === 'active') return p.status === 'accepted' || p.status === 'in_progress';
    if (filterTab === 'completed') return p.status === 'completed' || p.status === 'rated';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* View Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            SESSION_MONITOR // LIFECYCLE_HUB
          </p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-100 tracking-tight mt-0.5">
            Exchange Lifecycle Management
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setFilterTab('all')}
            className={`font-mono text-xs px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer border ${
              filterTab === 'all'
                ? 'bg-[#18181b] text-white border-zinc-700 font-bold'
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            ALL_EXCHANGES ({myProposals.length})
          </button>
          <button
            onClick={() => setFilterTab('pending')}
            className={`font-mono text-xs px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer border ${
              filterTab === 'pending'
                ? 'bg-[#18181b] text-white border-zinc-700 font-bold'
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            PENDING ({myProposals.filter((p) => p.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterTab('active')}
            className={`font-mono text-xs px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer border ${
              filterTab === 'active'
                ? 'bg-[#18181b] text-white border-zinc-700 font-bold'
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            ACTIVE ({myProposals.filter((p) => p.status === 'accepted' || p.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`font-mono text-xs px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer border ${
              filterTab === 'completed'
                ? 'bg-[#18181b] text-white border-zinc-700 font-bold'
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            COMPLETED ({myProposals.filter((p) => p.status === 'completed' || p.status === 'rated').length})
          </button>
        </div>
      </div>

      {/* Exchange List Rows */}
      {filteredProposals.length === 0 ? (
        <div className="bg-[#18181b] border border-zinc-800 rounded-[4px] p-12 text-center space-y-2">
          <p className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
            NO_ACTIVE_EXCHANGES_FOUND
          </p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Initiate a proposal from EXPLORE or COMMUNITY requests to populate the session execution monitor.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredProposals.map((proposal) => {
            const isSeeker = proposal.seekerId === currentUser.id;
            const isProvider = proposal.providerId === currentUser.id;
            const otherPartyName = isSeeker ? proposal.providerName : proposal.seekerName;
            const otherPartyAvatar = isSeeker ? proposal.providerAvatar : proposal.seekerAvatar;

            return (
              <div
                key={proposal.id}
                className="bg-[#18181b] border border-zinc-800 hover:border-zinc-700/80 rounded-[4px] p-4 transition-all space-y-3.5"
              >
                {/* Technical Row Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  {/* Column 1: User Cell */}
                  <div className="flex items-center gap-3">
                    <img
                      src={otherPartyAvatar}
                      alt={otherPartyName}
                      className="w-9 h-9 rounded-[2px] object-cover border border-zinc-700 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-zinc-100 truncate">
                        {otherPartyName}
                      </p>
                      <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                        {isSeeker ? 'PROVIDER' : 'SEEKER'} · {proposal.matchScore}% MATCH
                      </p>
                    </div>
                  </div>

                  {/* Column 2: Skill Pair */}
                  <div>
                    <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">
                      SKILL_PAIR
                    </p>
                    <div className="text-xs text-zinc-200 truncate flex items-center gap-1.5">
                      <span className="font-medium">{proposal.skillRequested}</span>
                      {proposal.skillOfferedInReturn && (
                        <>
                          <ArrowRightLeft className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="text-zinc-400">{proposal.skillOfferedInReturn}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Column 3: Logistics / Next Event */}
                  <div>
                    <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">
                      SESSION_TIMING
                    </p>
                    <p className="text-xs text-zinc-300 font-mono">
                      {proposal.proposedDate} · {proposal.proposedTimeSlot}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                      {proposal.meetingPoint}
                    </p>
                  </div>

                  {/* Column 4: Status Tag & Interactive Action */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-center gap-2">
                    {/* Status Badge */}
                    <div>
                      {proposal.status === 'pending' && (
                        <span className="font-mono text-[10px] uppercase font-bold text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded-[2px]">
                          AWAITING_ACCEPT
                        </span>
                      )}
                      {proposal.status === 'accepted' && (
                        <span className="font-mono text-[10px] uppercase font-bold text-blue-400 border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 rounded-[2px]">
                          SCHEDULED_ACTIVE
                        </span>
                      )}
                      {proposal.status === 'completed' && (
                        <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-[2px]">
                          FINALIZED_AWAIT_RATING
                        </span>
                      )}
                      {proposal.status === 'rated' && (
                        <span className="font-mono text-[10px] uppercase font-bold text-zinc-300 border border-zinc-700 bg-zinc-800 px-2 py-0.5 rounded-[2px] flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>RATED_VERIFIED</span>
                        </span>
                      )}
                      {proposal.status === 'declined' && (
                        <span className="font-mono text-[10px] uppercase font-bold text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded-[2px]">
                          DECLINED
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <div>
                      {proposal.status === 'pending' && (
                        <>
                          {isProvider ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => onDeclineProposal(proposal.id)}
                                className="font-mono text-[10px] px-2 py-1 text-zinc-400 border border-zinc-800 hover:text-zinc-200 rounded-[2px] cursor-pointer"
                              >
                                DECLINE
                              </button>
                              <button
                                onClick={() => onAcceptProposal(proposal.id)}
                                className="font-mono text-[10px] font-bold px-2.5 py-1 bg-emerald-500 text-black hover:bg-emerald-400 rounded-[2px] cursor-pointer tracking-wider"
                              >
                                ACCEPT_PROPOSAL
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => onAcceptProposal(proposal.id)}
                              className="font-mono text-[10px] px-2 py-1 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 rounded-[2px] cursor-pointer"
                              title="Simulate provider accepting right now"
                            >
                              [SIMULATE_ACCEPT]
                            </button>
                          )}
                        </>
                      )}

                      {(proposal.status === 'accepted' || proposal.status === 'in_progress') && (
                        <button
                          onClick={() => onMarkCompleted(proposal.id)}
                          className="font-mono text-[10px] font-bold px-3 py-1 bg-zinc-100 text-black hover:bg-white rounded-[2px] cursor-pointer tracking-wider flex items-center gap-1"
                        >
                          <CheckCheck className="w-3 h-3 text-emerald-600" />
                          <span>MARK_FINAL</span>
                        </button>
                      )}

                      {proposal.status === 'completed' && (
                        <button
                          onClick={() => onOpenRateModal(proposal)}
                          className="font-mono text-[10px] font-bold px-3 py-1 bg-amber-400 text-black hover:bg-amber-300 rounded-[2px] cursor-pointer tracking-wider flex items-center gap-1"
                        >
                          <Star className="w-3 h-3 fill-current" />
                          <span>RATE_SESSION</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sub-row: Notes & Feedback */}
                {proposal.notes && (
                  <div className="text-xs text-zinc-400 bg-[#111113] p-2.5 rounded-[2px] border border-zinc-800/80 flex items-start gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                    <p className="italic font-sans">"{proposal.notes}"</p>
                  </div>
                )}

                {proposal.seekerRating && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-2.5 rounded-[2px] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
                        PEER_VERIFICATION_FEEDBACK
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: proposal.seekerRating.stars }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-300 italic font-sans">
                      "{proposal.seekerRating.feedback}"
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* System Feedback Terminal Block (as specified in Design HTML) */}
      <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-[2px] mt-6">
        <p className="font-mono text-[10px] text-emerald-400 tracking-wider font-bold">
          SYSTEM_FEEDBACK // PROTOCOL_LOG
        </p>
        <p className="text-xs text-zinc-400 mt-1 italic leading-relaxed">
          "Intelligent state transitions ensure accountability: All skill sessions require mutual agreement, geo-verified check-in, and peer reputation scoring before time credits or ratings are permanently logged."
        </p>
      </div>
    </div>
  );
};
