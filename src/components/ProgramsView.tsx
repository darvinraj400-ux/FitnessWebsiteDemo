import { motion } from 'framer-motion';
import { Play, Clock, Dumbbell, ChevronRight } from 'lucide-react';
import { Workout } from '../types';
import { workouts } from '../data/workouts';
import { useState } from 'react';

interface ProgramsViewProps {
  onStartWorkout: (workoutId: string) => void;
}

type FilterGoal = 'all' | 'strength' | 'hypertrophy' | 'endurance' | 'flexibility';
type FilterDifficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';

export function ProgramsView({ onStartWorkout }: ProgramsViewProps) {
  const [goalFilter, setGoalFilter] = useState<FilterGoal>('all');
  const [diffFilter, setDiffFilter] = useState<FilterDifficulty>('all');
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  const filteredWorkouts = workouts.filter(w => {
    if (goalFilter !== 'all' && w.goal !== goalFilter) return false;
    if (diffFilter !== 'all' && w.difficulty !== diffFilter) return false;
    return true;
  });

  const goalColors: Record<string, string> = {
    strength: 'text-red-400 bg-red-400/10',
    hypertrophy: 'text-blue-400 bg-blue-400/10',
    endurance: 'text-orange-400 bg-orange-400/10',
    flexibility: 'text-purple-400 bg-purple-400/10',
  };

  const diffColors: Record<string, string> = {
    beginner: 'text-green-400 bg-green-400/10',
    intermediate: 'text-yellow-400 bg-yellow-400/10',
    advanced: 'text-red-400 bg-red-400/10',
  };

  return (
    <div className="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">Programs</h1>
        <p className="text-sm text-neutral-400 mt-1">Choose your training focus</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex gap-1.5 flex-shrink-0">
          {(['all', 'strength', 'hypertrophy', 'endurance'] as FilterGoal[]).map(goal => (
            <motion.button
              key={goal}
              onClick={() => setGoalFilter(goal)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap min-h-[36px] ${
                goalFilter === goal
                  ? 'bg-lime-400 text-neutral-900'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {goal === 'all' ? 'All Goals' : goal.charAt(0).toUpperCase() + goal.slice(1)}
            </motion.button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          {(['all', 'beginner', 'intermediate', 'advanced'] as FilterDifficulty[]).map(diff => (
            <motion.button
              key={diff}
              onClick={() => setDiffFilter(diff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap min-h-[36px] ${
                diffFilter === diff
                  ? 'bg-lime-400 text-neutral-900'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {diff === 'all' ? 'All Levels' : diff.charAt(0).toUpperCase() + diff.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Workout List */}
      <div className="space-y-3">
        {filteredWorkouts.map((workout, i) => (
          <motion.div
            key={workout.id}
            className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <button
              onClick={() => setExpandedWorkout(expandedWorkout === workout.id ? null : workout.id)}
              className="w-full p-4 text-left"
              aria-expanded={expandedWorkout === workout.id}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white">{workout.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${goalColors[workout.goal]}`}>
                      {workout.goal}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${diffColors[workout.difficulty]}`}>
                      {workout.difficulty}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className={`text-neutral-500 transition-transform ${expandedWorkout === workout.id ? 'rotate-90' : ''}`}
                />
              </div>
              <p className="text-xs text-neutral-400 mb-2">{workout.description}</p>
              <div className="flex items-center gap-4 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <Dumbbell size={12} />
                  {workout.exercises.length} exercises
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  ~{workout.estimatedMinutes}min
                </span>
              </div>
            </button>

            <motion.div
              initial={false}
              animate={{
                height: expandedWorkout === workout.id ? 'auto' : 0,
                opacity: expandedWorkout === workout.id ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-2">
                {workout.exercises.map((ex, j) => (
                  <div key={ex.id} className="flex items-center gap-3 py-1.5 border-t border-neutral-800">
                    <span className="text-xs text-neutral-600 w-5">{j + 1}.</span>
                    <div className="flex-1">
                      <p className="text-sm text-white">{ex.name}</p>
                      <p className="text-xs text-neutral-500">{ex.sets}×{ex.reps} · {ex.muscleGroup}</p>
                    </div>
                  </div>
                ))}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartWorkout(workout.id);
                  }}
                  className="w-full bg-lime-400 text-neutral-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 mt-3 min-h-[48px]"
                  whileTap={{ scale: 0.97 }}
                >
                  <Play size={16} fill="currentColor" />
                  Start This Workout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {filteredWorkouts.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-neutral-500">No workouts match your filters</p>
        </motion.div>
      )}
    </div>
  );
}
