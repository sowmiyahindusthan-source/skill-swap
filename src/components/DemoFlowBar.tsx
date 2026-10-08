import React from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface DemoFlowBarProps {
  currentStage: number; // 1 to 6
  onSelectStep: (step: number) => void;
  onAutoRunDemo: () => void;
  onResetData: () => void;
  isAutoRunning?: boolean;
}

export const DemoFlowBar: React.FC<DemoFlowBarProps> = ({
  currentStage,
  onSelectStep,
  onAutoRunDemo,
  onResetData,
  isAutoRunning = false,
}) => {
  const steps = [
    { num: 1, label: '01_PROFILE', desc: 'Skills & Schedule' },
    { num: 2, label: '02_SEARCH_REQ', desc: 'Query Need' },
    { num: 3, label: '03_MATCH', desc: 'Score Matrix' },
    { num: 4, label: '04_ACCEPT', desc: 'Agreement' },
    { num: 5, label: '05_COMPLETE', desc: 'Execution' },
    { num: 6, label: '06_RATE', desc: 'Reputation' },
  ];

  return (
    <div className="bg-[#080809] border-b border-zinc-800/80 px-4 py-2 select-none">
      <div className="max-w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: System label */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-[2px] tracking-wider font-bold">
            HN-WEB-02 // SKILLS_SWAP
          </div>
          <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-wider hidden sm:inline">
            Skills Swap Execution Engine
          </span>
        </div>

        {/* Center: Sequence Steps */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5">
          {steps.map((s) => {
            const isActive = currentStage === s.num;
            const isCompleted = currentStage > s.num;

            return (
              <button
                key={s.num}
                onClick={() => onSelectStep(s.num)}
                className={`font-mono text-[11px] px-2.5 py-1 rounded-[2px] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-zinc-800 text-white border-emerald-400/80 shadow-xs'
                    : isCompleted
                    ? 'bg-[#111113] text-emerald-400 border-zinc-800 hover:border-zinc-700'
                    : 'bg-[#0c0c0e] text-zinc-500 border-zinc-900 hover:text-zinc-300 hover:border-zinc-800'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-[2px] flex items-center justify-center text-[9px] font-bold ${
                    isActive
                      ? 'bg-emerald-400 text-black'
                      : isCompleted
                      ? 'bg-emerald-950 text-emerald-300'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {s.num}
                </span>
                <span className="tracking-wider">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onAutoRunDemo}
            disabled={isAutoRunning}
            className="flex items-center gap-1.5 px-3 py-1 font-mono text-[11px] font-bold bg-emerald-500 text-black hover:bg-emerald-400 transition-colors cursor-pointer rounded-[2px] uppercase disabled:opacity-50"
            title="Automatically run the entire 6-step lifecycle sequence"
          >
            <Play className={`w-3 h-3 fill-current ${isAutoRunning ? 'animate-spin' : ''}`} />
            <span>{isAutoRunning ? 'RUNNING...' : 'AUTO_SEQUENCE'}</span>
          </button>

          <button
            onClick={onResetData}
            className="flex items-center gap-1 px-2.5 py-1 font-mono text-[11px] text-zinc-400 bg-transparent border border-zinc-800 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer rounded-[2px] uppercase"
            title="Reset database to initial state"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET_DB</span>
          </button>
        </div>
      </div>
    </div>
  );
};
