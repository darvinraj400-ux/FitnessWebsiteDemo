import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, Dumbbell, History, Settings } from 'lucide-react';
import { ViewType } from '../types';

interface NavigationProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

const navItems: { view: ViewType; icon: typeof LayoutDashboard; label: string }[] = [
  { view: 'dashboard', icon: LayoutDashboard, label: 'Home' },
  { view: 'schedule', icon: Calendar, label: 'Schedule' },
  { view: 'programs', icon: Dumbbell, label: 'Workouts' },
  { view: 'history', icon: History, label: 'History' },
  { view: 'settings', icon: Settings, label: 'Settings' },
];

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  const activeView = ['session', 'summary'].includes(currentView) ? 'dashboard' : currentView;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-800 safe-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map(({ view, icon: Icon, label }) => {
          const isActive = activeView === view;
          return (
            <motion.button
              key={view}
              onClick={() => onNavigate(view)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl min-w-[56px] min-h-[44px] transition-colors ${
                isActive ? 'text-lime-400' : 'text-neutral-500'
              }`}
              whileTap={{ scale: 0.9 }}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-lime-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
