"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { Album } from "@/lib/music-data";
import { usePlayer } from "@/lib/player-context";
import Image from "next/image";

interface AlbumHeaderProps {
  album: Album;
}

export function AlbumHeader({ album }: AlbumHeaderProps) {
  const { state, playTrack, togglePlayPause } = usePlayer();

  const handlePlayAlbum = () => {
    if (state.currentTrack && album.tracks.some(track => track.id === state.currentTrack?.id)) {
      togglePlayPause();
    } else {
      // Play first track
      playTrack(album.tracks[0]);
    }
  };

  const isAlbumPlaying = state.currentTrack && 
    album.tracks.some(track => track.id === state.currentTrack?.id) && 
    state.isPlaying;

  const totalDuration = album.tracks.reduce((total, track) => total + track.durationSeconds, 0);
  const totalMinutes = Math.floor(totalDuration / 60);

  return (
    <Card className="p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-center lg:items-start">
        {/* Album Cover */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-lg overflow-hidden bg-muted shadow-2xl album-cover-glow flex-shrink-0">
          <Image
            src={album.coverArt}
            alt={album.title}
            fill
            className="object-cover"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256' fill='%23666'%3E%3Crect width='256' height='256' fill='%23f0f0f0'/%3E%3Ctext x='128' y='140' text-anchor='middle' font-size='48' fill='%23666'%3E♪%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>

        {/* Album Info */}
        <div className="flex-1 space-y-4 sm:space-y-6 text-center lg:text-left">
          <div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Album
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-3 sm:mb-4">{album.title}</h1>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-sm sm:text-base lg:text-lg">
              <span className="font-medium">{album.artist}</span>
              <span className="text-muted-foreground hidden sm:inline">•</span>
              <span className="text-muted-foreground">{album.year}</span>
              <span className="text-muted-foreground hidden sm:inline">•</span>
              <span className="text-muted-foreground">{album.tracks.length} songs</span>
              <span className="text-muted-foreground hidden sm:inline">•</span>
              <span className="text-muted-foreground">{totalMinutes} min</span>
            </div>
          </div>

          {/* Play Button */}
          <div className="flex items-center justify-center lg:justify-start space-x-4">
            <Button
              size="lg"
              className="rounded-full w-12 h-12 sm:w-14 sm:h-14"
              onClick={handlePlayAlbum}
              disabled={state.isLoading}
            >
              {isAlbumPlaying ? (
                <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
