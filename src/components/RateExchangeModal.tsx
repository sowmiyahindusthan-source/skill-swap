import React, { useState } from 'react';
import { ExchangeProposal } from '../types/exchange';
import { X, Star, Award } from 'lucide-react';

interface RateExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: ExchangeProposal | null;
  onSubmitRating: (proposalId: string, rating: number, feedback: string, tags: string[]) => void;
}

export const RateExchangeModal: React.FC<RateExchangeModalProps> = ({
  isOpen,
  onClose,
  proposal,
  onSubmitRating,
}) => {
  if (!isOpen || !proposal) return null;

  const [stars, setStars] = useState<number>(5);
  const [hoverStars, setHoverStars] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Patient Mentor',
    'Super Punctual',
  ]);

  const availableTags = [
    'Patient Mentor',
    'Super Punctual',
    'Master Explainer',
    'Practical & Hands-On',
    'Friendly & Encouraging',
    'Went Above & Beyond',
  ];

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRating(
      proposal.id,
      stars,
      feedback.trim() || `Excellent skill exchange session for ${proposal.skillRequested}! Very professional and clear.`,
      selectedTags
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#18181b] rounded-[4px] max-w-lg w-full max-h-[90vh] overflow-y-auto border border-zinc-800 shadow-2xl p-6 space-y-4 text-zinc-200">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              PEER_AUDIT_RATING // STEP_06
            </p>
            <h3 className="text-base font-bold text-zinc-100">
              Rate & Verify Service Session
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[2px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Counterparty info */}
        <div className="bg-[#111113] rounded-[2px] p-3 border border-zinc-800 flex items-center gap-3">
          <img
            src={proposal.providerAvatar}
            alt={proposal.providerName}
            className="w-10 h-10 rounded-[2px] object-cover border border-zinc-700"
            referrerPolicy="no-referrer"
          />
          <div>
            <h4 className="text-xs font-bold text-zinc-100">
              {proposal.providerName}
            </h4>
            <p className="font-mono text-[10px] text-zinc-400">
              EXCHANGED: {proposal.skillRequested} · {proposal.proposedDate}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {/* Star Rating */}
          <div className="text-center py-2 space-y-1 bg-[#111113] p-3 rounded-[2px] border border-zinc-800">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
              EXPERIENCE_RATING
            </span>
            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((s) => {
                const isLit = (hoverStars || stars) >= s;
                return (
                  <button
                    type="button"
                    key={s}
                    onMouseEnter={() => setHoverStars(s)}
                    onMouseLeave={() => setHoverStars(0)}
                    onClick={() => setStars(s)}
                    className="p-1 transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        isLit
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-zinc-700'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-emerald-400 font-bold uppercase">
              {stars === 5 && 'EXCEPTIONAL // 5_STAR_ACCORD'}
              {stars === 4 && 'RELIABLE // 4_STAR_SOLID'}
              {stars === 3 && 'SATISFACTORY // 3_STAR_NOMINAL'}
              {stars <= 2 && 'FLAGGED // REQUIRES_REVIEW'}
            </p>
          </div>

          {/* Compliment Tags */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
              ENDORSEMENT_BADGES
            </span>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleToggleTag(tag)}
                    className={`px-2.5 py-1 text-[10px] rounded-[2px] border transition-colors cursor-pointer uppercase ${
                      isSelected
                        ? 'bg-amber-400/15 border-amber-400/40 text-amber-300 font-bold'
                        : 'bg-[#111113] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback */}
          <div>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
              PEER_TESTIMONIAL_LOG
            </span>
            <textarea
              rows={3}
              placeholder="Session breakdown, punctuality, and clear takeaways..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200 focus:outline-none focus:border-emerald-500 font-sans text-xs"
            />
          </div>

          {/* Actions */}
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
              <Award className="w-3.5 h-3.5" />
              <span>COMMIT_RATING</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
