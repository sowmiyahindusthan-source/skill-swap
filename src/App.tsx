import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  ServiceRequest, 
  ExchangeProposal, 
  ReviewItem 
} from './types/exchange';
import { 
  INITIAL_USERS, 
  INITIAL_REQUESTS, 
  INITIAL_PROPOSALS 
} from './data/mockData';
import { TopNavigation } from './components/TopNavigation';
import { DemoFlowBar } from './components/DemoFlowBar';
import { ExploreSkillsView } from './components/ExploreSkillsView';
import { IntelligentMatchView } from './components/IntelligentMatchView';
import { RequestsBoardView } from './components/RequestsBoardView';
import { ExchangeManagerView } from './components/ExchangeManagerView';
import { LocationRadarView } from './components/LocationRadarView';
import { TrustBadgesView } from './components/TrustBadgesView';
import { UserProfileModal } from './components/UserProfileModal';
import { PostRequestModal } from './components/PostRequestModal';
import { ProposeExchangeModal } from './components/ProposeExchangeModal';
import { RateExchangeModal } from './components/RateExchangeModal';
import { 
  CheckCircle2, 
  Plus, 
  Edit3, 
  Play, 
  RotateCcw, 
  Radio 
} from 'lucide-react';

export default function App() {
  // Persistence with localStorage
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('skilllink_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('skilllink_active_uid') || INITIAL_USERS[0].id;
  });

  const [requests, setRequests] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem('skilllink_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [proposals, setProposals] = useState<ExchangeProposal[]>(() => {
    const saved = localStorage.getItem('skilllink_proposals');
    return saved ? JSON.parse(saved) : INITIAL_PROPOSALS;
  });

  // Current active user
  const currentUser = allUsers.find((u) => u.id === currentUserId) || allUsers[0];

  // Navigation tab
  const [activeTab, setActiveTab] = useState<
    'explore' | 'smart-match' | 'requests' | 'exchanges' | 'radar' | 'verification'
  >('exchanges');

  // HackNova 6-Step Demonstration Stage tracker
  const [demoStage, setDemoStage] = useState<number>(4);
  const [isAutoRunning, setIsAutoRunning] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPostRequestModalOpen, setIsPostRequestModalOpen] = useState(false);
  const [proposeProvider, setProposeProvider] = useState<UserProfile | null>(null);
  const [proposeInitialSkill, setProposeInitialSkill] = useState<string | undefined>(undefined);
  const [ratingProposal, setRatingProposal] = useState<ExchangeProposal | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('skilllink_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('skilllink_active_uid', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('skilllink_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('skilllink_proposals', JSON.stringify(proposals));
  }, [proposals]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Reset all state to clean initial mock data
  const handleResetData = () => {
    localStorage.removeItem('skilllink_users');
    localStorage.removeItem('skilllink_requests');
    localStorage.removeItem('skilllink_proposals');
    localStorage.removeItem('skilllink_active_uid');
    setAllUsers(INITIAL_USERS);
    setCurrentUserId(INITIAL_USERS[0].id);
    setRequests(INITIAL_REQUESTS);
    setProposals(INITIAL_PROPOSALS);
    setDemoStage(1);
    setActiveTab('explore');
    showToast('Platform reset to initial HackNova demonstration state!');
  };

  // Switch active user persona
  const handleSwitchUser = (user: UserProfile) => {
    setCurrentUserId(user.id);
    showToast(`Switched active perspective to ${user.name} (${user.role})`);
  };

  // Update profile
  const handleSaveProfile = (updated: UserProfile) => {
    setAllUsers(allUsers.map((u) => (u.id === updated.id ? updated : u)));
    setDemoStage(Math.max(demoStage, 2));
    showToast('Profile and skills schedule updated successfully!');
  };

  // Create new service request
  const handleCreateRequest = (newReq: ServiceRequest) => {
    setRequests([newReq, ...requests]);
    setDemoStage(Math.max(demoStage, 3));
    setActiveTab('smart-match');
    showToast(`Request "${newReq.title}" posted! Finding intelligent matches...`);
  };

  // Send proposal to provider
  const handleSendProposal = (proposal: ExchangeProposal) => {
    setProposals([proposal, ...proposals]);
    setDemoStage(Math.max(demoStage, 4));
    setActiveTab('exchanges');
    showToast(`Proposal sent to ${proposal.providerName}! Status: Pending Acceptance.`);
  };

  // Accept proposal
  const handleAcceptProposal = (proposalId: string) => {
    setProposals(
      proposals.map((p) =>
        p.id === proposalId ? { ...p, status: 'accepted' } : p
      )
    );
    setDemoStage(Math.max(demoStage, 5));
    showToast('Proposal Accepted! Session is scheduled.');
  };

  // Decline proposal
  const handleDeclineProposal = (proposalId: string) => {
    setProposals(
      proposals.map((p) =>
        p.id === proposalId ? { ...p, status: 'declined' } : p
      )
    );
    showToast('Proposal declined.');
  };

  // Mark session completed
  const handleMarkCompleted = (proposalId: string) => {
    setProposals(
      proposals.map((p) =>
        p.id === proposalId ? { ...p, status: 'completed' } : p
      )
    );
    setDemoStage(Math.max(demoStage, 6));
    showToast('Session marked completed! Now ready for peer rating.');
  };

  // Submit Rating & Review
  const handleSubmitRating = (
    proposalId: string,
    rating: number,
    feedback: string,
    tags: string[]
  ) => {
    const targetProposal = proposals.find((p) => p.id === proposalId);
    if (!targetProposal) return;

    // Update proposal
    const updatedProposals = proposals.map((p) => {
      if (p.id === proposalId) {
        return {
          ...p,
          status: 'rated' as const,
          seekerRating: {
            stars: rating,
            feedback,
            submittedAt: new Date().toISOString(),
          },
        };
      }
      return p;
    });
    setProposals(updatedProposals);

    // Update target provider's reviews and reputation score
    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      reviewerAvatar: currentUser.avatar,
      rating,
      date: new Date().toISOString().split('T')[0],
      skillExchanged: targetProposal.skillRequested,
      comment: feedback,
      tags,
    };

    setAllUsers(
      allUsers.map((u) => {
        if (u.id === targetProposal.providerId) {
          const updatedReviews = [newReview, ...u.reviews];
          const newAvg =
            updatedReviews.reduce((acc, r) => acc + r.rating, 0) /
            updatedReviews.length;
          return {
            ...u,
            reviews: updatedReviews,
            reputationScore: Math.round(newAvg * 10) / 10,
            totalExchanges: u.totalExchanges + 1,
            creditsBalance: u.creditsBalance + 1,
          };
        }
        return u;
      })
    );

    setDemoStage(6);
    showToast('Rating and peer testimonial submitted! Reputation score updated.');
  };

  // Verify ID action
  const handleVerifyId = () => {
    setAllUsers(
      allUsers.map((u) => (u.id === currentUser.id ? { ...u, isIdVerified: true } : u))
    );
    showToast('Student ID verified with institutional domain (.edu)!');
  };

  // Verify skill badge
  const handleVerifySkillBadge = (skillName: string) => {
    setAllUsers(
      allUsers.map((u) => {
        if (u.id === currentUser.id) {
          const updatedSkills = u.skillsOffered.map((sk) =>
            sk.name === skillName
              ? { ...sk, verificationStatus: 'verified' as const }
              : sk
          );
          return { ...u, skillsOffered: updatedSkills };
        }
        return u;
      })
    );
    showToast(`Verification badge awarded for "${skillName}"!`);
  };

  // Step selector from DemoFlowBar
  const handleSelectDemoStep = (step: number) => {
    setDemoStage(step);
    if (step === 1) {
      setIsProfileModalOpen(true);
    } else if (step === 2) {
      setActiveTab('requests');
    } else if (step === 3) {
      setActiveTab('smart-match');
    } else if (step >= 4) {
      setActiveTab('exchanges');
    }
  };

  // Automated 6-step demo walkthrough execution
  const handleAutoRunDemo = () => {
    setIsAutoRunning(true);
    showToast('Starting automated HackNova demonstration lifecycle...');

    setDemoStage(1);
    setActiveTab('explore');

    setTimeout(() => {
      setDemoStage(2);
      setActiveTab('requests');
      showToast('Step 2: Searching and reviewing community service requests...');

      setTimeout(() => {
        setDemoStage(3);
        setActiveTab('smart-match');
        showToast('Step 3: Calculating multi-factor match score...');

        setTimeout(() => {
          setDemoStage(4);
          setActiveTab('exchanges');
          const pending = proposals.find((p) => p.status === 'pending');
          if (pending) {
            handleAcceptProposal(pending.id);
          }
          showToast('Step 4: Provider accepts exchange proposal!');

          setTimeout(() => {
            setDemoStage(5);
            const active = proposals.find((p) => p.status === 'accepted');
            if (active) {
              handleMarkCompleted(active.id);
            }
            showToast('Step 5: Peer session held on campus and marked completed!');

            setTimeout(() => {
              setDemoStage(6);
              const readyToRate = proposals.find((p) => p.status === 'completed');
              if (readyToRate) {
                setRatingProposal(readyToRate);
              }
              setIsAutoRunning(false);
              showToast('Step 6: Peer rating and reputation update ready!');
            }, 1600);
          }, 1600);
        }, 1600);
      }, 1600);
    }, 1600);
  };

  // Pending count for badge
  const pendingCount = proposals.filter(
    (p) =>
      p.status === 'pending' &&
      (p.providerId === currentUser.id || p.seekerId === currentUser.id)
  ).length;

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#e4e4e7] flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* 1. Technical Sequence Exec Bar */}
      <DemoFlowBar
        currentStage={demoStage}
        onSelectStep={handleSelectDemoStep}
        onAutoRunDemo={handleAutoRunDemo}
        onResetData={handleResetData}
        isAutoRunning={isAutoRunning}
      />

      {/* 2. Top Navigation Bar (Variation 3 technical style) */}
      <TopNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        allUsers={allUsers}
        onSwitchUser={handleSwitchUser}
        pendingCount={pendingCount}
        onOpenPostRequest={() => setIsPostRequestModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onTriggerDemo={handleAutoRunDemo}
      />

      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-14 right-5 z-50 bg-[#18181b] text-zinc-100 px-4 py-2.5 rounded-[3px] shadow-2xl border border-emerald-500/40 flex items-center gap-2.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-mono text-[11px] font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 3. Dashboard Two-Column Technical Layout (Variation 3 Architecture) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[300px_1fr] overflow-hidden">
        {/* Technical Sidebar */}
        <aside className="border-r border-zinc-800/80 p-5 sm:p-6 bg-[#111113] flex flex-col gap-6 overflow-y-auto">
          {/* Persona Card */}
          <div className="bg-[#18181b] border border-zinc-800 rounded-[4px] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                ACTIVE_PERSONA
              </span>
              <span className="font-mono text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-[2px] font-bold">
                AUTH_OK
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 rounded-[4px] object-cover border border-zinc-700"
                referrerPolicy="no-referrer"
              />
              <div className="truncate">
                <p className="font-bold text-sm text-zinc-100 truncate">
                  {currentUser.name}
                </p>
                <p className="font-mono text-[10px] text-zinc-400 truncate">
                  {currentUser.headline.split('&')[0]}
                </p>
                <p className="font-mono text-[9px] text-zinc-500 truncate">
                  {currentUser.role}
                </p>
              </div>
            </div>

            {/* Persona Quick Switcher Chips */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-1">
              <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
                QUICK_SWITCH_PERSONA
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSwitchUser(u)}
                    className={`font-mono text-[10px] p-1 rounded-[2px] truncate text-left transition-colors cursor-pointer border ${
                      u.id === currentUser.id
                        ? 'bg-zinc-800 text-emerald-400 border-emerald-500/40 font-bold'
                        : 'bg-[#121214] text-zinc-400 border-zinc-800/80 hover:text-zinc-200'
                    }`}
                  >
                    {u.name.split(' ')[0]} ({u.role.includes('Student') ? 'Seeker' : 'Provider'})
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 font-mono text-xs font-semibold text-zinc-300 bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 rounded-[3px] transition-colors cursor-pointer"
            >
              <Edit3 className="w-3 h-3 text-zinc-400" />
              <span>EDIT_PROFILE_DATA</span>
            </button>
          </div>

          {/* Network Stats Grid (as in Variation 3 Design) */}
          <div>
            <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-2 font-semibold">
              NETWORK_STATS
            </p>
            <div className="grid grid-cols-2 gap-[1px] bg-zinc-800 border border-zinc-800 rounded-[3px] overflow-hidden">
              <div className="bg-[#0c0c0e] p-3">
                <span className="font-mono text-[9px] text-zinc-400 uppercase block tracking-wider">
                  TIME_BANK
                </span>
                <span className="font-mono text-base font-bold text-zinc-100 tabular-nums">
                  {currentUser.creditsBalance.toFixed(1)} hrs
                </span>
              </div>

              <div className="bg-[#0c0c0e] p-3">
                <span className="font-mono text-[9px] text-zinc-400 uppercase block tracking-wider">
                  TRUST_SCORE
                </span>
                <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">
                  {Math.round(currentUser.reputationScore * 200)}
                </span>
              </div>

              <div className="bg-[#0c0c0e] p-3">
                <span className="font-mono text-[9px] text-zinc-400 uppercase block tracking-wider">
                  EXCHANGES
                </span>
                <span className="font-mono text-base font-bold text-zinc-100 tabular-nums">
                  {currentUser.totalExchanges}
                </span>
              </div>

              <div className="bg-[#0c0c0e] p-3">
                <span className="font-mono text-[9px] text-zinc-400 uppercase block tracking-wider">
                  REPLY_RATE
                </span>
                <span className="font-mono text-base font-bold text-zinc-100 tabular-nums">
                  {currentUser.responseRatePct}%
                </span>
              </div>
            </div>
          </div>

          {/* System Control Dispatches */}
          <div className="space-y-2">
            <p className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
              QUICK_ACTIONS
            </p>
            <button
              onClick={() => setIsPostRequestModalOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 font-mono text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 rounded-[3px] transition-colors cursor-pointer tracking-wider uppercase"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>POST_REQUEST</span>
            </button>

            <button
              onClick={handleAutoRunDemo}
              className="w-full flex items-center justify-center gap-1.5 py-2 font-mono text-xs font-semibold bg-[#18181b] text-zinc-200 border border-zinc-700/80 hover:border-zinc-600 rounded-[3px] transition-colors cursor-pointer tracking-wider uppercase"
            >
              <Play className="w-3 h-3 text-emerald-400" />
              <span>RUN_DEMO_SEQUENCE</span>
            </button>

            <button
              onClick={handleResetData}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 font-mono text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer uppercase"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET_STATE_MACHINE</span>
            </button>
          </div>

          {/* Monospace System Telemetry Box (Variation 3 Design) */}
          <div className="mt-auto pt-4 border-t border-zinc-800/80 font-mono text-[10px] text-zinc-400 space-y-1 leading-relaxed">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>SYSTEM_OPERATIONAL</span>
            </div>
            <div>Anchor: {currentUser.locationName.split('·')[0].trim()}</div>
            <div>Sub_System: HN-WEB-02 // SKILLS_SWAP</div>
            <div>Radius: 5.0 KM (Campus & Local)</div>
            <div>Platform: Skills Swap Engine</div>
          </div>
        </aside>

        {/* Main Workspace View */}
        <main className="p-5 sm:p-7 overflow-y-auto bg-[#0c0c0e]">
          {/* Active View Routing */}
          {activeTab === 'explore' && (
            <ExploreSkillsView
              currentUser={currentUser}
              providers={allUsers}
              onSelectProvider={(p, skill) => {
                setProposeProvider(p);
                setProposeInitialSkill(skill);
              }}
              onOpenRadar={() => setActiveTab('radar')}
            />
          )}

          {activeTab === 'smart-match' && (
            <IntelligentMatchView
              currentUser={currentUser}
              providers={allUsers}
              userRequests={requests.filter((r) => r.seekerId === currentUser.id)}
              onSelectProviderForExchange={(p, targetSkill) => {
                setProposeProvider(p);
                setProposeInitialSkill(targetSkill);
              }}
              onOpenPostRequest={() => setIsPostRequestModalOpen(true)}
            />
          )}

          {activeTab === 'requests' && (
            <RequestsBoardView
              currentUser={currentUser}
              requests={requests}
              onOpenPostRequest={() => setIsPostRequestModalOpen(true)}
              onRespondToRequest={(req) => {
                const seekerUser = allUsers.find((u) => u.id === req.seekerId);
                if (seekerUser) {
                  setProposeProvider(seekerUser);
                  setProposeInitialSkill(req.skillRequired);
                }
              }}
            />
          )}

          {activeTab === 'exchanges' && (
            <ExchangeManagerView
              currentUser={currentUser}
              proposals={proposals}
              onAcceptProposal={handleAcceptProposal}
              onDeclineProposal={handleDeclineProposal}
              onMarkCompleted={handleMarkCompleted}
              onOpenRateModal={(prop) => setRatingProposal(prop)}
            />
          )}

          {activeTab === 'radar' && (
            <LocationRadarView
              currentUser={currentUser}
              providers={allUsers}
              requests={requests}
              onSelectProvider={(p) => {
                setProposeProvider(p);
                setProposeInitialSkill(p.skillsOffered[0]?.name);
              }}
              onSelectZone={() => {}}
            />
          )}

          {activeTab === 'verification' && (
            <TrustBadgesView
              currentUser={currentUser}
              onVerifySkillBadge={handleVerifySkillBadge}
              onVerifyId={handleVerifyId}
            />
          )}
        </main>
      </div>

      {/* 4. Technical Terminal Footer (as in Variation 3 Design) */}
      <footer className="h-12 border-t border-zinc-800 bg-[#080809] px-4 sm:px-6 flex items-center justify-between text-zinc-500 font-mono text-[10px] select-none">
        <div>SKILLS_SWAP_TERMINAL_V.2.0.26</div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">SKILLS_SWAP // LOCAL_MESH</span>
          <span className="text-emerald-400 font-semibold">PROBLEM_HN_WEB_02 / HACKNOVA_STMT</span>
        </div>
      </footer>

      {/* Modals */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onSaveProfile={handleSaveProfile}
      />

      <PostRequestModal
        isOpen={isPostRequestModalOpen}
        onClose={() => setIsPostRequestModalOpen(false)}
        currentUser={currentUser}
        onCreateRequest={handleCreateRequest}
      />

      <ProposeExchangeModal
        isOpen={Boolean(proposeProvider)}
        onClose={() => {
          setProposeProvider(null);
          setProposeInitialSkill(undefined);
        }}
        currentUser={currentUser}
        provider={proposeProvider}
        initialSkillRequested={proposeInitialSkill}
        onSendProposal={handleSendProposal}
      />

      <RateExchangeModal
        isOpen={Boolean(ratingProposal)}
        onClose={() => setRatingProposal(null)}
        proposal={ratingProposal}
        onSubmitRating={handleSubmitRating}
      />
    </div>
  );
}
