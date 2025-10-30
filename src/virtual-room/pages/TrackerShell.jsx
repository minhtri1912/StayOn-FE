import React, { useEffect, useRef, useState } from 'react';

export default function TrackerShell() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const portRef = useRef(null);
  const bcRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    // Initialize BroadcastChannel
    try {
      bcRef.current = new BroadcastChannel('stayon-tracker');
    } catch (err) {
      console.error('BroadcastChannel error:', err);
    }

    // Listen for port initialization
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
        } catch (err) {
          console.error('Port message error:', err);
        }
      }
    };

    window.addEventListener('message', onMsg);

    // Initialize camera
    initCamera();

    return () => {
      window.removeEventListener('message', onMsg);
      try {
        bcRef.current?.close();
      } catch (err) {}
      // Stop camera
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraActive(true);

        // Start face detection (simplified version)
        startFaceDetection();
      }
    } catch (err) {
      console.error('Camera error:', err);
      setIsCameraActive(false);
    }
  };

  const startFaceDetection = () => {
    // Simplified face detection - send dummy data
    const interval = setInterval(() => {
      const faceData = {
        isLookingAtScreen: true,
        confidence: 0.95,
        timestamp: Date.now()
      };

      try {
        portRef.current?.postMessage({
          type: 'FOCUS_DATA',
          payload: faceData
        });
      } catch (err) {}

      try {
        bcRef.current?.postMessage({
          type: 'FOCUS_DATA',
          payload: faceData
        });
      } catch (err) {}
    }, 1000);

    return () => clearInterval(interval);
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
        justifyContent: 'center'
      }}
    >
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { 
          margin: 0; 
          padding: 0; 
          height: 100%; 
          overflow: hidden; 
          background: #bfbfbf; 
        }
        .video-card { 
          position: relative; 
          width: 320px; 
          height: 240px; 
          border-radius: 12px; 
          background: #1f1f1f; 
          box-shadow: 0 10px 18px rgba(0,0,0,.35); 
          overflow: hidden; 
        }
        .video-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        #tracker-video { 
          position: absolute;
          top: 0;
          left: 0;
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          border-radius: 12px;
        }
        #tracker-canvas { 
          display: none; 
        }
        .close-btn { 
          position: absolute; 
          top: 8px; 
          right: 8px; 
          width: 24px; 
          height: 24px; 
          border: none; 
          border-radius: 50%; 
          background: rgba(0,0,0,.5); 
          color: #fff; 
          cursor: pointer; 
          font-size: 18px; 
          line-height: 1; 
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .close-btn:hover {
          background: rgba(0,0,0,.7);
        }
        .active-badge { 
          position: absolute; 
          bottom: 12px; 
          left: 50%; 
          transform: translateX(-50%); 
          background: #22c55e; 
          color: #fff; 
          padding: 6px 14px; 
          border-radius: 20px; 
          font-size: 13px; 
          font-weight: 600; 
          z-index: 20; 
          display: flex; 
          align-items: center; 
          gap: 6px; 
          box-shadow: 0 2px 8px rgba(0,0,0,.25);
          font-family: system-ui, -apple-system, sans-serif;
        }
        .active-badge::before { 
          content: '✓'; 
          font-size: 14px; 
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

        <div className="video-wrapper">
          <video ref={videoRef} id="tracker-video" autoPlay playsInline muted />
          <canvas ref={canvasRef} id="tracker-canvas" />
        </div>

        {isCameraActive && <div className="active-badge">Camera Active</div>}
      </div>
    </div>
  );
}
