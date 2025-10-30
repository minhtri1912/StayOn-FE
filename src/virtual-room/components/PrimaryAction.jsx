import { useEffect, useState, useRef } from 'react';

export default function PrimaryAction({
  onStartPomodoro,
  onStartWithCamera,
  onPause,
  onEndSession,
  isRunning = false,
  hasStarted = false // Track if session has ever started
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  console.log('🎬 PrimaryAction render:', {
    showDropdown,
    isRunning,
    hasStarted
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.code === 'Space' &&
        e.target.tagName !== 'INPUT' &&
        e.target.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        if (isRunning) {
          onPause && onPause();
        } else {
          setShowDropdown(true);
        }
      }
      if (e.key.toLowerCase() === 'r' && onEndSession) {
        e.preventDefault();
        onEndSession();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, onPause, onEndSession]);

  return (
    <div
      style={{
        marginTop: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        position: 'relative',
        pointerEvents: 'auto'
      }}
    >
      {/* Reset Button (Left) - SMALL */}
      <button
        aria-label="Reset (R)"
        title="End Session (R)"
        onClick={onEndSession}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: 'white',
          fontSize: '20px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) =>
          (e.target.style.backgroundColor = 'rgba(255,255,255,0.2)')
        }
        onMouseLeave={(e) =>
          (e.target.style.backgroundColor = 'rgba(255,255,255,0.1)')
        }
      >
        ↺
      </button>

      {/* Main Start/Pause Button (Center) - BIG WHITE PILL */}
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <button
          onClick={() => {
            if (hasStarted) {
              // If session has started, just toggle pause/resume
              onPause && onPause();
            } else {
              // If never started, show dropdown
              console.log('🔽 Toggle dropdown, current:', showDropdown);
              setShowDropdown(!showDropdown);
            }
          }}
          style={{
            padding: '16px 48px',
            borderRadius: '9999px',
            backgroundColor: 'white',
            color: 'black',
            fontSize: 'max(16px, 1.125rem)',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            transition: 'transform 0.2s',
            minWidth: '180px',
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '1',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          <span
            style={{
              color: 'black',
              fontSize: 'max(16px, 1.125rem)',
              fontWeight: '600',
              pointerEvents: 'none'
            }}
          >
            {(() => {
              const text = !hasStarted
                ? 'Start'
                : isRunning
                  ? 'Pause'
                  : 'Resume';
              console.log('🔤 Button text:', { hasStarted, isRunning, text });
              return text;
            })()}
          </span>
        </button>

        {/* Dropdown Menu - Only show if never started */}
        {showDropdown && !hasStarted && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: '50%',
              transform: 'translateX(-50%)',
              background:
                'linear-gradient(135deg, rgba(30, 30, 40, 0.98) 0%, rgba(20, 20, 30, 0.98) 100%)',
              backdropFilter: 'blur(24px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '12px',
              minWidth: '280px',
              boxShadow:
                '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.1) inset',
              zIndex: 9999
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                console.log('🍅 Start with Pomodoro clicked');
                setShowDropdown(false);
                onStartPomodoro && onStartPomodoro();
              }}
              style={{
                width: '100%',
                padding: '14px 18px',
                background:
                  'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background =
                  'linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 100%)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background =
                  'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '20px' }}>🍅</span>
              <span>Start with Pomodoro</span>
            </button>
            <button
              onClick={() => {
                console.log('📷 Start with Camera clicked');
                setShowDropdown(false);
                onStartWithCamera && onStartWithCamera();
              }}
              style={{
                width: '100%',
                padding: '14px 18px',
                background:
                  'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background =
                  'linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(245, 158, 11, 0.25) 100%)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background =
                  'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '20px' }}>📷</span>
              <span>Start with Pomodoro + Focus Cam</span>
            </button>
          </div>
        )}
      </div>

      {/* Skip Button (Right) - SMALL */}
      <button
        aria-label="Skip (S)"
        title="End Session (S)"
        onClick={onEndSession}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: 'white',
          fontSize: '20px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) =>
          (e.target.style.backgroundColor = 'rgba(255,255,255,0.2)')
        }
        onMouseLeave={(e) =>
          (e.target.style.backgroundColor = 'rgba(255,255,255,0.1)')
        }
      >
        ⏭
      </button>
    </div>
  );
}
