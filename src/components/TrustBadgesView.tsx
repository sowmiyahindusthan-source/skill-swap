import React, { useState } from 'react';
import { UserProfile } from '../types/exchange';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Star, 
  FileCode, 
  UserCheck, 
  Zap 
} from 'lucide-react';

interface TrustBadgesViewProps {
  currentUser: UserProfile;
  onVerifySkillBadge: (skillName: string) => void;
  onVerifyId: () => void;
}

export const TrustBadgesView: React.FC<TrustBadgesViewProps> = ({
  currentUser,
  onVerifySkillBadge,
  onVerifyId,
}) => {
  const [activeQuizSkill, setActiveQuizSkill] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizSuccess, setQuizSuccess] = useState<boolean>(false);

  const sampleQuiz = {
    skill: 'Python Tutoring & Algorithm Debugging',
    questions: [
      {
        q: 'What is the average time complexity of searching an element in a balanced Binary Search Tree?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
        correct: 1,
      },
      {
        q: 'Which Python keyword is used to create a generator function?',
        options: ['return', 'async', 'yield', 'lambda'],
        correct: 2,
      },
      {
        q: 'In Python, what is the key difference between a list and a tuple?',
        options: [
          'Lists are mutable; tuples are immutable',
          'Lists only hold integers; tuples hold anything',
          'Tuples have O(n) indexing speed',
          'There is no difference',
        ],
        correct: 0,
      },
    ],
  };

  const handleSelectQuizAnswer = (qIdx: number, optIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    const allCorrect = sampleQuiz.questions.every(
      (q, idx) => quizAnswers[idx] === q.correct
    );
    if (allCorrect) {
      setQuizSuccess(true);
      onVerifySkillBadge(sampleQuiz.skill);
    } else {
      alert('One or more answers were incorrect. Please review and try again!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#18181b] border border-zinc-800 rounded-[4px] p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              TRUST_PROTOCOL // VERIFICATION_CENTER
            </p>
            <h2 className="text-xl font-extrabold text-zinc-100 tracking-tight mt-0.5">
              Reputation & Trust Verification Engine
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Decentralized community trust scoring combining institutional ID validation, peer endorsements, artifact proof, and interactive competency challenges.
            </p>
          </div>

          <div>
            {!currentUser.isIdVerified ? (
              <button
                onClick={onVerifyId}
                className="px-3.5 py-1.5 font-mono text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black rounded-[2px] transition-colors cursor-pointer uppercase tracking-wider"
              >
                VERIFY_CAMPUS_ID (.EDU)
              </button>
            ) : (
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-[2px] border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" />
                <span>STUDENT_ID_VERIFIED</span>
              </div>
            )}
          </div>
        </div>

        {/* Reputation Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="bg-[#111113] rounded-[2px] p-3 border border-zinc-800 text-center">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-0.5">
              TRUST_SCORE
            </span>
            <div className="flex items-center justify-center gap-1 text-xl font-mono font-bold text-emerald-400 tabular-nums">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              {currentUser.reputationScore.toFixed(1)}
            </div>
            <p className="font-mono text-[9px] text-zinc-500 mt-0.5">PEER_RATED</p>
          </div>

          <div className="bg-[#111113] rounded-[2px] p-3 border border-zinc-800 text-center">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-0.5">
              COMPLETED_EXCHANGES
            </span>
            <div className="text-xl font-mono font-bold text-zinc-100 tabular-nums">
              {currentUser.totalExchanges}
            </div>
            <p className="font-mono text-[9px] text-zinc-500 mt-0.5">100% FULFILL</p>
          </div>

          <div className="bg-[#111113] rounded-[2px] p-3 border border-zinc-800 text-center">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-0.5">
              RESPONSE_LATENCY
            </span>
            <div className="text-xl font-mono font-bold text-zinc-100 tabular-nums">
              {currentUser.responseRatePct}%
            </div>
            <p className="font-mono text-[9px] text-zinc-500 mt-0.5">&lt; 2 HR LATENCY</p>
          </div>

          <div className="bg-[#111113] rounded-[2px] p-3 border border-zinc-800 text-center">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-0.5">
              TIME_BANK_CREDITS
            </span>
            <div className="text-xl font-mono font-bold text-emerald-400 tabular-nums">
              {currentUser.creditsBalance} HRS
            </div>
            <p className="font-mono text-[9px] text-zinc-500 mt-0.5">BALANCE_OK</p>
          </div>
        </div>
      </div>

      {/* Verification Tiers & Interactive Quiz */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Verification Tiers list */}
        <div className="bg-[#18181b] border border-zinc-800 rounded-[4px] p-5 space-y-3.5">
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
            VERIFICATION_TIER_PROTOCOLS
          </p>

          <div className="space-y-2.5">
            {/* Tier 1 */}
            <div className="p-3 rounded-[2px] border border-zinc-800 bg-[#111113] flex items-start gap-3">
              <div className="w-7 h-7 rounded-[2px] bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs font-bold text-zinc-200">
                    TIER_1: INSTITUTIONAL_ID
                  </h4>
                  <span className="font-mono text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-[2px]">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Verified campus student or municipal community identity record.
                </p>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="p-3 rounded-[2px] border border-zinc-800 bg-[#111113] flex items-start gap-3">
              <div className="w-7 h-7 rounded-[2px] bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <Award className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs font-bold text-zinc-200">
                    TIER_2: PEER_ENDORSEMENTS
                  </h4>
                  <span className="font-mono text-[9px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded-[2px]">
                    EARNED (14)
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Threshold of 5+ positive reviews from verified peers after exchange.
                </p>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="p-3 rounded-[2px] border border-zinc-800 bg-[#111113] flex items-start gap-3">
              <div className="w-7 h-7 rounded-[2px] bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                <FileCode className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs font-bold text-zinc-200">
                    TIER_3: ARTIFACT_VERIFICATION
                  </h4>
                  <span className="font-mono text-[9px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded-[2px]">
                    GIT_LINKED
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Audited code repos, design prototypes, or performance records.
                </p>
              </div>
            </div>

            {/* Tier 4 */}
            <div className="p-3 rounded-[2px] border border-zinc-800 bg-[#111113] flex items-start gap-3">
              <div className="w-7 h-7 rounded-[2px] bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs font-bold text-zinc-200">
                    TIER_4: COMPETENCY_CHALLENGE
                  </h4>
                  <button
                    onClick={() => {
                      setActiveQuizSkill(sampleQuiz.skill);
                      setQuizSuccess(false);
                      setQuizAnswers({});
                    }}
                    className="font-mono text-[9px] font-bold text-black bg-amber-400 hover:bg-amber-300 px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer uppercase"
                  >
                    TEST_NOW
                  </button>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Interactive 3-question skill test to earn instant verified badge.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Challenge Panel */}
        <div className="bg-[#18181b] border border-zinc-800 rounded-[4px] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
              <h3 className="font-mono text-xs font-bold text-zinc-200 flex items-center gap-1.5 uppercase">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>COMPETENCY_CHECK // PYTHON</span>
              </h3>
              <span className="font-mono text-[10px] text-zinc-500">
                TIME: NO_LIMIT
              </span>
            </div>

            {quizSuccess ? (
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-[2px] text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h4 className="font-mono text-sm font-bold text-emerald-400 uppercase">
                  VERIFICATION_STATUS: GRANTED
                </h4>
                <p className="text-xs text-zinc-300 max-w-sm mx-auto">
                  All 3 competency questions answered accurately. The Verified Credential badge is now active on your public profile!
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setQuizSuccess(false)}
                    className="font-mono text-xs font-bold px-3 py-1 bg-zinc-800 text-zinc-200 hover:text-white rounded-[2px] cursor-pointer uppercase"
                  >
                    CLOSE_CHALLENGE
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-zinc-400">
                  Prove core Python algorithmic knowledge to earn the verified peer credential.
                </p>

                {sampleQuiz.questions.map((item, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-3 rounded-[2px] border border-zinc-800 bg-[#111113] space-y-1.5"
                  >
                    <p className="font-mono text-xs font-bold text-zinc-200">
                      0{qIdx + 1}. {item.q}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {item.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectQuizAnswer(qIdx, optIdx)}
                          className={`text-left font-mono text-[11px] p-1.5 rounded-[2px] transition-colors cursor-pointer border ${
                            quizAnswers[qIdx] === optIdx
                              ? 'bg-zinc-800 text-emerald-400 border-emerald-500/80 font-bold'
                              : 'bg-[#18181b] text-zinc-400 border-zinc-800 hover:text-zinc-200'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!quizSuccess && (
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-500">
                {Object.keys(quizAnswers).length}/3 ANSWERED
              </span>
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(quizAnswers).length < 3}
                className="px-3.5 py-1.5 font-bold bg-emerald-500 hover:bg-emerald-400 text-black rounded-[2px] transition-colors cursor-pointer uppercase disabled:opacity-40"
              >
                SUBMIT_CHALLENGE
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Verified Peer Reviews */}
      <div className="bg-[#18181b] border border-zinc-800 rounded-[4px] p-5 space-y-3">
        <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
          PEER_VERIFICATION_LEDGER ({currentUser.reviews.length})
        </p>

        {currentUser.reviews.length === 0 ? (
          <p className="text-xs text-zinc-500 italic">
            No peer endorsements recorded yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentUser.reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-3.5 rounded-[2px] border border-zinc-800 bg-[#111113] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.reviewerAvatar}
                      alt={rev.reviewerName}
                      className="w-6 h-6 rounded-[2px] object-cover border border-zinc-700"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200">
                        {rev.reviewerName}
                      </h4>
                      <p className="font-mono text-[9px] text-zinc-500">
                        {rev.skillExchanged} · {rev.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-zinc-300 italic font-sans">
                  "{rev.comment}"
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {rev.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-[9px] text-zinc-400 bg-zinc-800/80 px-1.5 py-0.2 rounded-[2px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
