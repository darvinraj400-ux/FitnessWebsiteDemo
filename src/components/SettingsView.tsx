import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, User, Timer, Bell, Target } from 'lucide-react';
import { UserPreferences } from '../types';

interface SettingsViewProps {
  preferences: UserPreferences;
  onSave: (prefs: UserPreferences) => void;
  onReset: () => void;
}

export function SettingsView({ preferences, onSave, onReset }: SettingsViewProps) {
  const [form, setForm] = useState<UserPreferences>({ ...preferences });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('This will clear all your data including workout history and preferences. Continue?')) {
      onReset();
    }
  };

  return (
    <div className="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">Settings</h1>
        <p className="text-sm text-neutral-400 mt-1">Customize your training experience</p>
      </motion.div>

      <div className="space-y-4">
        {/* Name */}
        <motion.div
          className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <User size={16} className="text-lime-400" />
            <h3 className="text-sm font-bold text-white">Profile</h3>
          </div>
          <label htmlFor="pref-name" className="block text-xs text-neutral-400 mb-1.5">Display Name</label>
          <input
            id="pref-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400 text-sm min-h-[44px]"
            placeholder="Your name"
          />
        </motion.div>

        {/* Rest Timer */}
        <motion.div
          className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Timer size={16} className="text-lime-400" />
            <h3 className="text-sm font-bold text-white">Rest Timer</h3>
          </div>
          <label htmlFor="pref-rest" className="block text-xs text-neutral-400 mb-1.5">
            Default rest time: {form.restTimerSeconds}s
          </label>
          <input
            id="pref-rest"
            type="range"
            min={15}
            max={300}
            step={15}
            value={form.restTimerSeconds}
            onChange={(e) => setForm({ ...form, restTimerSeconds: parseInt(e.target.value) })}
            className="w-full accent-lime-400 h-2"
          />
          <div className="flex justify-between text-[10px] text-neutral-600 mt-1">
            <span>15s</span>
            <span>5min</span>
          </div>
        </motion.div>

        {/* Weekly Goal */}
        <motion.div
          className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-lime-400" />
            <h3 className="text-sm font-bold text-white">Weekly Goal</h3>
          </div>
          <label htmlFor="pref-goal" className="block text-xs text-neutral-400 mb-1.5">
            Target sessions per week: {form.weeklyGoalSessions}
          </label>
          <input
            id="pref-goal"
            type="range"
            min={1}
            max={7}
            step={1}
            value={form.weeklyGoalSessions}
            onChange={(e) => setForm({ ...form, weeklyGoalSessions: parseInt(e.target.value) })}
            className="w-full accent-lime-400 h-2"
          />
          <div className="flex justify-between text-[10px] text-neutral-600 mt-1">
            <span>1</span>
            <span>7</span>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Bell size={16} className="text-lime-400" />
            <h3 className="text-sm font-bold text-white">Notifications</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer min-h-[44px]">
              <span className="text-sm text-neutral-300">Sound alerts</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.soundEnabled}
                  onChange={(e) => setForm({ ...form, soundEnabled: e.target.checked })}
                  className="sr-only peer"
                  aria-label="Enable sound alerts"
                />
                <div className="w-11 h-6 bg-neutral-700 rounded-full peer-checked:bg-lime-400 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
            <label className="flex items-center justify-between cursor-pointer min-h-[44px]">
              <span className="text-sm text-neutral-300">Vibration</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.vibrationEnabled}
                  onChange={(e) => setForm({ ...form, vibrationEnabled: e.target.checked })}
                  className="sr-only peer"
                  aria-label="Enable vibration"
                />
                <div className="w-11 h-6 bg-neutral-700 rounded-full peer-checked:bg-lime-400 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="space-y-3 pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={handleSave}
            className="w-full bg-lime-400 text-neutral-900 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 min-h-[52px]"
            whileTap={{ scale: 0.97 }}
          >
            <Save size={18} />
            {saved ? 'Saved!' : 'Save Settings'}
          </motion.button>
          <motion.button
            onClick={handleReset}
            className="w-full bg-neutral-800 text-red-400 font-medium py-3 rounded-xl flex items-center justify-center gap-2 min-h-[48px]"
            whileTap={{ scale: 0.97 }}
          >
            <RotateCcw size={16} />
            Reset All Data
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
