import React from 'react';
import { CheckCircle2, RotateCcw, ListFilter, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import { MissionData } from '../types/game';

interface MissionCompleteModalProps {
  mission: MissionData;
  onReplay: () => void;
  onReturnToSelection: () => void;
}

export const MissionCompleteModal: React.FC<MissionCompleteModalProps> = ({
  mission,
  onReplay,
  onReturnToSelection,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md select-none text-white">
      <div className="relative w-full max-w-2xl bg-[#0b1020] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,217,245,0.2)] p-6 md:p-8 flex flex-col">
        {/* Victory Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-mono tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>MISSION OBJECTIVES FULFILLED</span>
          </div>

          <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold mb-1">
            MISSION {mission.number} COMPLETED
          </h2>
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-white">
            {mission.completionTitle}
          </h1>
        </div>

        {/* Completed Objectives Checklist */}
        <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            Completed Scientific Objectives:
          </div>
          {mission.objectives.map((obj) => (
            <div key={obj.id} className="flex items-center gap-3 text-sm text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{obj.title}</span>
            </div>
          ))}
        </div>

        {/* Learning Card & Verified Historical Fact */}
        <div className="mb-6 p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-sm leading-relaxed text-slate-200">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold uppercase mb-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>EDUCATIONAL TAKEAWAY</span>
          </div>
          <p className="font-light">{mission.learningCard}</p>

          <div className="mt-3 pt-3 border-t border-cyan-500/20 text-xs text-slate-400">
            <strong className="text-cyan-400 font-mono">MISSION FACT: </strong>
            {mission.historicalFact}
          </div>
        </div>

        {/* Truth Disclaimers */}
        <div className="mb-6 flex flex-wrap gap-2 text-[11px] font-mono">
          <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-slate-400 flex items-start gap-2 flex-1">
            <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-300 block mb-0.5">SIMPLIFIED SIMULATION</span>
              Game representations, flight controls, and laser timing are simplified for accessibility while preserving scientific truth.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              soundEngine.playClick();
              onReplay();
            }}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs tracking-wider font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>REPLAY MISSION</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onReturnToSelection();
            }}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono text-xs tracking-wider font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer active:scale-95"
          >
            <ListFilter className="w-4 h-4" />
            <span>RETURN TO MISSION ARCHIVE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
