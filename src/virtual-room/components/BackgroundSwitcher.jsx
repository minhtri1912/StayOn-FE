import { useState, useEffect } from 'react';
import { Image } from 'lucide-react';
import { useBackground } from '../hooks/useBackground';

export default function BackgroundSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('motion');
  const [backgrounds, setBackgrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentBackground, changeBackground } = useBackground();

  // Load backgrounds from JSON
  useEffect(() => {
    fetch('/data/backgrounds.json')
      .then((res) => res.json())
      .then((data) => {
        setBackgrounds(data.backgrounds || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load backgrounds:', err);
        setLoading(false);
      });
  }, []);

  // Filter backgrounds by tab
  const filteredBackgrounds = backgrounds.filter((bg) => {
    if (activeTab === 'motion') return bg.category === 'motion';
    if (activeTab === 'stills') return bg.category === 'stills';
    return true;
  });

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Change Background"
        style={{
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: 'white',
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
        <Image size={20} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)'
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              width: '90%',
              maxWidth: '900px',
              backgroundColor: 'rgba(0,0,0,0.95)',
              borderRadius: '24px',
              padding: '32px',
              maxHeight: '85vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}
            >
              <h2
                style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}
              >
                Set your study scene
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '32px',
                marginBottom: '32px',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <button
                onClick={() => setActiveTab('motion')}
                style={{
                  padding: '12px 0',
                  color:
                    activeTab === 'motion' ? 'white' : 'rgba(255,255,255,0.5)',
                  fontWeight: activeTab === 'motion' ? '600' : '400',
                  borderBottom:
                    activeTab === 'motion' ? '2px solid white' : 'none',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'all 0.2s'
                }}
              >
                Motion
              </button>
              <button
                onClick={() => setActiveTab('stills')}
                style={{
                  padding: '12px 0',
                  color:
                    activeTab === 'stills' ? 'white' : 'rgba(255,255,255,0.5)',
                  fontWeight: activeTab === 'stills' ? '600' : '400',
                  borderBottom:
                    activeTab === 'stills' ? '2px solid white' : 'none',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'all 0.2s'
                }}
              >
                Stills
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: 'rgba(255,255,255,0.6)'
                }}
              >
                Loading backgrounds...
              </div>
            )}

            {/* Background Grid */}
            {!loading && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '16px'
                }}
              >
                {filteredBackgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      changeBackground(bg);
                      setIsOpen(false);
                    }}
                    style={{
                      position: 'relative',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      aspectRatio: '16/9',
                      border:
                        currentBackground?.id === bg.id
                          ? '3px solid #3b82f6'
                          : 'none',
                      cursor: 'pointer',
                      padding: 0,
                      background: 'none'
                    }}
                  >
                    {/* Thumbnail or Image */}
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${bg.type === 'video' ? bg.thumbnail : bg.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />

                    {/* Video Play Icon */}
                    {bg.type === 'video' && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '20px'
                        }}
                      >
                        ▶
                      </div>
                    )}

                    {/* Overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '12px',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <div>
                        <p
                          style={{
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '14px',
                            marginBottom: '2px'
                          }}
                        >
                          {bg.name}
                        </p>
                        <p
                          style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '12px'
                          }}
                        >
                          {bg.description}
                        </p>
                      </div>
                    </div>

                    {/* Selected Checkmark */}
                    {currentBackground?.id === bg.id && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: '#3b82f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredBackgrounds.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: 'rgba(255,255,255,0.6)'
                }}
              >
                No backgrounds found in this category
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
