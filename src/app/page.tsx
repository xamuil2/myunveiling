"use client";

import { useRef, useEffect, useState } from "react";
import { Header } from "@/components/header";
import { LandingSection } from "@/components/landing-section";
import { ScrollReveal } from "@/components/scroll-reveal";
import { DynamicBackground } from "@/components/dynamic-background";
import { AlbumHeader } from "@/components/album-header";
import { TrackList } from "@/components/track-list";
import { MusicPlayer } from "@/components/music-player";
import { PlayerProvider } from "@/lib/player-context";
import { album } from "@/lib/music-data";

export default function Home() {
  const musicContentRef = useRef<HTMLDivElement>(null);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);

  const handleContinue = () => {
    // Show music content and scroll to it
    if (musicContentRef.current) {
      musicContentRef.current.style.display = 'block';
      setShowMusicPlayer(true);
      setTimeout(() => {
        musicContentRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const musicContent = musicContentRef.current;
      if (!musicContent) return;

      // Check if music content is visible
      const rect = musicContent.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      // Hide music player if we're back at the landing section
      if (musicContent.style.display === 'block' && !isVisible && window.scrollY < window.innerHeight / 2) {
        setShowMusicPlayer(false);
      } else if (musicContent.style.display === 'block' && isVisible) {
        setShowMusicPlayer(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <PlayerProvider>
      <div className="min-h-screen relative">
        {/* Dynamic Background */}
        <DynamicBackground />
        
        {/* Landing Section */}
        <LandingSection onContinue={handleContinue} />
        
        {/* Music Content - Hidden by default */}
        <div 
          ref={musicContentRef}
          id="music-content" 
          className="bg-gradient-to-b from-muted/10 to-background"
          style={{ display: 'none' }}
        >
          <Header />
          <main className="container mx-auto px-4 py-8 pb-32">
            <ScrollReveal delay={200}>
              <AlbumHeader album={album} />
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <TrackList tracks={album.tracks} />
            </ScrollReveal>
          </main>
        </div>
        
        {/* Music Player - Only show when music content is visible */}
        {showMusicPlayer && (
          <MusicPlayer 
            albumTitle={album.title}
            artist={album.artist}
            coverArt={album.coverArt}
          />
        )}
      </div>
    </PlayerProvider>
  );
}
