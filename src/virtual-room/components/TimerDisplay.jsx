import { formatTimeSafe } from '../utils/formatTime';

export default function TimerDisplay({ timeText, caption }) {
  const display = formatTimeSafe(timeText, '25:00');

  return (
    <div className="select-none text-center">
      {/* Large white timer - exactly like StudyFocus */}
      <div
        className="font-extrabold tabular-nums leading-none text-white drop-shadow-sm"
        style={{
          fontSize: 'min(18vw, 160px)',
          letterSpacing: '-0.02em',
          minHeight: '160px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {display}
      </div>
      {caption && (
        <div className="mt-3 text-white/90" style={{ fontSize: '16px' }}>
          {caption}
        </div>
      )}
    </div>
  );
}
