import React, { useState } from 'react';
import { ServiceRequest, SkillCategory, UserProfile, ExchangeType } from '../types/exchange';
import { X, Send } from 'lucide-react';

interface PostRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onCreateRequest: (newReq: ServiceRequest) => void;
}

export const PostRequestModal: React.FC<PostRequestModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCreateRequest,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillCategory, setSkillCategory] = useState<SkillCategory>('Tech & Programming');
  const [skillRequired, setSkillRequired] = useState('');
  const [urgency, setUrgency] = useState<'Immediate (Today)' | 'Within 2-3 Days' | 'Flexible this Week'>('Within 2-3 Days');
  const [locationMode, setLocationMode] = useState<'In-Person' | 'Remote' | 'Flexible'>('In-Person');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('Weekday Evenings (6-8 PM)');
  const [exchangeType, setExchangeType] = useState<ExchangeType>('skill_barter');
  const [offeredSkillForBarter, setOfferedSkillForBarter] = useState(
    currentUser.skillsOffered[0]?.name || 'Acoustic Guitar Lessons'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !skillRequired.trim()) return;

    const newRequest: ServiceRequest = {
      id: `req-${Date.now()}`,
      seekerId: currentUser.id,
      seekerName: currentUser.name,
      seekerAvatar: currentUser.avatar,
      seekerZone: currentUser.locationName,
      title: title.trim(),
      description: description.trim() || `Seeking assistance with ${skillRequired.trim()} in ${currentUser.locationName}.`,
      skillCategory,
      skillRequired: skillRequired.trim(),
      urgency,
      locationMode,
      preferredTimeSlot,
      exchangeType,
      offeredSkillForBarter: exchangeType === 'skill_barter' ? offeredSkillForBarter : undefined,
      createdAt: new Date().toISOString(),
      status: 'open',
    };

    onCreateRequest(newRequest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#18181b] rounded-[4px] max-w-xl w-full max-h-[90vh] overflow-y-auto border border-zinc-800 shadow-2xl p-6 space-y-4 text-zinc-200">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              DISPATCH_REQUEST // STEP_02
            </p>
            <h3 className="text-base font-bold text-zinc-100">
              Broadcast Community Skill Request
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[2px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 font-mono text-xs">
          <div>
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
              REQUEST_TITLE *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Need 1-on-1 Help Debugging Python Binary Trees"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                CATEGORY
              </label>
              <select
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Tech & Programming">Tech & Programming</option>
                <option value="Academic & STEM">Academic & STEM</option>
                <option value="Music & Arts">Music & Arts</option>
                <option value="Creative & Design">Creative & Design</option>
                <option value="Practical & Repair">Practical & Repair</option>
                <option value="Language & Culture">Language & Culture</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                SKILL_NEEDED *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Python Tutoring, Calculus"
                value={skillRequired}
                onChange={(e) => setSkillRequired(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
              DESCRIPTION
            </label>
            <textarea
              rows={2}
              placeholder="Provide context and problem statement..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                URGENCY
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full px-2 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200"
              >
                <option value="Immediate (Today)">Immediate</option>
                <option value="Within 2-3 Days">2-3 Days</option>
                <option value="Flexible this Week">Flexible</option>
              </select>
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
                <option value="Flexible">Flexible</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                TIME_SLOT
              </label>
              <input
                type="text"
                value={preferredTimeSlot}
                onChange={(e) => setPreferredTimeSlot(e.target.value)}
                className="w-full px-2 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200"
              />
            </div>
          </div>

          {/* Compensation */}
          <div className="pt-2 border-t border-zinc-800 space-y-2">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider block">
              COMPENSATION_PROTOCOL
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setExchangeType('skill_barter')}
                className={`py-1.5 px-2 text-[10px] font-bold rounded-[2px] border text-center transition-colors cursor-pointer uppercase ${
                  exchangeType === 'skill_barter'
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                    : 'border-zinc-800 bg-[#111113] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                SKILL_BARTER
              </button>
              <button
                type="button"
                onClick={() => setExchangeType('direct_exchange')}
                className={`py-1.5 px-2 text-[10px] font-bold rounded-[2px] border text-center transition-colors cursor-pointer uppercase ${
                  exchangeType === 'direct_exchange'
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                    : 'border-zinc-800 bg-[#111113] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                TIME_CREDITS
              </button>
              <button
                type="button"
                onClick={() => setExchangeType('community_help')}
                className={`py-1.5 px-2 text-[10px] font-bold rounded-[2px] border text-center transition-colors cursor-pointer uppercase ${
                  exchangeType === 'community_help'
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400'
                    : 'border-zinc-800 bg-[#111113] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                FREE_PEER
              </button>
            </div>

            {exchangeType === 'skill_barter' && (
              <div className="pt-1">
                <label className="text-[9px] text-zinc-500 uppercase tracking-wider block mb-1">
                  OFFERED_IN_RETURN:
                </label>
                <input
                  type="text"
                  value={offeredSkillForBarter}
                  onChange={(e) => setOfferedSkillForBarter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200"
                />
              </div>
            )}
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
              <span>DISPATCH_BROADCAST</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
