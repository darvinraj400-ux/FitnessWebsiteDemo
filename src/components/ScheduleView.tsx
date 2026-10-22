import { motion, AnimatePresence } from 'framer-motion';
import { Check, Play, Moon } from 'lucide-react';
import { WorkoutDay, ViewType } from '../types';
import { workouts } from '../data/workouts';
import { getTodayDayName } from '../utils/helpers';

interface ScheduleViewProps {
  schedule: WorkoutDay[];
  onUpdateSchedule: (schedule: WorkoutDay[]) => void;
  onStartWorkout: (workoutId: string) => void;
}

export function ScheduleView({ schedule, onUpdateSchedule, onStartWorkout }: ScheduleViewProps) {
  const today = getTodayDayName();

  const toggleRestDay = (index: number) => {
    const newSchedule = [...schedule];
    if (newSchedule[index].isRestDay) {
      newSchedule[index] = { ...newSchedule[index], isRestDay: false, workoutId: workouts[0].id };
    } else {
      newSchedule[index] = { ...newSchedule[index], isRestDay: true, workoutId: null };
    }
    onUpdateSchedule(newSchedule);
  };

  const updateWorkout = (index: number, workoutId: string) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], workoutId, isRestDay: false };
    onUpdateSchedule(newSchedule);
  };

  return (
    <div className="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">Weekly Schedule</h1>
        <p className="text-sm text-neutral-400 mt-1">Tap to assign workouts or rest days</p>
      </motion.div>

      <div className="space-y-2">
        {schedule.map((day, index) => {
          const isToday = day.day === today;
          const workout = day.workoutId ? workouts.find(w => w.id === day.workoutId) : null;

          return (
            <motion.div
              key={day.day}
              className={`rounded-2xl p-4 border transition-colors ${
                isToday
                  ? 'bg-lime-400/10 border-lime-400/30'
                  : 'bg-neutral-900 border-neutral-800'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold uppercase ${isToday ? 'text-lime-400' : 'text-white'}`}>
                    {day.day.slice(0, 3)}
                  </span>
                  {isToday && (
                    <span className="text-[10px] bg-lime-400 text-neutral-900 px-1.5 py-0.5 rounded-full font-bold">
                      TODAY
                    </span>
                  )}
                </div>
                <motion.button
                  onClick={() => toggleRestDay(index)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium min-h-[36px] ${
                    day.isRestDay
                      ? 'bg-neutral-800 text-neutral-400'
                      : 'bg-neutral-800 text-neutral-300'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  aria-label={day.isRestDay ? 'Set as training day' : 'Set as rest day'}
                >
                  {day.isRestDay ? <Moon size={12} /> : <Check size={12} />}
                  {day.isRestDay ? 'Rest' : 'Active'}
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {day.isRestDay ? (
                  <motion.p
                    key="rest"
                    className="text-sm text-neutral-500"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    Recovery day
                  </motion.p>
                ) : (
                  <motion.div
                    key="active"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2"
                  >
                    <select
                      value={day.workoutId || ''}
                      onChange={(e) => updateWorkout(index, e.target.value)}
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white min-h-[40px] focus:outline-none focus:ring-2 focus:ring-lime-400"
                      aria-label={`Select workout for ${day.day}`}
                    >
                      {workouts.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                    {workout && (
                      <motion.button
                        onClick={() => onStartWorkout(workout.id)}
                        className="w-10 h-10 bg-lime-400 rounded-lg flex items-center justify-center flex-shrink-0"
                        whileTap={{ scale: 0.9 }}
                        aria-label={`Start ${workout.name}`}
                      >
                        <Play size={16} className="text-neutral-900" fill="currentColor" />
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
