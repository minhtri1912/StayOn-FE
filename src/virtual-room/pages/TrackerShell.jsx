import React, { useEffect, useRef, useState } from 'react';
import CameraView from '../components/CameraView';
import {
  FocusAlertManager,
  playAlertSound,
  showBrowserNotification
} from '../utils/alertManager';
import { calculateFocusScore } from '../utils/focusCalculator';

export default function TrackerShell() {
  const portRef = useRef(null);
  const bcRef = useRef(null);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [showWellnessModal, setShowWellnessModal] = useState(false);
  const [wellnessReason, setWellnessReason] = useState('');
  const [wellnessQuote, setWellnessQuote] = useState('');
  const [isTrackingPaused, setIsTrackingPaused] = useState(false);
  const alertManagerRef = useRef(new FocusAlertManager());
  const lowFocusStartRef = useRef(null);
  const sadStartRef = useRef(null);
  const sessionTimeRef = useRef(0);

  useEffect(() => {
    // Initialize BroadcastChannel
    try {
      bcRef.current = new BroadcastChannel('stayon-tracker');
    } catch (err) {
      console.error('BroadcastChannel error:', err);
    }

    // Listen for port initialization và pause/resume từ main window
    const onMsg = (e) => {
      if (e?.data?.type === 'INIT_PORT' && e.ports && e.ports[0]) {
        portRef.current = e.ports[0];
        try {
          portRef.current.start?.();
        } catch (err) {
          console.error('Port start error:', err);
        }
        try {
          console.log('[TrackerShell] Port initialized, sending TRACKER_READY');
          portRef.current.postMessage({ type: 'TRACKER_READY' });
          // Setup port message handler ngay khi port được init
          portRef.current.onmessage = (e) => {
            if (e?.data?.type === 'PAUSE_TRACKING') {
              console.log('[TrackerShell] Received PAUSE_TRACKING via port');
              setIsTrackingPaused(true);
            } else if (e?.data?.type === 'RESUME_TRACKING') {
              console.log('[TrackerShell] Received RESUME_TRACKING via port');
              setIsTrackingPaused(false);
            }
          };
        } catch (err) {
          console.error('Port message error:', err);
        }
      } else if (e?.data?.type === 'PAUSE_TRACKING') {
        // Pause từ main window (nút pause)
        console.log('[TrackerShell] Received PAUSE_TRACKING from main window');
        setIsTrackingPaused(true);
      } else if (e?.data?.type === 'RESUME_TRACKING') {
        // Resume từ main window (nút resume)
        console.log('[TrackerShell] Received RESUME_TRACKING from main window');
        setIsTrackingPaused(false);
      }
    };

    window.addEventListener('message', onMsg);

    // Listen từ BroadcastChannel
    if (bcRef.current) {
      bcRef.current.onmessage = (e) => {
        if (e?.data?.type === 'PAUSE_TRACKING') {
          console.log('[TrackerShell] Received PAUSE_TRACKING via BC');
          setIsTrackingPaused(true);
        } else if (e?.data?.type === 'RESUME_TRACKING') {
          console.log('[TrackerShell] Received RESUME_TRACKING via BC');
          setIsTrackingPaused(false);
        }
      };
    }

    return () => {
      window.removeEventListener('message', onMsg);
      try {
        bcRef.current?.close();
      } catch (err) {}
    };
  }, []);

  // Helper functions để gửi messages về main window
  const pauseTimerInMainWindow = () => {
    try {
      portRef.current?.postMessage({ type: 'PAUSE_TIMER' });
      bcRef.current?.postMessage({ type: 'PAUSE_TIMER' });
      if (window.opener) {
        window.opener.postMessage({ type: 'PAUSE_TIMER' }, '*');
      }
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'PAUSE_TIMER' }, '*');
      }
    } catch (err) {
      console.error('Error sending PAUSE_TIMER:', err);
    }
  };

  const resumeTimerInMainWindow = () => {
    try {
      portRef.current?.postMessage({ type: 'RESUME_TIMER' });
      bcRef.current?.postMessage({ type: 'RESUME_TIMER' });
      if (window.opener) {
        window.opener.postMessage({ type: 'RESUME_TIMER' }, '*');
      }
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'RESUME_TIMER' }, '*');
      }
    } catch (err) {
      console.error('Error sending RESUME_TIMER:', err);
    }
  };

  // Handle face data từ CameraView
  const onFaceData = (faceData) => {
    // Check if data is valid
    if (!faceData || typeof faceData !== 'object') {
      console.warn('[TrackerShell] Invalid face data received:', faceData);
      return;
    }

    // Dừng gửi data nếu tracking bị pause hoặc wellness modal đang hiển thị
    if (isTrackingPaused || showWellnessModal) {
      return;
    }

    // Calculate focus score
    const calculatedFocus = calculateFocusScore({
      eyeAspectRatio: faceData.eyeAspectRatio || 0,
      headYaw: faceData.headYaw || 0,
      headPitch: faceData.headPitch || 0,
      faceDetected: faceData.faceDetected || false
    });

    // Send focus data to main window
    const focusData = {
      focusScore: calculatedFocus,
      emotion: faceData.emotion || 'neutral',
      emotionConfidence: faceData.emotionConfidence || 0.5,
      eyeAspectRatio: faceData.eyeAspectRatio || 0.3,
      headYaw: faceData.headYaw || 0,
      headPitch: faceData.headPitch || 0,
      faceDetected: faceData.faceDetected || false,
      landmarks: faceData.landmarks?.length || 0,
      attention:
        calculatedFocus < 40
          ? '😵 Distracted'
          : calculatedFocus > 80
            ? '🌟 Excellent'
            : '⚠️ Moderate'
    };

    try {
      portRef.current?.postMessage({
        type: 'FOCUS_DATA',
        payload: focusData
      });
      bcRef.current?.postMessage({
        type: 'FOCUS_DATA',
        payload: focusData
      });
    } catch (err) {
      console.error('Error sending FOCUS_DATA:', err);
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
    if (isSadLike && (faceData.emotionConfidence || 0) >= SAD_CONF_THRESHOLD) {
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
      pauseTimerInMainWindow();
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
      pauseTimerInMainWindow();
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
      pauseTimerInMainWindow();
      setShowWellnessModal(true);
      setWellnessReason('Tâm trạng bạn chưa tốt lắm, nghỉ ngơi một chút nhé.');
      setWellnessQuote(pick(quotes.sad));
      return;
    }
  };

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh',
        background: '#bfbfbf',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <style>{`
        html, body {
          margin:0;
          padding:0;
          height:100%;
          overflow:hidden;
          background:#bfbfbf;
        }
        .video-card {
          position: relative;
          width: 320px;
          height: 200px;
          border-radius: 12px;
          background:#1f1f1f;
          box-shadow: 0 10px 18px rgba(0,0,0,.35);
          padding: 0;
          overflow:hidden;
        }
        .video-container {
          margin:0 !important;
          width:100% !important;
          height:100% !important;
          border-radius: 12px !important;
          overflow:hidden;
          background: transparent !important;
          display:block !important;
        }
        #input_video {
          width:100% !important;
          height:100% !important;
          object-fit: cover !important;
          display:block !important;
          border-radius: 12px;
        }
        #output_canvas {
          display:none !important;
        }
        .camera-status {
          display:none !important;
        }
        .close-btn {
          position:absolute;
          top:8px;
          right:8px;
          width:24px;
          height:24px;
          border:none;
          border-radius:50%;
          background:rgba(0,0,0,.5);
          color:#fff;
          cursor:pointer;
          font-size:18px;
          line-height:1;
          z-index:10;
        }
        .active-badge {
          position:absolute;
          bottom:12px;
          left:50%;
          transform:translateX(-50%);
          background:#22c55e;
          color:#fff;
          padding:6px 14px;
          border-radius:20px;
          font-size:13px;
          font-weight:600;
          z-index:10;
          display:flex;
          align-items:center;
          gap:6px;
          box-shadow: 0 2px 8px rgba(0,0,0,.25);
        }
        .active-badge::before {
          content:'✓';
          font-size:14px;
        }
      `}</style>

      <div className="video-card">
        <button
          className="close-btn"
          onClick={() => window.close()}
          aria-label="Close"
        >
          ×
        </button>

        {/* Camera chỉ hiển thị khi không có wellness modal và không bị pause */}
        {!showWellnessModal && !isTrackingPaused && (
          <CameraView isTracking={true} onFaceData={onFaceData} />
        )}

        {!isTrackingPaused && !showWellnessModal && (
          <div className="active-badge">Camera Active</div>
        )}
      </div>

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
              "{wellnessQuote}"
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
                  setIsTrackingPaused(true);
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
                  setIsTrackingPaused(false);
                  lowFocusStartRef.current = null;
                  sadStartRef.current = null;
                  alertManagerRef.current.reset();
                  setCurrentAlert(null);
                  resumeTimerInMainWindow();
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
