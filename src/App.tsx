import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MissionId, GameScreen, MissionTelemetry, RoverChoice } from './types/game';
import { MISSIONS_DATA } from './data/missionsData';
import { MissionGameEngine } from './game/engine/MissionGameEngine';
import { soundEngine } from './audio/soundEngine';
import { TitleScreen } from './components/TitleScreen';
import { MissionSelectModal } from './components/MissionSelectModal';
import { MissionBriefing } from './components/MissionBriefing';
import { GameHUD } from './components/GameHUD';
import { PauseMenu } from './components/PauseMenu';
import { MissionCompleteModal } from './components/MissionCompleteModal';
import { PhotoCaptureView } from './components/PhotoCaptureView';
import { WaveformView } from './components/WaveformView';
import { GoldenRecordModal } from './components/GoldenRecordModal';
import { ControlsOverlay } from './components/ControlsOverlay';

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<MissionGameEngine | null>(null);

  // High-level Game State
  const [screen, setScreen] = useState<GameScreen>('title');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showSelectModal, setShowSelectModal] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Active Mission Configuration
  const [activeMissionId, setActiveMissionId] = useState<MissionId>('apollo-reflector');
  const [roverChoice, setRoverChoice] = useState<'spirit' | 'opportunity'>('spirit');

  // Dynamic In-Game HUD State
  const [completedObjectives, setCompletedObjectives] = useState<Set<string>>(new Set());
  const [lastCompletedTitle, setLastCompletedTitle] = useState<string | null>(null);
  const [contextActionLabel, setContextActionLabel] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<MissionTelemetry>({});

  // Special Inspection Overlays
  const [specialView, setSpecialView] = useState<{
    type: 'photo' | 'waveform' | 'golden_record';
    data?: any;
  } | null>(null);

  // Initialize 3D Engine on Mount
  useEffect(() => {
    if (!canvasMountRef.current) return;

    const engine = new MissionGameEngine(canvasMountRef.current, {
      onObjectiveUpdate: (objectiveId: string, completed: boolean, title?: string) => {
        setCompletedObjectives(prev => {
          const next = new Set(prev);
          if (completed) next.add(objectiveId);
          else next.delete(objectiveId);
          return next;
        });
        if (completed && title) {
          setLastCompletedTitle(title);
          setTimeout(() => setLastCompletedTitle(null), 4000);
        }
      },
      onContextActionChange: (actionLabel: string | null) => {
        setContextActionLabel(actionLabel);
      },
      onTelemetryUpdate: (newTelemetry: MissionTelemetry) => {
        setTelemetry(prev => ({ ...prev, ...newTelemetry }));
      },
      onMissionComplete: (missionId: MissionId) => {
        setScreen('complete');
      },
      onSpecialView: (viewType, data) => {
        if (!viewType) {
          setSpecialView(null);
        } else {
          setSpecialView({ type: viewType, data });
        }
      }
    });

    engineRef.current = engine;

    // Global Escape Key listener for Pause
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPaused(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  // Launch a Mission into the 3D Engine
  const startPlayingMission = useCallback((missionId: MissionId, rover: 'spirit' | 'opportunity' = 'spirit') => {
    setActiveMissionId(missionId);
    setRoverChoice(rover);
    setCompletedObjectives(new Set());
    setContextActionLabel(null);
    setTelemetry({});
    setSpecialView(null);
    setIsPaused(false);
    setScreen('playing');

    if (engineRef.current) {
      engineRef.current.loadMission(missionId, rover);
    }
  }, []);

  // Audio Toggle
  const handleToggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
  }, [isMuted]);

  const activeMissionData = MISSIONS_DATA[activeMissionId];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#07111f] select-none font-sans">
      {/* 3D WebGL Canvas Viewport (Kept mounted continuously) */}
      <div
        ref={canvasMountRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
          screen === 'playing' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Screen 1: Title Screen */}
      {screen === 'title' && (
        <TitleScreen
          onStart={() => setShowSelectModal(true)}
          onSelectMission={(missionId) => {
            setActiveMissionId(missionId);
            setScreen('briefing');
          }}
        />
      )}

      {/* Mission Selection Catalogue Modal */}
      {showSelectModal && (
        <MissionSelectModal
          onClose={() => setShowSelectModal(false)}
          onSelectMission={(missionId, chosenRover) => {
            setActiveMissionId(missionId);
            if (chosenRover) setRoverChoice(chosenRover);
            setShowSelectModal(false);
            setScreen('briefing');
          }}
        />
      )}

      {/* Screen 2: Mission Briefing */}
      {screen === 'briefing' && (
        <MissionBriefing
          mission={activeMissionData}
          roverChoice={roverChoice}
          onBack={() => setScreen('title')}
          onStartMission={() => startPlayingMission(activeMissionId, roverChoice)}
        />
      )}

      {/* Screen 3: Playing Mode HUD & Overlays */}
      {screen === 'playing' && (
        <>
          <GameHUD
            mission={activeMissionData}
            completedObjectives={completedObjectives}
            lastCompletedTitle={lastCompletedTitle}
            contextActionLabel={contextActionLabel}
            onContextAction={() => engineRef.current?.triggerCurrentContextAction()}
            telemetry={telemetry}
            onPause={() => setIsPaused(true)}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onRotateCamera={(azimuth) => engineRef.current?.rotateCameraOrbit(azimuth, 0)}
            onZoomCamera={(delta) => engineRef.current?.zoomCamera(delta)}
            onResetCamera={() => engineRef.current?.resetCameraOrbit()}
          />

          {/* Mobile Touch Navigation Overlay */}
          <ControlsOverlay
            onDirectionInput={(dir) => {
              if (engineRef.current) {
                engineRef.current.touchJoystick = dir;
              }
            }}
            onAltitudeInput={(delta) => {
              if (engineRef.current) {
                engineRef.current.touchAltitude = delta;
              }
            }}
            onActionButton={() => engineRef.current?.triggerCurrentContextAction()}
            isFlightMission={activeMissionId === 'ingenuity'}
          />

          {/* Pause Menu Overlay */}
          {isPaused && (
            <PauseMenu
              onResume={() => setIsPaused(false)}
              onRestart={() => startPlayingMission(activeMissionId, roverChoice)}
              onReturnToSelection={() => {
                setIsPaused(false);
                setScreen('title');
                setShowSelectModal(true);
              }}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
            />
          )}

          {/* Special Inspection Views */}
          {specialView?.type === 'photo' && (
            <PhotoCaptureView data={specialView.data} />
          )}

          {specialView?.type === 'waveform' && (
            <WaveformView data={specialView.data} />
          )}

          {specialView?.type === 'golden_record' && (
            <GoldenRecordModal
              onClose={() => {
                if (specialView.data?.onClose) {
                  specialView.data.onClose();
                } else {
                  setSpecialView(null);
                }
              }}
            />
          )}
        </>
      )}

      {/* Screen 4: Mission Completed Screen */}
      {screen === 'complete' && (
        <MissionCompleteModal
          mission={activeMissionData}
          onReplay={() => startPlayingMission(activeMissionId, roverChoice)}
          onReturnToSelection={() => {
            setScreen('title');
            setShowSelectModal(true);
          }}
        />
      )}
    </div>
  );
}
