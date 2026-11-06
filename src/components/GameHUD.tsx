import React, { useState } from 'react';
import { Volume2, VolumeX, Pause, CheckCircle2, Circle, Compass, ChevronDown, ChevronUp, Sparkles, RotateCcw, RotateCw, ZoomIn, ZoomOut, Focus } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import { MissionData, MissionTelemetry } from '../types/game';

interface GameHUDProps {
  mission: MissionData;
  completedObjectives: Set<string>;
  lastCompletedTitle?: string | null;
  contextActionLabel: string | null;
  onContextAction: () => void;
  telemetry: MissionTelemetry;
  onPause: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onRotateCamera?: (deltaAzimuth: number) => void;
  onZoomCamera?: (delta: number) => void;
  onResetCamera?: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  mission,
  completedObjectives,
  lastCompletedTitle,
  contextActionLabel,
  onContextAction,
  telemetry,
  onPause,
  isMuted,
  onToggleMute,
  onRotateCamera,
  onZoomCamera,
  onResetCamera,
}) => {
  const [showObjectivesDock, setShowObjectivesDock] = useState(true);

  // Find first uncompleted objective
  const activeObjective = mission.objectives.find(o => !completedObjectives.has(o.id)) || mission.objectives[mission.objectives.length - 1];
  const progressPercent = Math.round((completedObjectives.size / mission.objectives.length) * 100);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 md:p-6 select-none font-sans">
      {/* Top Header Cluster */}
      <div className="flex items-start justify-between w-full">
        {/* Top-Left: Mission Spec & Badge */}
        <div className="pointer-events-auto flex items-center gap-3 bg-[#07111f]/90 border border-white/10 rounded-xl px-4 py-2.5 shadow-lg backdrop-blur-sm">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-mono text-xs font-bold">
            {mission.number}
          </div>
          <div>
            <div className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase font-semibold">
              {mission.destination} · {mission.spacecraftType}
            </div>
            <div className="text-sm font-bold text-white tracking-wide truncate max-w-[200px] md:max-w-xs">
              {mission.name}
            </div>
          </div>
        </div>

        {/* Top-Center: Current Objective Banner & Completed Toast */}
        <div className="pointer-events-auto flex flex-col items-center max-w-lg mx-2 space-y-1.5">
          {/* Objective Completed Toast */}
          {lastCompletedTitle && (
            <div className="animate-pulse flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400 text-emerald-200 font-mono text-xs font-bold shadow-[0_0_25px_rgba(52,211,153,0.4)]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>OBJECTIVE COMPLETE: {lastCompletedTitle}</span>
            </div>
          )}

          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#0b1020]/95 border border-cyan-500/40 shadow-xl text-center">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <div className="text-xs font-mono font-medium text-slate-200">
              <span className="text-cyan-400 font-bold mr-1.5 uppercase">CURRENT GOAL:</span>
              <span>{activeObjective.title}</span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 bg-black/60 px-3 py-0.5 rounded-full border border-white/10">
            {activeObjective.description}
          </div>
        </div>

        {/* Top-Right: Camera Orbit, Zoom, Sound & Pause Controls */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#07111f]/90 border border-white/10 rounded-xl p-1.5 shadow-lg backdrop-blur-sm">
          {/* Camera Orbit Buttons */}
          <div className="flex items-center gap-1 pr-2 border-r border-white/10">
            <button
              onClick={() => {
                soundEngine.playClick();
                onRotateCamera?.(Math.PI / 8);
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer flex items-center gap-1"
              title="Rotate Camera Left (Q or drag)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[9px] font-mono font-bold hidden sm:inline">-45°</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onRotateCamera?.(-Math.PI / 8);
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer flex items-center gap-1"
              title="Rotate Camera Right (R or drag)"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="text-[9px] font-mono font-bold hidden sm:inline">+45°</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onZoomCamera?.(-1.5);
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onZoomCamera?.(1.5);
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onResetCamera?.();
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Reset View"
            >
              <Focus className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onToggleMute();
            }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-cyan-300" />}
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onPause();
            }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Pause Menu (Esc)"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Orbit Camera Hint (Discreet overlay pill) */}
      <div className="pointer-events-none self-center flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-[10px] font-mono text-slate-400">
        <Focus className="w-3 h-3 text-cyan-400" />
        <span>Drag mouse or swipe anywhere to rotate 360° · Q/R keys · Scroll to zoom</span>
      </div>

      {/* Bottom Center: Sleek Collapsible Objective Dock & Progress Bar */}
      <div className="pointer-events-auto self-center flex flex-col items-center max-w-xl w-full mb-1">
        <button
          onClick={() => {
            soundEngine.playClick();
            setShowObjectivesDock(!showObjectivesDock);
          }}
          className="mb-1 px-3 py-0.5 rounded-full bg-[#07111f]/80 border border-white/10 text-[10px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-all cursor-pointer"
        >
          {showObjectivesDock ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          <span>{showObjectivesDock ? 'COLLAPSE OBJECTIVES' : 'EXPAND OBJECTIVES'}</span>
          <span className="text-cyan-400 ml-1">({completedObjectives.size}/{mission.objectives.length})</span>
        </button>

        {showObjectivesDock && (
          <div className="w-full p-3 rounded-xl bg-[#0b1020]/95 border border-white/10 shadow-2xl flex flex-col gap-2 backdrop-blur-sm">
            {/* Progress bar line */}
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center gap-3 justify-between">
              {mission.objectives.map((obj, idx) => {
                const isDone = completedObjectives.has(obj.id);
                return (
                  <div key={obj.id} className="flex items-center gap-2 flex-1 min-w-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    )}
                    <div className="truncate">
                      <div className={`text-[10px] font-mono uppercase ${isDone ? 'text-emerald-300 line-through' : 'text-slate-300'}`}>
                        {idx + 1}. {obj.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Row: Telemetry Cluster & Contextual Action Button */}
      <div className="flex items-end justify-between w-full">
        {/* Bottom-Left: Real-time Telemetry Cluster */}
        <div className="pointer-events-auto p-3 rounded-xl bg-[#07111f]/90 border border-white/10 shadow-lg text-xs font-mono text-slate-300 space-y-1 backdrop-blur-sm">
          <div className="text-[10px] font-semibold text-cyan-400 uppercase tracking-widest flex items-center gap-1 mb-1">
            <Compass className="w-3 h-3" />
            <span>TELEMETRY & SENSORS</span>
          </div>
          {telemetry.speed !== undefined && (
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">SPEED:</span>
              <span className="font-bold tabular-nums text-white">{telemetry.speed} m/s</span>
            </div>
          )}
          {telemetry.altitude !== undefined && (
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">ALTITUDE:</span>
              <span className="font-bold tabular-nums text-cyan-300">{telemetry.altitude} m</span>
            </div>
          )}
          {telemetry.distanceToTarget !== undefined && (
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">BEACON DISTANCE:</span>
              <span className="font-bold tabular-nums text-amber-300">{telemetry.distanceToTarget} m</span>
            </div>
          )}
          {telemetry.rotorRPM !== undefined && (
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">ROTOR SPEED:</span>
              <span className="font-bold tabular-nums text-amber-300">{telemetry.rotorRPM} RPM</span>
            </div>
          )}
          {telemetry.lightTravelTime !== undefined && (
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">ROUND-TRIP LIGHT:</span>
              <span className="font-bold tabular-nums text-emerald-400">{telemetry.lightTravelTime} s</span>
            </div>
          )}
        </div>

        {/* Bottom-Right: Contextual Action Button */}
        <div className="pointer-events-auto">
          {contextActionLabel ? (
            <button
              onClick={() => {
                soundEngine.playClick();
                onContextAction();
              }}
              className="group px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-mono font-bold tracking-wider text-sm flex items-center gap-3 shadow-[0_0_35px_rgba(0,217,245,0.6)] border-2 border-cyan-300/60 cursor-pointer transition-all active:scale-95 animate-pulse"
            >
              <span className="px-2.5 py-1 rounded bg-black/40 border border-white/30 text-xs text-cyan-200 font-bold">
                PRESS E
              </span>
              <span>{contextActionLabel}</span>
            </button>
          ) : (
            <div className="text-[11px] font-mono text-slate-500 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
              Walk or drive towards the glowing waypoint beacon
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
