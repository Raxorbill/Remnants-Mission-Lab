import React from 'react';
import { ArrowLeft, Rocket, CheckCircle2, ShieldCheck, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import { MissionData, RoverChoice } from '../types/game';
import { ROVER_CHOICES } from '../data/missionsData';

interface MissionBriefingProps {
  mission: MissionData;
  roverChoice?: 'spirit' | 'opportunity';
  onStartMission: () => void;
  onBack: () => void;
}

export const MissionBriefing: React.FC<MissionBriefingProps> = ({
  mission,
  roverChoice = 'spirit',
  onStartMission,
  onBack
}) => {
  const roverInfo = mission.id === 'spirit-opportunity'
    ? ROVER_CHOICES.find(r => r.roverId === roverChoice)
    : null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto bg-[#07111f] select-none text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_20%,rgba(0,217,245,0.1),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl bg-[#0b1020]/95 border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col my-auto">
        {/* Top Navigation & Mission Identity */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <button
            onClick={() => {
              soundEngine.playClick();
              onBack();
            }}
            className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO MISSION ARCHIVE</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono">
              MISSION {mission.number} · {mission.destination}
            </span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-6">
          <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold mb-1">
            {mission.spacecraftType}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-wide">
            {mission.name}
            {roverInfo && <span className="text-amber-400 ml-2">({roverInfo.name})</span>}
          </h1>
          <p className="text-sm font-mono text-slate-400 uppercase tracking-wider">
            {mission.subtitle}
          </p>
        </div>

        {/* Historical Context & Story */}
        <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/10 text-sm leading-relaxed text-slate-300 font-light">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-2">
            <BookOpen className="w-4 h-4" />
            <span>HISTORICAL MISSION CONTEXT · {mission.dateOrEra}</span>
          </div>
          <p>{mission.historicalContext}</p>
          {roverInfo && (
            <p className="mt-2 text-amber-200/90 font-mono text-xs">
              Selected Target: {roverInfo.location} — {roverInfo.objectiveHint}
            </p>
          )}
        </div>

        {/* Two-Column: Key Components & Required Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Scientific Equipment */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Key Mission Equipment</span>
            </div>
            <div className="space-y-3">
              {mission.keyComponents.map((comp) => (
                <div key={comp.name} className="border-l-2 border-cyan-500/40 pl-3">
                  <div className="text-xs font-semibold text-slate-200">{comp.name}</div>
                  <div className="text-[11px] text-slate-400 leading-snug">{comp.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission Objectives */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Required Mission Objectives</span>
            </div>
            <div className="space-y-2.5">
              {mission.objectives.map((obj, idx) => (
                <div key={obj.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-black/30 border border-white/5">
                  <span className="text-xs font-mono font-bold text-cyan-400 mt-0.5">
                    0{idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{obj.title}</div>
                    <div className="text-[11px] text-slate-400">{obj.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Truth Labels */}
        <div className="mb-6 flex flex-wrap gap-2">
          {mission.truthLabels.map((lbl, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 p-2.5 rounded-lg text-xs leading-tight flex-1 min-w-[240px] ${
                lbl.type === 'MISSION FACT'
                  ? 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-200'
                  : 'bg-indigo-950/40 border border-indigo-500/30 text-indigo-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-mono font-bold block text-[10px] tracking-wider mb-0.5">
                  {lbl.type}
                </span>
                <span className="text-[11px] opacity-90">{lbl.text}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Start Mission Button */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <div className="text-xs font-mono text-slate-400">
            Location: <span className="text-slate-300">{mission.locationDetails}</span>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onStartMission();
            }}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-semibold tracking-wider text-xs flex items-center gap-2.5 transition-all shadow-lg shadow-cyan-500/30 cursor-pointer active:scale-95"
          >
            <Rocket className="w-4 h-4" />
            <span>START MISSION {mission.number}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
