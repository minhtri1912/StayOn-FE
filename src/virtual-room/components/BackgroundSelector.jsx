import { useState, useEffect, useCallback } from 'react';
import './BackgroundSelector.css';

function BackgroundSelector({ onBackgroundSelect, currentBackground }) {
  const [showModal, setShowModal] = useState(false);
  const [backgrounds, setBackgrounds] = useState([]);
  const [activeTab, setActiveTab] = useState('motion');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Load backgrounds from JSON file
  useEffect(() => {
    const loadBackgrounds = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/backgrounds.json');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBackgrounds(data.backgrounds || []);
        setError(null);
      } catch (err) {
        console.error('Failed to load backgrounds:', err);
        setError('Failed to load backgrounds');
        setBackgrounds([]);
      } finally {
        setLoading(false);
      }
    };

    loadBackgrounds();
  }, []);

  // Handle background selection
  const handleSelect = useCallback(
    (background) => {
      onBackgroundSelect(background);
      setShowModal(false);
    },
    [onBackgroundSelect]
  );

  // Handle modal close
  const handleClose = useCallback(() => {
    setShowModal(false);
  }, []);

  // Animation effect
  useEffect(() => {
    if (showModal) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  // Handle overlay click
  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  // Filter backgrounds by active tab
  const filteredBackgrounds = backgrounds.filter(
    (bg) => bg.category === activeTab
  );

  console.log('🎨 BackgroundSelector:', {
    activeTab,
    totalBackgrounds: backgrounds.length,
    filteredCount: filteredBackgrounds.length,
    categories: backgrounds.map((bg) => bg.category)
  });

  return (
    <>
      {/* Background Selector Button */}
      <button
        className="background-btn"
        onClick={() => setShowModal(true)}
        title="Change study background"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          border: 'none',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          transition: 'all 0.2s'
        }}
      >
        🎨
      </button>

      {/* Modal Overlay */}
      {shouldRender && (
        <div
          className="background-modal-overlay"
          onClick={handleOverlayClick}
          style={{
            animation: isClosing
              ? 'fadeOut 0.3s ease-out'
              : 'fadeIn 0.3s ease-out'
          }}
        >
          <div
            className="background-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: isClosing
                ? 'scaleOut 0.3s ease-out'
                : 'scaleIn 0.3s ease-out'
            }}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <h2>Set your study scene</h2>
              <button className="close-btn" onClick={handleClose}>
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="background-tabs">
              <button
                className={`tab ${activeTab === 'motion' ? 'active' : ''}`}
                onClick={() => setActiveTab('motion')}
              >
                🎬 Motion
              </button>
              <button
                className={`tab ${activeTab === 'stills' ? 'active' : ''}`}
                onClick={() => setActiveTab('stills')}
              >
                🖼️ Stills
              </button>
            </div>

            {/* Background Grid */}
            <div className="background-grid">
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading backgrounds...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <p>❌ {error}</p>
                  <button onClick={() => window.location.reload()}>
                    🔄 Retry
                  </button>
                </div>
              ) : filteredBackgrounds.length === 0 ? (
                <div className="empty-container">
                  <p>No backgrounds found for this category</p>
                </div>
              ) : (
                filteredBackgrounds.map((bg) => (
                  <div
                    key={bg.id}
                    className={`background-card ${currentBackground?.id === bg.id ? 'selected' : ''}`}
                    onClick={() => handleSelect(bg)}
                  >
                    {/* Background Preview */}
                    {bg.type === 'video' ? (
                      // For videos, show the thumbnail image instead of video preview
                      <div
                        className="background-preview"
                        style={{
                          width: '100%',
                          height: '200px',
                          backgroundImage: `url(${bg.thumbnail})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: '#333'
                        }}
                      />
                    ) : (
                      <img
                        src={bg.url}
                        alt={bg.name}
                        className="background-preview"
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          backgroundColor: '#333'
                        }}
                      />
                    )}

                    {/* Overlay with info */}
                    <div className="background-overlay">
                      <div className="background-info">
                        <span className="background-name">{bg.name}</span>
                        <span className="background-description">
                          {bg.description}
                        </span>
                      </div>
                      {bg.type === 'video' && (
                        <span className="play-icon">▶</span>
                      )}
                    </div>

                    {/* Selected indicator */}
                    {currentBackground?.id === bg.id && (
                      <div className="selected-indicator">✓</div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BackgroundSelector;
