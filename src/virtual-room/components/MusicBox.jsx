import { useState, useRef, useCallback, useEffect } from 'react';

export default function MusicBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [playerHtml, setPlayerHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPlatform, setCurrentPlatform] = useState('');
  const [playerKey, setPlayerKey] = useState(0);
  const playerRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [soundCloudIframeSrc, setSoundCloudIframeSrc] = useState('');

  // Detect platform from URL
  const detectPlatform = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    } else if (url.includes('soundcloud.com')) {
      return 'soundcloud';
    }
    return null;
  };

  // Extract YouTube video ID
  const extractYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId;
  };

  // Generate YouTube iframe
  const generateYouTubeIframe = (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?controls=1&rel=0&modestbranding=1&enablejsapi=1&autoplay=1`;
  };

  // Get SoundCloud oEmbed
  const getSoundCloudEmbed = async (url) => {
    try {
      const oembedUrl = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url)}&auto_play=true&show_artwork=true&visual=true`;
      const response = await fetch(oembedUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch SoundCloud embed');
      }

      const data = await response.json();
      return data.html;
    } catch (error) {
      console.error('SoundCloud oEmbed error:', error);
      throw new Error('Không thể tải nhạc từ SoundCloud');
    }
  };

  // Handle URL submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!inputUrl.trim()) {
        setError('Vui lòng nhập link nhạc');
        return;
      }

      setIsLoading(true);
      setError('');
      setPlayerHtml('');
      setCurrentPlatform('');

      try {
        const platform = detectPlatform(inputUrl);

        if (!platform) {
          throw new Error('Chỉ hỗ trợ YouTube và SoundCloud');
        }

        setCurrentPlatform(platform);

        if (platform === 'youtube') {
          const videoId = extractYouTubeId(inputUrl);
          if (!videoId) {
            throw new Error('Link YouTube không hợp lệ');
          }
          const iframeSrc = generateYouTubeIframe(videoId);
          setPlayerHtml(iframeSrc);
          setPlayerKey((prev) => prev + 1);
        } else if (platform === 'soundcloud') {
          const embedHtml = await getSoundCloudEmbed(inputUrl);
          setPlayerHtml(embedHtml);
          // Parse src from html
          const match = embedHtml && embedHtml.match(/src="([^"]+)"/);
          setSoundCloudIframeSrc(match ? match[1] : '');
          if (currentPlatform !== 'soundcloud')
            setPlayerKey((prev) => prev + 1); // Key only changes if platform changes
        }
      } catch (error) {
        setError(error.message);
        setCurrentPlatform('');
      } finally {
        setIsLoading(false);
      }
    },
    [inputUrl]
  );

  // Clear player
  const clearPlayer = useCallback(() => {
    setPlayerHtml('');
    setSoundCloudIframeSrc('');
    setInputUrl('');
    setCurrentPlatform('');
    setError('');
    setPlayerKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    } else {
      setIsClosing(true);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Music Box"
        style={{
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')
        }
      >
        🎵
      </button>

      {/* Modal - always render, control visibility */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease-out, visibility 0.3s ease-out'
        }}
      >
        {/* Backdrop overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            animation: isClosing
              ? 'fadeOut 0.3s ease-out'
              : 'fadeIn 0.3s ease-out'
          }}
          onClick={() => setIsOpen(false)}
        />

        {/* Popup card */}
        <div
          style={{
            position: 'absolute',
            bottom: '56px',
            left: '0',
            width: '420px',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            animation: isClosing
              ? 'scaleOut 0.3s ease-out'
              : 'scaleIn 0.3s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                margin: 0
              }}
            >
              YouTube
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {playerHtml && (
                <button
                  onClick={clearPlayer}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    padding: '4px 8px'
                  }}
                >
                  🔄 Change
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '20px',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Input form - only show when no video is playing */}
          {!playerHtml && (
            <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="Dán link YouTube hoặc SoundCloud..."
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputUrl.trim()}
                  style={{
                    padding: '10px 16px',
                    background:
                      isLoading || !inputUrl.trim()
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(59, 130, 246, 0.6)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    cursor:
                      isLoading || !inputUrl.trim() ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  {isLoading ? '⏳' : '▶️'}
                </button>
              </div>
            </form>
          )}

          {/* Error message */}
          {error && (
            <div
              style={{
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '8px',
                color: '#fca5a5',
                marginBottom: '16px'
              }}
            >
              ❌ {error}
            </div>
          )}

          {/* Loading spinner */}
          {isLoading && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                padding: '32px',
                color: 'white'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '4px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}
              ></div>
              <p>Đang tải nhạc...</p>
            </div>
          )}

          {/* Player - Real iframe always rendered */}
          {playerHtml && !isLoading && (
            <div>
              {currentPlatform === 'youtube' && (
                <iframe
                  key={playerKey}
                  ref={playerRef}
                  width="100%"
                  height="220"
                  src={playerHtml}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{
                    borderRadius: '12px',
                    border: 'none'
                  }}
                />
              )}
              {currentPlatform === 'soundcloud' &&
                soundCloudIframeSrc &&
                !isLoading && (
                  <iframe
                    key={playerKey}
                    ref={playerRef}
                    src={soundCloudIframeSrc}
                    width="100%"
                    height="180"
                    frameBorder="no"
                    allow="autoplay"
                    allowFullScreen
                    style={{
                      minHeight: '166px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'transparent'
                    }}
                    title="SoundCloud player"
                  />
                )}

              {/* Bottom controls */}
              {currentPlatform === 'youtube' && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '16px',
                    marginTop: '12px',
                    padding: '8px 0'
                  }}
                >
                  <button
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '20px',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    ☁️
                  </button>
                  <button
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '20px',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    🖼️
                  </button>
                  <button
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '20px',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    🎮
                  </button>
                  <button
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '20px',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    ⚙️
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
    </div>
  );
}
