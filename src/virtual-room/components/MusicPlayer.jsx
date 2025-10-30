import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import './MusicPlayer.css';

function MusicPlayer({ isVisible }) {
  const [inputUrl, setInputUrl] = useState('');
  const [playerHtml, setPlayerHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPlatform, setCurrentPlatform] = useState('');
  const [playerKey, setPlayerKey] = useState(0);
  const playerRef = useRef(null);

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
    console.log('Extracting YouTube ID from:', url);
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    console.log('Regex match:', match);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    console.log('Extracted video ID:', videoId);
    return videoId;
  };

  // Generate YouTube iframe
  const generateYouTubeIframe = (videoId) => {
    return `<iframe 
      width="100%" 
      height="200" 
      src="https://www.youtube.com/embed/${videoId}?controls=1&rel=0&modestbranding=1&enablejsapi=1" 
      title="YouTube video player" 
      frameborder="0" 
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen>
    </iframe>`;
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
          console.log('Generating YouTube iframe for video ID:', videoId);
          const iframe = generateYouTubeIframe(videoId);
          console.log('Generated iframe HTML:', iframe);
          setPlayerHtml(iframe);
          setPlayerKey((prev) => prev + 1); // Force re-render with new key
        } else if (platform === 'soundcloud') {
          const embedHtml = await getSoundCloudEmbed(inputUrl);
          setPlayerHtml(embedHtml);
          setPlayerKey((prev) => prev + 1); // Force re-render with new key
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

  // Debug iframe rendering
  useEffect(() => {
    if (playerHtml && playerRef.current) {
      console.log('Player container mounted:', playerRef.current);
      const iframe = playerRef.current.querySelector('iframe');
      console.log('Iframe found in DOM:', iframe);
      if (iframe) {
        console.log('Iframe src:', iframe.src);
        console.log(
          'Iframe dimensions:',
          iframe.offsetWidth,
          'x',
          iframe.offsetHeight
        );
      }
    }
  }, [playerHtml, playerKey]);

  // Clear player
  const clearPlayer = useCallback(() => {
    setPlayerHtml('');
    setInputUrl('');
    setCurrentPlatform('');
    setError('');
    setPlayerKey((prev) => prev + 1);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="music-player-container">
      <div className="music-player-header">
        <h3>🎵 Nhạc Nền</h3>
        <button className="clear-btn" onClick={clearPlayer} title="Xóa nhạc">
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="music-input-form">
        <div className="input-group">
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Dán link YouTube hoặc SoundCloud..."
            className="music-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="load-btn"
            disabled={isLoading || !inputUrl.trim()}
          >
            {isLoading ? '⏳' : '▶️'}
          </button>
        </div>
      </form>

      {error && <div className="error-message">❌ {error}</div>}

      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải nhạc...</p>
        </div>
      )}

      {playerHtml && !isLoading && (
        <div className="player-container">
          <div className="platform-badge">
            {currentPlatform === 'youtube' ? '📺 YouTube' : '🎧 SoundCloud'}
          </div>
          {/* Try direct iframe rendering for YouTube */}
          {currentPlatform === 'youtube' && playerHtml ? (
            <iframe
              key={playerKey}
              ref={playerRef}
              width="100%"
              height="200"
              src={playerHtml.match(/src="([^"]+)"/)?.[1] || ''}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                border: '2px solid #007bff',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa'
              }}
            />
          ) : (
            <div
              key={playerKey}
              ref={playerRef}
              className="player-iframe"
              style={{
                width: '100%',
                height: '200px',
                border: '2px solid #007bff',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#f8f9fa'
              }}
              dangerouslySetInnerHTML={{ __html: playerHtml }}
            />
          )}
          {/* Test iframe visibility */}
          <div
            style={{
              marginTop: '10px',
              padding: '10px',
              background: '#f0f0f0',
              fontSize: '12px'
            }}
          >
            <strong>Test:</strong> Iframe đã được render với HTML:{' '}
            {playerHtml.substring(0, 100)}...
          </div>
          {/* Debug DOM */}
          <div
            style={{
              marginTop: '10px',
              padding: '10px',
              background: '#e9ecef',
              fontSize: '12px'
            }}
          >
            <strong>Debug DOM:</strong>
            <br />
            Player Key: {playerKey}
            <br />
            Player Ref: {playerRef.current ? 'Mounted' : 'Not mounted'}
            <br />
            Iframe in DOM:{' '}
            {playerRef.current?.querySelector('iframe') ? 'Yes' : 'No'}
          </div>
        </div>
      )}

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            padding: '10px',
            fontSize: '12px',
            background: '#f0f0f0',
            margin: '10px'
          }}
        >
          <strong>Debug:</strong>
          <br />
          playerHtml: {playerHtml ? 'Có' : 'Không'}
          <br />
          isLoading: {isLoading ? 'Có' : 'Không'}
          <br />
          currentPlatform: {currentPlatform}
          <br />
          playerKey: {playerKey}
        </div>
      )}

      <div className="music-help">
        <h4>💡 Hướng dẫn:</h4>
        <ul>
          <li>
            <strong>YouTube:</strong> Dán link video hoặc playlist
          </li>
          <li>
            <strong>SoundCloud:</strong> Dán link track hoặc playlist
          </li>
          <li>Nhạc sẽ tự động phát khi tải xong</li>
        </ul>
      </div>
    </div>
  );
}

export default MusicPlayer;
