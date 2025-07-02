export interface Track {
  id: string;
  title: string;
  duration: string;
  durationSeconds: number;
  audioUrl: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  year: string;
  coverArt: string;
  tracks: Track[];
}

// Sample data for your album "My Unveiling"
export const album: Album = {
  id: "my-unveiling-2025",
  title: "My Unveiling",
  artist: "Max Liu",
  year: "2025",
  coverArt: "/album-cover.jpg",
  tracks: [
    {
      id: "track-1",
      title: "I don't speak Cantonese",
      duration: "6:14",
      durationSeconds: 374,
      audioUrl: "/audio/I don't speak Cantonese.wav"
    },
    {
      id: "track-2",
      title: "My Mother's Kidneys",
      duration: "8:06",
      durationSeconds: 486,
      audioUrl: "/audio/My Mother's Kidneys.wav"
    },
    {
      id: "track-3",
      title: '"I"(t), said',
      duration: "6:28",
      durationSeconds: 388,
      audioUrl: "/audio/Robot.wav"
    },
    {
      id: "track-4",
      title: "Fantasy of a Misdirected Secretary",
      duration: "5:09",
      durationSeconds: 309,
      audioUrl: "/audio/Fantasy of a Misdirected Secretary.wav"
    },
    {
      id: "track-5",
      title: "Memory Pill: #11/04/2007",
      duration: "11:01",
      durationSeconds: 661,
      audioUrl: "/audio/Memory Pill.wav"
    }
  ]
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
