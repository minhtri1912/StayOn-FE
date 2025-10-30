import { Camera, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CameraPanel({ isOpen, onClose, children }) {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '24px',
        zIndex: 40,
        width: '256px',
        height: '160px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(20px)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        animation: isClosing
          ? 'slideInUp 0.3s ease-out'
          : 'slideInDown 0.3s ease-out'
      }}
    >
      {/* Close button - small, top-right corner */}
      <button
        onClick={onClose}
        className="absolute right-2 top-2 z-50 text-white/60 transition-colors hover:text-white"
        style={{
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <X size={14} />
      </button>

      {/* Camera feed - full size */}
      <div className="flex h-full w-full items-center justify-center bg-black/30">
        {children || (
          <div className="text-center text-white/60">
            <Camera size={32} className="mx-auto mb-1" />
            <p className="text-xs">Camera preview</p>
          </div>
        )}
      </div>
    </div>
  );
}
