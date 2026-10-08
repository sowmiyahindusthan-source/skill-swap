import React, { useState } from 'react';
import { UserProfile, SkillItem, SkillCategory } from '../types/exchange';
import { LOCAL_ZONES } from '../data/mockData';
import { X, Plus, Trash2, Check } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(currentUser.name);
  const [headline, setHeadline] = useState(currentUser.headline);
  const [bio, setBio] = useState(currentUser.bio);
  const [role, setRole] = useState(currentUser.role);
  const [zoneId, setZoneId] = useState(currentUser.locationZoneId);
  const [modePreference, setModePreference] = useState(currentUser.modePreference);

  const [skillsOffered, setSkillsOffered] = useState<SkillItem[]>([...currentUser.skillsOffered]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCat, setNewSkillCat] = useState<SkillCategory>('Tech & Programming');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');

  const [skillsWanted, setSkillsWanted] = useState<string[]>([...currentUser.skillsWanted]);
  const [newWantedSkill, setNewWantedSkill] = useState('');

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: SkillItem = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCat,
      level: newSkillLevel,
      verificationStatus: 'peer_endorsed',
      endorsementsCount: 1,
    };
    setSkillsOffered([...skillsOffered, newSkill]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (id: string) => {
    setSkillsOffered(skillsOffered.filter((s) => s.id !== id));
  };

  const handleAddWantedSkill = () => {
    if (!newWantedSkill.trim()) return;
    setSkillsWanted([...skillsWanted, newWantedSkill.trim()]);
    setNewWantedSkill('');
  };

  const handleRemoveWantedSkill = (skill: string) => {
    setSkillsWanted(skillsWanted.filter((s) => s !== skill));
  };

  const handleSave = () => {
    const selectedZone = LOCAL_ZONES.find((z) => z.id === zoneId) || LOCAL_ZONES[0];
    const updated: UserProfile = {
      ...currentUser,
      name,
      headline,
      bio,
      role,
      locationZoneId: selectedZone.id,
      locationName: selectedZone.name,
      coordinates: selectedZone.coordinates,
      modePreference,
      skillsOffered,
      skillsWanted,
    };
    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#18181b] rounded-[4px] max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-800 shadow-2xl p-6 space-y-5 text-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              PROFILE_CONFIGURATION // STEP_01
            </p>
            <h3 className="text-base font-bold text-zinc-100">
              User Profile & Skills Matrix
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[2px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Basic Info */}
        <div className="space-y-3 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                FULL_NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
                COMMUNITY_ROLE
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="University Student">University Student</option>
                <option value="Campus Mentor">Campus Mentor</option>
                <option value="Community Resident">Community Resident</option>
                <option value="Local Craftsman">Local Craftsman</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
              HEADLINE
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          <div>
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
              CAMPUS_ZONE_ANCHOR
            </label>
            <select
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200 focus:outline-none focus:border-emerald-500"
            >
              {LOCAL_ZONES.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-1">
              BACKGROUND_BIO
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>
        </div>

        {/* Skills Offered */}
        <div className="pt-3 border-t border-zinc-800 space-y-2">
          <label className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">
            SKILLS_OFFERED (TO_TEACH)
          </label>
          <div className="space-y-1.5">
            {skillsOffered.map((sk) => (
              <div
                key={sk.id}
                className="flex items-center justify-between text-xs p-2 rounded-[2px] bg-[#111113] border border-zinc-800"
              >
                <div>
                  <span className="font-semibold text-zinc-200">{sk.name}</span>
                  <span className="font-mono text-[10px] text-zinc-500 ml-2">({sk.category} · {sk.level})</span>
                </div>
                <button
                  onClick={() => handleRemoveSkill(sk.id)}
                  className="text-zinc-500 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-1 font-mono text-xs">
            <input
              type="text"
              placeholder="Skill title..."
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200 focus:outline-none"
            />
            <select
              value={newSkillCat}
              onChange={(e) => setNewSkillCat(e.target.value as any)}
              className="px-2 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200"
            >
              <option value="Tech & Programming">Tech & Programming</option>
              <option value="Music & Arts">Music & Arts</option>
              <option value="Academic & STEM">Academic & STEM</option>
              <option value="Creative & Design">Creative & Design</option>
              <option value="Practical & Repair">Practical & Repair</option>
              <option value="Language & Culture">Language & Culture</option>
            </select>
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value as any)}
              className="px-2 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <button
              onClick={handleAddSkill}
              className="px-3 py-1.5 font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-[2px] cursor-pointer flex items-center justify-center gap-1 uppercase"
            >
              <Plus className="w-3 h-3" />
              <span>ADD</span>
            </button>
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="pt-3 border-t border-zinc-800 space-y-2">
          <label className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">
            SKILLS_WANTED (FOR_RECIPROCAL_BARTER)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {skillsWanted.map((wanted) => (
              <span
                key={wanted}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[11px] rounded-[2px] bg-[#111113] text-zinc-300 border border-zinc-800"
              >
                <span>{wanted}</span>
                <button
                  onClick={() => handleRemoveWantedSkill(wanted)}
                  className="text-zinc-500 hover:text-red-400 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 pt-1 font-mono text-xs">
            <input
              type="text"
              placeholder="e.g. Calculus II, Figma UI..."
              value={newWantedSkill}
              onChange={(e) => setNewWantedSkill(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-[#111113] border border-zinc-800 rounded-[2px] text-zinc-200 focus:outline-none"
            />
            <button
              onClick={handleAddWantedSkill}
              className="px-3 py-1.5 font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-[2px] cursor-pointer flex items-center gap-1 uppercase"
            >
              <Plus className="w-3 h-3" />
              <span>ADD</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3 font-mono text-xs">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-zinc-400 hover:text-zinc-200 cursor-pointer uppercase"
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 font-bold bg-emerald-500 text-black hover:bg-emerald-400 rounded-[2px] transition-colors cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>SAVE_CHANGES</span>
          </button>
        </div>
      </div>
    </div>
  );
};
