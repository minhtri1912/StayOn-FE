import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useBackground() {
  const [backgrounds, setBackgrounds] = useState([]);
  const [currentBg, setCurrentBg] = useLocalStorage('ui.bg', null);
  const [isLoading, setIsLoading] = useState(true);
  const hasSetDefault = useRef(false);

  // Load backgrounds from JSON on mount
  useEffect(() => {
    fetch('/data/backgrounds.json')
      .then((res) => res.json())
      .then((data) => {
        const bgList = data.backgrounds || [];
        setBackgrounds(bgList);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load backgrounds:', err);
        setIsLoading(false);
      });
  }, []);

  // Set default background ONLY ONCE after backgrounds are loaded
  useEffect(() => {
    if (!hasSetDefault.current && !currentBg && backgrounds.length > 0) {
      console.log('🎨 Setting default background:', backgrounds[0]);
      setCurrentBg(backgrounds[0]);
      hasSetDefault.current = true;
    }
  }, [backgrounds, currentBg, setCurrentBg]);

  // Log every time currentBg changes
  useEffect(() => {
    console.log('🎨 [useBackground] currentBg changed:', currentBg);
  }, [currentBg]);

  const changeBackground = useCallback(
    (background) => {
      console.log('🎨 [useBackground] Changing background to:', background);
      // Force a new object reference with timestamp to guarantee re-render
      const newBg = { ...background, _timestamp: Date.now() };
      setCurrentBg(newBg);
    },
    [setCurrentBg]
  );

  const nextBackground = useCallback(() => {
    if (backgrounds.length === 0) return;
    const currentIndex = backgrounds.findIndex((bg) => bg.id === currentBg?.id);
    const nextIndex = (currentIndex + 1) % backgrounds.length;
    changeBackground(backgrounds[nextIndex]);
  }, [backgrounds, currentBg, changeBackground]);

  // For image backgrounds (inline style)
  const bgStyle =
    currentBg && currentBg.type === 'image'
      ? {
          backgroundImage: `url(${currentBg.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      : {};

  return {
    currentBackground: currentBg,
    backgrounds,
    isLoading,
    changeBackground,
    nextBackground,
    bgStyle
  };
}
