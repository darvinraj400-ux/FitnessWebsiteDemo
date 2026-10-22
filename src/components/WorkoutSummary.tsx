import { motion } from 'framer-motion';
import { Trophy, Clock, Target, Flame, ArrowRight, Home } from 'lucide-react';
import { WorkoutSession, Workout } from '../types';
import { formatDuration, formatTime } from '../utils/helpers';
import { ProgressRing } from './ProgressRing';

interface WorkoutSummaryProps {
  session: WorkoutSession;
  workout: Workout;
  onGoHome: () => void;
  onRepeat: () => void;
}

export function WorkoutSummary({ session, workout, onGoHome, onRepeat }: WorkoutSummaryProps) {
  const completionRate = session.totalSets > 0 
    ? Math.round((session.completedSets / session.totalSets) * 100) 
    : 0;
  const isComplete = completionRate === 100;

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-6 py-12">
      {/* Celebration */}
      <motion.div
        className="text-center mb-8"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
      >
        <motion.div
          className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isComplete ? 'bg-lime-400/20' : 'bg-orange-400/20'
          }`}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
        >
          <Trophy size={40} className={isComplete ? 'text-lime-400' : 'text-orange-400'} />
        </motion.div>
        <h1 className="text-3xl font-black text-white uppercase">
          {isComplete ? 'Crushed It!' : 'Good Effort!'}
        </h1>
        <p className="text-neutral-400 mt-2">
          {isComplete ? 'All sets completed. Beast mode activated.' : 'Every rep counts. Keep pushing.'}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="w-full max-w-sm space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-neutral-900 rounded-2xl p-5 border border-neutral-800">
          <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-4">{workout.name}</h3>
          
          <div className="flex items-center justify-center mb-4">
            <ProgressRing
              progress={completionRate}
              size={100}
              strokeWidth={8}
              label={`${completionRate}%`}
              sublabel="complete"
              color={isComplete ? '#BEFF3C' : '#FB923C'}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock size={12} className="text-lime-400" />
              </div>
              <p className="text-lg font-bold text-white">{formatDuration(session.duration)}</p>
              <p className="text-[10px] text-neutral-500">Duration</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target size={12} className="text-lime-400" />
              </div>
              <p className="text-lg font-bold text-white">{session.completedSets}</p>
              <p className="text-[10px] text-neutral-500">Sets Done</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame size={12} className="text-orange-400" />
              </div>
              <p className="text-lg font-bold text-white">{workout.exercises.length}</p>
              <p className="text-[10px] text-neutral-500">Exercises</p>
            </div>
          </div>
        </div>

        {/* Exercise Breakdown */}
        <div className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800">
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Exercise Breakdown</h4>
          <div className="space-y-2">
            {workout.exercises.map((ex) => {
              const exerciseData = session.exercises.find(e => e.exerciseId === ex.id);
              const setsDone = exerciseData?.setsCompleted.length || 0;
              return (
                <div key={ex.id} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-neutral-300 truncate flex-1">{ex.name}</span>
                  <span className={`text-xs font-medium ${setsDone === ex.sets ? 'text-lime-400' : 'text-neutral-500'}`}>
                    {setsDone}/{ex.sets}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        className="w-full max-w-sm space-y-3 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          onClick={onRepeat}
          className="w-full bg-lime-400 text-neutral-900 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 min-h-[52px]"
          whileTap={{ scale: 0.97 }}
        >
          <ArrowRight size={18} />
          Repeat Workout
        </motion.button>
        <motion.button
          onClick={onGoHome}
          className="w-full bg-neutral-800 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 min-h-[48px]"
          whileTap={{ scale: 0.97 }}
        >
          <Home size={16} />
          Back to Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
}
