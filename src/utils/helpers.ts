import { WorkoutSession, WorkoutDay, UserPreferences, WeeklyProgress } from '../types';

export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hrs}h ${remainMins}m`;
}

export function getTodayDayName(): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
}

export function getTodaysWorkout(schedule: WorkoutDay[], workoutIds: string[]): string | null {
  const today = getTodayDayName();
  const todaySchedule = schedule.find(s => s.day === today);
  if (todaySchedule && !todaySchedule.isRestDay && todaySchedule.workoutId) {
    return todaySchedule.workoutId;
  }
  return null;
}

export function calculateWeeklyProgress(sessions: WorkoutSession[]): WeeklyProgress {
  const weekStart = getWeekStart();
  const weekSessions = sessions.filter(s => {
    const sessionDate = new Date(s.startedAt);
    const sessionWeekStart = getWeekStart(sessionDate);
    return sessionWeekStart === weekStart;
  });

  return {
    weekStart,
    sessionsCompleted: weekSessions.filter(s => s.completedAt).length,
    totalMinutes: Math.round(weekSessions.reduce((acc, s) => acc + s.duration, 0) / 60),
    totalSets: weekSessions.reduce((acc, s) => acc + s.completedSets, 0),
  };
}

export function getDefaultPreferences(): UserPreferences {
  return {
    restTimerSeconds: 90,
    soundEnabled: true,
    vibrationEnabled: true,
    weeklyGoalSessions: 4,
    name: '',
  };
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
