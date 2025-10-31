import { useState, useEffect, useRef } from 'react';
import helpers from '@/helpers';
import signalRClient from '../services/signalRClient';
import { calculateFocusScore } from '../utils/focusCalculator';
import {
  FocusAlertManager,
  playAlertSound,
  showBrowserNotification,
  vibrateDevice
} from '../utils/alertManager';
import AlertModal from '../components/AlertModal';
import CameraView from '../components/CameraView';
import PomodoroTimer from '../components/PomodoroTimer';

// StudyFocus UI Components
import TopBar from '../components/TopBar';
import SessionDots from '../components/SessionDots';
import TimerDisplay from '../components/TimerDisplay';
import PrimaryAction from '../components/PrimaryAction';
import CameraPanel from '../components/CameraPanel';
import Dock from '../components/Dock';
import FabCluster from '../components/FabCluster';
import ChatDrawer from '../components/ChatDrawer';
import TodoTemplateModal from '../components/TodoTemplateModal';
import TodoPreviewCard from '../components/TodoPreviewCard';
import ActivitiesSummaryModal from '../components/ActivitiesSummaryModal';

function PomodoroPage() {
  // ⛔ Keep ALL existing SignalR and timer logic untouched
  const [isTracking, setIsTracking] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [focusScore, setFocusScore] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [status, setStatus] = useState('Ready to focus');
  const [currentAlert, setCurrentAlert] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [stats, setStats] = useState({
    eyeStatus: '👀 Analyzing...',
    headPose: '📐 Calculating...',
    emotion: '🤔 Loading...',
    attention: '🎯 Monitoring...',
    faceDetected: false,
    landmarks: 0,
    ear: 0,
    yaw: 0,
    pitch: 0,
    emotionConfidence: 0
  });
  const [realTimeData, setRealTimeData] = useState(null);
  const [emotionData, setEmotionData] = useState({
    primary: 'Loading...',
    confidence: 0,
    emotions: []
  });
  const [showWellnessModal, setShowWellnessModal] = useState(false);
  const [wellnessReason, setWellnessReason] = useState('');
  const [wellnessQuote, setWellnessQuote] = useState('');
  const lowFocusStartRef = useRef(null);
  const sadStartRef = useRef(null);

  // Pomodoro timer state (from existing logic)
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // seconds
  const [pomodoroPhase, setPomodoroPhase] = useState('work'); // 'work' | 'short' | 'long'
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0); // seconds, counts UP

  // UI state (localStorage persisted)
  const [cameraOpen, setCameraOpen] = useState(false);
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('mode') || 'pomodoro';
  });
  const [chatOpen, setChatOpen] = useState(false);
  const [todoModalOpen, setTodoModalOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  // User ID - lấy từ JWT trong cookie AT
  const userId = (() => {
    try {
      const token = helpers.cookie_get('AT');
      if (!token) return '';
      const payload = JSON.parse(atob(token.split('.')[1] || '')) || {};
      return payload.sub || payload.userId || payload.nameid || '';
    } catch (e) {
      return '';
    }
  })();

  // Background state (NO localStorage)
  const [currentBackground, setCurrentBackground] = useState(null);
  const [videoKey, setVideoKey] = useState(0);

  // Refs
  const chatRef = useRef(null);
  const alertManagerRef = useRef(new FocusAlertManager());
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const bgVideoRef = useRef(null);
  const [trackerPort, setTrackerPort] = useState(null);
  const [isExternalTracker, setIsExternalTracker] = useState(false);
  const trackerBCRef = useRef(null);

  // Force video re-render when background changes
  useEffect(() => {
    if (currentBackground) {
      console.log('🎨 Background changed to:', currentBackground);
      setVideoKey((prev) => prev + 1); // Force video remount
    }
  }, [currentBackground]);

  // Cache-busted video src
  const videoSrc =
    currentBackground?.type === 'video'
      ? `${currentBackground.url}?t=${videoKey}`
      : null;

  // Reset when background changes
  useEffect(() => {
    const v = bgVideoRef.current;
    if (v) {
      try {
        v.pause();
        v.currentTime = 0.01;
      } catch {}
      // autoplay after small delay to ensure metadata loaded
      const t = setTimeout(() => {
        try {
          v.play();
        } catch {}
      }, 50);
      return () => clearTimeout(t);
    }
  }, [videoSrc]);

  // ⛔ Keep ALL existing face data handling logic
  const handleFaceData = (faceData) => {
    console.log('Face data received:', faceData);

    // Add null/undefined check
    if (!faceData) {
      console.warn('Face data is null/undefined, skipping processing');
      return;
    }

    setRealTimeData(faceData);

    const calculatedFocus = calculateFocusScore({
      eyeAspectRatio: faceData.eyeAspectRatio || 0,
      headYaw: faceData.headYaw || 0,
      headPitch: faceData.headPitch || 0,
      faceDetected: faceData.faceDetected || false
    });

    console.log('Calculated focus:', calculatedFocus);
    setFocusScore(Math.round(calculatedFocus));

    const emotionMap = {
      happy: { emoji: '😊', label: 'Happy' },
      sad: { emoji: '😔', label: 'Sad' },
      tired: { emoji: '😪', label: 'Tired' },
      angry: { emoji: '😠', label: 'Angry' },
      fearful: { emoji: '😨', label: 'Fearful' },
      disgusted: { emoji: '😖', label: 'Disgusted' },
      surprised: { emoji: '😲', label: 'Surprised' },
      neutral: { emoji: '😐', label: 'Neutral' }
    };

    const emotion = faceData.emotion || 'neutral';
    const emotionConfidence = faceData.emotionConfidence || 0.5;
    const primary = emotionMap[emotion] || { emoji: '🤔', label: 'Unknown' };

    setEmotionData({
      primary: `${primary.emoji} ${primary.label} (${(emotionConfidence * 100).toFixed(0)}%)`,
      confidence: emotionConfidence,
      emotions: [
        { name: primary.label, value: emotionConfidence, emoji: primary.emoji }
      ]
    });

    let eyeStatus = '👀 Eyes Open';
    if (faceData.eyeAspectRatio < 0.15) {
      eyeStatus = '😴 Eyes Closed';
    } else if (faceData.eyeAspectRatio < 0.2) {
      eyeStatus = '😑 Half Open';
    }

    let poseStatus = '📐 Straight';
    if (Math.abs(faceData.headYaw) > 15) {
      poseStatus = faceData.headYaw > 0 ? '↗️ Right' : '↖️ Left';
    }

    let attentionLevel = '🎯 Focused';
    if (calculatedFocus < 40) {
      attentionLevel = '😵 Distracted';
    } else if (calculatedFocus < 60) {
      attentionLevel = '⚠️ Moderate';
    } else if (calculatedFocus > 80) {
      attentionLevel = '🌟 Excellent';
    }

    setStats({
      eyeStatus,
      headPose: poseStatus,
      emotion: faceData.emotion || '🤔 Loading...',
      attention: attentionLevel,
      faceDetected: faceData.faceDetected,
      landmarks: faceData.landmarks?.length || 0,
      ear: faceData.eyeAspectRatio || 0,
      yaw: faceData.headYaw || 0,
      pitch: faceData.headPitch || 0,
      emotionConfidence: faceData.emotionConfidence || 0
    });

    if (isTracking && sessionId) {
      signalRClient
        .sendFocusData({
          focusScore: calculatedFocus,
          emotion: faceData.emotion || 'neutral',
          emotionConfidence: faceData.emotionConfidence || 0.5,
          eyeAspectRatio: faceData.eyeAspectRatio || 0.3,
          headYaw: faceData.headYaw || 0,
          headPitch: faceData.headPitch || 0,
          faceDetected: faceData.faceDetected || false
        })
        .catch((error) => {
          console.error('Error sending focus data:', error);
        });
    }

    if (isTracking) {
      const alert = alertManagerRef.current.checkFocus(
        calculatedFocus,
        sessionTime
      );
      if (alert) {
        setCurrentAlert(alert);
        playAlertSound();
        showBrowserNotification(alert.title, alert.message);
        vibrateDevice();
      }
    }

    // Wellness detection thresholds
    const now = Date.now();
    const FOCUS_LOW_THRESHOLD = 40; // dưới 40 xem là mất tập trung
    const FOCUS_SUSTAIN_MS = 45 * 1000; // 45 giây
    const SAD_CONF_THRESHOLD = 0.7; // confidence cao
    const SAD_SUSTAIN_MS = 60 * 1000; // 60 giây

    // Track prolonged low focus
    if (calculatedFocus < FOCUS_LOW_THRESHOLD) {
      if (!lowFocusStartRef.current) lowFocusStartRef.current = now;
    } else {
      lowFocusStartRef.current = null;
    }

    // Track prolonged sad/tired-like emotion
    const emo = (faceData.emotion || 'neutral').toLowerCase();
    const isSadLike = emo === 'sad' || emo === 'tired';
    if (isSadLike) {
      if (!sadStartRef.current) sadStartRef.current = now;
    } else {
      sadStartRef.current = null;
    }

    const quotes = {
      sad: [
        'Cứ bình tĩnh nhé, trời nào rồi cũng sáng.',
        'Bạn đã làm rất tốt rồi, thử hít thở sâu một chút nhé.',
        'Nghỉ 5 phút và quay lại, bạn sẽ làm được.'
      ],
      tired: [
        'Một chút nghỉ ngơi sẽ giúp bạn đi xa hơn.',
        'Đặt lưng 5 phút, uống nước rồi mình tiếp tục nhé.',
        'Cơ thể là ưu tiên, hãy nạp lại năng lượng.'
      ],
      distracted: [
        'Tạm dừng 2 phút để gom lại sự tập trung nhé.',
        'Thử đóng bớt tab và hít sâu 3 lần nào.',
        'Một lần nữa thôi — bạn sẽ làm được.'
      ]
    };

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // If fatigue flag from camera metrics
    if (faceData.fatigue?.isFatigued && !showWellnessModal) {
      setPomodoroRunning(false);
      setShowWellnessModal(true);
      setWellnessReason('Có vẻ bạn đang mệt, mình nghỉ một chút nhé?');
      setWellnessQuote(pick(quotes.tired));
      return;
    }

    // Prolonged low focus
    if (
      lowFocusStartRef.current &&
      now - lowFocusStartRef.current > FOCUS_SUSTAIN_MS &&
      !showWellnessModal
    ) {
      setPomodoroRunning(false);
      setShowWellnessModal(true);
      setWellnessReason('Bạn đang mất tập trung khá lâu, tạm dừng 1 chút nhé.');
      setWellnessQuote(pick(quotes.distracted));
      return;
    }

    // Prolonged sad-like emotion
    if (
      sadStartRef.current &&
      now - sadStartRef.current > SAD_SUSTAIN_MS &&
      !showWellnessModal
    ) {
      setPomodoroRunning(false);
      setShowWellnessModal(true);
      setWellnessReason('Tâm trạng bạn chưa tốt lắm, nghỉ ngơi một chút nhé.');
      setWellnessQuote(pick(quotes.sad));
      return;
    }
  };

  // ⛔ Keep existing start tracking logic
  const startTracking = async (sessionType = 'pomodoro') => {
    if (isTracking) {
      console.log('Already tracking, ignoring start request');
      return;
    }

    setStatus('🔄 Starting session...');

    const sessionName =
      sessionType === 'pomodoro_ai'
        ? 'Pomodoro + AI Focus Session'
        : 'Pomodoro Session';

    try {
      const result = await signalRClient.startSession(
        userId || 'unknown',
        sessionName,
        sessionType
      );

      if (result.success) {
        setSessionId(result.sessionId);
        setIsTracking(true);
        setStatus(`🎯 ${sessionName} Active!`);
        startTimeRef.current = Date.now();
        alertManagerRef.current.reset();
        setPomodoroRunning(true);
      } else {
        setStatus('❌ Error: ' + result.error);
      }
    } catch (error) {
      console.error('Start tracking error:', error);
      setStatus('❌ Error: ' + error.message);
    }
  };

  // ⛔ Keep existing stop tracking logic
  const stopTracking = async () => {
    if (sessionId) {
      const result = await signalRClient.endSession();
      if (result.success) {
        setAnalysis({
          averageFocusScore: result.averageFocusScore,
          totalDurationMinutes: result.totalDurationMinutes,
          aiAnalysis: result.analysisSummary,
          recommendations: result.recommendations
        });
      }
    }

    setIsTracking(false);
    setSessionId(null);
    setStatus('⏸️ Stopped');
    setPomodoroRunning(false);
    setPomodoroTime(25 * 60);
    setPomodoroPhase('Work');

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Start Pomodoro without camera
  const handleStartPomodoro = () => {
    if (!isTracking) {
      startTracking('pomodoro'); // Normal pomodoro mode
    }
  };

  // Start Pomodoro with camera + AI tracking
  const handleStartWithCamera = () => {
    const agreed = window.confirm(
      'Tính năng này sẽ sử dụng camera trong một cửa sổ nổi để tránh bị chậm khi bạn chuyển tab.\n\nBạn có muốn bật camera để bắt đầu phiên với Focus Tracking không?'
    );
    if (!agreed) return;
    openTrackerWindow();
    if (!isTracking) startTracking('pomodoro_ai');
  };

  const openTrackerWindow = async () => {
    const url = '/vr-tracker';
    const supportsDocPip = 'documentPictureInPicture' in window;
    const channel = new MessageChannel();

    try {
      trackerBCRef.current = new BroadcastChannel('stayon-tracker');
    } catch (err) {}

    if (trackerBCRef.current) {
      trackerBCRef.current.onmessage = (e) => {
        console.log('[Main] BC message', e?.data?.type);
        if (e?.data?.type === 'FOCUS_DATA') {
          const m = e.data.payload || {};
          setFocusScore(Math.round(m.focusScore || 0));
          setStats((prev) => ({
            ...prev,
            emotion: m.emotion || prev.emotion,
            faceDetected: m.faceDetected || false,
            landmarks: m.landmarks || 0,
            ear: m.eyeAspectRatio || 0,
            yaw: m.headYaw || 0,
            pitch: m.headPitch || 0,
            attention: m.attention || prev.attention
          }));
          // luôn gọi; client sẽ tự queue nếu session chưa sẵn sàng
          signalRClient
            .sendFocusData({
              focusScore: m.focusScore,
              emotion: m.emotion,
              emotionConfidence: m.emotionConfidence,
              eyeAspectRatio: m.eyeAspectRatio,
              headYaw: m.headYaw,
              headPitch: m.headPitch,
              faceDetected: m.faceDetected
            })
            .catch(() => {});
        }
      };
    }

    const wirePort = (contentWindow) => {
      try {
        console.log('[Main] wiring MessageChannel port to child');
        contentWindow.postMessage({ type: 'INIT_PORT' }, '*', [channel.port2]);
        setTrackerPort(channel.port1);
        setIsExternalTracker(true);
        channel.port1.onmessage = (e) => {
          console.log('[Main] Port message', e?.data?.type);
          if (e?.data?.type === 'FOCUS_DATA') {
            const m = e.data.payload || {};
            setFocusScore(Math.round(m.focusScore || 0));
            setStats((prev) => ({
              ...prev,
              emotion: m.emotion || prev.emotion,
              faceDetected: m.faceDetected || false,
              landmarks: m.landmarks || 0,
              ear: m.eyeAspectRatio || 0,
              yaw: m.headYaw || 0,
              pitch: m.headPitch || 0,
              attention: m.attention || prev.attention
            }));
            signalRClient
              .sendFocusData({
                focusScore: m.focusScore,
                emotion: m.emotion,
                emotionConfidence: m.emotionConfidence,
                eyeAspectRatio: m.eyeAspectRatio,
                headYaw: m.headYaw,
                headPitch: m.headPitch,
                faceDetected: m.faceDetected
              })
              .catch(() => {});
          }
        };
      } catch (err) {}
    };

    if (supportsDocPip) {
      try {
        // @ts-ignore
        const pipWin = await window.documentPictureInPicture.requestWindow({
          width: 360,
          height: 260
        });
        const iframe = pipWin.document.createElement('iframe');
        iframe.src = url;
        iframe.style.cssText =
          'border:0;width:100%;height:100%;display:block;background:#000;';
        pipWin.document.body.style.margin = '0';
        pipWin.document.body.style.background = '#000';
        pipWin.document.body.appendChild(iframe);
        iframe.addEventListener('load', () => wirePort(iframe.contentWindow));
        pipWin.addEventListener('pagehide', () => {
          try {
            channel.port1.close();
          } catch {}
          setIsExternalTracker(false);
          try {
            trackerBCRef.current?.close();
          } catch {}
        });
        return;
      } catch (err) {}
    }

    // Fallback popup
    const child = window.open(
      url,
      'vr-tracker',
      'width=360,height=260,menubar=0,toolbar=0,resizable=1'
    );
    const t = setInterval(() => {
      if (!child || child.closed) {
        clearInterval(t);
        return;
      }
      try {
        if (child.document && child.document.readyState === 'complete') {
          wirePort(child);
          clearInterval(t);
        }
      } catch {}
    }, 200);
  };

  // Pause (toggle running state)
  const handlePause = () => {
    if (isExternalTracker) {
      // Nếu đang dùng AI tracking → Pause/Resume timer + Pause/Resume camera + Dừng/Tiếp tục data
      const newState = !pomodoroRunning;
      setPomodoroRunning(newState);
      // Gửi message pause/resume camera trong tracker window
      const messageType = newState ? 'RESUME_TRACKING' : 'PAUSE_TRACKING';
      try {
        trackerBCRef.current?.postMessage({ type: messageType });
      } catch (err) {
        console.error('BC send tracking error:', err);
      }
      try {
        trackerPort?.postMessage({ type: messageType });
      } catch (err) {
        console.error('Port send tracking error:', err);
      }
      // Gửi qua window message nếu là popup
      if (window.postMessage) {
        window.postMessage({ type: messageType }, '*');
      }
    } else {
      // Mode bình thường → chỉ pause timer
      setPomodoroRunning(!pomodoroRunning);
    }
  };

  // End session (stop tracking + reset)
  const handleEndSession = async () => {
    // Stop timer first
    setPomodoroRunning(false);

    if (isTracking) {
      await stopTracking();
    }

    reset();
  };

  // Reset function
  const reset = () => {
    if (mode === 'stopwatch') {
      setStopwatchTime(0);
      setPomodoroRunning(false);
      if (isTracking) {
        stopTracking();
      }
    } else {
      setPomodoroTime(25 * 60);
      setPomodoroPhase('work');
      setPomodoroRunning(false);
      setCompletedSessions(0);
      if (isTracking) {
        stopTracking();
      }
    }
  };

  // Toggle mode (Pomodoro <-> Stopwatch) - End session if running
  const toggleMode = async () => {
    // If running, end session first
    if (isTracking) {
      await stopTracking();
    }

    const newMode = mode === 'pomodoro' ? 'stopwatch' : 'pomodoro';
    setMode(newMode);
    localStorage.setItem('mode', newMode);

    // Reset timer when switching mode
    setPomodoroRunning(false);
    if (newMode === 'stopwatch') {
      setStopwatchTime(0);
    } else {
      setPomodoroTime(25 * 60);
      setPomodoroPhase('work');
      setCompletedSessions(0);
    }
  };

  // Handle phase selection from dots
  const handlePhaseSelect = (phase) => {
    setPomodoroRunning(false); // Stop timer
    setPomodoroPhase(phase.id);
    setPomodoroTime(phase.time);
  };

  // Camera toggle with persistence
  const toggleCam = () => {
    const newValue = !cameraOpen;
    if (newValue) {
      const agreed = window.confirm(
        'Tính năng này sẽ sử dụng camera của bạn nhưng chúng mình sẽ không ghi hình, chụp ảnh và đảm bảo quyền riêng tư của bạn đúng theo quy định của pháp luật.\n\nBạn có muốn bật camera không?'
      );
      if (!agreed) return;
    }
    setCameraOpen(newValue);
    localStorage.setItem('ui.cameraOpen', JSON.stringify(newValue));
  };

  // Session index
  const sessionIndex = completedSessions % 4;

  // Timer logic for both Pomodoro and Stopwatch
  useEffect(() => {
    if (pomodoroRunning) {
      timerRef.current = setInterval(() => {
        if (mode === 'stopwatch') {
          // Stopwatch: count UP
          setStopwatchTime((prev) => prev + 1);
        } else {
          // Pomodoro: count DOWN
          setPomodoroTime((prev) => {
            if (prev <= 1) {
              // Timer finished
              clearInterval(timerRef.current);
              setPomodoroRunning(false);

              // Handle phase completion
              if (pomodoroPhase === 'work') {
                const newCount = completedSessions + 1;
                setCompletedSessions(newCount);

                // After 4 sessions, long break; otherwise short break
                if (newCount % 4 === 0) {
                  setPomodoroPhase('long');
                  setPomodoroTime(15 * 60);
                } else {
                  setPomodoroPhase('short');
                  setPomodoroTime(5 * 60);
                }
              } else {
                // Break finished, back to work
                setPomodoroPhase('work');
                setPomodoroTime(25 * 60);
              }

              // Notification
              if (
                'Notification' in window &&
                Notification.permission === 'granted'
              ) {
                new Notification('Pomodoro Timer', {
                  body: `${pomodoroPhase} completed! 🎉`,
                  icon: '/favicon.ico'
                });
              }

              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [pomodoroRunning, mode, pomodoroPhase, completedSessions]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Background - full bleed with fallback gradient */}
      <div
        className="via-blue-900 fixed inset-0 bg-gradient-to-br from-purple-900 to-indigo-900"
        style={{ zIndex: -1 }}
      />

      {/* Video background */}
      {currentBackground && currentBackground.type === 'video' && (
        <video
          ref={bgVideoRef}
          key={`bg-video-${videoKey}-${currentBackground.id}`}
          src={videoSrc}
          autoPlay
          muted
          playsInline
          preload="auto"
          loop
          disableRemotePlayback
          className="background-video"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            backgroundColor: 'black',
            display: 'block',
            pointerEvents: 'none',
            opacity: 1
          }}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration && v.currentTime > v.duration - 0.08) {
              try {
                v.currentTime = 0.01;
              } catch {}
            }
          }}
        />
      )}

      {/* Image Background (if image type) */}
      {currentBackground?.type === 'image' && (
        <div
          key={`image-${currentBackground.id}`}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundImage: `url(${currentBackground.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1
          }}
        />
      )}

      {/* Dark overlay - ABOVE video but BELOW content */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 2,
          pointerEvents: 'none',
          backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }}
      />

      {/* Top Bar */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          transform: 'translateX(-21px)'
        }}
      >
        <TopBar
          onToggleCamera={toggleCam}
          onOpenAnalytics={() => setAnalyticsOpen(true)}
        />
      </div>

      {/* Camera Panel (floating top-right) */}
      {cameraOpen && !isExternalTracker && (
        <CameraPanel isOpen={cameraOpen} onClose={() => setCameraOpen(false)}>
          <CameraView onFaceData={handleFaceData} isTracking={isTracking} />
        </CameraPanel>
      )}

      {/* HERO center-lock - HARD CENTER */}
      <div
        aria-label="pomodoro-hero"
        style={{
          position: 'fixed',
          top: '80px',
          left: '0',
          right: '0',
          bottom: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          pointerEvents: 'none'
        }}
      >
        <div
          style={{ pointerEvents: 'auto' }}
          className="flex flex-col items-center text-center"
        >
          {/* Session Dots - only show in Pomodoro mode */}
          {mode === 'pomodoro' && (
            <SessionDots
              activePhase={pomodoroPhase}
              onPhaseSelect={handlePhaseSelect}
            />
          )}

          {/* Timer Display - NEVER shows NaN */}
          <TimerDisplay
            timeText={mode === 'stopwatch' ? stopwatchTime : pomodoroTime}
            caption={mode === 'stopwatch' ? '⏱️ Stopwatch' : 'Podomoro'}
          />

          {/* Primary Action - ONE Start/Pause button + Reset/Skip */}
          <PrimaryAction
            onStartPomodoro={handleStartPomodoro}
            onStartWithCamera={handleStartWithCamera}
            onPause={handlePause}
            onEndSession={handleEndSession}
            isRunning={pomodoroRunning}
            hasStarted={isTracking || pomodoroRunning}
          />

          {/* Info Text */}
          <p className="mt-3 text-sm text-white/80">
            {mode === 'stopwatch'
              ? 'Focus until you decide to stop'
              : '25/5 cycles • long break 15m after 4 sessions'}
          </p>
        </div>
      </div>

      {/* Bottom Left Dock: Music, Background, Camera, Mode */}
      <Dock
        onToggleCamera={toggleCam}
        mode={mode}
        onToggleMode={toggleMode}
        currentBackground={currentBackground}
        onBackgroundSelect={setCurrentBackground}
      />

      {/* Bottom Right FAB Cluster: Chat, Todo/Templates */}
      <FabCluster
        onChat={() => setChatOpen(true)}
        onTodoTemplate={() => setTodoModalOpen(true)}
      />

      {/* Chat Drawer (right slide-out) */}
      <ChatDrawer
        ref={chatRef}
        open={chatOpen}
        onClose={() => setChatOpen(false)}
      />

      {/* Todo & Template Modal */}
      <TodoTemplateModal
        open={todoModalOpen}
        onClose={() => setTodoModalOpen(false)}
        userId={userId}
      />

      {/* Activities Summary Modal */}
      <ActivitiesSummaryModal
        open={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
        userId={userId}
        onAnalyzeSession={(sessionId) => {
          setChatOpen(true);
          setTimeout(() => {
            if (chatRef.current?.analyzeSession) {
              chatRef.current.analyzeSession(sessionId);
            }
          }, 100); // Delay để chatbox mở xong
        }}
      />

      {/* Hidden Pomodoro Timer Component (logic only) */}
      <div className="hidden">
        <PomodoroTimer
          onTimerUpdate={(timerData) => {
            setPomodoroTime(timerData.timeLeft);
            setPomodoroPhase(timerData.currentPhase);
            if (timerData.isRunning) {
              setSessionTime(timerData.totalSeconds - timerData.timeLeft);
            }
            if (timerData.timeLeft === 0 && timerData.currentPhase === 'Work') {
              setCompletedSessions((prev) => prev + 1);
            }
          }}
          isActive={isTracking}
        />
      </div>

      {/* Alert Modal */}
      {currentAlert && (
        <AlertModal
          alert={currentAlert}
          onDismiss={() => setCurrentAlert(null)}
          onSnooze={(duration) => {
            alertManagerRef.current.snooze(duration);
            setCurrentAlert(null);
          }}
        />
      )}

      {/* Todo Preview Card - shows under timer */}
      <TodoPreviewCard userId={userId} />

      {/* Wellness Modal */}
      {showWellnessModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
          onClick={() => setShowWellnessModal(false)}
        >
          <div
            style={{
              background: 'rgba(20,20,25,0.95)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '16px',
              padding: '20px',
              maxWidth: '480px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 700,
                marginBottom: '8px'
              }}
            >
              Nhắc nhở thân thiện
            </h3>
            <p
              style={{
                margin: 0,
                color: 'rgba(255,255,255,0.85)',
                marginBottom: '8px'
              }}
            >
              {wellnessReason}
            </p>
            <p
              style={{
                margin: 0,
                color: 'rgba(255,255,255,0.65)',
                fontStyle: 'italic',
                marginBottom: '16px'
              }}
            >
              “{wellnessQuote}”
            </p>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-end'
              }}
            >
              <button
                onClick={() => {
                  setShowWellnessModal(false);
                  setPomodoroRunning(false);
                }}
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  color: 'white'
                }}
              >
                Nghỉ một chút
              </button>
              <button
                onClick={() => {
                  setShowWellnessModal(false);
                  setPomodoroRunning(true);
                }}
                style={{
                  padding: '10px 14px',
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontWeight: 600
                }}
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PomodoroPage;
