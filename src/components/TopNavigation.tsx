import React from 'react';
import { UserProfile } from '../types/exchange';
import { Plus, ChevronDown, UserCheck } from 'lucide-react';

interface TopNavigationProps {
  activeTab: 'explore' | 'smart-match' | 'requests' | 'exchanges' | 'radar' | 'verification';
  setActiveTab: (tab: 'explore' | 'smart-match' | 'requests' | 'exchanges' | 'radar' | 'verification') => void;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSwitchUser: (user: UserProfile) => void;
  pendingCount: number;
  onOpenPostRequest: () => void;
  onOpenProfile: () => void;
  onTriggerDemo: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  allUsers,
  onSwitchUser,
  pendingCount,
  onOpenPostRequest,
  onOpenProfile,
  onTriggerDemo,
}) => {
  return (
    <nav className="h-16 px-4 sm:px-6 bg-[#0c0c0e] border-b border-zinc-800/80 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Brand Zone */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setActiveTab('explore')}
          className="flex items-center gap-2 cursor-pointer group text-left"
        >
          <span className="text-emerald-400 font-mono font-bold text-sm tracking-wider">//</span>
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-zinc-100 group-hover:text-white transition-colors">
            SKILLS_SWAP
          </span>
        </button>

        {/* Technical Nav Links */}
        <div className="hidden lg:flex items-center gap-6">
          <button
            onClick={() => setActiveTab('explore')}
            className={`font-mono text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'explore'
                ? 'text-white border-b-2 border-emerald-400 pb-0.5'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            EXPLORE
          </button>

          <button
            onClick={() => setActiveTab('smart-match')}
            className={`font-mono text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'smart-match'
                ? 'text-white border-b-2 border-emerald-400 pb-0.5'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            MATCH_ENGINE
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`font-mono text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'requests'
                ? 'text-white border-b-2 border-emerald-400 pb-0.5'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            COMMUNITY
          </button>

          <button
            onClick={() => setActiveTab('exchanges')}
            className={`font-mono text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer relative ${
              activeTab === 'exchanges'
                ? 'text-white border-b-2 border-emerald-400 pb-0.5'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>EXCHANGE_HUB</span>
            {pendingCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-emerald-500 text-black text-[9px] font-mono font-bold rounded-xs">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('radar')}
            className={`font-mono text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'radar'
                ? 'text-white border-b-2 border-emerald-400 pb-0.5'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            RADAR
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`font-mono text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'verification'
                ? 'text-white border-b-2 border-emerald-400 pb-0.5'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            TRUST_VERIFICATION
          </button>
        </div>
      </div>

      {/* Right Action Zone */}
      <div className="flex items-center gap-3">
        {/* Persona quick switch for mobile/header */}
        <div className="relative group">
          <button 
            className="flex items-center gap-2 px-2.5 py-1.5 bg-[#18181b] border border-zinc-800 rounded-[3px] hover:border-zinc-700 transition-colors cursor-pointer text-left"
            title="Switch persona to test Seeker vs Provider perspectives"
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-5 h-5 rounded-[2px] object-cover" 
              referrerPolicy="no-referrer"
            />
            <span className="text-xs font-semibold text-zinc-200 hidden sm:inline max-w-[100px] truncate">
              {currentUser.name.split(' ')[0]}
            </span>
            <span className="font-mono text-[9px] text-zinc-500 hidden sm:inline uppercase">
              {currentUser.role.split(' ')[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          {/* Dropdown */}
          <div className="hidden group-hover:block group-focus-within:block absolute right-0 mt-1 w-64 bg-[#18181b] border border-zinc-800 rounded-[3px] shadow-2xl p-2 z-50">
            <div className="px-2 py-1 border-b border-zinc-800 mb-1">
              <p className="font-mono text-[10px] uppercase text-zinc-400 tracking-wider">
                ACTIVE_PERSONA_SWITCH
              </p>
            </div>
            <div className="space-y-1">
              {allUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onSwitchUser(user)}
                  className={`w-full flex items-center gap-2 p-1.5 rounded-[2px] text-left text-xs transition-colors cursor-pointer ${
                    user.id === currentUser.id 
                      ? 'bg-zinc-800/80 font-semibold text-white' 
                      : 'hover:bg-zinc-800/40 text-zinc-300'
                  }`}
                >
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-5 h-5 rounded-[2px] object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 truncate">
                    <span className="block truncate font-medium">{user.name}</span>
                    <span className="font-mono text-[9px] text-zinc-500 block truncate">{user.role}</span>
                  </div>
                  {user.id === currentUser.id && (
                    <span className="font-mono text-[9px] text-emerald-400 uppercase font-bold">LIVE</span>
                  )}
                </button>
              ))}
            </div>
            <div className="border-t border-zinc-800 pt-1.5 mt-1.5">
              <button
                onClick={onOpenProfile}
                className="w-full text-center py-1 text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-[2px] cursor-pointer"
              >
                EDIT_PROFILE_DATA
              </button>
            </div>
          </div>
        </div>

        {/* Demo Guide trigger */}
        <button
          onClick={onTriggerDemo}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-xs font-semibold text-zinc-300 bg-[#18181b] border border-zinc-800 hover:border-zinc-700 hover:text-white rounded-[3px] transition-colors cursor-pointer whitespace-nowrap"
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>AUTO_RUN</span>
        </button>

        {/* Primary Action Button */}
        <button
          onClick={onOpenPostRequest}
          className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 rounded-[3px] transition-colors cursor-pointer whitespace-nowrap uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>POST_REQUEST</span>
        </button>
      </div>
    </nav>
  );
};
