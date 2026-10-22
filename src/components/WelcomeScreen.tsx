import { motion } from 'framer-motion';
import { Flame, Zap } from 'lucide-react';
import { UserPreferences } from '../types';

interface WelcomeScreenProps {
  onComplete: (name: string) => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') as string) || 'Athlete';
    onComplete(name);
  };

  return (
    <motion.div
      className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center mb-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="w-20 h-20 mx-auto mb-6 bg-lime-400 rounded-2xl flex items-center justify-center"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
        >
          <Flame className="text-neutral-900" size={40} />
        </motion.div>
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">
          REP CLUB
        </h1>
        <p className="text-neutral-400 mt-2 text-sm">Your training companion</p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
            What should we call you?
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter your name"
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3.5 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent text-lg"
            autoComplete="name"
            autoFocus
          />
        </div>

        <motion.button
          type="submit"
          className="w-full bg-lime-400 text-neutral-900 font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 min-h-[52px]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Zap size={20} />
          Start Training
        </motion.button>
      </motion.form>

      <motion.p
        className="text-neutral-600 text-xs mt-8 text-center max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Demo data is used for statistics. No medical claims are made. Always consult a professional before starting a new fitness program.
      </motion.p>
    </motion.div>
  );
}
