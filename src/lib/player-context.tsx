"use client";

import React, { createContext, useContext, useReducer, useRef, useEffect, useCallback } from 'react';
import { Track, album } from '@/lib/music-data';

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
}

type PlayerAction =
  | { type: 'SET_TRACK'; payload: Track }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'SET_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean };

interface PlayerContextType {
  state: PlayerState;
  dispatch: React.Dispatch<PlayerAction>;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  playTrack: (track: Track, autoPlay?: boolean) => void;
  togglePlayPause: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isLoading: false,
};

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'SET_TRACK':
      return { ...state, currentTrack: action.payload };
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'SET_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement>(null);

  const getCurrentTrackIndex = useCallback(() => {
    if (!state.currentTrack) return -1;
    return album.tracks.findIndex(track => track.id === state.currentTrack?.id);
  }, [state.currentTrack]);

  const canGoNext = getCurrentTrackIndex() < album.tracks.length - 1;
  const canGoPrevious = getCurrentTrackIndex() > 0;

  const playTrack = (track: Track, autoPlay: boolean = false) => {
    if (audioRef.current) {
      dispatch({ type: 'SET_TRACK', payload: track });
      dispatch({ type: 'SET_LOADING', payload: true });
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      
      if (autoPlay) {
        // Use a small delay to ensure the track is loaded before playing
        audioRef.current.addEventListener('canplay', () => {
          audioRef.current?.play();
          dispatch({ type: 'PLAY' });
        }, { once: true });
      }
    }
  };

  const nextTrack = () => {
    const currentIndex = getCurrentTrackIndex();
    if (currentIndex >= 0 && currentIndex < album.tracks.length - 1) {
      const wasPlaying = state.isPlaying;
      playTrack(album.tracks[currentIndex + 1], wasPlaying);
    }
  };

  const previousTrack = () => {
    const currentIndex = getCurrentTrackIndex();
    if (currentIndex > 0) {
      const wasPlaying = state.isPlaying;
      playTrack(album.tracks[currentIndex - 1], wasPlaying);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (state.isPlaying) {
        audioRef.current.pause();
        dispatch({ type: 'PAUSE' });
      } else {
        audioRef.current.play();
        dispatch({ type: 'PLAY' });
      }
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      dispatch({ type: 'SET_TIME', payload: time });
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      dispatch({ type: 'SET_VOLUME', payload: volume });
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      dispatch({ type: 'SET_TIME', payload: audio.currentTime });
    };

    const handleDurationChange = () => {
      dispatch({ type: 'SET_DURATION', payload: audio.duration });
    };

    const handleCanPlay = () => {
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    const handleEnded = () => {
      dispatch({ type: 'PAUSE' });
      dispatch({ type: 'SET_TIME', payload: 0 });
      // Auto-play next track when current track ends
      if (canGoNext) {
        const currentIndex = getCurrentTrackIndex();
        if (currentIndex >= 0 && currentIndex < album.tracks.length - 1) {
          playTrack(album.tracks[currentIndex + 1], true); // Auto-play the next track
        }
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [canGoNext, getCurrentTrackIndex]);

  return (
    <PlayerContext.Provider value={{
      state,
      dispatch,
      audioRef,
      playTrack,
      togglePlayPause,
      seekTo,
      setVolume,
      nextTrack,
      previousTrack,
      canGoNext,
      canGoPrevious,
    }}>
      {children}
      <audio ref={audioRef} preload="metadata" />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
