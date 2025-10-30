import { Clock, Timer } from 'lucide-react';

export default function ModeToggle({ mode, onModeChange }) {
  return (
    <div className="flex rounded-full bg-white/10 p-1 backdrop-blur-md">
      <button
        onClick={() => onModeChange('pomodoro')}
        className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all ${
          mode === 'pomodoro'
            ? 'bg-white font-medium text-gray-900'
            : 'text-white/70 hover:text-white'
        }`}
      >
        <Clock size={16} />
        Pomodoro
      </button>
      <button
        onClick={() => onModeChange('stopwatch')}
        className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all ${
          mode === 'stopwatch'
            ? 'bg-white font-medium text-gray-900'
            : 'text-white/70 hover:text-white'
        }`}
      >
        <Timer size={16} />
        Stopwatch
      </button>
    </div>
  );
}
