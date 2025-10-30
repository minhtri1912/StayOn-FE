import helpers from '@/helpers';

export default function TopBar({ onToggleCamera, onOpenAnalytics }) {
  let userName = 'User';
  try {
    const token = helpers.cookie_get('AT');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1] || '')) || {};
      userName =
        payload.name ||
        payload.username ||
        payload.sub ||
        (payload.email ? String(payload.email).split('@')[0] : 'User');
    }
  } catch (e) {}
  const initials = String(userName)
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        backgroundColor: 'transparent'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Left: Logo */}
        <a
          href="/"
          style={{
            fontSize: 'max(20px, 1.5rem)',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            color: 'white',
            whiteSpace: 'nowrap',
            textDecoration: 'none'
          }}
          aria-label="Go to home"
        >
          Stay On
        </a>

        {/* Right: Controls */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {/* Analytics */}
          <button
            onClick={onOpenAnalytics}
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = 'rgba(255,255,255,0.2)')
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = 'rgba(255,255,255,0.1)')
            }
          >
            📊 Analytics
          </button>

          {/* Camera Toggle */}
          <button
            onClick={onToggleCamera}
            title="Toggle camera"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '18px',
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
            📷
          </button>

          {/* User Room */}
          <div
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '14px'
            }}
          >
            {userName}'s room
          </div>

          {/* Avatar */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {initials}
          </div>
        </nav>
      </div>
    </header>
  );
}
