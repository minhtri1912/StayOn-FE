/**
 * Focus Score Calculation Utilities
 * Based on eye tracking, head pose, and face detection
 */

// Mediapipe Face Mesh landmark indices
export const LEFT_EYE_INDICES = [362, 385, 387, 263, 373, 380];
export const RIGHT_EYE_INDICES = [33, 160, 158, 133, 153, 144];
export const NOSE_TIP = 1;
export const LEFT_EYE_CORNER = 33;
export const RIGHT_EYE_CORNER = 263;

/**
 * Calculate Eye Aspect Ratio (EAR)
 * Used to detect if eyes are open or closed
 */
export function calculateEAR(eyePoints) {
  if (!eyePoints || eyePoints.length < 6) return 0;

  const vertical1 = Math.sqrt(
    Math.pow(eyePoints[1].x - eyePoints[5].x, 2) +
      Math.pow(eyePoints[1].y - eyePoints[5].y, 2)
  );
  const vertical2 = Math.sqrt(
    Math.pow(eyePoints[2].x - eyePoints[4].x, 2) +
      Math.pow(eyePoints[2].y - eyePoints[4].y, 2)
  );
  const horizontal = Math.sqrt(
    Math.pow(eyePoints[0].x - eyePoints[3].x, 2) +
      Math.pow(eyePoints[0].y - eyePoints[3].y, 2)
  );

  return (vertical1 + vertical2) / (2.0 * horizontal);
}

/**
 * Calculate head pose (yaw and pitch angles)
 */
export function calculateHeadPose(landmarks) {
  if (!landmarks || landmarks.length < 468) return { yaw: 0, pitch: 0 };

  const noseTip = landmarks[NOSE_TIP];
  const leftEye = landmarks[LEFT_EYE_CORNER];
  const rightEye = landmarks[RIGHT_EYE_CORNER];

  // Calculate yaw (left-right rotation)
  const eyeDistance = Math.abs(leftEye.x - rightEye.x);
  const noseToLeftEye = Math.abs(noseTip.x - leftEye.x);
  const noseToRightEye = Math.abs(noseTip.x - rightEye.x);

  let yaw = 0;
  if (eyeDistance > 0) {
    yaw = ((noseToRightEye - noseToLeftEye) / eyeDistance) * 30;
  }

  // Calculate pitch (up-down rotation)
  const eyeCenterY = (leftEye.y + rightEye.y) / 2;
  const pitch = (noseTip.y - eyeCenterY) * 50;

  return {
    yaw: Math.max(-45, Math.min(45, yaw)),
    pitch: Math.max(-30, Math.min(30, pitch))
  };
}

/**
 * Calculate overall focus score (0-100)
 * Takes into account:
 * - Eye openness (EAR)
 * - Head pose (yaw, pitch)
 * - Face detection confidence
 */
export function calculateFocusScore(input, ...rest) {
  // Support original signature where landmarks are passed directly
  if (Array.isArray(input)) {
    const [faceDetected = true] = rest;
    return calculateFocusScoreFromLandmarks(input, faceDetected);
  }

  // Support calling with discrete metric arguments
  if (typeof input === 'number') {
    const [headYaw = 0, headPitch = 0, faceDetected = true] = rest;
    return calculateFocusScoreFromMetrics({
      eyeAspectRatio: input,
      headYaw,
      headPitch,
      faceDetected
    });
  }

  // Support calling with an object of metrics
  if (typeof input === 'object' && input !== null) {
    const {
      landmarks = null,
      faceDetected,
      eyeAspectRatio,
      headYaw,
      headPitch
    } = input;

    if (Array.isArray(landmarks)) {
      return calculateFocusScoreFromLandmarks(landmarks, faceDetected ?? true);
    }

    return calculateFocusScoreFromMetrics({
      eyeAspectRatio,
      headYaw,
      headPitch,
      faceDetected
    });
  }

  return 0;
}

