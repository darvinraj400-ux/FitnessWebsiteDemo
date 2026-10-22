# REP CLUB — Training Companion

A mobile-first fitness training companion app built with React, TypeScript, and Tailwind CSS. REP CLUB helps users plan workouts, follow exercise sessions with a working rest timer, and track personal consistency over time.

![REP CLUB](https://img.shields.io/badge/REP%20CLUB-Training%20Companion-BEFF3C?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)

---

## ✨ Features

### Core Functionality
- **Weekly Training Schedule** — Assign workouts to each day of the week with quick rest-day toggles
- **Workout Programs** — 6 pre-built programs grouped by goal (strength, hypertrophy, endurance) and difficulty (beginner → advanced)
- **Exercise Details** — Each exercise includes sets, reps, rest periods, muscle group, and step-by-step instructions
- **Workout Session Mode** — Follow along with completion checkboxes for every set; progress updates in real time
- **Working Rest Timer** — Fully functional timer with pause, resume, reset, and skip controls; audio beep and vibration alerts when rest is complete
- **Dashboard** — Weekly progress rings, session counts, total minutes trained, and recent session history
- **Workout History** — All completed sessions stored in `localStorage` with completion rate and duration
- **Settings** — Adjustable rest timer defaults, weekly goals, display name, and notification preferences
- **First-Time User Flow** — Welcome screen that captures the user's name and sets up initial state
- **Completed-Workout Summary** — Celebration screen with stats breakdown after finishing a session

### Design & UX
- **Athletic aesthetic** — Charcoal backgrounds, vivid lime (#BEFF3C) accents, bold condensed headings
- **Mobile-first responsive** — Designed for 320px+ screens with progressive enhancement for tablets and desktop
- **Large touch targets** — All interactive elements meet or exceed 44×44px minimum
- **Smooth animations** — Page transitions, staggered reveals, spring-based navigation indicators, and animated progress rings via Framer Motion
- **Accessible** — Respects `prefers-reduced-motion`, semantic HTML, ARIA labels, visible focus indicators, and keyboard navigation
- **High contrast** — WCAG-friendly color choices with no reliance on color alone to communicate state

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd rep-club

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

The optimized output will be in the `dist/` directory.

### Type Checking

```bash
npm run typecheck
```

---

## 📁 Project Structure

```
src/
├── App.tsx                      # Main app shell with view routing
├── main.tsx                     # Entry point
├── index.css                    # Global styles, Tailwind config, theme tokens
├── types.ts                     # TypeScript interfaces for all data models
│
├── data/
│   └── workouts.ts              # Workout programs and default schedule data
│
├── hooks/
│   ├── useLocalStorage.ts       # Persistent state hook with localStorage
│   └── useTimer.ts              # Functional rest timer with pause/resume/reset
│
├── utils/
│   └── helpers.ts               # Date formatting, ID generation, progress calc
│
└── components/
    ├── Navigation.tsx            # Bottom tab bar with animated active indicator
    ├── ProgressRing.tsx          # SVG animated circular progress indicator
    ├── WelcomeScreen.tsx         # First-time user onboarding
    ├── Dashboard.tsx             # Home view with weekly stats and today's workout
    ├── ScheduleView.tsx          # Weekly schedule editor
    ├── ProgramsView.tsx          # Workout library with filters and expandable cards
    ├── WorkoutSessionView.tsx    # Active workout with sets, timer, and navigation
    ├── WorkoutSummary.tsx        # Post-workout celebration and stats
    ├── HistoryView.tsx           # Completed workout log
    └── SettingsView.tsx          # Preferences and data management
```

---

## 🏋️ Workout Programs Included

| Program | Goal | Difficulty | Exercises | Duration |
|---------|------|-----------|-----------|----------|
| Full Body Strength | Strength | Intermediate | 5 | ~45 min |
| Push Day Power | Hypertrophy | Intermediate | 5 | ~50 min |
| Pull Day Destroyer | Hypertrophy | Intermediate | 5 | ~50 min |
| Leg Day Annihilator | Hypertrophy | Advanced | 5 | ~55 min |
| HIIT Cardio Blast | Endurance | Beginner | 5 | ~30 min |
| Beginner Foundations | Strength | Beginner | 5 | ~35 min |

---

## ⏱️ Rest Timer

The rest timer is a genuinely functional countdown that:
- Starts automatically when a set is completed
- Supports **pause**, **resume**, **reset**, and **skip** actions
- Plays an audio beep (Web Audio API) when time is up
- Triggers device vibration on supported mobile browsers
- Shows a circular progress ring with remaining time
- Can be dismissed to continue immediately

Timer duration defaults to each exercise's prescribed rest period but can be customized globally in Settings.

---

## 💾 Data Storage

All user data is persisted in `localStorage`:
- `repclub-first-time` — onboarding completion flag
- `repclub-preferences` — user settings (name, timer defaults, notifications)
- `repclub-schedule` — weekly workout assignments
- `repclub-sessions` — completed workout history

No backend or external API is required. All data stays on the device.

---

## 🎨 Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Lime accent | `#BEFF3C` | Primary actions, progress, active states |
| Charcoal bg | `#0A0A0A` | Page background |
| Card surface | `#171717` | Card and panel backgrounds |
| Border | `#262626` | Subtle dividers and card borders |
| Text primary | `#FFFFFF` | Headings and primary content |
| Text secondary | `#A3A3A3` | Labels and descriptions |
| Text muted | `#737373` | Metadata and timestamps |

---

## ♿ Accessibility

- **Reduced motion** — All animations respect `prefers-reduced-motion: reduce`
- **Keyboard navigation** — Full tab order with visible `:focus-visible` outlines
- **ARIA labels** — All buttons, toggles, and interactive elements have descriptive labels
- **Semantic HTML** — Proper heading hierarchy, landmark regions, and form labels
- **Touch targets** — Minimum 44×44px on all interactive elements
- **Color contrast** — Lime-on-charcoal exceeds WCAG AA requirements

---

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 90+
- Safari 15+
- iOS Safari 15+ (with safe-area support)
- Android Chrome 90+

---

## 🛠️ Tech Stack

- **React 18** — UI framework
- **TypeScript 5** — Type safety
- **Vite 6** — Build tool and dev server
- **Tailwind CSS 4** — Utility-first styling
- **Framer Motion** — Animation and transitions
- **Lucide React** — Icon library
- **date-fns** — Date utilities (available)
- **Recharts** — Charting (available for future use)

---

## 📝 Notes

- Statistics shown on the dashboard are calculated from actual completed sessions stored locally. When no sessions exist, values display as zero.
- Demo data labels are shown where appropriate to clarify that no medical claims are being made.
- The app does not collect, transmit, or store any data outside the user's browser.
- Always consult a qualified professional before starting a new fitness program.

---

## 📄 License

MIT
