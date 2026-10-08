import React, { useState } from 'react';
import { UserProfile, ExchangeProposal } from '../types/exchange';
import { computeMatchScore } from '../utils/matchingEngine';
import { X, Send, Sparkles } from 'lucide-react';

interface ProposeExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  provider: UserProfile | null;
  initialSkillRequested?: string;
  onSendProposal: (proposal: ExchangeProposal) => void;
}

export const ProposeExchangeModal: React.FC<ProposeExchangeModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  provider,
  initialSkillRequested,
  onSendProposal,
}) => {
  if (!isOpen || !provider) return null;

  const matchData = computeMatchScore(
    currentUser,
    provider,
    initialSkillRequested || provider.skillsOffered[0]?.name || ''
  );

  const [skillRequested, setSkillRequested] = useState(
    initialSkillRequested || provider.skillsOffered[0]?.name || ''
  );
  const [skillOfferedInReturn, setSkillOfferedInReturn] = useState(
    currentUser.skillsOffered[0]?.name || 'Acoustic Guitar Lessons'
  );
  const [proposedDate, setProposedDate] = useState('2026-10-12');
  const [proposedTimeSlot, setProposedTimeSlot] = useState('Evening (6:30 PM)');
  const [locationMode, setLocationMode] = useState<'In-Person' | 'Remote'>('In-Person');
  const [meetingPoint, setMeetingPoint] = useState(
    `${provider.locationName.split('·')[0].trim()} · Main Lobby Study Pod`
  );
  const [notes, setNotes] = useState(
    `Hi ${provider.name}! I would love to trade peer sessions with you. Looking forward to connecting!`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const proposal: ExchangeProposal = {
      id: `prop-${Date.now()}`,
      seekerId: currentUser.id,
      seekerName: currentUser.name,
      seekerAvatar: currentUser.avatar,
      providerId: provider.id,
      providerName: provider.name,
      providerAvatar: provider.avatar,
      skillRequested,
      skillOfferedInReturn,
      proposedDate,
      proposedTimeSlot,
      locationMode,
      meetingPoint,
      status: 'pending',
      notes,
      createdAt: new Date().toISOString(),
      matchScore: matchData.overallScore,
    };

    onSendProposal(proposal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#18181b] rounded-[4px] max-w-xl w-full max-h-[90vh] overflow-y-auto border border-zinc-800 shadow-2xl p-6 space-y-4 text-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              EXCHANGE_TERMS_INIT // STEP_03
            </p>
            <h3 className="text-base font-bold text-zinc-100">
              Propose Direct Skill Exchange
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[2px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matched Summary Banner */}
        <div className="bg-[#111113] border border-zinc-800 rounded-[2px] p-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={provider.avatar}
              alt={provider.name}
              className="w-10 h-10 rounded-[2px] object-cover border border-zinc-700"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="text-xs font-bold text-zinc-100">
                {provider.name}
              </h4>
              <p className="font-mono text-[10px] text-zinc-500">
                {provider.locationName.split('·')[0]} ({matchData.distanceKm} KM)
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-sm font-bold text-emerald-400 flex items-center gap-1 justify-end">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{matchData.overallScore}%</span>
            </div>
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block">
              MATCH_INDEX
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                TARGET_SKILL_REQUESTED *
              </label>
              <select
                value={skillRequested}
                onChange={(e) => setSkillRequested(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200"
              >
                {provider.skillsOffered.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                OFFERED_IN_RETURN (BARTER)
              </label>
              <select
                value={skillOfferedInReturn}
                onChange={(e) => setSkillOfferedInReturn(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200"
              >
                {currentUser.skillsOffered.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.level})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                DATE
              </label>
              <input
                type="date"
                value={proposedDate}
                onChange={(e) => setProposedDate(e.target.value)}
                className="w-full px-2 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                TIME_SLOT
              </label>
              <input
                type="text"
                value={proposedTimeSlot}
                onChange={(e) => setProposedTimeSlot(e.target.value)}
                className="w-full px-2 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                MODE
              </label>
              <select
                value={locationMode}
                onChange={(e) => setLocationMode(e.target.value as any)}
                className="w-full px-2 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200"
              >
                <option value="In-Person">In-Person</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
              MEETING_STATION / VENUE
            </label>
            <input
              type="text"
              value={meetingPoint}
              onChange={(e) => setMeetingPoint(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200 font-sans"
            />
          </div>

          <div>
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
              DIRECT_NOTE
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200 font-sans"
            />
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3 font-mono text-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-zinc-400 hover:text-zinc-200 cursor-pointer uppercase"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-bold bg-emerald-500 text-black hover:bg-emerald-400 rounded-[2px] transition-colors cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
            >
              <Send className="w-3.5 h-3.5" />
              <span>DISPATCH_TERMS</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
