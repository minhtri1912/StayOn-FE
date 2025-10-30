/**
 * Smart Focus Alert Manager
 * Detects when user loses focus and triggers appropriate alerts
 */

const ALERT_THRESHOLDS = {
  // Focus score thresholds
  CRITICAL: 30,
  WARNING: 50,
  LOW: 70,

  // Time thresholds (milliseconds)
  WARNING_DURATION: 30000, // 30 seconds
  CRITICAL_DURATION: 60000, // 60 seconds

  // Cooldown between alerts
  COOLDOWN: 120000 // 2 minutes
};

export class FocusAlertManager {
  constructor() {
    this.lowFocusStartTime = null;
    this.lastAlertTime = 0;
    this.alertCount = 0;
    this.isSnoozed = false;
    this.snoozeUntil = 0;
    this.alertHistory = [];
  }

  /**
   * Check focus level and return alert if needed
   */
  checkFocus(focusScore, timestamp = Date.now()) {
    // Skip if snoozed
    if (this.isSnoozed && timestamp < this.snoozeUntil) {
      return null;
    }
    this.isSnoozed = false;

    // Cooldown between alerts
    if (timestamp - this.lastAlertTime < ALERT_THRESHOLDS.COOLDOWN) {
      return null;
    }

    // Focus is good - reset tracking
    if (focusScore >= ALERT_THRESHOLDS.LOW) {
      this.lowFocusStartTime = null;
      return null;
    }

    // Start tracking low focus duration
    if (!this.lowFocusStartTime) {
      this.lowFocusStartTime = timestamp;
    }

    const duration = timestamp - this.lowFocusStartTime;

    // Critical alert - very distracted for long time
    if (
      focusScore < ALERT_THRESHOLDS.CRITICAL &&
      duration >= ALERT_THRESHOLDS.CRITICAL_DURATION
    ) {
      this.lastAlertTime = timestamp;
      this.alertCount++;

      const alert = {
        level: 'critical',
        duration: duration / 1000,
        focusScore,
        title: '🚨 Critical Focus Alert',
        message: `You've been distracted for over ${(duration / 1000).toFixed(0)} seconds!`,
        suggestions: [
          '🧘 Take a 2-minute break',
          '💧 Drink some water',
          '🪟 Look away from screen (20-20-20 rule)',
          '📱 Put phone on silent mode',
          '🎧 Try focus music or white noise'
        ],
        sound: 'critical',
        vibrate: true,
        timestamp
      };

      this.alertHistory.push(alert);
      return alert;
    }

    // Warning alert - moderate distraction
    if (
      focusScore < ALERT_THRESHOLDS.WARNING &&
      duration >= ALERT_THRESHOLDS.WARNING_DURATION
    ) {
      this.lastAlertTime = timestamp;
      this.alertCount++;

      const alert = {
        level: 'warning',
        duration: duration / 1000,
        focusScore,
        title: '⚠️ Focus Warning',
        message: `Your focus has dropped for ${(duration / 1000).toFixed(0)} seconds`,
        suggestions: [
          '🎯 Refocus on your current task',
          '🪑 Adjust your posture',
          '👀 Reduce eye strain - blink more',
          '🌬️ Take 3 deep breaths',
          '📝 Review your goals'
        ],
        sound: 'warning',
        vibrate: false,
        timestamp
      };

      this.alertHistory.push(alert);
      return alert;
    }

    return null;
  }

  /**
   * Snooze alerts for specified duration
   */
  snooze(duration) {
    this.isSnoozed = true;
    this.snoozeUntil = Date.now() + duration;
  }

  /**
   * Detect patterns in alert history
   */
  detectPattern() {
    const recentAlerts = this.alertHistory.slice(-5);

    // Frequent alerts - suggest longer break
    if (recentAlerts.length >= 3) {
      const timeSpan =
        recentAlerts[recentAlerts.length - 1].timestamp -
        recentAlerts[0].timestamp;

      if (timeSpan < 30 * 60 * 1000) {
        // Within 30 minutes
        return {
          type: 'pattern',
          message: "🤔 You're consistently losing focus",
          suggestion: 'Consider taking a 10-15 minute break to recharge'
        };
      }
    }

    return null;
  }

  /**
   * Get time-based suggestion
   */
  getTimedSuggestion() {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 10) return '☕ Morning session - coffee break might help';
    if (hour >= 12 && hour < 14) return '🍽️ Lunch time - energy dip is normal';
    if (hour >= 14 && hour < 16) return '😴 Post-lunch dip - try a quick walk';
    if (hour >= 18) return '🌅 Evening fatigue - consider wrapping up soon';

    return '💪 Keep up the focus!';
  }

  /**
   * Reset alert manager
   */
  reset() {
    this.lowFocusStartTime = null;
    this.lastAlertTime = 0;
    this.alertCount = 0;
    this.isSnoozed = false;
    this.snoozeUntil = 0;
    this.alertHistory = [];
  }

  /**
   * Get alert statistics
   */
  getStats() {
    return {
      totalAlerts: this.alertCount,
      recentAlerts: this.alertHistory.slice(-10),
      isSnoozed: this.isSnoozed,
      snoozeRemaining: this.isSnoozed ? this.snoozeUntil - Date.now() : 0
    };
  }
}

/**
 * Play alert sound
 */
export function playAlertSound(level) {
  try {
    const audio = new Audio(`/sounds/${level}-alert.mp3`);
    audio.volume = 0.3;
    audio.play().catch((err) => console.warn('Audio play failed:', err));
  } catch (error) {
    console.warn('Audio not supported:', error);
  }
}

/**
 * Show browser notification
 */
export async function showBrowserNotification(alert) {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(alert.title, {
      body: alert.message,
      icon: '/icon-focus.png',
      badge: '/badge.png',
      tag: 'focus-alert',
      requireInteraction: alert.level === 'critical',
      vibrate: alert.vibrate ? [200, 100, 200] : undefined
    });
  } else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      showBrowserNotification(alert);
    }
  }
}

/**
 * Vibrate device (mobile)
 */
export function vibrateDevice(pattern = [200, 100, 200]) {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

export default FocusAlertManager;