export function calculateFocusScoreFromLandmarks(
  landmarks,
  faceDetected = true
) {
  if (!landmarks || landmarks.length < 468 || !faceDetected) return 0;

  // Get eye points
  const leftEyePoints = LEFT_EYE_INDICES.map((idx) => landmarks[idx]);
  const rightEyePoints = RIGHT_EYE_INDICES.map((idx) => landmarks[idx]);

  // Calculate EAR
  const leftEAR = calculateEAR(leftEyePoints);
  const rightEAR = calculateEAR(rightEyePoints);
  const avgEAR = (leftEAR + rightEAR) / 2;

  // Calculate head pose
  const headPose = calculateHeadPose(landmarks);

  return calculateFocusScoreFromMetrics({
    eyeAspectRatio: avgEAR,
    headYaw: headPose.yaw,
    headPitch: headPose.pitch,
    faceDetected
  });
}

export function calculateFocusScoreFromMetrics({
  eyeAspectRatio,
  headYaw,
  headPitch,
  faceDetected = true
}) {
  if (!faceDetected) return 0;

  if (
    typeof eyeAspectRatio !== 'number' ||
    typeof headYaw !== 'number' ||
    typeof headPitch !== 'number'
  ) {
    return 0;
  }

  // Start with perfect score
  let focusScore = 100;

  // Eye openness - primary factor (70% weight)
  // EAR < 0.15 = eyes closed
  // EAR 0.15-0.2 = half open
  // EAR > 0.2 = fully open
  const eyeOpenness = Math.max(0, Math.min(1, (eyeAspectRatio - 0.1) / 0.3));
  focusScore *= eyeOpenness;

  // Head pose penalty - reduced impact (only 30% weight)
  // Only penalize significant head movements
  // Yaw (left-right): Only penalize if > 25 degrees
  // Pitch (up-down): Minimal penalty, only if > 20 degrees
  const yawPenalty =
    Math.abs(headYaw) > 25 ? ((Math.abs(headYaw) - 25) / 45) * 0.15 : 0;
  const pitchPenalty =
    Math.abs(headPitch) > 20 ? ((Math.abs(headPitch) - 20) / 30) * 0.05 : 0;
  const headPosePenalty = 1 - (yawPenalty + pitchPenalty);
  focusScore *= Math.max(0.5, headPosePenalty);

  // Ensure minimum score for detected face with open eyes
  if (eyeAspectRatio > 0.15) {
    focusScore = Math.max(focusScore, 30);
  } else {
    focusScore = Math.max(focusScore, 10);
  }

  return Math.round(Math.max(0, Math.min(100, focusScore)));
}

/**
 * Get human-readable eye status
 */
export function getEyeStatus(ear) {
  if (ear < 0.15) return { status: '😴 Eyes Closed', level: 'critical' };
  if (ear < 0.2) return { status: '😑 Half Open', level: 'warning' };
  return { status: '👀 Eyes Open', level: 'good' };
}

/**
 * Get human-readable head pose status
 */
export function getHeadPoseStatus(yaw, pitch) {
  if (Math.abs(yaw) > 20) {
    return {
      status: yaw > 0 ? '↗️ Looking Right' : '↖️ Looking Left',
      level: 'warning'
    };
  }
  if (Math.abs(pitch) > 15) {
    return {
      status: pitch > 0 ? '⬇️ Looking Down' : '⬆️ Looking Up',
      level: 'warning'
    };
  }
  return { status: '📐 Straight Ahead', level: 'good' };
}

/**
 * Get attention level based on focus score
 */
export function getAttentionLevel(focusScore) {
  if (focusScore >= 80) return { level: '🌟 Excellent', color: 'green' };
  if (focusScore >= 60) return { level: '🎯 Focused', color: 'blue' };
  if (focusScore >= 40) return { level: '⚠️ Moderate', color: 'yellow' };
  return { level: '😵 Distracted', color: 'red' };
}
