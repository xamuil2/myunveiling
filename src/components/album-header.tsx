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
    <Card className="p-8 mb-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Album Cover */}
        <div className="relative w-64 h-64 rounded-lg overflow-hidden bg-muted shadow-2xl album-cover-glow">
          <Image
            src={album.coverArt}
            alt={album.title}
            fill
            className="object-cover"
            priority
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256' fill='%23666'%3E%3Crect width='256' height='256' fill='%23f0f0f0'/%3E%3Ctext x='128' y='140' text-anchor='middle' font-size='48' fill='%23666'%3E♪%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>

        {/* Album Info */}
        <div className="flex-1 space-y-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Album
            </p>
            <h1 className="text-5xl font-bold mt-2 mb-4">{album.title}</h1>
            <div className="flex items-center space-x-2 text-lg">
              <span className="font-medium">{album.artist}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{album.year}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{album.tracks.length} songs</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{totalMinutes} min</span>
            </div>
          </div>

          {/* Play Button */}
          <div className="flex items-center space-x-4">
            <Button
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={handlePlayAlbum}
              disabled={state.isLoading}
            >
              {isAlbumPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
