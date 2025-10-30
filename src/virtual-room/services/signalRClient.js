import * as signalR from '@microsoft/signalr';

class SignalRClient {
  constructor() {
    this.connection = null;
    this.currentSessionId = null;
    this.isConnected = false;
    this.lastSentAt = 0;
    this.minIntervalMs = 250; // throttle to max ~4 msgs/sec
    this.pendingQueue = [];
  }

  async connect() {
    try {
      // Create connection without credentials for CORS compatibility
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl('https://api.stayon.io.vn/hubs/tracking', {
          skipNegotiation: false,
          withCredentials: false, // Disable credentials to avoid CORS wildcard error
          transport:
            signalR.HttpTransportType.WebSockets |
            signalR.HttpTransportType.ServerSentEvents |
            signalR.HttpTransportType.LongPolling
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            // Exponential backoff: 0s, 2s, 10s, 30s
            if (retryContext.elapsedMilliseconds < 60000) {
              return Math.min(
                1000 * Math.pow(2, retryContext.previousRetryCount),
                30000
              );
            } else {
              return null; // Stop reconnecting after 1 minute
            }
          }
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Setup event handlers
      this.connection.onreconnecting((error) => {
        console.warn('SignalR reconnecting...', error);
        this.isConnected = false;
      });

      this.connection.onreconnected((connectionId) => {
        console.log('SignalR reconnected:', connectionId);
        this.isConnected = true;
      });

      this.connection.onclose((error) => {
        console.error('SignalR connection closed:', error);
        this.isConnected = false;
      });

      // Start connection
      await this.connection.start();
      this.isConnected = true;
      console.log('SignalR connected successfully');

      return { success: true };
    } catch (error) {
      console.error('SignalR connection error:', error);
      return { success: false, error: error.message };
    }
  }

  async startSession(
    userId = '00000000-0000-0000-0000-000000000000',
    sessionName = 'Focus Session',
    sessionType = 'focus'
  ) {
    try {
      if (!this.isConnected) {
        const connectResult = await this.connect();
        if (!connectResult.success) {
          throw new Error('Failed to connect to server');
        }
      }

      // Start tracking session with all required parameters
      const response = await this.connection.invoke(
        'StartTrackingSession',
        userId,
        sessionName,
        sessionType
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to start session');
      }

      this.currentSessionId = response.sessionId;
      console.log('Session started successfully:', this.currentSessionId);

      // flush any pending messages
      try {
        const queue = this.pendingQueue.splice(0);
        for (const msg of queue) {
          await this.sendFocusData(msg);
        }
      } catch (e) {
        console.warn('Flush queue error:', e);
      }

      return {
        success: true,
        sessionId: this.currentSessionId,
        message: response.message
      };
    } catch (error) {
      console.error('Start session error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendFocusData(data) {
    try {
      if (!this.isConnected || !this.currentSessionId) {
        // queue while connecting/starting session
        this.pendingQueue.push(data);
        console.warn(
          'Queued tracking data: not connected or no active session'
        );
        return { success: false, error: 'queued' };
      }

      // Disable throttling for testing
      const now = Date.now();
      // if (now - this.lastSentAt < this.minIntervalMs) {
      //   return { success: false, error: 'throttled' };
      // }

      // Send tracking data to hub - ensure proper format
      const trackingData = {
        focusScore: data.focusScore || 0,
        eyeAspectRatio: data.eyeAspectRatio || 0,
        headYaw: data.headYaw || 0,
        headPitch: data.headPitch || 0,
        faceDetected: data.faceDetected || false,
        emotion: data.emotion || 'neutral',
        emotionConfidence: data.emotionConfidence || 0,
        timestamp: new Date().toISOString()
      };

      console.log(
        'Invoking SendTrackingData with:',
        this.currentSessionId,
        trackingData
      );

      // Try different parameter order - match C# method signature exactly
      await this.connection.invoke(
        'SendTrackingData',
        this.currentSessionId,
        trackingData
      );

      console.log('SendTrackingData invoked successfully');
      this.lastSentAt = now;

      return { success: true };
    } catch (error) {
      console.error('Send focus data error:', error);
      return { success: false, error: error.message };
    }
  }

  async endSession() {
    try {
      if (!this.isConnected || !this.currentSessionId) {
        console.warn('Cannot end session: not connected or no active session');
        return { success: false, error: 'No active session' };
      }

      // End tracking session and get analysis
      const analysis = await this.connection.invoke(
        'EndTrackingSession',
        this.currentSessionId
      );

      console.log('Session ended with analysis:', analysis);

      const sessionId = this.currentSessionId;
      this.currentSessionId = null;

      return {
        success: true,
        analysis: {
          sessionId: analysis.sessionId,
          duration: analysis.duration,
          averageFocus: analysis.averageFocus,
          minFocus: analysis.minFocus,
          maxFocus: analysis.maxFocus,
          totalDataPoints: analysis.totalDataPoints,
          dominantEmotion: analysis.dominantEmotion,
          summary: analysis.summary,
          recommendations: this.generateRecommendations(analysis)
        }
      };
    } catch (error) {
      console.error('End session error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  generateRecommendations(analysis) {
    const recommendations = [];

    if (analysis.averageFocus < 50) {
      recommendations.push('Consider taking more frequent breaks');
      recommendations.push('Try minimizing distractions in your environment');
      recommendations.push('Use focus music or white noise');
    } else if (analysis.averageFocus < 70) {
      recommendations.push('Good progress! Try the Pomodoro technique');
      recommendations.push('Keep your workspace organized');
    } else {
      recommendations.push('Excellent focus! Keep up the good work');
      recommendations.push('Consider sharing your focus strategies');
    }

    if (analysis.duration < 15) {
      recommendations.push('Try extending your focus sessions gradually');
    } else if (analysis.duration > 60) {
      recommendations.push('Consider taking a break after 50-60 minutes');
    }

    return recommendations;
  }

  onTrackingDataReceived(callback) {
    if (this.connection) {
      this.connection.on('TrackingDataReceived', callback);
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await this.connection.stop();
        this.isConnected = false;
        this.currentSessionId = null;
        console.log('SignalR disconnected');
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }
}

// Export singleton instance
const signalRClient = new SignalRClient();
export default signalRClient;
