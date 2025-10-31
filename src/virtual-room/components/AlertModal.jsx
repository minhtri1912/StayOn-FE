import { useState } from 'react';
import './AlertModal.css';

function AlertModal({ alert, onDismiss, onSnooze }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  const handleSnooze = (minutes) => {
    setIsClosing(true);
    setTimeout(() => {
      onSnooze(minutes * 60 * 1000);
    }, 300);
  };

  const getAlertIcon = () => {
    switch (alert.level) {
      case 'critical':
        return '🚨';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getAlertColor = () => {
    switch (alert.level) {
      case 'critical':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      default:
        return '#3b82f6';
    }
  };

  return (
    <div className={`alert-overlay ${isClosing ? 'closing' : ''}`}>
      <div
        className={`alert-modal ${alert.level} ${isClosing ? 'slide-out' : 'slide-in'}`}
        style={{ borderLeftColor: getAlertColor() }}
      >
        <div className="alert-header">
          <div className="alert-icon">{getAlertIcon()}</div>
          <div>
            <h2>{alert.title}</h2>
            <p className="alert-message">{alert.message}</p>
          </div>
        </div>

        <div className="alert-body">
          <div className="alert-stats">
            <div className="stat-item">
              <span className="stat-label">Duration:</span>
              <span className="stat-value">{alert.duration.toFixed(0)}s</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Focus Score:</span>
              <span className="stat-value">{alert.focusScore}%</span>
            </div>
          </div>

          {alert.suggestions && alert.suggestions.length > 0 && (
            <div className="suggestions">
              <h3>💡 Quick Tips:</h3>
              <ul>
                {alert.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="alert-actions">
          <button className="btn btn-primary" onClick={handleDismiss}>
            ✓ Got it!
          </button>
          <button className="btn btn-secondary" onClick={() => handleSnooze(5)}>
            😴 Snooze 5 min
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleSnooze(10)}
          >
            ⏰ Snooze 10 min
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertModal;
