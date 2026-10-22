import { motion } from 'framer-motion';
import { Calendar, Clock, Target, Trash2, Flame } from 'lucide-react';
import { WorkoutSession } from '../types';
import { formatDuration, formatTime } from '../utils/helpers';
import { workouts } from '../data/workouts';

interface HistoryViewProps {
  sessions: WorkoutSession[];
  onClearHistory: () => void;
}

export function HistoryView({ sessions, onClearHistory }: HistoryViewProps) {
  const completedSessions = sessions.filter(s => s.completedAt);

  return (
    <div className="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">History</h1>
          <p className="text-sm text-neutral-400 mt-1">{completedSessions.length} completed sessions</p>
        </div>
        {completedSessions.length > 0 && (
          <motion.button
            onClick={onClearHistory}
            className="text-xs text-red-400 px-3 py-1.5 rounded-lg bg-red-400/10 min-h-[36px]"
            whileTap={{ scale: 0.95 }}
            aria-label="Clear all history"
          >
            Clear All
          </motion.button>
        )}
      </motion.div>

      {completedSessions.length === 0 ? (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-neutral-800 rounded-2xl flex items-center justify-center">
            <Calendar size={28} className="text-neutral-600" />
          </div>
          <p className="text-neutral-400 font-medium">No sessions yet</p>
          <p className="text-sm text-neutral-600 mt-1">Complete a workout to see it here</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {completedSessions.map((session, i) => {
            const workout = workouts.find(w => w.id === session.workoutId);
            const date = new Date(session.startedAt);
            const completionRate = session.totalSets > 0 
              ? Math.round((session.completedSets / session.totalSets) * 100) 
              : 0;

            return (
              <motion.div
                key={session.id}
                className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{session.workoutName}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {' · '}
                      {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-lime-400/10 px-2 py-1 rounded-lg">
                    <Flame size={10} className="text-lime-400" />
                    <span className="text-xs font-bold text-lime-400">{completionRate}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatDuration(session.duration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target size={12} />
                    {session.completedSets}/{session.totalSets} sets
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-lime-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
