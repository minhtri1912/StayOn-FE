import { useEffect, useRef, useState } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { FaceMesh } from '@mediapipe/face_mesh';
import * as faceapi from '@vladmandic/face-api';
import './CameraView.css';

function CameraView({ onFaceData, isTracking }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState(null);

  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);
  const faceApiModelsLoadedRef = useRef(false);
  const lastEmotionDetectionRef = useRef(0);
  const lastEmotionDataRef = useRef({ emotion: 'neutral', confidence: 0.5 });
  const frameCounterRef = useRef(0);

  // Flags bật/tắt tính năng nặng
  const enableFaceApi = true;
  const enableGaze = true;
  const enableAttention = true;

  const latestOnFaceDataRef = useRef(onFaceData);
  useEffect(() => (latestOnFaceDataRef.current = onFaceData), [onFaceData]);

  // ---------------------------
  //      LANDMARK SETUP
  // ---------------------------
  const LEFT_EYE_INDICES = [362, 385, 387, 263, 373, 380];
  const RIGHT_EYE_INDICES = [33, 160, 158, 133, 153, 144];
  const NOSE_TIP = 1;
  const LEFT_EYE_CORNER = 33;
  const RIGHT_EYE_CORNER = 263;

  const LEFT_IRIS = 468;
  const RIGHT_IRIS = 473;

  // Buffer smoothing
  const metricBuffers = useRef({
    ear: [],
    yaw: [],
    pitch: [],
    gaze: [],
    faceSize: []
  });

  const smoothMetric = (buffer, newValue, maxSize = 3) => {
    buffer.push(newValue);
    if (buffer.length > maxSize) buffer.shift();
    return buffer.reduce((a, b) => a + b, 0) / buffer.length;
  };

  // --------------------------------
  //      FACE-API EMOTIONS (giảm tải)
  // --------------------------------
  const EMOTION_HISTORY_SIZE = 5;
  const emotionHistoryRef = useRef([]); // for smoothing
  const detectEmotions = async () => {
    if (!enableFaceApi) {
      console.log('⚠️ Face API disabled');
      return lastEmotionDataRef.current;
    }
    if (!faceApiModelsLoadedRef.current) {
      console.log('⚠️ Models not loaded');
      return lastEmotionDataRef.current;
    }
    if (!isTracking) {
      console.log('⚠️ Not tracking');
      return lastEmotionDataRef.current;
    }
    if (!videoRef.current) {
      console.log('⚠️ No video');
      return lastEmotionDataRef.current;
    }
    const now = Date.now();
    if (now - lastEmotionDetectionRef.current < 800) {
      return lastEmotionDataRef.current; // ⭐ reduce min interval to 800ms
    }
    lastEmotionDetectionRef.current = now;
    try {
      console.log('🔍 Detecting emotions...');
      const result = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 224, // ⭐ higher input size for quality
            scoreThreshold: 0.3 // ⭐ reduce threshold for detection
          })
        )
        .withFaceExpressions();

      console.log('📦 Result:', result ? 'Found' : 'Not found');
      if (result?.expressions) {
        // Log all emotions for debug
        console.log('😊 Expressions:');
        Object.entries(result.expressions).forEach(([emo, score]) => {
          console.log(`  ${emo}: ${(score * 100).toFixed(1)}%`);
        });
        // Collect all emotions above a low threshold
        let emotions = [];
        for (const [emo, confidence] of Object.entries(result.expressions)) {
          if (confidence > 0.15) {
            // ⭐ more sensitive
            emotions.push({ emotion: emo, confidence });
          }
        }
        emotions.sort((a, b) => b.confidence - a.confidence);
        let selectedEmotion = emotions[0] || {
          emotion: 'neutral',
          confidence: 0.5
        };
        // Boost non-neutral
        const nonNeutral = emotions.find(
          (e) => e.emotion !== 'neutral' && e.confidence > 0.2
        );
        if (nonNeutral) {
          selectedEmotion = nonNeutral;
        }
        // push for smoothing
        emotionHistoryRef.current.push(selectedEmotion);
        if (emotionHistoryRef.current.length > EMOTION_HISTORY_SIZE)
          emotionHistoryRef.current.shift();
        // Smoothing - find most frequent
        const countMap = {};
        emotionHistoryRef.current.forEach((e) => {
          countMap[e.emotion] = (countMap[e.emotion] || 0) + 1;
        });
        let mode = selectedEmotion.emotion,
          maxCount = 0;
        for (const [emo, count] of Object.entries(countMap)) {
          if (count > maxCount) {
            maxCount = count;
            mode = emo;
          }
        }
        // Compute average confidence for mode
        const modeList = emotionHistoryRef.current.filter(
          (e) => e.emotion === mode
        );
        let avgConfidence =
          modeList.length > 0
            ? modeList.reduce((sum, e) => sum + e.confidence, 0) /
              modeList.length
            : selectedEmotion.confidence;
        const finalEmotion = { emotion: mode, confidence: avgConfidence };
        lastEmotionDataRef.current = finalEmotion;
        console.log('✅ Final emotion:', finalEmotion);
        return finalEmotion;
      }
    } catch (err) {
      console.error('❌ Emotion detect error:', err);
    }
    return lastEmotionDataRef.current;
  };

  // ---------------------------
  //        EAR
  // ---------------------------
  const calculateEAR = (pts) => {
    try {
      const v1 = Math.hypot(pts[1].x - pts[5].x, pts[1].y - pts[5].y);
      const v2 = Math.hypot(pts[2].x - pts[4].x, pts[2].y - pts[4].y);
      const h = Math.hypot(pts[0].x - pts[3].x, pts[0].y - pts[3].y);
      return (v1 + v2) / (2 * h);
    } catch {
      return 0.3;
    }
  };

  // ---------------------------
  //      HEAD POSE
  // ---------------------------
  const calculateHeadPose = (lm) => {
    try {
      const nose = lm[NOSE_TIP];
      const left = lm[LEFT_EYE_CORNER];
      const right = lm[RIGHT_EYE_CORNER];

      const eyeDist = Math.abs(left.x - right.x);
      const yaw = ((nose.x - left.x - (right.x - nose.x)) / eyeDist) * 30;
      const pitch = (nose.y - (left.y + right.y) / 2) * 50;

      return {
        yaw: Math.max(-45, Math.min(45, yaw)),
        pitch: Math.max(-30, Math.min(30, pitch))
      };
    } catch {
      return { yaw: 0, pitch: 0 };
    }
  };

  // ---------------------------
  //      GAZE TRACKING
  // ---------------------------
  const calculateGaze = (lm) => {
    if (!enableGaze)
      return { horizontal: 0, vertical: 0, lookingAtScreen: true };

    try {
      const leftEyeLeft = lm[33];
      const leftEyeRight = lm[133];
      const rightEyeLeft = lm[362];
      const rightEyeRight = lm[263];

      const leftIris = lm[LEFT_IRIS];
      const rightIris = lm[RIGHT_IRIS];

      const leftNorm =
        (leftIris.x - leftEyeLeft.x) / (leftEyeRight.x - leftEyeLeft.x) - 0.5;
      const rightNorm =
        (rightIris.x - rightEyeLeft.x) / (rightEyeRight.x - rightEyeLeft.x) -
        0.5;

      const avg = smoothMetric(
        metricBuffers.current.gaze,
        (leftNorm + rightNorm) / 2
      );

      return {
        horizontal: avg,
        vertical: 0,
        lookingAtScreen: Math.abs(avg) < 0.18
      };
    } catch {
      return { horizontal: 0, vertical: 0, lookingAtScreen: true };
    }
  };

  // ---------------------------
  //     ATTENTION SCORE
  // ---------------------------
  const calculateAttentionScore = (m) => {
    if (!enableAttention) return 0;

    let score = 100;

    const headAngle = Math.abs(m.headYaw) + Math.abs(m.headPitch);
    if (headAngle > 20) score -= (headAngle - 20) * 2;

    if (!m.gaze.lookingAtScreen) score -= 20;
    if (m.eyeAspectRatio < 0.2) score -= 20;

    return Math.max(0, Math.min(100, score));
  };

  // ---------------------------
  //   MAIN METRICS PIPELINE
  // ---------------------------
  // Lưu lịch sử EAR để phát hiện mệt mỏi
  const earHistoryRef = useRef([]);
  const MAX_HISTORY = 30; // ~1s nếu xử lý 30fps/3
  const FATIGUE_HISTORY_SIZE = 50; // ~5 giây nếu ~10fps
  const fatigueHistoryRef = useRef([]); // for fatigue smoothing

  const detectFatigue = (metrics, avgEAR) => {
    let fatigueScore = 0;
    // Dùng avgEAR thay vì instant
    if (avgEAR < 0.22) {
      fatigueScore += 30;
    }
    // Mắt nhắm kéo dài
    const recentEAR = earHistoryRef.current.slice(-10);
    const lowEARCount = recentEAR.filter((e) => e < 0.23).length;
    if (lowEARCount > 7) {
      fatigueScore += 20;
    }
    // Attention thấp
    if (metrics.attentionScore < 60) fatigueScore += 20;
    // Đầu cúi xuống
    if (metrics.headPitch > 15) fatigueScore += 25;
    // Không nhìn màn hình
    if (!metrics.gaze.lookingAtScreen) fatigueScore += 15;
    // Emotion sad (không cộng neutral nữa)
    if (metrics.emotion === 'sad') fatigueScore += 10;
    // track fatigue score theo buffer
    fatigueHistoryRef.current.push(fatigueScore);
    if (fatigueHistoryRef.current.length > FATIGUE_HISTORY_SIZE)
      fatigueHistoryRef.current.shift();
    const avgFatigueScore =
      fatigueHistoryRef.current.reduce((a, b) => a + b, 0) /
      fatigueHistoryRef.current.length;
    return {
      isFatigued: avgFatigueScore > 50,
      fatigueLevel: Math.min(100, avgFatigueScore),
      instantScore: fatigueScore,
      indicators: {
        droopyEyes: avgEAR < 0.22,
        headDropping: metrics.headPitch > 15,
        lowAttention: metrics.attentionScore < 60,
        prolongedLowEAR: lowEARCount > 7
      }
    };
  };

  const calculateMetrics = async (lm) => {
    const leftEye = LEFT_EYE_INDICES.map((i) => lm[i]);
    const rightEye = RIGHT_EYE_INDICES.map((i) => lm[i]);

    const ear = smoothMetric(
      metricBuffers.current.ear,
      (calculateEAR(leftEye) + calculateEAR(rightEye)) / 2
    );

    const pose = calculateHeadPose(lm);
    const yaw = smoothMetric(metricBuffers.current.yaw, pose.yaw);
    const pitch = smoothMetric(metricBuffers.current.pitch, pose.pitch);

    const gaze = calculateGaze(lm);

    let emotion = lastEmotionDataRef.current;
    if (enableFaceApi) {
      const e = await detectEmotions();
      if (e) emotion = e;
    }

    const metrics = {
      eyeAspectRatio: ear,
      headYaw: yaw,
      headPitch: pitch,
      faceDetected: true,
      emotion: emotion.emotion,
      emotionConfidence: emotion.confidence,
      gaze: gaze
    };

    metrics.attentionScore = calculateAttentionScore(metrics);

    // Cập nhật lịch sử EAR và tính fatigue
    earHistoryRef.current.push(ear);
    if (earHistoryRef.current.length > MAX_HISTORY)
      earHistoryRef.current.shift();
    const avgEAR =
      earHistoryRef.current.reduce((a, b) => a + b, 0) /
      earHistoryRef.current.length;
    metrics.fatigue = detectFatigue(metrics, avgEAR);
    return metrics;
  };

  // -------------------------------------
  //      CAMERA + FACE MESH INIT
  // -------------------------------------
  const initializeCamera = async () => {
    try {
      console.log('🎥 Starting camera initialization...');

      // Ensure video element exists
      if (!videoRef.current) {
        console.error('Video ref is null');
        setError('Video element not found');
        return;
      }

      const faceMesh = new FaceMesh({
        locateFile: (f) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMesh.onResults(async (res) => {
        if (!res.multiFaceLandmarks || res.multiFaceLandmarks.length === 0) {
          latestOnFaceDataRef.current({
            faceDetected: false,
            emotion: 'neutral',
            emotionConfidence: 0,
            eyeAspectRatio: 0,
            headYaw: 0,
            headPitch: 0,
            gaze: { lookingAtScreen: false },
            attentionScore: 0
          });
          return;
        }

        const lm = res.multiFaceLandmarks[0];

        // ⭐ Lighting detection
        if (videoRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoRef.current, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const brightness =
            imageData.data.reduce(
              (sum, val, i) => (i % 4 === 3 ? sum : sum + val),
              0
            ) /
            (imageData.data.length * 0.75);
          if (brightness < 50) {
            console.warn('⚠️ Low lighting detected:', brightness);
          }
        }

        // LOG GIỮ LẠI
        console.log('⚡ Processing face frame...');

        const data = await calculateMetrics(lm);
        latestOnFaceDataRef.current(data);
      });

      faceMeshRef.current = faceMesh;

      console.log('🎥 Creating camera with video element:', videoRef.current);

      // ⭐ Bump camera resolution and process every 2nd frame
      cameraRef.current = new Camera(videoRef.current, {
        width: 640,
        height: 480,
        onFrame: async () => {
          frameCounterRef.current++;
          if (frameCounterRef.current % 2 !== 0) return;
          if (faceMeshRef.current && videoRef.current) {
            await faceMeshRef.current.send({ image: videoRef.current });
          }
        }
      });

      console.log('🎥 Starting camera...');
      await cameraRef.current.start();
      console.log('✅ Camera started successfully');
      setIsCameraReady(true);
    } catch (err) {
      console.error('❌ Camera initialization failed:', err);
      setError(`Camera init failed: ${err.message}`);
    }
  };

  // -----------------------
  //         LIFECYCLE
  // -----------------------
  useEffect(() => {
    // Load models trước, sau đó mới init camera
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(
            'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model'
          ),
          faceapi.nets.faceExpressionNet.loadFromUri(
            'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model'
          )
        ]);
        faceApiModelsLoadedRef.current = true;
        console.log('✅ Face-API Models Loaded');
      } catch (err) {
        console.error('❌ Failed to load face-api models:', err);
      }
    };

    loadModels().then(() => {
      initializeCamera();
    });

    return () => {
      if (cameraRef.current) cameraRef.current.stop();
      if (faceMeshRef.current) faceMeshRef.current.close();
    };
  }, []);

  return (
    <div className="video-container">
      {error && (
        <div className="camera-error">
          <p>📹 {error}</p>
          <button onClick={initializeCamera} className="retry-button">
            🔄 Retry
          </button>
        </div>
      )}

      {!isCameraReady && !error && (
        <div className="camera-placeholder">
          <div className="camera-icon">📹</div>
          <p>Initializing camera...</p>
          <small>Please allow camera access</small>
        </div>
      )}

      <video
        ref={videoRef}
        id="input_video"
        autoPlay
        muted
        playsInline
        style={{
          display: isCameraReady ? 'block' : 'none',
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        onError={(e) => {
          console.error('Video error:', e);
          setError('Video playback failed');
        }}
        onLoadStart={() => console.log('Video loading started')}
        onCanPlay={() => console.log('Video can play')}
      />
      <canvas ref={canvasRef} id="output_canvas" style={{ display: 'none' }} />

      {isCameraReady && (
        <div className="camera-status">
          <span className="status-indicator">✔ Camera Active</span>
        </div>
      )}
    </div>
  );
}

export default CameraView;
