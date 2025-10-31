import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

const DEFAULT_TRACKS = [
  {
    id: 'lofi-1',
    name: 'Lofi Study',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk'
  },
  {
    id: 'lofi-2',
    name: 'Chill Beats',
    url: 'https://www.youtube.com/watch?v=5qap5aO4i9A'
  },
  {
    id: 'nature',
    name: 'Nature Sounds',
    url: 'https://www.youtube.com/watch?v=DWcJFNfaw9c'
  },
  {
    id: 'rain',
    name: 'Rain Sounds',
    url: 'https://www.youtube.com/watch?v=WYWP6G6L3cQ'
  }
];

export function useMusic() {
  const [selectedTrack, setSelectedTrack] = useLocalStorage(
    'music.selected',
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const playTrack = (track) => {
    setSelectedTrack(track);
    setIsPlaying(true);
  };

  const stopMusic = () => {
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return {
    selectedTrack,
    isPlaying,
    volume,
    tracks: DEFAULT_TRACKS,
    playTrack,
    stopMusic,
    togglePlayPause,
    setVolume
  };
}
