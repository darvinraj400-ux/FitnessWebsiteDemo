import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, RotateCcw, Check, ChevronRight, ChevronLeft, X, Volume2, VolumeX, SkipForward } from 'lucide-react';
import { Workout, WorkoutSession, UserPreferences } from '../types';
import { useTimer } from '../hooks/useTimer';
import { formatTime, generateId } from '../utils/helpers';
import { ProgressRing } from './ProgressRing';

interface WorkoutSessionViewProps {
  workout: Workout;
  preferences: UserPreferences;
  onComplete: (session: WorkoutSession) => void;
  onFinish: (session: WorkoutSession) => void;
}

export function WorkoutSessionView({ workout, preferences, onComplete, onFinish }: WorkoutSessionViewProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean[]>>({});
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [startTime] = useState(Date.now());
  const [soundEnabled, setSoundEnabled] = useState(preferences.soundEnabled);
  const restTimerRef = useRef<HTMLDivElement>(null);

  const currentExercise = workout.exercises[currentExerciseIndex];
  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const completedSetsCount = Object.values(completedSets).flat().filter(Boolean).length;
  const progress = totalSets > 0 ? (completedSetsCount / totalSets) * 100 : 0;

  const playBeep = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 1100;
        osc2.type = 'sine';
        gain2.gain.value = 0.3;
        osc2.start();
        osc2.stop(ctx.currentTime + 0.2);
      }, 200);
    } catch {}
  }, [soundEnabled]);

  const timer = useTimer(currentExercise.restSeconds, () => {
    playBeep();
    if (preferences.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  });

  // Initialize completed sets for current exercise
  useEffect(() => {
    if (!completedSets[currentExercise.id]) {
      setCompletedSets(prev => ({
        ...prev,
        [currentExercise.id]: Array(currentExercise.sets).fill(false),
      }));
    }
  }, [currentExercise.id, currentExercise.sets]);

  const toggleSet = (setIndex: number) => {
    setCompletedSets(prev => {
      const exerciseSets = [...(prev[currentExercise.id] || Array(currentExercise.sets).fill(false))];
      exerciseSets[setIndex] = !exerciseSets[setIndex];
      
      // Start rest timer when completing a set
      if (exerciseSets[setIndex]) {
        setShowRestTimer(true);
        timer.start(currentExercise.restSeconds);
      }
      
      return {
        ...prev,
        [currentExercise.id]: exerciseSets,
      };
    });
  };

  const nextExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setShowRestTimer(false);
      timer.reset();
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setShowRestTimer(false);
      timer.reset();
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const finishWorkout = () => {
    const session: WorkoutSession = {
      id: generateId(),
      workoutId: workout.id,
      workoutName: workout.name,
      startedAt: new Date(startTime).toISOString(),
      completedAt: new Date().toISOString(),
      exercises: Object.entries(completedSets).map(([exerciseId, sets]) => ({
        exerciseId,
        setsCompleted: sets.map((done, i) => done ? i : -1).filter(i => i >= 0),
        completedAt: new Date().toISOString(),
      })),
      totalSets,
      completedSets: completedSetsCount,
      duration: Math.round((Date.now() - startTime) / 1000),
    };
    onComplete(session);
    onFinish(session);
  };

  const skipRest = () => {
    setShowRestTimer(false);
    timer.reset();
  };

  const exerciseSets = completedSets[currentExercise.id] || Array(currentExercise.sets).fill(false);
  const allSetsDone = exerciseSets.every(Boolean);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-lg border-b border-neutral-800 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-white truncate">{workout.name}</h2>
            <p className="text-xs text-neutral-400">
              Exercise {currentExerciseIndex + 1}/{workout.exercises.length}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ProgressRing progress={progress} size={44} strokeWidth={4} label={`${Math.round(progress)}%`} />
            <motion.button
              onClick={finishWorkout}
              className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-medium min-h-[36px]"
              whileTap={{ scale: 0.95 }}
            >
              Finish
            </motion.button>
          </div>
        </div>
      </div>

      {/* Exercise Content */}
      <div className="flex-1 px-4 py-4 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExercise.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Exercise Header */}
            <div className="mb-6">
              <span className="text-xs font-medium text-lime-400 uppercase tracking-wider">
                {currentExercise.muscleGroup}
              </span>
              <h3 className="text-2xl font-black text-white mt-1">{currentExercise.name}</h3>
              <p className="text-sm text-neutral-400 mt-2">{currentExercise.instructions}</p>
            </div>

            {/* Sets */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-neutral-300 uppercase">Sets</h4>
                <span className="text-xs text-neutral-500">{currentExercise.sets} × {currentExercise.reps}</span>
              </div>
              <div className="space-y-2">
                {exerciseSets.map((done, i) => (
                  <motion.button
                    key={i}
                    onClick={() => toggleSet(i)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border min-h-[52px] transition-colors ${
                      done
                        ? 'bg-lime-400/10 border-lime-400/30'
                        : 'bg-neutral-900 border-neutral-800'
                    }`}
                    whileTap={{ scale: 0.98 }}
                    role="checkbox"
                    aria-checked={done}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      done ? 'bg-lime-400' : 'bg-neutral-800 border border-neutral-700'
                    }`}>
                      {done && <Check size={14} className="text-neutral-900" />}
                    </div>
                    <span className={`text-sm font-medium ${done ? 'text-lime-400' : 'text-white'}`}>
                      Set {i + 1}
                    </span>
                    <span className="text-xs text-neutral-500 ml-auto">{currentExercise.reps} reps</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center gap-3 mb-6">
          <motion.button
            onClick={prevExercise}
            disabled={currentExerciseIndex === 0}
            className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center disabled:opacity-30 min-h-[48px]"
            whileTap={{ scale: 0.9 }}
            aria-label="Previous exercise"
          >
            <ChevronLeft size={20} className="text-white" />
          </motion.button>
          <motion.button
            onClick={nextExercise}
            disabled={currentExerciseIndex === workout.exercises.length - 1}
            className="flex-1 bg-neutral-800 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-30 min-h-[48px]"
            whileTap={{ scale: 0.97 }}
          >
            Next Exercise
            <ChevronRight size={16} />
          </motion.button>
        </div>
      </div>

      {/* Rest Timer Overlay */}
      <AnimatePresence>
        {showRestTimer && (
          <motion.div
            ref={restTimerRef}
            className="fixed inset-x-0 bottom-0 z-50 bg-neutral-900/98 backdrop-blur-xl border-t border-neutral-700 rounded-t-3xl safe-bottom"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-label="Rest timer"
          >
            <div className="px-6 pt-6 pb-8 max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Rest Timer</h3>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="w-9 h-9 bg-neutral-800 rounded-lg flex items-center justify-center"
                    whileTap={{ scale: 0.9 }}
                    aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
                  >
                    {soundEnabled ? <Volume2 size={16} className="text-neutral-400" /> : <VolumeX size={16} className="text-neutral-600" />}
                  </motion.button>
                  <motion.button
                    onClick={skipRest}
                    className="w-9 h-9 bg-neutral-800 rounded-lg flex items-center justify-center"
                    whileTap={{ scale: 0.9 }}
                    aria-label="Skip rest"
                  >
                    <X size={16} className="text-neutral-400" />
                  </motion.button>
                </div>
              </div>

              {/* Timer Display */}
              <div className="flex flex-col items-center mb-6">
                <ProgressRing
                  progress={timer.progress}
                  size={140}
                  strokeWidth={10}
                  label={formatTime(timer.timeLeft)}
                  sublabel={timer.status === 'finished' ? 'DONE!' : 'remaining'}
                />
                <p className="text-xs text-neutral-500 mt-3">
                  {currentExercise.name} · {currentExercise.restSeconds}s rest
                </p>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  onClick={() => timer.reset(currentExercise.restSeconds)}
                  className="w-14 h-14 bg-neutral-800 rounded-full flex items-center justify-center"
                  whileTap={{ scale: 0.9 }}
                  aria-label="Reset timer"
                >
                  <RotateCcw size={20} className="text-neutral-400" />
                </motion.button>

                {timer.status === 'running' ? (
                  <motion.button
                    onClick={timer.pause}
                    className="w-18 h-18 bg-lime-400 rounded-full flex items-center justify-center"
                    whileTap={{ scale: 0.9 }}
                    aria-label="Pause timer"
                    style={{ width: 72, height: 72 }}
                  >
                    <Pause size={28} className="text-neutral-900" />
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={timer.status === 'paused' ? timer.resume : () => timer.start(currentExercise.restSeconds)}
                    className="w-18 h-18 bg-lime-400 rounded-full flex items-center justify-center"
                    whileTap={{ scale: 0.9 }}
                    aria-label={timer.status === 'paused' ? 'Resume timer' : 'Start timer'}
                    style={{ width: 72, height: 72 }}
                  >
                    <Play size={28} className="text-neutral-900" fill="currentColor" />
                  </motion.button>
                )}

                <motion.button
                  onClick={skipRest}
                  className="w-14 h-14 bg-neutral-800 rounded-full flex items-center justify-center"
                  whileTap={{ scale: 0.9 }}
                  aria-label="Skip to next set"
                >
                  <SkipForward size={20} className="text-neutral-400" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
