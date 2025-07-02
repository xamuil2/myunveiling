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
    <Card className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Tracks</h2>
      <div className="space-y-1 sm:space-y-2">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`flex items-center justify-between p-3 sm:p-4 rounded-lg transition-all duration-200 cursor-pointer track-row-hover ${
              state.currentTrack?.id === track.id
                ? "bg-primary/10 border border-primary/20"
                : "hover:bg-muted/50"
            }`}
            onClick={() => handleTrackClick(track)}
          >
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
              <Button
                variant={state.currentTrack?.id === track.id ? "default" : "ghost"}
                size="sm"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrackClick(track);
                }}
              >
                {state.currentTrack?.id === track.id && state.isPlaying ? (
                  <Pause className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </Button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-xs sm:text-sm text-muted-foreground font-mono w-4 sm:w-6 flex-shrink-0">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className={`font-medium text-sm sm:text-base truncate ${
                      state.currentTrack?.id === track.id ? "text-primary" : ""
                    }`}>
                      {track.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground font-mono flex-shrink-0">
              {track.duration}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
