"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { Track } from "@/lib/music-data";
import { usePlayer } from "@/lib/player-context";

interface TrackListProps {
  tracks: Track[];
}

export function TrackList({ tracks }: TrackListProps) {
  const { state, playTrack, togglePlayPause } = usePlayer();

  const handleTrackClick = (track: Track) => {
    if (state.currentTrack?.id === track.id) {
      // If clicking on the current track, just toggle play/pause
      togglePlayPause();
    } else {
      // If clicking on a different track, check if we should auto-play
      const shouldAutoPlay = state.isPlaying || state.currentTrack === null;
      playTrack(track, shouldAutoPlay);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Tracks</h2>
      <div className="space-y-2">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 cursor-pointer track-row-hover ${
              state.currentTrack?.id === track.id
                ? "bg-primary/10 border border-primary/20"
                : "hover:bg-muted/50"
            }`}
            onClick={() => handleTrackClick(track)}
          >
            <div className="flex items-center space-x-4">
              <Button
                variant={state.currentTrack?.id === track.id ? "default" : "ghost"}
                size="sm"
                className="w-10 h-10 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrackClick(track);
                }}
              >
                {state.currentTrack?.id === track.id && state.isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              <div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-muted-foreground font-mono w-6">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className={`font-medium ${
                      state.currentTrack?.id === track.id ? "text-primary" : ""
                    }`}>
                      {track.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground font-mono">
              {track.duration}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
