import { useState, useEffect, useRef } from 'react';
import './PomodoroTimer.css';

function PomodoroTimer({ onTimerUpdate, isActive }) {
  const [phase, setPhase] = useState('work'); // 'work' | 'shortBreak' | 'longBreak'
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const notificationSoundRef = useRef(null);

  // Pomodoro settings
  const WORK_TIME = 25 * 60; // 25 minutes
  const SHORT_BREAK = 5 * 60; // 5 minutes
  const LONG_BREAK = 15 * 60; // 15 minutes
  const POMODOROS_UNTIL_LONG_BREAK = 4;

  useEffect(() => {
    // Create notification sound
    notificationSoundRef.current = new Audio(
      'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjeL0fPTgjMGHm7A7+OZURU='
    );
  }, []);

  useEffect(() => {
    if (isRunning && isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isActive]);

  useEffect(() => {
    // Notify parent component of timer updates
    if (onTimerUpdate) {
      onTimerUpdate({
        phase,
        timeLeft,
        pomodoroCount,
        isRunning,
        totalSeconds: getCurrentPhaseTime()
      });
    }
  }, [phase, timeLeft, pomodoroCount, isRunning]);

  const getCurrentPhaseTime = () => {
    switch (phase) {
      case 'work':
        return WORK_TIME;
      case 'shortBreak':
        return SHORT_BREAK;
      case 'longBreak':
        return LONG_BREAK;
      default:
        return WORK_TIME;
    }
  };

  const handlePhaseComplete = () => {
    // Play notification sound
    if (notificationSoundRef.current) {
      notificationSoundRef.current
        .play()
        .catch((e) => console.log('Audio play failed:', e));
    }

    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const phaseNames = {
        work: 'Work session',
        shortBreak: 'Short break',
        longBreak: 'Long break'
      };
      new Notification('Pomodoro Timer', {
        body: `${phaseNames[phase]} completed! 🎉`,
        icon: '/favicon.ico'
      });
    }

    if (phase === 'work') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);

      // After 4 pomodoros, take a long break
      if (newCount % POMODOROS_UNTIL_LONG_BREAK === 0) {
        setPhase('longBreak');
        setTimeLeft(LONG_BREAK);
      } else {
        setPhase('shortBreak');
        setTimeLeft(SHORT_BREAK);
      }
    } else {
      // After break, start work again
      setPhase('work');
      setTimeLeft(WORK_TIME);
    }

    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setPhase('work');
    setTimeLeft(WORK_TIME);
    setPomodoroCount(0);
  };

  const skipPhase = () => {
    handlePhaseComplete();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseEmoji = () => {
    switch (phase) {
      case 'work':
        return '🍅';
      case 'shortBreak':
        return '☕';
      case 'longBreak':
        return '🌴';
      default:
        return '🍅';
    }
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case 'work':
        return 'Work Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Pomodoro';
    }
  };

  const progress =
    ((getCurrentPhaseTime() - timeLeft) / getCurrentPhaseTime()) * 100;

  return (
    <div className="pomodoro-timer">
      <div className="pomodoro-header">
        <span className="phase-emoji">{getPhaseEmoji()}</span>
        <h3 className="phase-label">{getPhaseLabel()}</h3>
      </div>

      <div className="pomodoro-display">
        <div className="time-display">{formatTime(timeLeft)}</div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="pomodoro-stats">
        <div className="stat-item">
          <span className="stat-label">Pomodoros</span>
          <span className="stat-value">{pomodoroCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Until Long Break</span>
          <span className="stat-value">
            {POMODOROS_UNTIL_LONG_BREAK -
              (pomodoroCount % POMODOROS_UNTIL_LONG_BREAK)}
          </span>
        </div>
      </div>

      <div className="pomodoro-controls">
        <button
          className={`btn-pomodoro ${isRunning ? 'btn-pause' : 'btn-play'}`}
          onClick={toggleTimer}
          disabled={!isActive}
        >
          {isRunning ? '⏸ Pause' : '▶️ Start'}
        </button>
        <button
          className="btn-pomodoro btn-skip"
          onClick={skipPhase}
          disabled={!isActive}
        >
          ⏭ Skip
        </button>
        <button
          className="btn-pomodoro btn-reset"
          onClick={resetTimer}
          disabled={!isActive}
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}

export default PomodoroTimer;
