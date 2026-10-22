export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
  instructions: string;
  muscleGroup: string;
}

export interface Workout {
  id: string;
  name: string;
  goal: 'strength' | 'hypertrophy' | 'endurance' | 'flexibility';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  exercises: Exercise[];
  description: string;
}

export interface WorkoutDay {
  day: string;
  workoutId: string | null;
  isRestDay: boolean;
}

export interface CompletedExercise {
  exerciseId: string;
  setsCompleted: number[];
  completedAt: string;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  workoutName: string;
  startedAt: string;
  completedAt: string | null;
  exercises: CompletedExercise[];
  totalSets: number;
  completedSets: number;
  duration: number;
}

export interface UserPreferences {
  restTimerSeconds: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  weeklyGoalSessions: number;
  name: string;
}

export interface WeeklyProgress {
  weekStart: string;
  sessionsCompleted: number;
  totalMinutes: number;
  totalSets: number;
}

export type ViewType = 'dashboard' | 'schedule' | 'programs' | 'session' | 'history' | 'settings' | 'summary';
