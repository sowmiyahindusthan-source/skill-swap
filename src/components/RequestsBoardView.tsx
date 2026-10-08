import React, { useState } from 'react';
import { ServiceRequest, UserProfile } from '../types/exchange';
import { 
  FileText, 
  MapPin, 
  Clock, 
  ArrowRightLeft, 
  Plus, 
  Search, 
  Handshake, 
  Filter 
} from 'lucide-react';

interface RequestsBoardViewProps {
  currentUser: UserProfile;
  requests: ServiceRequest[];
  onOpenPostRequest: () => void;
  onRespondToRequest: (request: ServiceRequest) => void;
}

export const RequestsBoardView: React.FC<RequestsBoardViewProps> = ({
  currentUser,
  requests,
  onOpenPostRequest,
  onRespondToRequest,
}) => {
  const [urgencyFilter, setUrgencyFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRequests = requests.filter((req) => {
    if (urgencyFilter !== 'All' && req.urgency !== urgencyFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        req.title.toLowerCase().includes(q) ||
        req.description.toLowerCase().includes(q) ||
        req.skillRequired.toLowerCase().includes(q) ||
        req.seekerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-[#18181b] border border-zinc-800 rounded-[4px] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            COMMUNITY_REQUESTS // LOCAL_BROADCAST
          </p>
          <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight mt-0.5">
            Peer Skill & Service Broadcasts
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Community members requesting immediate skill assistance. Offer expertise in exchange for reciprocal skills or time credits.
          </p>
        </div>

        <button
          onClick={onOpenPostRequest}
          className="flex items-center gap-1.5 px-3.5 py-1.5 font-mono text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 rounded-[2px] transition-colors cursor-pointer whitespace-nowrap uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>BROADCAST_NEED</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#18181b] border border-zinc-800 p-3 rounded-[4px]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search broadcasts by keyword, skill, title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 font-mono text-xs bg-[#111113] border border-zinc-800 text-zinc-200 rounded-[2px] focus:outline-none focus:border-emerald-500/80 placeholder:text-zinc-600"
          />
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <Filter className="w-3 h-3 text-zinc-500" />
          <span className="text-zinc-500">URGENCY:</span>
          <div className="flex items-center gap-1 bg-[#111113] p-0.5 border border-zinc-800 rounded-[2px]">
            {['All', 'Immediate (Today)', 'Within 2-3 Days', 'Flexible this Week'].map((urg) => (
              <button
                key={urg}
                onClick={() => setUrgencyFilter(urg)}
                className={`px-2 py-0.5 font-mono text-[10px] rounded-[2px] transition-colors cursor-pointer uppercase ${
                  urgencyFilter === urg
                    ? 'bg-zinc-800 text-emerald-400 font-bold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {urg === 'All' ? 'ALL' : urg.split(' ')[0].toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.map((req) => {
          const isCurrentUser = req.seekerId === currentUser.id;

          return (
            <div
              key={req.id}
              className={`bg-[#18181b] border rounded-[4px] p-4 flex flex-col justify-between transition-all space-y-3 ${
                isCurrentUser ? 'border-zinc-700 bg-[#161619]' : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-3">
                {/* Seeker header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={req.seekerAvatar}
                      alt={req.seekerName}
                      className="w-8 h-8 rounded-[2px] object-cover border border-zinc-700"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-zinc-100">
                          {req.seekerName}
                        </span>
                        {isCurrentUser && (
                          <span className="font-mono text-[9px] text-zinc-400 bg-zinc-800 px-1 py-0.2 rounded-[2px]">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500">
                        {req.seekerZone.split('·')[0]}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-[10px] uppercase font-bold text-zinc-400 bg-[#111113] border border-zinc-800 px-2 py-0.5 rounded-[2px]">
                    {req.urgency}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-100 leading-snug">
                    {req.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {req.description}
                  </p>
                </div>

                {/* Details Box */}
                <div className="bg-[#111113] rounded-[2px] p-3 border border-zinc-800/80 space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">NEED:</span>
                    <span className="text-zinc-200 font-semibold">{req.skillRequired}</span>
                  </div>

                  {req.offeredSkillForBarter && (
                    <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <ArrowRightLeft className="w-3 h-3" />
                        OFFERS:
                      </span>
                      <span className="text-zinc-300">{req.offeredSkillForBarter}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-zinc-500 text-[10px]">
                    <span>SLOT: {req.preferredTimeSlot}</span>
                    <span>MODE: {req.locationMode.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-zinc-800">
                {isCurrentUser ? (
                  <div className="font-mono text-[10px] text-center py-1 text-zinc-500 bg-[#111113] rounded-[2px]">
                    ACTIVE_OPEN_BROADCAST
                  </div>
                ) : (
                  <button
                    onClick={() => onRespondToRequest(req)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 font-mono text-[11px] font-bold bg-[#111113] hover:bg-emerald-500 hover:text-black text-zinc-200 border border-zinc-700 hover:border-emerald-500 rounded-[2px] transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    <Handshake className="w-3.5 h-3.5" />
                    <span>OFFER_ASSISTANCE</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
