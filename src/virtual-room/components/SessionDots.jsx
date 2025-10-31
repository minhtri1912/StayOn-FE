import { useState } from 'react';

export default function SessionDots({ activePhase, onPhaseSelect }) {
  const [hoveredPhase, setHoveredPhase] = useState(null);

  const phases = [
    { id: 'work', label: '25m Focus', time: 25 * 60 },
    { id: 'short', label: '5m Break', time: 5 * 60 },
    { id: 'long', label: '15m Long Break', time: 15 * 60 }
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px'
      }}
      title="Click to switch phase: 25m focus • 5m break • 15m long break"
    >
      {phases.map((phase, i) => (
        <button
          key={phase.id}
          onClick={(e) => {
            e.stopPropagation();
            console.log('🔘 Dot clicked:', phase.label);
            onPhaseSelect && onPhaseSelect(phase);
          }}
          onMouseEnter={() => setHoveredPhase(phase.id)}
          onMouseLeave={() => setHoveredPhase(null)}
          title={phase.label}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            pointerEvents: 'auto',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor:
                activePhase === phase.id
                  ? 'white'
                  : hoveredPhase === phase.id
                    ? 'rgba(255,255,255,0.6)'
                    : 'rgba(255,255,255,0.4)',
              transition: 'background-color 0.3s',
              display: 'block',
              pointerEvents: 'none'
            }}
          />
        </button>
      ))}
    </div>
  );
}
