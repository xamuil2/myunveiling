"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import { formatTime } from "@/lib/music-data";
import Image from "next/image";

interface MusicPlayerProps {
  albumTitle: string;
  artist: string;
  coverArt: string;
}

export function MusicPlayer({ albumTitle, artist, coverArt }: MusicPlayerProps) {
  const { state, togglePlayPause, seekTo, setVolume, nextTrack, previousTrack, canGoNext, canGoPrevious } = usePlayer();

  const handleSeek = (value: number[]) => {
    seekTo(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  if (!state.currentTrack) {
    return null;
  }

  return (
    <Card className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 music-player-bar z-50">
      {/* Mobile Layout */}
      <div className="block sm:hidden">
        {/* Top Row: Track Info and Main Controls */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={coverArt}
                alt={albumTitle}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40' fill='%23666'%3E%3Crect width='40' height='40' fill='%23f0f0f0'/%3E%3Ctext x='20' y='24' text-anchor='middle' font-size='10' fill='%23666'%3E♪%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate text-sm">{state.currentTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate">{artist}</p>
            </div>
          </div>
          
          {/* Play/Pause Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 rounded-full flex-shrink-0"
            onClick={togglePlayPause}
            disabled={state.isLoading}
          >
            {state.isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Bottom Row: Progress and Controls */}
        <div className="space-y-2">
          {/* Progress Bar */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground font-mono w-8 text-right">
              {formatTime(state.currentTime)}
            </span>
            <Slider
              value={[state.currentTime]}
              min={0}
              max={state.duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground font-mono w-8">
              {formatTime(state.duration)}
            </span>
          </div>

          {/* Navigation and Volume Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={previousTrack}
                disabled={!canGoPrevious}
                className="w-7 h-7"
              >
                <SkipBack className="w-3 h-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={nextTrack}
                disabled={!canGoNext}
                className="w-7 h-7"
              >
                <SkipForward className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-1">
              <Volume2 className="w-3 h-3 text-muted-foreground" />
              <Slider
                value={[state.volume * 100]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-16"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-between space-x-4">
        {/* Track Info */}
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
            <Image
              src={coverArt}
              alt={albumTitle}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='%23666'%3E%3Crect width='48' height='48' fill='%23f0f0f0'/%3E%3Ctext x='24' y='28' text-anchor='middle' font-size='12' fill='%23666'%3E♪%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{state.currentTrack.title}</p>
            <p className="text-sm text-muted-foreground truncate">{artist}</p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={previousTrack}
              disabled={!canGoPrevious}
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 rounded-full"
              onClick={togglePlayPause}
              disabled={state.isLoading}
            >
              {state.isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={nextTrack}
              disabled={!canGoNext}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-muted-foreground font-mono w-10">
              {formatTime(state.currentTime)}
            </span>
            <Slider
              value={[state.currentTime]}
              min={0}
              max={state.duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground font-mono w-10">
              {formatTime(state.duration)}
            </span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 min-w-0 flex-1 justify-end">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <Slider
            value={[state.volume * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="w-20"
          />
        </div>
      </div>
    </Card>
  );
}
