import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ViewType, WorkoutSession, WorkoutDay, UserPreferences, Workout } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { workouts, defaultSchedule } from './data/workouts';
import { getDefaultPreferences } from './utils/helpers';
import { Navigation } from './components/Navigation';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Dashboard } from './components/Dashboard';
import { ScheduleView } from './components/ScheduleView';
import { ProgramsView } from './components/ProgramsView';
import { WorkoutSessionView } from './components/WorkoutSessionView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { WorkoutSummary } from './components/WorkoutSummary';

function App() {
  const [isFirstTime, setIsFirstTime] = useLocalStorage('repclub-first-time', true);
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>('repclub-preferences', getDefaultPreferences());
  const [schedule, setSchedule] = useLocalStorage<WorkoutDay[]>('repclub-schedule', defaultSchedule);
  const [sessions, setSessions] = useLocalStorage<WorkoutSession[]>('repclub-sessions', []);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [completedSession, setCompletedSession] = useState<WorkoutSession | null>(null);

  const handleWelcomeComplete = useCallback((name: string) => {
    setPreferences(prev => ({ ...prev, name }));
    setIsFirstTime(false);
  }, [setPreferences, setIsFirstTime]);

  const handleStartWorkout = useCallback((workoutId: string) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (workout) {
      setActiveWorkout(workout);
      setCurrentView('session');
    }
  }, []);

  const handleWorkoutComplete = useCallback((session: WorkoutSession) => {
    setSessions(prev => [session, ...prev]);
    setCompletedSession(session);
    setActiveWorkout(null);
    setCurrentView('summary');
  }, [setSessions]);

  const handleFinishSession = useCallback((session: WorkoutSession) => {
    // This is called by the session view before showing summary
  }, []);

  const handleClearHistory = useCallback(() => {
    setSessions([]);
  }, [setSessions]);

  const handleReset = useCallback(() => {
    setPreferences(getDefaultPreferences());
    setSchedule(defaultSchedule);
    setSessions([]);
    setIsFirstTime(true);
    setCurrentView('dashboard');
  }, [setPreferences, setSchedule, setSessions, setIsFirstTime]);

  const handleNavigate = useCallback((view: ViewType) => {
    setCurrentView(view);
    if (view !== 'session') {
      setActiveWorkout(null);
    }
    if (view !== 'summary') {
      setCompletedSession(null);
    }
  }, []);

  // First time user
  if (isFirstTime) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  // Workout summary view
  if (currentView === 'summary' && completedSession && activeWorkout === null) {
    const workout = workouts.find(w => w.id === completedSession.workoutId);
    if (workout) {
      return (
        <WorkoutSummary
          session={completedSession}
          workout={workout}
          onGoHome={() => handleNavigate('dashboard')}
          onRepeat={() => handleStartWorkout(workout.id)}
        />
      );
    }
  }

  // Active workout session
  if (currentView === 'session' && activeWorkout) {
    return (
      <WorkoutSessionView
        workout={activeWorkout}
        preferences={preferences}
        onComplete={handleWorkoutComplete}
        onFinish={handleFinishSession}
      />
    );
  }

  // Main views
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            sessions={sessions}
            schedule={schedule}
            preferences={preferences}
            onStartWorkout={handleStartWorkout}
            onNavigate={handleNavigate}
          />
        );
      case 'schedule':
        return (
          <ScheduleView
            schedule={schedule}
            onUpdateSchedule={setSchedule}
            onStartWorkout={handleStartWorkout}
          />
        );
      case 'programs':
        return (
          <ProgramsView onStartWorkout={handleStartWorkout} />
        );
      case 'history':
        return (
          <HistoryView
            sessions={sessions}
            onClearHistory={handleClearHistory}
          />
        );
      case 'settings':
        return (
          <SettingsView
            preferences={preferences}
            onSave={setPreferences}
            onReset={handleReset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <AnimatePresence mode="wait">
        <motion.main
          key={currentView}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="pb-20"
        >
          {renderView()}
        </motion.main>
      </AnimatePresence>
      <Navigation currentView={currentView} onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
