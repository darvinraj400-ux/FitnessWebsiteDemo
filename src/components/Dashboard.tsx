import { motion } from 'framer-motion';
import { Play, TrendingUp, Clock, Target, Flame } from 'lucide-react';
import { ProgressRing } from './ProgressRing';
import { WorkoutSession, WorkoutDay, UserPreferences, Workout } from '../types';
import { calculateWeeklyProgress, getTodayDayName, getTodaysWorkout, formatDuration } from '../utils/helpers';
import { workouts } from '../data/workouts';

interface DashboardProps {
  sessions: WorkoutSession[];
  schedule: WorkoutDay[];
  preferences: UserPreferences;
  onStartWorkout: (workoutId: string) => void;
  onNavigate: (view: 'schedule' | 'programs') => void;
}

export function Dashboard({ sessions, schedule, preferences, onStartWorkout, onNavigate }: DashboardProps) {
  const progress = calculateWeeklyProgress(sessions);
  const todayWorkoutId = getTodaysWorkout(schedule, workouts.map(w => w.id));
  const todayWorkout = todayWorkoutId ? workouts.find(w => w.id === todayWorkoutId) : null;
  const todayName = getTodayDayName();
  const goalProgress = preferences.weeklyGoalSessions > 0 
    ? (progress.sessionsCompleted / preferences.weeklyGoalSessions) * 100 
    : 0;
  const totalAllTime = sessions.filter(s => s.completedAt).length;

  return (
    <div className="px-4 pt-4 pb-24 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-neutral-400 text-sm">{todayName}</p>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          Hey, {preferences.name || 'Athlete'}
        </h1>
      </motion.div>

      {/* Weekly Progress */}
      <motion.div
        className="bg-neutral-900 rounded-2xl p-5 mb-4 border border-neutral-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">Weekly Progress</h2>
          <span className="text-xs text-neutral-500">Demo data</span>
        </div>
        <div className="flex items-center gap-6">
          <ProgressRing
            progress={goalProgress}
            size={90}
            strokeWidth={8}
            label={`${progress.sessionsCompleted}/${preferences.weeklyGoalSessions}`}
            sublabel="sessions"
          />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-lime-400" />
              <span className="text-sm text-neutral-300">{formatDuration(progress.totalMinutes * 60)} trained</span>
            </div>
            <div className="flex items-center gap-2">
              <Target size={14} className="text-lime-400" />
              <span className="text-sm text-neutral-300">{progress.totalSets} sets completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame size={14} className="text-orange-400" />
              <span className="text-sm text-neutral-300">{totalAllTime} all-time sessions</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Today's Workout */}
      {todayWorkout && (
        <motion.div
          className="bg-gradient-to-br from-lime-400/10 to-lime-400/5 rounded-2xl p-5 mb-4 border border-lime-400/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-lime-400" />
            <span className="text-xs font-bold text-lime-400 uppercase tracking-wider">Today's Workout</span>
          </div>
          <h3 className="text-xl font-black text-white mb-1">{todayWorkout.name}</h3>
          <p className="text-sm text-neutral-400 mb-4">{todayWorkout.exercises.length} exercises · ~{todayWorkout.estimatedMinutes}min</p>
          <motion.button
            onClick={() => onStartWorkout(todayWorkout.id)}
            className="w-full bg-lime-400 text-neutral-900 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 min-h-[48px]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <Play size={18} fill="currentColor" />
            Start Workout
          </motion.button>
        </motion.div>
      )}

      {!todayWorkout && (
        <motion.div
          className="bg-neutral-900 rounded-2xl p-5 mb-4 border border-neutral-800 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-neutral-400 mb-3">Rest day today. Recovery is part of training!</p>
          <motion.button
            onClick={() => onNavigate('programs')}
            className="bg-neutral-800 text-white font-medium py-2.5 px-6 rounded-xl min-h-[44px]"
            whileTap={{ scale: 0.97 }}
          >
            Browse Workouts
          </motion.button>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div
        className="grid grid-cols-3 gap-3 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-neutral-900 rounded-xl p-3 text-center border border-neutral-800">
          <p className="text-2xl font-black text-lime-400">{progress.sessionsCompleted}</p>
          <p className="text-[10px] text-neutral-500 uppercase mt-1">This Week</p>
        </div>
        <div className="bg-neutral-900 rounded-xl p-3 text-center border border-neutral-800">
          <p className="text-2xl font-black text-white">{totalAllTime}</p>
          <p className="text-[10px] text-neutral-500 uppercase mt-1">Total</p>
        </div>
        <div className="bg-neutral-900 rounded-xl p-3 text-center border border-neutral-800">
          <p className="text-2xl font-black text-orange-400">{Math.round(goalProgress)}%</p>
          <p className="text-[10px] text-neutral-500 uppercase mt-1">Goal</p>
        </div>
      </motion.div>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-3">Recent Sessions</h2>
          <div className="space-y-2">
            {sessions.slice(0, 3).map((session, i) => {
              const workout = workouts.find(w => w.id === session.workoutId);
              return (
                <motion.div
                  key={session.id}
                  className="bg-neutral-900 rounded-xl p-3 flex items-center gap-3 border border-neutral-800"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center">
                    <Flame size={16} className="text-lime-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{session.workoutName}</p>
                    <p className="text-xs text-neutral-500">
                      {new Date(session.startedAt).toLocaleDateString()} · {session.completedSets} sets
                    </p>
                  </div>
                  <span className="text-xs text-neutral-400">{formatDuration(session.duration)}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
