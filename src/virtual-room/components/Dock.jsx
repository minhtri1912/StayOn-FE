import MusicBox from './MusicBox';
import BackgroundSelector from './BackgroundSelector';

export default function Dock({
  onToggleCamera,
  mode,
  onToggleMode,
  currentBackground,
  onBackgroundSelect
}) {
  return (
    <div
      style={{
        position: 'fixed',
        left: '24px',
        bottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 50
      }}
    >
      {/* Music Box */}
      <MusicBox />

      {/* Background Selector */}
      <BackgroundSelector
        currentBackground={currentBackground}
        onBackgroundSelect={onBackgroundSelect}
      />

      {/* Camera Toggle */}
      <button
        title="Toggle camera preview"
        onClick={onToggleCamera}
        style={{
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: 'white',
          fontSize: '18px',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) =>
          (e.target.style.backgroundColor = 'rgba(255,255,255,0.2)')
        }
        onMouseLeave={(e) =>
          (e.target.style.backgroundColor = 'rgba(255,255,255,0.1)')
        }
      >
        📷
      </button>

      {/* Mode Toggle */}
      <button
        title="Toggle Pomodoro/Stopwatch"
        onClick={onToggleMode}
        style={{
          padding: '8px 12px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: 'white',
          fontSize: '14px',
          fontWeight: '500',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) =>
          (e.target.style.backgroundColor = 'rgba(255,255,255,0.2)')
        }
        onMouseLeave={(e) =>
          (e.target.style.backgroundColor = 'rgba(255,255,255,0.1)')
        }
      >
        {mode === 'pomodoro' ? 'Pomodoro' : 'Stopwatch'}
      </button>
    </div>
  );
}
